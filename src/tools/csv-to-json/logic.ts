import Papa from 'papaparse';
import { fail, lineColumn, ok, type ConvertResult } from '@/lib/convert';
import { setOwn } from '@/lib/object';

export type CsvDelimiter = 'auto' | ',' | ';' | '\t' | '|';

export interface CsvToJsonOptions {
  header: boolean;
  delimiter: CsvDelimiter;
  /** Convert "42", "true" and "" to numbers, booleans and null (leading zeros stay strings). */
  dynamicTyping: boolean;
  minify: boolean;
}

const NUMERIC = /^-?(?:0|[1-9]\d*)(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

/**
 * Convert a CSV cell to a JSON value. Unlike naive typing, values with leading zeros
 * (ZIP codes, phone numbers) and integers too large for JavaScript stay strings.
 */
export function typeCell(value: string): unknown {
  const v = value.trim();
  if (v === '') return null;
  if (/^(true|false)$/i.test(v)) return v.toLowerCase() === 'true';
  if (NUMERIC.test(v)) {
    const n = Number(v);
    if (Number.isFinite(n) && (!/^-?\d+$/.test(v) || Number.isSafeInteger(n))) return n;
  }
  return value;
}

const NAMES: Record<string, string> = { ',': 'comma', ';': 'semicolon', '\t': 'tab', '|': 'pipe' };

/** Trim header names and make duplicates unique: ["id", "name", "name"] -> ["id", "name", "name_1"]. */
export function uniqueHeaders(raw: string[]): string[] {
  const seen = new Map<string, number>();
  return raw.map((h) => {
    const name = h.trim();
    const count = seen.get(name) ?? 0;
    seen.set(name, count + 1);
    return count ? `${name}_${count}` : name;
  });
}

export function csvToJson(input: string, options: CsvToJsonOptions): ConvertResult {
  const text = input.replace(/^\uFEFF/, '');
  // Always parse rows as arrays: objects are built below with setOwn, so a column named
  // "__proto__" is kept as data (Papa Parse's header mode would drop it).
  const result = Papa.parse<string[]>(text, {
    header: false,
    delimiter: options.delimiter === 'auto' ? '' : options.delimiter,
    delimitersToGuess: [',', ';', '\t', '|'],
    skipEmptyLines: 'greedy',
  });

  const fatal = result.errors.find((e) => e.type === 'Quotes');
  if (fatal) {
    const pos =
      typeof fatal.index === 'number' ? lineColumn(text, Math.max(0, fatal.index - 1)) : {};
    return fail(
      'Invalid CSV',
      `${fatal.message}: a double quote was opened but never closed.`,
      pos,
    );
  }

  const convert = (cell: string): unknown => (options.dynamicTyping ? typeCell(cell) : cell);
  const warnings: string[] = [];
  let data: unknown[];

  if (options.header) {
    const [headerRow, ...rows] = result.data;
    if (!headerRow || rows.length === 0)
      return fail('Nothing to convert', 'No data rows were found below the header row.');
    const headers = uniqueHeaders(headerRow);
    data = rows.map((row, i) => {
      if (row.length !== headers.length && warnings.length < 3) {
        warnings.push(
          `Row ${i + 2}: ${row.length < headers.length ? 'too few' : 'too many'} fields (expected ${headers.length}, found ${row.length}).`,
        );
      }
      const obj: Record<string, unknown> = {};
      headers.forEach((h, j) => {
        if (j < row.length) setOwn(obj, h, convert(row[j] ?? ''));
      });
      if (row.length > headers.length)
        setOwn(obj, '__extra', row.slice(headers.length).map(convert));
      return obj;
    });
  } else {
    data = result.data.map((row) => row.map(convert));
  }
  if (data.length === 0) return fail('Nothing to convert', 'No rows were found in the input.');

  const delim = result.meta.delimiter;
  const output = options.minify ? JSON.stringify(data) : JSON.stringify(data, null, 2);
  return ok(output, {
    info: `${data.length} record${data.length === 1 ? '' : 's'} converted. Delimiter: ${NAMES[delim] ?? JSON.stringify(delim)}${
      options.delimiter === 'auto' ? ' (detected)' : ''
    }.`,
    warnings: warnings.length ? warnings : undefined,
  });
}

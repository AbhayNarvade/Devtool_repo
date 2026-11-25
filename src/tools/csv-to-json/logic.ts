import Papa from 'papaparse';
import { fail, lineColumn, ok, type ConvertResult } from '@/lib/convert';

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

export function csvToJson(input: string, options: CsvToJsonOptions): ConvertResult {
  const text = input.replace(/^﻿/, '');
  const result = Papa.parse<unknown>(text, {
    header: options.header,
    delimiter: options.delimiter === 'auto' ? '' : options.delimiter,
    delimitersToGuess: [',', ';', '\t', '|'],
    skipEmptyLines: 'greedy',
    transformHeader: (h) => h.trim(),
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
  let data = result.data;
  if (options.dynamicTyping) {
    data = data.map((row) => {
      if (Array.isArray(row)) return row.map((v) => (typeof v === 'string' ? typeCell(v) : v));
      const out: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(row as Record<string, unknown>))
        out[k] = typeof v === 'string' ? typeCell(v) : v;
      return out;
    });
  }
  if (data.length === 0) return fail('Nothing to convert', 'No rows were found in the input.');

  const warnings = result.errors
    .filter((e) => e.type === 'FieldMismatch')
    .slice(0, 3)
    .map((e) => `Row ${(e.row ?? 0) + (options.header ? 2 : 1)}: ${e.message}.`);
  const delim = result.meta.delimiter;
  const output = options.minify ? JSON.stringify(data) : JSON.stringify(data, null, 2);
  return ok(output, {
    info: `${data.length} record${data.length === 1 ? '' : 's'} converted. Delimiter: ${NAMES[delim] ?? JSON.stringify(delim)}${
      options.delimiter === 'auto' ? ' (detected)' : ''
    }.`,
    warnings: warnings.length ? warnings : undefined,
  });
}

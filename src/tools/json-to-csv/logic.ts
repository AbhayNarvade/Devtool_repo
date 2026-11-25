import Papa from 'papaparse';
import { fail, ok, type ConvertResult } from '@/lib/convert';
import { parseJson } from '@/lib/json';
import { setOwn } from '@/lib/object';

export type Delimiter = ',' | ';' | '\t' | '|';

export interface JsonToCsvOptions {
  delimiter: Delimiter;
  /** Flatten nested objects/arrays into dot-notation columns (otherwise nested values become JSON text). */
  flatten: boolean;
  /** Prefix text cells that start with = + - @ (formula injection) with an apostrophe. */
  escapeFormulas?: boolean;
}

type Row = Record<string, unknown>;

/** Flatten nested objects and arrays: {a:{b:1},c:[2]} -> {"a.b":1,"c.0":2}. Empty containers become "". */
export function flattenObject(value: unknown, prefix = '', out: Row = {}): Row {
  if (value !== null && typeof value === 'object') {
    const entries = Array.isArray(value)
      ? value.map((v, i) => [String(i), v] as const)
      : Object.entries(value);
    if (entries.length === 0) {
      if (prefix) setOwn(out, prefix, '');
      return out;
    }
    for (const [k, v] of entries) flattenObject(v, prefix ? `${prefix}.${k}` : k, out);
    return out;
  }
  setOwn(out, prefix || 'value', value);
  return out;
}

const FORMULA_START = /^[=+\-@\t\r]/;
const PLAIN_NUMBER = /^[+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?$/;

/**
 * Spreadsheet apps execute cells that start with = + - @ as formulas (CSV injection).
 * Prefixing an apostrophe makes them plain text; real numbers such as -5 are left untouched.
 */
export function escapeFormula(text: string): string {
  return FORMULA_START.test(text) && !PLAIN_NUMBER.test(text) ? `'${text}` : text;
}

function cell(value: unknown, escapeFormulas: boolean): string {
  if (value === null || value === undefined) return '';
  const text = typeof value === 'object' ? JSON.stringify(value) : String(value);
  return escapeFormulas && typeof value !== 'number' ? escapeFormula(text) : text;
}

export function jsonToCsv(input: string, options: JsonToCsvOptions): ConvertResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    const { message, line, column } = parsed.issue;
    return fail('Invalid JSON', message, { line, column });
  }
  const data = parsed.value;
  const items: unknown[] = Array.isArray(data) ? data : [data];
  if (items.length === 0) return fail('Nothing to convert', 'The JSON array is empty.');

  const rows: Row[] = items.map((item) => {
    if (item === null || typeof item !== 'object' || Array.isArray(item)) {
      return options.flatten && Array.isArray(item) ? flattenObject(item) : { value: item };
    }
    if (options.flatten) return flattenObject(item);
    return { ...(item as Row) };
  });

  const columns: string[] = [];
  const seen = new Set<string>();
  for (const row of rows) {
    for (const key of Object.keys(row)) {
      if (!seen.has(key)) {
        seen.add(key);
        columns.push(key);
      }
    }
  }

  const csv = Papa.unparse(
    {
      fields: columns,
      data: rows.map((r) => columns.map((c) => cell(r[c], options.escapeFormulas ?? false))),
    },
    { delimiter: options.delimiter, newline: '\r\n', escapeFormulae: false },
  );
  return ok(csv, {
    info: `${rows.length} row${rows.length === 1 ? '' : 's'} × ${columns.length} column${columns.length === 1 ? '' : 's'}.`,
  });
}

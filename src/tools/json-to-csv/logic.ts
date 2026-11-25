import Papa from 'papaparse';
import { fail, ok, type ConvertResult } from '@/lib/convert';
import { parseJson } from '@/lib/json';

export type Delimiter = ',' | ';' | '\t' | '|';

export interface JsonToCsvOptions {
  delimiter: Delimiter;
  /** Flatten nested objects/arrays into dot-notation columns (otherwise nested values become JSON text). */
  flatten: boolean;
}

type Row = Record<string, unknown>;

/** Flatten nested objects and arrays: {a:{b:1},c:[2]} -> {"a.b":1,"c.0":2}. Empty containers become "". */
export function flattenObject(value: unknown, prefix = '', out: Row = {}): Row {
  if (value !== null && typeof value === 'object') {
    const entries = Array.isArray(value)
      ? value.map((v, i) => [String(i), v] as const)
      : Object.entries(value);
    if (entries.length === 0) {
      if (prefix) out[prefix] = '';
      return out;
    }
    for (const [k, v] of entries) flattenObject(v, prefix ? `${prefix}.${k}` : k, out);
    return out;
  }
  out[prefix || 'value'] = value;
  return out;
}

function cell(value: unknown): string {
  if (value === null || value === undefined) return '';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
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
    { fields: columns, data: rows.map((r) => columns.map((c) => cell(r[c]))) },
    { delimiter: options.delimiter, newline: '\r\n', escapeFormulae: false },
  );
  return ok(csv, {
    info: `${rows.length} row${rows.length === 1 ? '' : 's'} × ${columns.length} column${columns.length === 1 ? '' : 's'}.`,
  });
}

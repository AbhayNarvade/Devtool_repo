import { fail, ok, type ConvertResult } from '@/lib/convert';
import { indentValue, parseJson, sortKeysDeep, type Indent } from '@/lib/json';

export type JsonMode = 'beautify' | 'minify';

export interface FormatOptions {
  mode: JsonMode;
  indent: Indent;
  sortKeys: boolean;
}

/** Integers with 16+ digits cannot be represented exactly by JavaScript numbers. */
export function findUnsafeNumbers(text: string): string[] {
  const withoutStrings = text.replace(/"(?:[^"\\]|\\.)*"/g, '""');
  // Whole integers only: not the fraction or exponent digits of a decimal like 3.14159265358979323846.
  const found = withoutStrings.match(/(?<![\d.eE+-])-?\d{16,}(?![\d.eE])/g) ?? [];
  return found.filter((n) => !Number.isSafeInteger(Number(n)));
}

export function describeJson(value: unknown): string {
  if (Array.isArray(value))
    return `array with ${value.length} item${value.length === 1 ? '' : 's'}`;
  if (value && typeof value === 'object') {
    const n = Object.keys(value).length;
    return `object with ${n} key${n === 1 ? '' : 's'}`;
  }
  return value === null ? 'null' : typeof value;
}

export function formatJson(input: string, options: FormatOptions): ConvertResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    const { message, line, column } = parsed.issue;
    return fail('Invalid JSON', message, { line, column });
  }
  const value = options.sortKeys ? sortKeysDeep(parsed.value) : parsed.value;
  const output =
    options.mode === 'minify'
      ? JSON.stringify(value)
      : JSON.stringify(value, null, indentValue(options.indent));
  const unsafe = findUnsafeNumbers(input);
  return ok(output, {
    info: `Valid JSON: ${describeJson(parsed.value)}.`,
    warnings: unsafe.length
      ? [
          `${unsafe.length === 1 ? 'An integer' : `${unsafe.length} integers`} (for example ${unsafe[0]}) ${unsafe.length === 1 ? 'is' : 'are'} larger than 9,007,199,254,740,991 and will be rounded by JavaScript. Store large IDs as strings.`,
        ]
      : undefined,
  });
}

import { CORE_SCHEMA, YAMLException, load, loadAll, mergeTag } from 'js-yaml';

/** YAML 1.2 core schema plus the widely used "<<" merge key (Docker Compose, CI files). */
const SCHEMA = CORE_SCHEMA.withTags(mergeTag);
import { fail, ok, type ConvertResult } from '@/lib/convert';
import { indentValue, type Indent } from '@/lib/json';
import { setOwn } from '@/lib/object';

export interface YamlToJsonOptions {
  indent: Indent | 'minify';
  /** Treat "---" separated documents as an array. */
  multiDocument: boolean;
}

function toJsonSafe(value: unknown, path = '$'): unknown {
  if (value instanceof Date) return value.toISOString();
  if (value instanceof Uint8Array)
    throw new Error(`Binary value at ${path} cannot be represented in JSON`);
  if (value instanceof Map) {
    const out: Record<string, unknown> = {};
    for (const [k, v] of value) setOwn(out, String(k), toJsonSafe(v, `${path}.${String(k)}`));
    return out;
  }
  if (value instanceof Set) return [...value].map((v, i) => toJsonSafe(v, `${path}[${i}]`));
  if (Array.isArray(value)) return value.map((v, i) => toJsonSafe(v, `${path}[${i}]`));
  if (typeof value === 'number' && !Number.isFinite(value)) {
    throw new Error(`The value at ${path} is ${String(value)}, which JSON cannot represent`);
  }
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(value)) setOwn(out, k, toJsonSafe(v, `${path}.${k}`));
    return out;
  }
  return value;
}

export function yamlToJson(input: string, options: YamlToJsonOptions): ConvertResult {
  let data: unknown;
  try {
    if (options.multiDocument) data = loadAll(input, { schema: SCHEMA });
    else data = load(input, { schema: SCHEMA });
  } catch (e) {
    if (e instanceof YAMLException) {
      const mark = e.mark;
      const multi = /expected a single document/i.test(e.reason);
      return fail(
        'Invalid YAML',
        multi
          ? 'The input contains more than one document (separated by ---). Turn on "Multiple documents" to convert them into a JSON array.'
          : e.reason.charAt(0).toUpperCase() + e.reason.slice(1),
        mark ? { line: mark.line + 1, column: mark.column + 1 } : {},
      );
    }
    return fail('Invalid YAML', e instanceof Error ? e.message : String(e));
  }
  let safe: unknown;
  try {
    safe = toJsonSafe(data);
  } catch (e) {
    return fail('Cannot convert to JSON', (e as Error).message);
  }
  if (safe === undefined) safe = null;
  const output =
    options.indent === 'minify'
      ? JSON.stringify(safe)
      : JSON.stringify(safe, null, indentValue(options.indent));
  return ok(output);
}

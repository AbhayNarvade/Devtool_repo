import { dump } from 'js-yaml';
import { fail, ok, type ConvertResult } from '@/lib/convert';
import { parseJson, sortKeysDeep } from '@/lib/json';

export interface JsonToYamlOptions {
  indent: 2 | 4;
  sortKeys: boolean;
}

export function jsonToYaml(input: string, options: JsonToYamlOptions): ConvertResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    const { message, line, column } = parsed.issue;
    return fail('Invalid JSON', message, { line, column });
  }
  const value = options.sortKeys ? sortKeysDeep(parsed.value) : parsed.value;
  const yaml = dump(value, { indent: options.indent, lineWidth: -1, noRefs: true });
  return ok(yaml, { info: 'Converted to YAML 1.2.' });
}

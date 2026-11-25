import { fail, ok, type ConvertResult } from '@/lib/convert';
import { parseJson } from '@/lib/json';

export interface TsOptions {
  rootName: string;
  /** Mark every property optional (otherwise only keys missing from some array items are). */
  allOptional: boolean;
  /** Prefix declarations with "export". */
  exportTypes: boolean;
  /** Emit "type X = {…}" instead of "interface X {…}". */
  useTypeAlias: boolean;
}

const IDENT = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

/** "user_profile" / "user-profile" / "userProfile" -> "UserProfile". */
export function toPascalCase(name: string): string {
  const words = name
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .split(/[^A-Za-z0-9]+/)
    .filter(Boolean);
  let out = words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join('');
  if (!out) out = 'Item';
  if (/^\d/.test(out)) out = `T${out}`;
  return out;
}

/** Naive English singular used to name array item types: "categories" -> "category". */
export function singularize(name: string): string {
  if (/ies$/i.test(name) && name.length > 3) return name.replace(/ies$/i, 'y');
  if (/(ss|x|z|ch|sh)es$/i.test(name)) return name.replace(/es$/i, '');
  if (/[^s]s$/i.test(name) && name.length > 1) return name.slice(0, -1);
  return `${name}Item`;
}

function propertyName(key: string): string {
  return IDENT.test(key) ? key : JSON.stringify(key);
}

type Kind = 'string' | 'number' | 'boolean' | 'null' | 'object' | 'array';

function kindOf(v: unknown): Kind {
  if (v === null) return 'null';
  if (Array.isArray(v)) return 'array';
  const t = typeof v;
  if (t === 'string' || t === 'number' || t === 'boolean') return t;
  return 'object';
}

export function jsonToTypeScriptFromValue(value: unknown, options: TsOptions): string {
  const rootName = toPascalCase(options.rootName.trim() || 'Root');
  const decls: { name: string; body: string }[] = [];
  const used = new Set<string>([rootName]);
  const byBody = new Map<string, string>();

  const uniqueName = (base: string) => {
    let name = base;
    let n = 2;
    while (used.has(name)) name = `${base}${n++}`;
    used.add(name);
    return name;
  };

  const objectBody = (objects: Record<string, unknown>[], hint: string): string => {
    const keys: string[] = [];
    const seen = new Set<string>();
    for (const o of objects)
      for (const k of Object.keys(o))
        if (!seen.has(k)) {
          seen.add(k);
          keys.push(k);
        }
    const lines = keys.map((k) => {
      const values = objects
        .filter((o) => Object.prototype.hasOwnProperty.call(o, k))
        .map((o) => o[k]);
      const optional = options.allOptional || values.length < objects.length;
      const type = typeOf(values, k);
      return `  ${propertyName(k)}${optional ? '?' : ''}: ${type};`;
    });
    void hint;
    return lines.length ? `{\n${lines.join('\n')}\n}` : '{}';
  };

  const namedObject = (
    objects: Record<string, unknown>[],
    hint: string,
    forcedName?: string,
  ): string => {
    const body = objectBody(objects, hint);
    if (body === '{}') return 'Record<string, unknown>';
    if (forcedName) {
      decls.unshift({ name: forcedName, body });
      byBody.set(body, forcedName);
      return forcedName;
    }
    const existing = byBody.get(body);
    if (existing) return existing;
    const name = uniqueName(toPascalCase(hint));
    byBody.set(body, name);
    decls.push({ name, body });
    return name;
  };

  const typeOf = (samples: unknown[], hint: string, forcedName?: string): string => {
    if (samples.length === 0) return 'unknown';
    const kinds = new Set(samples.map(kindOf));
    const parts: string[] = [];
    if (kinds.has('string')) parts.push('string');
    if (kinds.has('number')) parts.push('number');
    if (kinds.has('boolean')) parts.push('boolean');
    if (kinds.has('object')) {
      const objs = samples.filter((s) => kindOf(s) === 'object') as Record<string, unknown>[];
      parts.push(namedObject(objs, hint, forcedName));
    }
    if (kinds.has('array')) {
      const items = (samples.filter(Array.isArray) as unknown[][]).flat();
      const inner = items.length ? typeOf(items, singularize(hint)) : 'unknown';
      parts.push(inner.includes(' | ') ? `(${inner})[]` : `${inner}[]`);
    }
    if (kinds.has('null')) parts.push('null');
    return parts.join(' | ');
  };

  const exp = options.exportTypes ? 'export ' : '';
  const render = (name: string, body: string) =>
    options.useTypeAlias ? `${exp}type ${name} = ${body};` : `${exp}interface ${name} ${body}`;

  const rootKind = kindOf(value);
  let rootLine: string | null = null;
  if (rootKind === 'object') {
    const t = typeOf([value], rootName, rootName);
    if (t !== rootName) rootLine = `${exp}type ${rootName} = ${t};`;
  } else {
    let t: string;
    if (rootKind === 'array') {
      const items = value as unknown[];
      const inner = items.length ? typeOf(items, `${rootName}Item`) : 'unknown';
      t = inner.includes(' | ') ? `(${inner})[]` : `${inner}[]`;
    } else {
      t = typeOf([value], rootName);
    }
    rootLine = `${exp}type ${rootName} = ${t};`;
  }

  const blocks = decls.map((d) => render(d.name, d.body));
  if (rootLine) blocks.unshift(rootLine);
  return `${blocks.join('\n\n')}\n`;
}

export function jsonToTypeScript(input: string, options: TsOptions): ConvertResult {
  const parsed = parseJson(input);
  if (!parsed.ok) {
    const { message, line, column } = parsed.issue;
    return fail('Invalid JSON', message, { line, column });
  }
  const output = jsonToTypeScriptFromValue(parsed.value, options);
  const count = (output.match(/^(export )?(interface|type) /gm) ?? []).length;
  return ok(output, { info: `Generated ${count} type declaration${count === 1 ? '' : 's'}.` });
}

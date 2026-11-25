import { parseJson, sortKeysDeep, type JsonSyntaxIssue } from '@/lib/json';

export type DiffKind = 'added' | 'removed' | 'changed' | 'type';

export interface DiffEntry {
  path: string;
  kind: DiffKind;
  left?: unknown;
  right?: unknown;
}

export interface CompareOptions {
  /** Treat arrays as unordered collections. */
  ignoreArrayOrder: boolean;
}

const IDENT = /^[A-Za-z_$][\w$]*$/;
const childPath = (path: string, key: string | number) =>
  typeof key === 'number'
    ? `${path}[${key}]`
    : IDENT.test(key)
      ? `${path}.${key}`
      : `${path}[${JSON.stringify(key)}]`;

type Kind = 'object' | 'array' | 'null' | 'string' | 'number' | 'boolean';
const kindOf = (v: unknown): Kind =>
  v === null ? 'null' : Array.isArray(v) ? 'array' : (typeof v as Kind);

const has = (o: object, k: string) => Object.prototype.hasOwnProperty.call(o, k);
const canonical = (v: unknown) => JSON.stringify(sortKeysDeep(v));

/** Structural diff of two JSON values. Key order and whitespace never matter. */
export function diffJson(
  left: unknown,
  right: unknown,
  options: CompareOptions,
  path = '$',
): DiffEntry[] {
  const lk = kindOf(left);
  const rk = kindOf(right);
  if (lk !== rk) return [{ path, kind: 'type', left, right }];

  if (lk === 'object') {
    const a = left as Record<string, unknown>;
    const b = right as Record<string, unknown>;
    const out: DiffEntry[] = [];
    for (const key of Object.keys(a)) {
      const p = childPath(path, key);
      if (!has(b, key)) out.push({ path: p, kind: 'removed', left: a[key] });
      else out.push(...diffJson(a[key], b[key], options, p));
    }
    for (const key of Object.keys(b))
      if (!has(a, key)) out.push({ path: childPath(path, key), kind: 'added', right: b[key] });
    return out;
  }

  if (lk === 'array') {
    const a = left as unknown[];
    const b = right as unknown[];
    if (options.ignoreArrayOrder) {
      // Multiset comparison: report items that exist on only one side.
      const counts = new Map<string, number>();
      for (const item of b) counts.set(canonical(item), (counts.get(canonical(item)) ?? 0) + 1);
      const out: DiffEntry[] = [];
      a.forEach((item, i) => {
        const key = canonical(item);
        const n = counts.get(key) ?? 0;
        if (n > 0) counts.set(key, n - 1);
        else out.push({ path: childPath(path, i), kind: 'removed', left: item });
      });
      // `counts` now holds the unmatched right-side items per value. The earliest occurrences of a
      // value were the ones matched, so report the last `unmatched` occurrences as added.
      const totals = new Map<string, number>();
      for (const item of b) totals.set(canonical(item), (totals.get(canonical(item)) ?? 0) + 1);
      const seen = new Map<string, number>();
      b.forEach((item, i) => {
        const key = canonical(item);
        const index = (seen.get(key) ?? 0) + 1;
        seen.set(key, index);
        const matched = (totals.get(key) ?? 0) - (counts.get(key) ?? 0);
        if (index > matched) out.push({ path: childPath(path, i), kind: 'added', right: item });
      });
      return out;
    }
    const out: DiffEntry[] = [];
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      const p = childPath(path, i);
      if (i >= b.length) out.push({ path: p, kind: 'removed', left: a[i] });
      else if (i >= a.length) out.push({ path: p, kind: 'added', right: b[i] });
      else out.push(...diffJson(a[i], b[i], options, p));
    }
    return out;
  }

  return Object.is(left, right) || left === right ? [] : [{ path, kind: 'changed', left, right }];
}

export type CompareResult =
  | { ok: true; diffs: DiffEntry[]; counts: Record<DiffKind, number> }
  | { ok: false; side: 'original' | 'modified'; issue: JsonSyntaxIssue };

export function compareJson(
  original: string,
  modified: string,
  options: CompareOptions,
): CompareResult {
  const a = parseJson(original);
  if (!a.ok) return { ok: false, side: 'original', issue: a.issue };
  const b = parseJson(modified);
  if (!b.ok) return { ok: false, side: 'modified', issue: b.issue };
  const diffs = diffJson(a.value, b.value, options);
  const counts: Record<DiffKind, number> = { added: 0, removed: 0, changed: 0, type: 0 };
  for (const d of diffs) counts[d.kind]++;
  return { ok: true, diffs, counts };
}

/** Short, single-line JSON preview of a value for the diff table. */
export function preview(value: unknown, max = 120): string {
  if (value === undefined) return '';
  const text = JSON.stringify(value);
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

/** Plain-text report of the differences (for copy and download). */
export function diffReport(diffs: DiffEntry[]): string {
  if (diffs.length === 0) return 'The two JSON documents are equivalent.';
  return diffs
    .map((d) => {
      switch (d.kind) {
        case 'added':
          return `+ ${d.path}: ${JSON.stringify(d.right)}`;
        case 'removed':
          return `- ${d.path}: ${JSON.stringify(d.left)}`;
        case 'changed':
          return `~ ${d.path}: ${JSON.stringify(d.left)} -> ${JSON.stringify(d.right)}`;
        case 'type':
          return `! ${d.path}: ${kindOf(d.left)} ${JSON.stringify(d.left)} -> ${kindOf(d.right)} ${JSON.stringify(d.right)}`;
      }
    })
    .join('\n');
}

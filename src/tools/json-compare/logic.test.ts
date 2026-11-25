import { describe, expect, it } from 'vitest';
import { compareJson, diffJson, diffReport } from './logic';

const ordered = { ignoreArrayOrder: false };

describe('diffJson', () => {
  it('ignores key order and finds added, removed, changed and type changes', () => {
    const a = { id: 1, name: 'Ann', tags: ['a'], meta: { v: 1 }, gone: true };
    const b = { meta: { v: 2 }, name: 'Ann', id: '1', tags: ['a', 'b'], extra: null };
    expect(diffJson(a, b, ordered)).toEqual([
      { path: '$.id', kind: 'type', left: 1, right: '1' },
      { path: '$.tags[1]', kind: 'added', right: 'b' },
      { path: '$.meta.v', kind: 'changed', left: 1, right: 2 },
      { path: '$.gone', kind: 'removed', left: true },
      { path: '$.extra', kind: 'added', right: null },
    ]);
  });
  it('returns nothing for equivalent documents', () => {
    expect(diffJson({ a: [1, { b: 2 }] }, { a: [1, { b: 2 }] }, ordered)).toEqual([]);
  });
  it('quotes unusual keys in paths', () => {
    expect(diffJson({ 'content-type': 'a' }, { 'content-type': 'b' }, ordered)[0]!.path).toBe(
      '$["content-type"]',
    );
  });
  it('can ignore array order (as a multiset)', () => {
    const opts = { ignoreArrayOrder: true };
    expect(diffJson([1, 2, 3], [3, 1, 2], opts)).toEqual([]);
    expect(diffJson([{ x: 1, y: 2 }], [{ y: 2, x: 1 }], opts)).toEqual([]);
    expect(diffJson([1, 1, 2], [1, 2, 2], opts)).toEqual([
      { path: '$[1]', kind: 'removed', left: 1 },
      { path: '$[2]', kind: 'added', right: 2 },
    ]);
  });
  it('keeps __proto__ keys as data', () => {
    const a = JSON.parse('{"__proto__": 1}');
    const b = JSON.parse('{"__proto__": 2}');
    expect(diffJson(a, b, ordered)).toEqual([
      { path: '$.__proto__', kind: 'changed', left: 1, right: 2 },
    ]);
  });
});

describe('compareJson', () => {
  it('counts differences and reports which side is invalid', () => {
    const r = compareJson('{"a":1,"b":2}', '{"a":1,"b":3,"c":4}', ordered);
    expect(r.ok && r.counts).toEqual({ added: 1, removed: 0, changed: 1, type: 0 });
    const bad = compareJson('{"a":1}', '{"a":}', ordered);
    expect(bad).toMatchObject({ ok: false, side: 'modified', issue: { line: 1, column: 6 } });
  });
  it('produces a readable report', () => {
    const r = compareJson('{"a":1,"b":true}', '{"a":2,"c":"x"}', ordered);
    expect(r.ok && diffReport(r.diffs)).toBe('~ $.a: 1 -> 2\n- $.b: true\n+ $.c: "x"');
    expect(diffReport([])).toMatch(/equivalent/);
  });
});

import { describe, expect, it } from 'vitest';
import { findJsonError, parseJson, sortKeysDeep } from '@/lib/json';
import { findUnsafeNumbers, formatJson } from './logic';

const opts = { mode: 'beautify' as const, indent: '2' as const, sortKeys: false };

describe('formatJson', () => {
  it('beautifies with 2 spaces, 4 spaces and tabs', () => {
    const r2 = formatJson('{"a":1,"b":[1,2]}', opts);
    expect(r2.ok && r2.output).toBe('{\n  "a": 1,\n  "b": [\n    1,\n    2\n  ]\n}');
    const r4 = formatJson('{"a":1}', { ...opts, indent: '4' });
    expect(r4.ok && r4.output).toBe('{\n    "a": 1\n}');
    const rt = formatJson('{"a":1}', { ...opts, indent: 'tab' });
    expect(rt.ok && rt.output).toBe('{\n\t"a": 1\n}');
  });

  it('minifies', () => {
    const r = formatJson('{\n  "a" : 1 ,\n "b": "x y"\n}', { ...opts, mode: 'minify' });
    expect(r.ok && r.output).toBe('{"a":1,"b":"x y"}');
  });

  it('sorts keys recursively but keeps array order', () => {
    const r = formatJson('{"b":1,"a":{"d":1,"c":2},"z":[3,1]}', {
      ...opts,
      mode: 'minify',
      sortKeys: true,
    });
    expect(r.ok && r.output).toBe('{"a":{"c":2,"d":1},"b":1,"z":[3,1]}');
    expect(sortKeysDeep([{ b: 1, a: 2 }])).toEqual([{ a: 2, b: 1 }]);
    const proto = formatJson('{"b":1,"__proto__":{"x":1}}', {
      ...opts,
      mode: 'minify',
      sortKeys: true,
    });
    expect(proto.ok && proto.output).toBe('{"__proto__":{"x":1},"b":1}');
  });

  it('reports errors with line and column', () => {
    const r = formatJson('{\n  "a": 1,\n  "b": 2,\n}', opts);
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.error.line).toBe(4);
      expect(r.error.column).toBe(1);
      expect(r.error.message).toMatch(/Trailing comma/);
    }
  });

  it('accepts a byte order mark', () => {
    expect(parseJson('\uFEFF{"a":1}').ok).toBe(true);
  });

  it('warns about numbers that lose precision', () => {
    expect(findUnsafeNumbers('{"id": 12345678901234567890, "s": "12345678901234567890"}')).toEqual([
      '12345678901234567890',
    ]);
    expect(findUnsafeNumbers('{"n": 9007199254740991}')).toEqual([]);
    expect(findUnsafeNumbers('{"pi": 3.14159265358979323846, "e": 1e12345678901234567}')).toEqual(
      [],
    );
    expect(findUnsafeNumbers('[-12345678901234567890]')).toEqual(['-12345678901234567890']);
    const r = formatJson('{"id": 12345678901234567890}', opts);
    expect(r.ok && r.warnings?.length).toBe(1);
  });
});

describe('findJsonError', () => {
  const cases: [string, RegExp, number, number][] = [
    ["{'a': 1}", /double quotes/, 1, 2],
    ['{"a": 1 "b": 2}', /Expected "," or "}"/, 1, 9],
    ['[1, 2,]', /Trailing comma/, 1, 7],
    ['{"a": tru}', /value was expected/, 1, 7],
    ['{"a": 01}', /Invalid number/, 1, 8],
    ['{"a": "x', /Unterminated string/, 1, 7],
    ['{"a": 1', /not closed/, 1, 8],
    ['', /empty/, 1, 1],
    ['{"a": undefined}', /undefined/, 1, 7],
    ['{} x', /after the end/, 1, 4],
    ['{"a": "line\nbreak"}', /control character/, 1, 12],
  ];
  it.each(cases)('%s', (text, msg, line, column) => {
    const issue = findJsonError(text);
    expect(issue).not.toBeNull();
    expect(issue!.message).toMatch(msg);
    expect([issue!.line, issue!.column]).toEqual([line, column]);
  });

  it('returns null for valid JSON', () => {
    for (const t of [
      '{}',
      '[]',
      '0',
      '-1.5e3',
      '"x\\u00e9"',
      'null',
      ' {"a":[true,false,null]} ',
    ]) {
      expect(findJsonError(t)).toBeNull();
    }
  });
});

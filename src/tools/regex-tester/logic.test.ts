import { describe, expect, it } from 'vitest';
import { highlightSegments, runRegex } from './logic';

describe('runRegex', () => {
  it('finds all matches with capture groups and named groups', () => {
    const r = runRegex({
      pattern: '(?<user>\\w+)@(\\w+)\\.com',
      flags: 'g',
      text: 'a@x.com, bob@y.com',
    });
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.matches.map((m) => [m.index, m.text, m.groups])).toEqual([
      [0, 'a@x.com', ['a', 'x']],
      [9, 'bob@y.com', ['bob', 'y']],
    ]);
    expect(r.matches[1]!.named).toEqual({ user: 'bob' });
    expect(r.groupNames).toEqual(['user']);
  });
  it('returns only the first match without the g flag', () => {
    const r = runRegex({ pattern: '\\d', flags: '', text: 'a1b2' });
    expect(r.ok && r.matches.length).toBe(1);
  });
  it('handles empty matches without looping forever', () => {
    const r = runRegex({ pattern: 'x*', flags: 'g', text: 'axxb' });
    expect(r.ok && r.matches.map((m) => m.text)).toEqual(['', 'xx', '', '']);
    const u = runRegex({ pattern: '', flags: 'gu', text: '😀a' });
    expect(u.ok && u.matches.map((m) => m.index)).toEqual([0, 2, 3]);
  });
  it('builds a replace preview with group references', () => {
    const r = runRegex({
      pattern: '(\\w+) (\\w+)',
      flags: 'g',
      text: 'John Smith',
      replacement: '$2, $1',
    });
    expect(r.ok && r.replaced).toBe('Smith, John');
  });
  it('reports syntax errors and truncates huge result lists', () => {
    const bad = runRegex({ pattern: '(abc', flags: 'g', text: '' });
    expect(bad.ok).toBe(false);
    if (!bad.ok) expect(bad.error).toMatch(/Unterminated group/);
    const many = runRegex({ pattern: '.', flags: 'g', text: 'a'.repeat(50) }, 10);
    expect(many.ok && many.truncated).toBe(true);
    expect(many.ok && many.matches.length).toBe(10);
  });
  it('reports invalid flags', () => {
    expect(runRegex({ pattern: 'a', flags: 'gg', text: 'a' }).ok).toBe(false);
  });
});

describe('highlightSegments', () => {
  it('splits text around matches', () => {
    const r = runRegex({ pattern: 'o', flags: 'g', text: 'foo bar' });
    if (!r.ok) throw new Error('expected ok');
    expect(highlightSegments('foo bar', r.matches)).toEqual([
      { text: 'f' },
      { text: 'o', match: 0 },
      { text: 'o', match: 1 },
      { text: ' bar' },
    ]);
  });
});

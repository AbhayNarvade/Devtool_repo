import { describe, expect, it } from 'vitest';
import { formatSql } from './logic';

const base = { language: 'sql' as const, keywordCase: 'upper' as const, indent: '2' as const };

describe('formatSql', () => {
  it('formats and upper-cases keywords', () => {
    const r = formatSql('select id, name from users where active = 1 order by name', base);
    expect(r.ok && r.output).toBe(
      'SELECT\n  id,\n  name\nFROM\n  users\nWHERE\n  active = 1\nORDER BY\n  name',
    );
  });
  it('supports lower case, 4-space and tab indentation', () => {
    const lower = formatSql('SELECT a FROM t', { ...base, keywordCase: 'lower', indent: '4' });
    expect(lower.ok && lower.output).toBe('select\n    a\nfrom\n    t');
    const tab = formatSql('SELECT a FROM t', { ...base, indent: 'tab' });
    expect(tab.ok && tab.output).toBe('SELECT\n\ta\nFROM\n\tt');
  });
  it('separates multiple statements', () => {
    const r = formatSql('select 1; select 2;', base);
    expect(r.ok && r.output).toBe('SELECT\n  1;\n\nSELECT\n  2;');
  });
  it('understands dialect syntax', () => {
    const r = formatSql("select data->>'name' from docs", { ...base, language: 'postgresql' });
    expect(r.ok && r.output).toContain("data ->> 'name'");
  });
  it('reports parse errors with a position', () => {
    const r = formatSql('select (a from t', base);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.line).toBe(1);
  });
});

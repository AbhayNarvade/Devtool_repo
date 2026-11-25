import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { categories, tools } from '.';
import { parseMarkdown } from '@/lib/markdown';

const registrySource = readFileSync(
  path.join(import.meta.dirname, '..', 'tools', 'registry.tsx'),
  'utf8',
);
const uiSlugs = [
  ...registrySource.matchAll(
    /^\s*'([a-z0-9-]+)': load\(\(\) => import\('\.\/([a-z0-9-]+)\/Tool'\)\)/gm,
  ),
];

describe('tool registry', () => {
  it('every tool has a UI component and every UI component has a registry entry', () => {
    expect(uiSlugs.map((m) => m[1]).sort()).toEqual(tools.map((t) => t.slug).sort());
    for (const m of uiSlugs) expect(m[1]).toBe(m[2]);
  });

  it('slugs are unique and every tool belongs to a known category', () => {
    expect(new Set(tools.map((t) => t.slug)).size).toBe(tools.length);
    const cats = new Set(categories.map((c) => c.slug));
    for (const t of tools) expect(cats.has(t.category)).toBe(true);
  });

  it('content headings inside sections never use H2 (the section heading is the H2)', () => {
    for (const t of tools)
      for (const s of t.contentSections)
        for (const b of parseMarkdown(s.body))
          if (b.type === 'heading') expect(b.level, `${t.slug}: ${s.heading}`).toBeGreaterThan(2);
  });

  it('FAQ text is plain (no Markdown), because it is copied verbatim into JSON-LD', () => {
    for (const t of [...tools, ...categories])
      for (const f of t.faqs) expect(`${f.question} ${f.answer}`).not.toMatch(/`|\*\*|\]\(/);
  });
});

'use client';

import Link from 'next/link';
import { useId, useMemo, useState } from 'react';
import type { ToolCardData } from '@/data';
import { searchItems } from '@/lib/search';
import { UiIcon } from './Icon';
import { ToolCard } from './ToolCard';

export interface ExplorerCategory {
  slug: string;
  name: string;
  path: string;
  intro: string;
  tools: (ToolCardData & { keywords: string })[];
}

/** Homepage tool directory with an instant filter. Fully server-rendered for the empty query. */
export function HomeExplorer({ categories }: { categories: ExplorerCategory[] }) {
  const id = useId();
  const [query, setQuery] = useState('');

  const all = useMemo(
    () =>
      categories.flatMap((c) =>
        c.tools.map((t) => ({ ...t, category: c.name, keywords: t.keywords })),
      ),
    [categories],
  );
  const results = useMemo(() => searchItems(all, query), [all, query]);
  const filtering = query.trim().length > 0;

  return (
    <div>
      <div className="relative max-w-xl">
        <label htmlFor={id} className="mb-2 block text-sm font-medium text-fg">
          Find a tool
        </label>
        <UiIcon
          name="search"
          className="pointer-events-none absolute bottom-3.5 left-3.5 h-5 w-5 text-fg-muted"
        />
        <input
          id={id}
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Try “json”, “compress”, “pdf” or “color”"
          autoComplete="off"
          aria-describedby={`${id}-status`}
          className="h-12 w-full rounded-xl border border-border-strong bg-card pr-4 pl-11 text-base text-fg shadow-sm placeholder:text-fg-muted focus:border-accent"
        />
      </div>
      <p id={`${id}-status`} className="sr-only" aria-live="polite">
        {filtering ? `${results.length} tools match` : ''}
      </p>

      {filtering ? (
        <section aria-label="Search results" className="mt-8">
          {results.length === 0 ? (
            <p className="text-fg-muted">
              No tools match “{query.trim()}”. Try a shorter or different word.
            </p>
          ) : (
            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {results.map((card) => (
                <li key={card.path}>
                  <ToolCard card={card} />
                </li>
              ))}
            </ul>
          )}
        </section>
      ) : (
        categories.map((c) => (
          <section key={c.slug} aria-labelledby={`${id}-${c.slug}`} className="mt-12">
            <div className="flex flex-wrap items-end justify-between gap-2">
              <h2 id={`${id}-${c.slug}`} className="text-2xl font-bold tracking-tight">
                {c.name}
              </h2>
              <Link
                href={c.path}
                className="inline-flex items-center gap-1 text-sm font-medium text-accent-text hover:underline"
              >
                All {c.name.toLowerCase()}
                <UiIcon name="arrowRight" className="h-4 w-4" />
              </Link>
            </div>
            <p className="mt-2 max-w-3xl text-fg-muted">{c.intro}</p>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {c.tools.map((card) => (
                <li key={card.path}>
                  <ToolCard card={card} />
                </li>
              ))}
            </ul>
          </section>
        ))
      )}
    </div>
  );
}

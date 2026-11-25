'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useId, useMemo, useRef, useState } from 'react';
import type { SearchItem } from '@/data';
import { searchItems } from '@/lib/search';
import { UiIcon } from './Icon';

interface SearchBoxProps {
  items: SearchItem[];
  /** Visually hidden label text. */
  label?: string;
  placeholder?: string;
  className?: string;
}

/** Accessible combobox (WAI-ARIA 1.2 pattern) that jumps to a tool page. */
export function SearchBox({
  items,
  label = 'Search tools',
  placeholder = 'Search tools…',
  className = '',
}: SearchBoxProps) {
  const router = useRouter();
  const id = useId();
  const listId = `${id}-list`;
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchItems(items, query, 8), [items, query]);
  const showList = open && query.trim().length > 0;

  function go(path: string) {
    setOpen(false);
    setQuery('');
    setActive(-1);
    router.push(path);
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setOpen(true);
      setActive((i) => (results.length ? (i + 1) % results.length : -1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActive((i) => (results.length ? (i <= 0 ? results.length - 1 : i - 1) : -1));
    } else if (e.key === 'Enter') {
      const target = results[active >= 0 ? active : 0];
      if (target) {
        e.preventDefault();
        go(target.path);
      }
    } else if (e.key === 'Escape') {
      setOpen(false);
      setActive(-1);
    }
  }

  return (
    <div
      ref={wrapRef}
      className={`relative ${className}`}
      onBlur={(e) => {
        if (!wrapRef.current?.contains(e.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <label htmlFor={`${id}-input`} className="sr-only">
        {label}
      </label>
      <UiIcon
        name="search"
        className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-fg-muted"
      />
      <input
        id={`${id}-input`}
        type="search"
        role="combobox"
        aria-expanded={showList}
        aria-controls={listId}
        aria-autocomplete="list"
        aria-activedescendant={showList && active >= 0 ? `${id}-opt-${active}` : undefined}
        autoComplete="off"
        spellCheck={false}
        placeholder={placeholder}
        value={query}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
          setActive(-1);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={onKeyDown}
        className="h-10 w-full rounded-lg border border-border bg-bg-subtle pr-3 pl-9 text-[0.95rem] text-fg placeholder:text-fg-muted focus:border-accent focus:bg-bg"
      />
      <ul
        id={listId}
        role="listbox"
        aria-label="Matching tools"
        hidden={!showList}
        className="absolute right-0 left-0 z-50 mt-2 max-h-96 overflow-auto rounded-xl border border-border bg-card p-1 shadow-xl"
      >
        {results.length === 0 ? (
          <li className="px-3 py-2 text-sm text-fg-muted" role="presentation">
            No tools match “{query.trim()}”.
          </li>
        ) : (
          results.map((item, i) => (
            <li
              key={item.path}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              className={`rounded-lg ${i === active ? 'bg-accent-soft' : ''}`}
            >
              <Link
                href={item.path}
                tabIndex={-1}
                onClick={() => {
                  setOpen(false);
                  setQuery('');
                }}
                className="block px-3 py-2 hover:bg-bg-muted"
              >
                <span className="block text-sm font-medium text-fg">{item.name}</span>
                <span className="block text-xs text-fg-muted">{item.category}</span>
              </Link>
            </li>
          ))
        )}
      </ul>
    </div>
  );
}

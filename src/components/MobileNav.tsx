'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { UiIcon } from './Icon';

interface NavLink {
  href: string;
  label: string;
}

export function MobileNav({ links }: { links: NavLink[] }) {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-muted hover:text-fg"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen((o) => !o)}
      >
        <UiIcon name={open ? 'close' : 'menu'} />
      </button>
      <nav
        id="mobile-menu"
        aria-label="Mobile"
        hidden={!open}
        className="absolute inset-x-0 top-full border-b border-border bg-bg shadow-lg"
      >
        <ul className="mx-auto max-w-7xl px-4 py-3">
          {links.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setOpen(false)}
                className="block rounded-lg px-3 py-3 font-medium text-fg hover:bg-bg-muted"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

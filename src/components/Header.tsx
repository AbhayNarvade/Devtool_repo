import Link from 'next/link';
import { SITE_NAME } from '@/config/site';
import { activeCategories, searchIndex, staticPages } from '@/data';
import { categoryPath } from '@/lib/routes';
import { LogoMark } from './Logo';
import { MobileNav } from './MobileNav';
import { SearchBox } from './SearchBox';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
  const cats = activeCategories();
  const index = searchIndex();
  const mobileLinks = [
    { href: '/', label: 'Home' },
    ...cats.map((c) => ({ href: categoryPath(c.slug), label: c.name })),
    ...staticPages
      .filter((p) => p.path === '/about' || p.path === '/contact')
      .map((p) => ({ href: p.path, label: p.name })),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/90 backdrop-blur supports-[backdrop-filter]:bg-bg/80">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:px-6">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 text-lg font-bold tracking-tight text-fg"
        >
          <LogoMark className="h-8 w-8" />
          <span>{SITE_NAME}</span>
        </Link>

        {cats.length > 0 ? (
          <nav aria-label="Categories" className="ml-4 hidden lg:block">
            <ul className="flex items-center gap-1">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryPath(c.slug)}
                    className="rounded-lg px-3 py-2 text-[0.95rem] font-medium text-fg-muted hover:bg-bg-muted hover:text-fg"
                  >
                    {c.navName}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}

        <div className="ml-auto flex items-center gap-1">
          {index.length > 0 ? (
            <SearchBox items={index} className="hidden w-56 sm:block xl:w-72" />
          ) : null}
          <ThemeToggle />
          <MobileNav links={mobileLinks} />
        </div>
      </div>
      {index.length > 0 ? (
        <div className="border-t border-border px-4 py-2 sm:hidden">
          <SearchBox items={index} label="Search tools (mobile)" />
        </div>
      ) : null}
    </header>
  );
}

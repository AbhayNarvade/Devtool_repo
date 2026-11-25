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
      <div className="relative mx-auto flex max-w-7xl flex-wrap items-center gap-x-3 gap-y-2 px-4 sm:h-16 sm:flex-nowrap sm:px-6 max-sm:pt-3">
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

        <div className="ml-auto flex items-center gap-1 sm:order-last sm:ml-0">
          <ThemeToggle />
          <MobileNav links={mobileLinks} />
        </div>

        {/* One search box for all screen sizes: a full-width second row on phones, inline from sm up. */}
        {index.length > 0 ? (
          <SearchBox
            items={index}
            className="order-last w-full pb-2 sm:order-none sm:ml-auto sm:w-56 sm:pb-0 xl:w-72"
          />
        ) : null}
      </div>
    </header>
  );
}

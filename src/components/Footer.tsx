import Link from 'next/link';
import { SITE_NAME } from '@/config/site';
import { activeCategories, staticPages } from '@/data';
import { categoryPath } from '@/lib/routes';
import { LogoMark } from './Logo';

export function Footer() {
  const cats = activeCategories();
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-border bg-bg-subtle">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div>
          <Link href="/" className="flex items-center gap-2 text-lg font-bold text-fg">
            <LogoMark className="h-7 w-7" />
            <span>{SITE_NAME}</span>
          </Link>
          <p className="mt-3 max-w-xs text-sm text-fg-muted">
            Free online tools that run entirely in your browser. Your files and text never leave
            your device.
          </p>
        </div>
        {cats.length > 0 ? (
          <nav aria-label="Tool categories">
            <h2 className="text-sm font-semibold text-fg">Tool categories</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {cats.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={categoryPath(c.slug)}
                    className="text-fg-muted hover:text-fg hover:underline"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
        {staticPages.length > 0 ? (
          <nav aria-label="Site information">
            <h2 className="text-sm font-semibold text-fg">{SITE_NAME}</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {staticPages.map((p) => (
                <li key={p.path}>
                  <Link href={p.path} className="text-fg-muted hover:text-fg hover:underline">
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-5 text-sm text-fg-muted sm:px-6">
          © {year} {SITE_NAME}. All tools are free to use.
        </p>
      </div>
    </footer>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { ToolCard } from '@/components/ToolCard';
import { activeCategories, popularTools, toCard } from '@/data';
import { categoryPath } from '@/lib/routes';

export const metadata: Metadata = {
  title: 'Page not found',
  description:
    'The page you were looking for does not exist or has moved. Try one of our popular free tools or browse the tool categories.',
  // Next.js injects <meta name="robots" content="noindex"> on not-found pages automatically.
};

export default function NotFound() {
  const popular = popularTools().slice(0, 9);
  const cats = activeCategories();
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      <p className="text-sm font-semibold text-accent-text">Error 404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        We couldn’t find that page
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-fg-muted">
        The link may be broken, or the page may have moved. Check the address for typos, go back to
        the{' '}
        <Link href="/" className="text-accent-text underline underline-offset-4">
          homepage
        </Link>
        {cats.length > 0 ? ', or pick one of the tools below.' : '.'}
      </p>

      {popular.length > 0 ? (
        <section aria-labelledby="popular-heading" className="mt-12">
          <h2 id="popular-heading" className="text-xl font-semibold">
            Popular tools
          </h2>
          <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((tool) => (
              <li key={tool.slug}>
                <ToolCard card={toCard(tool)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {cats.length > 0 ? (
        <section aria-labelledby="categories-heading" className="mt-12">
          <h2 id="categories-heading" className="text-xl font-semibold">
            Browse by category
          </h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {cats.map((c) => (
              <li key={c.slug}>
                <Link
                  href={categoryPath(c.slug)}
                  className="inline-block rounded-lg border border-border px-4 py-2 font-medium hover:border-accent hover:text-accent-text"
                >
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}

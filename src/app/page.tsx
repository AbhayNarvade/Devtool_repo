import { AdPlacement } from '@/components/AdSlot';
import { FaqList } from '@/components/FaqList';
import { HomeExplorer, type ExplorerCategory } from '@/components/HomeExplorer';
import { UiIcon } from '@/components/Icon';
import { Markdown } from '@/components/Markdown';
import { ToolCard } from '@/components/ToolCard';
import { activeCategories, popularTools, toCard, toolsInCategory } from '@/data';
import { home } from '@/data/home';
import { categoryPath } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';

export const metadata = buildMetadata({
  absoluteTitle: home.metaTitle,
  description: home.metaDescription,
  path: '/',
});

export default function HomePage() {
  const explorer: ExplorerCategory[] = activeCategories().map((c) => ({
    slug: c.slug,
    name: c.name,
    path: categoryPath(c.slug),
    intro: c.intro,
    tools: toolsInCategory(c.slug).map((t) => ({
      ...toCard(t),
      keywords: [t.primaryKeyword, ...t.secondaryKeywords].join(' '),
    })),
  }));
  const popular = popularTools();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6">
      <section className="py-12 sm:py-16">
        <h1 className="max-w-3xl text-4xl font-extrabold tracking-tight text-balance sm:text-5xl">
          {home.h1}
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-fg-muted">{home.intro}</p>
        <p className="mt-4 inline-flex items-center gap-2 rounded-full bg-success-soft px-3 py-1 text-sm font-medium text-success">
          <UiIcon name="shield" className="h-4 w-4" />
          Your files never leave your device
        </p>
      </section>

      {explorer.length > 0 ? <HomeExplorer categories={explorer} /> : null}

      {popular.length > 0 ? (
        <section aria-labelledby="popular" className="mt-16">
          <h2 id="popular" className="text-2xl font-bold tracking-tight">
            Popular tools
          </h2>
          <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {popular.map((t) => (
              <li key={t.slug}>
                <ToolCard card={toCard(t)} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <AdPlacement name="homeTop" />

      <section aria-labelledby="why" className="mt-16">
        <h2 id="why" className="text-2xl font-bold tracking-tight">
          {home.whyHeading}
        </h2>
        <ul className="mt-6 grid gap-6 sm:grid-cols-2">
          {home.why.map((item) => (
            <li key={item.title} className="rounded-xl border border-border bg-card p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
                <UiIcon name={item.icon} />
              </span>
              <h3 className="mt-4 text-lg font-semibold">{item.title}</h3>
              <p className="mt-2 text-fg-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="how" className="prose-content mt-16 max-w-3xl">
        <h2 id="how">{home.howHeading}</h2>
        <Markdown source={home.how} />
      </section>

      <AdPlacement name="homeBottom" />

      <section aria-labelledby="faq" className="mt-16 max-w-3xl">
        <h2 id="faq" className="text-2xl font-bold tracking-tight">
          {home.faqHeading}
        </h2>
        <div className="mt-6">
          <FaqList faqs={home.faqs} />
        </div>
      </section>
    </div>
  );
}

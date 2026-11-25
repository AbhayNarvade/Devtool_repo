import { notFound } from 'next/navigation';
import { AdPlacement } from '@/components/AdSlot';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqList } from '@/components/FaqList';
import { JsonLd } from '@/components/JsonLd';
import { Markdown } from '@/components/Markdown';
import { ToolCard } from '@/components/ToolCard';
import { activeCategories, getCategory, toCard, toolsInCategory } from '@/data';
import { breadcrumbLd, collectionPageLd, faqLd, graph } from '@/lib/jsonld';
import { categoryPath } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';

export const dynamicParams = false;

export function generateStaticParams() {
  return activeCategories().map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[category]'>) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return {};
  return buildMetadata({
    absoluteTitle: cat.metaTitle,
    description: cat.metaDescription,
    path: categoryPath(cat.slug),
  });
}

export default async function CategoryPage({ params }: PageProps<'/[category]'>) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();
  const items = toolsInCategory(cat.slug);
  if (items.length === 0) notFound();

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: cat.name, path: categoryPath(cat.slug) },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <JsonLd data={graph(collectionPageLd(cat, items), breadcrumbLd(crumbs), faqLd(cat.faqs))} />
      <div data-no-wordcount="">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{cat.h1}</h1>
      <p className="mt-4 max-w-3xl text-lg text-fg-muted">{cat.intro}</p>

      <section aria-label={`${cat.name} list`} className="mt-10" data-no-wordcount="">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((t) => (
            <li key={t.slug}>
              <ToolCard card={toCard(t)} headingLevel={2} />
            </li>
          ))}
        </ul>
      </section>

      <AdPlacement name="categoryTop" />

      <div className="prose-content mt-14 max-w-3xl">
        {cat.contentSections.map((s) => (
          <section key={s.heading}>
            <h2>{s.heading}</h2>
            <Markdown source={s.body} />
          </section>
        ))}
      </div>

      <AdPlacement name="categoryBottom" />

      <section aria-labelledby="faq" className="mt-14 max-w-3xl">
        <h2 id="faq" className="text-2xl font-bold tracking-tight">
          {cat.name}: frequently asked questions
        </h2>
        <div className="mt-6">
          <FaqList faqs={cat.faqs} />
        </div>
      </section>
    </div>
  );
}

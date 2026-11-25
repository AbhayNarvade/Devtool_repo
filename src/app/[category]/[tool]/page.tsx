import { notFound } from 'next/navigation';
import { AdPlacement } from '@/components/AdSlot';
import { Breadcrumbs } from '@/components/Breadcrumbs';
import { FaqList } from '@/components/FaqList';
import { JsonLd } from '@/components/JsonLd';
import { Markdown } from '@/components/Markdown';
import { ToolCard } from '@/components/ToolCard';
import { AD_PLACEMENTS } from '@/config/ads';
import { ADSENSE_CLIENT } from '@/config/site';
import { getCategory, getTool, relatedTools, toCard, tools } from '@/data';
import { breadcrumbLd, faqLd, graph, webApplicationLd } from '@/lib/jsonld';
import { categoryPath, toolPath } from '@/lib/routes';
import { buildMetadata } from '@/lib/seo';
import { ToolMount } from '@/tools/registry';

export const dynamicParams = false;

export function generateStaticParams() {
  return tools.map((t) => ({ category: t.category, tool: t.slug }));
}

export async function generateMetadata({ params }: PageProps<'/[category]/[tool]'>) {
  const { category, tool: slug } = await params;
  const tool = getTool(category, slug);
  if (!tool) return {};
  return buildMetadata({
    absoluteTitle: tool.metaTitle,
    description: tool.metaDescription,
    path: toolPath(tool.category, tool.slug),
    ogAlt: `${tool.name}: ${tool.primaryKeyword}`,
  });
}

function formatDate(iso: string) {
  return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

export default async function ToolPage({ params }: PageProps<'/[category]/[tool]'>) {
  const { category, tool: slug } = await params;
  const tool = getTool(category, slug);
  const cat = getCategory(category);
  if (!tool || !cat) notFound();

  const crumbs = [
    { name: 'Home', path: '/' },
    { name: cat.name, path: categoryPath(cat.slug) },
    { name: tool.name, path: toolPath(tool.category, tool.slug) },
  ];
  const before = tool.contentSections.filter((s) => s.kind !== 'tips');
  const tips = tool.contentSections.filter((s) => s.kind === 'tips');
  const related = relatedTools(tool);
  const sidebar = AD_PLACEMENTS.toolSidebar;
  const showSidebar = Boolean(ADSENSE_CLIENT && sidebar.enabled && sidebar.slot);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      <JsonLd data={graph(webApplicationLd(tool), breadcrumbLd(crumbs), faqLd(tool.faqs))} />
      <div className={showSidebar ? 'grid gap-10 xl:grid-cols-[minmax(0,1fr)_300px]' : ''}>
        <article className="min-w-0">
          <div data-no-wordcount="">
            <Breadcrumbs crumbs={crumbs} />
          </div>
          <header className="mt-5 max-w-3xl">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{tool.h1}</h1>
            <p className="mt-3 text-lg text-fg-muted">{tool.intro}</p>
          </header>

          <section
            aria-label={`${tool.name} tool`}
            className="mt-6"
            data-no-wordcount=""
            data-tool-ui=""
          >
            <ToolMount slug={tool.slug} />
          </section>

          <AdPlacement name="toolBelowTool" className="mt-12" />

          <div className="prose-content mt-12 max-w-3xl">
            <section>
              <h2>How to use the {tool.name}</h2>
              <ol>
                {tool.howToSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </section>

            {before.map((s, i) => (
              <div key={s.heading}>
                <section>
                  <h2>{s.heading}</h2>
                  <Markdown source={s.body} />
                </section>
                {i === 0 ? <AdPlacement name="toolMidContent" /> : null}
              </div>
            ))}

            <section>
              <h2>{tool.name} features</h2>
              <ul>
                {tool.features.map((f) => (
                  <li key={f}>{f}</li>
                ))}
              </ul>
            </section>

            {tips.map((s) => (
              <section key={s.heading}>
                <h2>{s.heading}</h2>
                <Markdown source={s.body} />
              </section>
            ))}
          </div>

          <AdPlacement name="toolBeforeFaq" />

          <section aria-labelledby="faq" className="mt-12 max-w-3xl">
            <h2 id="faq" className="text-2xl font-bold tracking-tight">
              Frequently asked questions
            </h2>
            <div className="mt-6">
              <FaqList faqs={tool.faqs} />
            </div>
          </section>

          <section aria-labelledby="related" className="mt-12" data-no-wordcount="">
            <h2 id="related" className="text-2xl font-bold tracking-tight">
              Related tools
            </h2>
            <ul className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <ToolCard card={toCard(r)} />
                </li>
              ))}
            </ul>
          </section>

          <p className="mt-10 text-sm text-fg-muted">
            Last updated: <time dateTime={tool.lastUpdated}>{formatDate(tool.lastUpdated)}</time>
          </p>
        </article>

        {showSidebar ? (
          <aside aria-label="Sidebar" className="hidden xl:block">
            <div className="sticky top-24">
              <AdPlacement name="toolSidebar" className="my-0" />
            </div>
          </aside>
        ) : null}
      </div>
    </div>
  );
}

import type { ReactNode } from 'react';
import type { StaticPage } from '@/data/types';
import { breadcrumbLd, graph } from '@/lib/jsonld';
import { absoluteUrl } from '@/config/site';
import { formatDisplayDate } from '@/lib/date';
import { Breadcrumbs } from './Breadcrumbs';
import { JsonLd } from './JsonLd';

interface Props {
  page: StaticPage;
  h1: string;
  intro?: ReactNode;
  /** schema.org type of the page: AboutPage, ContactPage or WebPage. */
  schemaType?: 'AboutPage' | 'ContactPage' | 'WebPage';
  children: ReactNode;
}

/** Layout for About, Contact, Privacy and Terms. These pages never show ads. */
export function StaticPageLayout({ page, h1, intro, schemaType = 'WebPage', children }: Props) {
  const crumbs = [
    { name: 'Home', path: '/' },
    { name: page.name, path: page.path },
  ];
  const url = absoluteUrl(page.path);
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <JsonLd
        data={graph(
          {
            '@type': schemaType,
            '@id': `${url}#page`,
            name: h1,
            url,
            description: page.metaDescription,
            inLanguage: 'en',
            dateModified: page.lastUpdated,
          },
          breadcrumbLd(crumbs),
        )}
      />
      <div data-no-wordcount="">
        <Breadcrumbs crumbs={crumbs} />
      </div>
      <h1 className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl">{h1}</h1>
      {intro ? <div className="mt-4 text-lg text-fg-muted">{intro}</div> : null}
      <div className="prose-content mt-8">{children}</div>
      <p className="mt-12 border-t border-border pt-6 text-sm text-fg-muted">
        Last updated: <time dateTime={page.lastUpdated}>{formatDisplayDate(page.lastUpdated)}</time>
      </p>
    </div>
  );
}

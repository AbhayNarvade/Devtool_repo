import { SITE_NAME, SITE_URL, absoluteUrl } from '@/config/site';
import type { Category, Faq, Tool } from '@/data/types';
import { toolPath } from './routes';

type Json = Record<string, unknown>;

const ORG_ID = `${SITE_URL}/#organization`;
const WEBSITE_ID = `${SITE_URL}/#website`;

export function organizationLd(): Json {
  return {
    '@type': 'Organization',
    '@id': ORG_ID,
    name: SITE_NAME,
    url: SITE_URL,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl('/icon-512.png'),
      width: 512,
      height: 512,
    },
  };
}

/** WebSite entity. No SearchAction: Google retired the sitelinks search box. */
export function websiteLd(): Json {
  return {
    '@type': 'WebSite',
    '@id': WEBSITE_ID,
    name: SITE_NAME,
    url: SITE_URL,
    inLanguage: 'en',
    publisher: { '@id': ORG_ID },
  };
}

export interface Crumb {
  name: string;
  path: string;
}

export function breadcrumbLd(crumbs: Crumb[]): Json {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: crumbs.map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: absoluteUrl(c.path),
    })),
  };
}

/** FAQPage built from exactly the same strings that are rendered on the page. */
export function faqLd(faqs: Faq[]): Json {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: { '@type': 'Answer', text: f.answer },
    })),
  };
}

export function webApplicationLd(tool: Tool): Json {
  const url = absoluteUrl(toolPath(tool.category, tool.slug));
  return {
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: tool.name,
    url,
    description: tool.metaDescription,
    applicationCategory: tool.schemaCategory,
    operatingSystem: 'Any',
    browserRequirements:
      tool.browserRequirements ?? 'Requires a modern browser with JavaScript enabled.',
    isAccessibleForFree: true,
    inLanguage: 'en',
    dateModified: tool.lastUpdated,
    offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    publisher: { '@id': ORG_ID },
  };
}

export function collectionPageLd(category: Category, tools: Tool[]): Json {
  const url = absoluteUrl(`/${category.slug}`);
  return {
    '@type': 'CollectionPage',
    '@id': `${url}#page`,
    name: category.h1,
    url,
    description: category.metaDescription,
    inLanguage: 'en',
    isPartOf: { '@id': WEBSITE_ID },
    mainEntity: itemListLd(tools),
  };
}

export function itemListLd(tools: Tool[]): Json {
  return {
    '@type': 'ItemList',
    numberOfItems: tools.length,
    itemListElement: tools.map((t, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: t.name,
      url: absoluteUrl(toolPath(t.category, t.slug)),
    })),
  };
}

/** Wrap one or more entities into a single JSON-LD document. */
export function graph(...nodes: Json[]): Json {
  return { '@context': 'https://schema.org', '@graph': nodes };
}

/** Serialise JSON-LD safely for inline <script> tags. */
export function serializeJsonLd(data: Json): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029');
}

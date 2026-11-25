import type { Metadata } from 'next';
import { OG_LOCALE, SITE_NAME, absoluteUrl } from '@/config/site';
import { ogImagePath } from './routes';

interface PageMetaInput {
  /** Title WITHOUT the site suffix; the root template appends " | SITE_NAME". */
  title?: string;
  /** Full title used verbatim (tool pages already end with " | SITE_NAME"). */
  absoluteTitle?: string;
  description: string;
  /** Site path, e.g. "/" or "/developer-tools/json-formatter". */
  path: string;
  /** Alt text for the OG image. */
  ogAlt?: string;
  noindex?: boolean;
}

export const ROBOTS_INDEX: Metadata['robots'] = {
  index: true,
  follow: true,
  'max-image-preview': 'large',
  'max-snippet': -1,
  googleBot: {
    index: true,
    follow: true,
    'max-image-preview': 'large',
    'max-snippet': -1,
  },
};

export const ROBOTS_NOINDEX: Metadata['robots'] = { index: false, follow: true };

/** Full <title> string for a page. */
export function fullTitle(input: Pick<PageMetaInput, 'title' | 'absoluteTitle'>): string {
  if (input.absoluteTitle) return input.absoluteTitle;
  if (!input.title) return SITE_NAME;
  return `${input.title} | ${SITE_NAME}`;
}

/** Build complete per-page metadata: title, description, canonical, robots, OG and Twitter. */
export function buildMetadata(input: PageMetaInput): Metadata {
  const title = fullTitle(input);
  const url = absoluteUrl(input.path);
  const image = {
    url: absoluteUrl(ogImagePath(input.path)),
    width: 1200,
    height: 630,
    alt: input.ogAlt ?? title,
    type: 'image/png',
  };
  return {
    title: { absolute: title },
    description: input.description,
    alternates: { canonical: url },
    robots: input.noindex ? ROBOTS_NOINDEX : ROBOTS_INDEX,
    openGraph: {
      type: 'website',
      url,
      title,
      description: input.description,
      siteName: SITE_NAME,
      locale: OG_LOCALE,
      images: [image],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description: input.description,
      images: [image],
    },
  };
}

import { SEO_LIMITS, TITLE_SEPARATOR } from './seo';

/**
 * Site-wide settings: the ONE place to change the brand, domain and contact details.
 *
 * Renaming the site / moving to a new domain:
 *   1. Change SITE_NAME and DOMAIN below (and CONTACT_EMAIL if it changes).
 *   2. Run `npm run build && npm run check:seo`. Titles, descriptions, canonical URLs,
 *      sitemap, robots.txt, OG images, favicons, the web manifest and JSON-LD all regenerate.
 *   3. In Cloudflare Pages, leave NEXT_PUBLIC_SITE_URL empty (it then follows DOMAIN) or set it
 *      to the new https://domain.
 * Nothing else in the codebase contains the brand name or domain.
 */

/** Brand name used in titles, headings, OG images, the manifest and JSON-LD. */
export const SITE_NAME = 'DevTool';

/** Apex domain without protocol or www. */
export const DOMAIN = 'devtool.com';

/** Public contact address shown on Contact, About and Privacy Policy pages. */
export const CONTACT_EMAIL = 'abhaynaravday123@gmail.com';

/** Person or brand that runs the site, shown on the About page. */
export const OWNER_NAME = 'Abhay Narvade';

/** Short tagline used on the homepage and in the manifest. */
export const SITE_TAGLINE = 'Free online tools that run in your browser';

/** Default description for pages that do not define their own. */
export const SITE_DESCRIPTION =
  'Free developer, image, PDF, CSS and text tools that run entirely in your browser. No sign-up, no uploads, fast and private.';

/** Accent colour (keep in sync with --color-accent-* in globals.css). */
export const BRAND_COLOR = '#4f46e5';
export const THEME_COLOR_LIGHT = '#ffffff';
export const THEME_COLOR_DARK = '#0b1120';

/** Language and locale. */
export const LANG = 'en';
export const OG_LOCALE = 'en_US';

function normaliseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

/**
 * Absolute production origin, e.g. https://devtool.com (no trailing slash).
 * NEXT_PUBLIC_SITE_URL overrides it (useful for preview deployments).
 */
export const SITE_URL = normaliseUrl(process.env.NEXT_PUBLIC_SITE_URL || `https://${DOMAIN}`);

/** Third-party IDs, read from environment variables. Empty string = feature disabled. */
export const ADSENSE_CLIENT = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? '').trim();
export const GA_ID = (process.env.NEXT_PUBLIC_GA_ID ?? '').trim();
export const FORMSPREE_ID = (process.env.NEXT_PUBLIC_FORMSPREE_ID ?? '').trim();

/**
 * Page title with the brand suffix, e.g. "JSON Formatter | DevTool". The suffix is added only
 * while the full title fits the 60-character limit, so a longer SITE_NAME never produces
 * over-long titles (check:seo warns when the suffix had to be dropped).
 */
export function brandTitle(base: string): string {
  const full = `${base}${TITLE_SEPARATOR}${SITE_NAME}`;
  return full.length <= SEO_LIMITS.title.max ? full : base;
}

/** Build an absolute URL for a site path ("/" or "/developer-tools"). */
export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return SITE_URL;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean.replace(/\/+$/, '')}`;
}

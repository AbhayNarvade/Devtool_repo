/**
 * Site-wide settings: the ONE place to change the brand, domain and contact details.
 *
 * SITE_NAME and DOMAIN are temporary until the final domain is purchased.
 * Change them here and every page, title, OG image, manifest and structured-data block follows.
 */

/** Brand name used in titles, headings, OG images, the manifest and JSON-LD. */
export const SITE_NAME = 'DevTool';

/** Apex domain without protocol or www. */
export const DOMAIN = 'devtool.com';

/** Public contact address shown on Contact, About and Privacy Policy pages. */
export const CONTACT_EMAIL = '';

/** Person or brand that runs the site, shown on the About page. */
export const OWNER_NAME = '';

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

/** Build an absolute URL for a site path ("/" or "/developer-tools"). */
export function absoluteUrl(path: string): string {
  if (path === '/' || path === '') return SITE_URL;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${clean.replace(/\/+$/, '')}`;
}

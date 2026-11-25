import type { CategorySlug } from '@/data/types';

export const toolPath = (category: CategorySlug, slug: string) => `/${category}/${slug}`;
export const categoryPath = (category: CategorySlug) => `/${category}`;

/**
 * OG image key for a path: "/" -> "home", "/developer-tools/json-formatter" ->
 * "developer-tools--json-formatter". Images live at /og/<key>.png.
 */
export function ogKey(path: string): string {
  if (path === '/' || path === '') return 'home';
  return path.replace(/^\/+|\/+$/g, '').replace(/\//g, '--');
}

export const ogImagePath = (path: string) => `/og/${ogKey(path)}.png`;

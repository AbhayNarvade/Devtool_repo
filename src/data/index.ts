import { categories } from './categories';
import { staticPages } from './pages';
import { tools } from './tools';
import type { Category, CategorySlug, Tool } from './types';
import { latestDate } from '@/lib/date';
import { categoryPath, toolPath } from '@/lib/routes';

export { categories, staticPages, tools };

export function getCategory(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}

export function toolsInCategory(slug: CategorySlug): Tool[] {
  return tools.filter((t) => t.category === slug);
}

/** Categories that have at least one tool (only these get pages and nav links). */
export function activeCategories(): Category[] {
  return categories.filter((c) => toolsInCategory(c.slug).length > 0);
}

export function getTool(category: string, slug: string): Tool | undefined {
  return tools.find((t) => t.category === category && t.slug === slug);
}

export function getToolBySlug(slug: string): Tool | undefined {
  return tools.find((t) => t.slug === slug);
}

export function popularTools(): Tool[] {
  return tools.filter((t) => t.popular);
}

export function relatedTools(tool: Tool): Tool[] {
  return tool.relatedSlugs.map((slug) => getToolBySlug(slug)).filter((t): t is Tool => Boolean(t));
}

export function urlOf(tool: Tool): string {
  return toolPath(tool.category, tool.slug);
}

/** Slim card data (safe to pass to client components). */
export interface ToolCardData {
  slug: string;
  name: string;
  path: string;
  description: string;
  icon: Tool['icon'];
}

export function toCard(tool: Tool): ToolCardData {
  return {
    slug: tool.slug,
    name: tool.name,
    path: urlOf(tool),
    description: tool.cardDescription,
    icon: tool.icon,
  };
}

/** Slim records for client-side search (keeps long-form content out of the JS bundle). */
export interface SearchItem {
  name: string;
  path: string;
  description: string;
  category: string;
  keywords: string;
}

export function searchIndex(): SearchItem[] {
  return tools.map((t) => ({
    name: t.name,
    path: urlOf(t),
    description: t.cardDescription,
    category: getCategory(t.category)?.name ?? '',
    keywords: [t.primaryKeyword, ...t.secondaryKeywords].join(' ').toLowerCase(),
  }));
}

export interface IndexablePage {
  path: string;
  lastModified: string;
}

/** Every indexable URL on the site (used by the sitemap and the SEO checker). */
export function indexablePages(): IndexablePage[] {
  const pages: IndexablePage[] = [
    {
      path: '/',
      lastModified: latestDate([
        ...tools.map((t) => t.lastUpdated),
        ...categories.map((c) => c.lastUpdated),
        ...staticPages.map((p) => p.lastUpdated),
      ]),
    },
  ];
  for (const c of activeCategories()) {
    const inCat = toolsInCategory(c.slug);
    pages.push({
      path: categoryPath(c.slug),
      lastModified: latestDate([c.lastUpdated, ...inCat.map((t) => t.lastUpdated)]),
    });
  }
  for (const t of tools) pages.push({ path: urlOf(t), lastModified: t.lastUpdated });
  for (const p of staticPages) pages.push({ path: p.path, lastModified: p.lastUpdated });
  return pages;
}

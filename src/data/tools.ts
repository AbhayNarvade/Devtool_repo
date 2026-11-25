import type { Tool } from './types';

/**
 * The tool registry: the single source of truth for every tool page, the homepage,
 * category pages, search, related links, the sitemap and structured data.
 *
 * Each entry lives in src/data/tool-content/<slug>.ts. To add a tool, create its entry
 * there, import it below, and add its UI to src/tools/registry.ts (see README).
 */
export const tools: Tool[] = [];

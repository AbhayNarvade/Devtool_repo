/** Category slugs double as the first URL segment: /developer-tools, /image-tools, ... */
export type CategorySlug =
  'developer-tools' | 'image-tools' | 'pdf-tools' | 'css-tools' | 'text-tools';

export type SchemaCategory =
  'DeveloperApplication' | 'MultimediaApplication' | 'UtilitiesApplication' | 'DesignApplication';

/** Icon names map to inline SVGs in src/components/Icon.tsx. */
export type IconName =
  | 'braces'
  | 'convert'
  | 'table'
  | 'code'
  | 'binary'
  | 'link'
  | 'key'
  | 'clock'
  | 'fingerprint'
  | 'hash'
  | 'regex'
  | 'calendar'
  | 'database'
  | 'lock'
  | 'network'
  | 'image'
  | 'resize'
  | 'crop'
  | 'compress'
  | 'file'
  | 'merge'
  | 'split'
  | 'pages'
  | 'gradient'
  | 'shadow'
  | 'palette'
  | 'droplet'
  | 'qr'
  | 'text'
  | 'password'
  | 'tools';

export interface Faq {
  /** Plain text only: it is rendered verbatim and copied verbatim into FAQPage JSON-LD. */
  question: string;
  /** Plain text only (same reason). */
  answer: string;
}

/**
 * A block of long-form content. `body` uses a small Markdown subset rendered on the server
 * (see src/lib/markdown.tsx): paragraphs, "### " sub-headings, "- " and "1. " lists,
 * fenced code blocks, pipe tables, `inline code`, **bold**, *italic* and [links](/path).
 */
export interface ContentSection {
  heading: string;
  body: string;
  /**
   * Where the section is rendered on a tool page:
   * - "concept" and "examples" (default) come before the features list,
   * - "tips" (common errors / tips) comes after the features list, before the FAQ.
   */
  kind?: 'concept' | 'examples' | 'tips';
}

export interface Tool {
  slug: string;
  category: CategorySlug;
  /** Short display name used in cards, nav and breadcrumbs. */
  name: string;
  /** One H1 per page; contains the primary keyword. */
  h1: string;
  /** Full <title>: build it with brandTitle("Primary keyword first…") so the " | SITE_NAME" suffix is added when it fits in 60 chars. */
  metaTitle: string;
  /** 140–160 chars, unique. */
  metaDescription: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  /** 1–2 sentence summary shown under the H1. */
  intro: string;
  /** Short card text (one sentence) for tool cards, search and related links. */
  cardDescription: string;
  icon: IconName;
  howToSteps: string[];
  features: string[];
  contentSections: ContentSection[];
  faqs: Faq[];
  /** 4–6 slugs of existing tools. */
  relatedSlugs: string[];
  schemaCategory: SchemaCategory;
  /** ISO date (YYYY-MM-DD). */
  lastUpdated: string;
  /** Shown on the homepage "Popular tools" section and on the 404 page. */
  popular?: boolean;
  /** True when the tool reads user files (shows the "files never leave your device" note). */
  handlesFiles?: boolean;
  /** Short browser requirement string for WebApplication JSON-LD. */
  browserRequirements?: string;
}

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short name for navigation. */
  navName: string;
  h1: string;
  metaTitle: string;
  metaDescription: string;
  intro: string;
  icon: IconName;
  /** Explanatory long-form content below the tool grid. */
  contentSections: ContentSection[];
  faqs: Faq[];
  lastUpdated: string;
}

/** Static informational pages (About, Contact, Privacy, Terms). */
export interface StaticPage {
  path: string;
  name: string;
  metaTitle: string;
  metaDescription: string;
  lastUpdated: string;
}

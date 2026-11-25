/** SEO limits shared by the content helpers and scripts/check-seo.ts. */
export const SEO_LIMITS = {
  /** Hard limits: check:seo fails outside these. */
  title: { min: 30, max: 60 },
  description: { min: 120, max: 160 },
  /** Targets: check:seo warns outside these. */
  titleTarget: { min: 50, max: 60 },
  descriptionTarget: { min: 140, max: 160 },
  /** Minimum words of real content per page type. */
  words: { tool: 700, category: 300, home: 400 },
  faqs: { min: 5, max: 8 },
  related: { min: 4, max: 6 },
  howToSteps: { min: 3, max: 6 },
  /** Maximum clicks from the homepage to any page. */
  maxClickDepth: 3,
} as const;

/** Separator between a page title and the site name. */
export const TITLE_SEPARATOR = ' | ';

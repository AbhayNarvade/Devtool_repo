/**
 * npm run check:seo — fails (exit 1) when any SEO rule is broken.
 * Run AFTER `npm run build` (it inspects the static export in /out).
 *
 * Registry checks: unique titles/descriptions/H1s, length ranges, FAQ and related-tool counts,
 * related slugs exist, OG image per page.
 * HTML checks (every page in /out): <title>, meta description, canonical, exactly one <h1>,
 * valid JSON-LD (with the required types per page kind, no banned types), FAQPage text equal to
 * the visible FAQ, internal links resolve, images have alt/width/height, heading levels are not
 * skipped, word counts, Open Graph/Twitter tags, sitemap coverage and click depth <= 3.
 */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import { parse, type HTMLElement } from 'node-html-parser';
import { SEO_LIMITS, TITLE_SEPARATOR } from '../src/config/seo';
import { SITE_NAME, SITE_URL, absoluteUrl } from '../src/config/site';
import {
  categories,
  getToolBySlug,
  indexablePages,
  staticPages,
  tools,
  activeCategories,
} from '../src/data';
import { home } from '../src/data/home';
import { categoryPath, ogKey, toolPath } from '../src/lib/routes';

const ROOT = path.resolve(import.meta.dirname, '..');
const OUT = path.join(ROOT, 'out');

const L = SEO_LIMITS;
const range = (r: { min: number; max: number }): [number, number] => [r.min, r.max];
const TITLE = range(L.title);
const DESC = range(L.description);
const TITLE_T = range(L.titleTarget);
const DESC_T = range(L.descriptionTarget);
const BRAND_SUFFIX = `${TITLE_SEPARATOR}${SITE_NAME}`;

/** Titles are built with brandTitle(); warn when a long SITE_NAME forced the suffix to be dropped. */
function checkBrand(owner: string, title: string) {
  if (!title.endsWith(BRAND_SUFFIX))
    warn(
      `${owner}: title has no "${BRAND_SUFFIX}" suffix (it did not fit in ${L.title.max} chars): "${title}"`,
    );
}

const errors: string[] = [];
const warnings: string[] = [];
const err = (msg: string) => errors.push(msg);
const warn = (msg: string) => warnings.push(msg);

// ---------------------------------------------------------------------------
// 1. Registry checks
// ---------------------------------------------------------------------------

function checkDuplicates(label: string, entries: { owner: string; value: string }[]) {
  const seen = new Map<string, string>();
  for (const { owner, value } of entries) {
    const key = value.trim().toLowerCase();
    const prev = seen.get(key);
    if (prev) err(`Duplicate ${label}: "${value}" (${prev} and ${owner})`);
    else seen.set(key, owner);
  }
}

function checkLength(
  owner: string,
  label: string,
  value: string,
  hard: [number, number],
  soft: [number, number],
) {
  const n = value.length;
  if (n < hard[0] || n > hard[1])
    err(`${owner}: ${label} is ${n} chars (allowed ${hard[0]}–${hard[1]}): "${value}"`);
  else if (n < soft[0] || n > soft[1])
    warn(`${owner}: ${label} is ${n} chars (target ${soft[0]}–${soft[1]})`);
}

function registryChecks() {
  const titleEntries = [
    { owner: 'home', value: home.metaTitle },
    ...tools.map((t) => ({ owner: `tool:${t.slug}`, value: t.metaTitle })),
    ...categories.map((c) => ({ owner: `category:${c.slug}`, value: c.metaTitle })),
    ...staticPages.map((p) => ({ owner: `page:${p.path}`, value: p.metaTitle })),
  ];
  const descEntries = [
    { owner: 'home', value: home.metaDescription },
    ...tools.map((t) => ({ owner: `tool:${t.slug}`, value: t.metaDescription })),
    ...categories.map((c) => ({ owner: `category:${c.slug}`, value: c.metaDescription })),
    ...staticPages.map((p) => ({ owner: `page:${p.path}`, value: p.metaDescription })),
  ];
  const h1Entries = [
    { owner: 'home', value: home.h1 },
    ...tools.map((t) => ({ owner: `tool:${t.slug}`, value: t.h1 })),
    ...categories.map((c) => ({ owner: `category:${c.slug}`, value: c.h1 })),
  ];
  checkDuplicates('metaTitle', titleEntries);
  checkDuplicates('metaDescription', descEntries);
  checkDuplicates('h1', h1Entries);

  const slugs = new Set<string>();
  for (const t of tools) {
    const owner = `tool:${t.slug}`;
    if (slugs.has(t.slug)) err(`${owner}: duplicate slug`);
    slugs.add(t.slug);
    if (!/^[a-z0-9]+(-[a-z0-9]+)*$/.test(t.slug))
      err(`${owner}: slug must be lowercase and hyphenated`);
    checkLength(owner, 'metaTitle', t.metaTitle, TITLE, TITLE_T);
    checkLength(owner, 'metaDescription', t.metaDescription, DESC, DESC_T);
    checkBrand(owner, t.metaTitle);
    if (t.faqs.length < L.faqs.min) err(`${owner}: only ${t.faqs.length} FAQs (min ${L.faqs.min})`);
    if (t.faqs.length > L.faqs.max)
      warn(`${owner}: ${t.faqs.length} FAQs (target ${L.faqs.min}–${L.faqs.max})`);
    if (t.relatedSlugs.length < L.related.min)
      err(`${owner}: only ${t.relatedSlugs.length} related tools (min ${L.related.min})`);
    if (t.relatedSlugs.length > L.related.max)
      warn(
        `${owner}: ${t.relatedSlugs.length} related tools (target ${L.related.min}–${L.related.max})`,
      );
    for (const r of t.relatedSlugs) {
      if (r === t.slug) err(`${owner}: relates to itself`);
      else if (!getToolBySlug(r)) err(`${owner}: related slug "${r}" does not exist`);
    }
    if (t.howToSteps.length < L.howToSteps.min || t.howToSteps.length > L.howToSteps.max)
      err(`${owner}: howToSteps must have ${L.howToSteps.min}–${L.howToSteps.max} steps`);
    if (t.features.length < 3) err(`${owner}: needs at least 3 features`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(t.lastUpdated)) err(`${owner}: lastUpdated must be YYYY-MM-DD`);
    const kw = t.primaryKeyword.toLowerCase();
    if (!t.h1.toLowerCase().includes(kw))
      err(`${owner}: H1 does not contain primary keyword "${t.primaryKeyword}"`);
    if (!t.metaDescription.toLowerCase().includes(kw))
      err(`${owner}: metaDescription does not contain "${t.primaryKeyword}"`);
    if (!t.contentSections.some((s) => s.heading.toLowerCase().includes(kw)))
      err(`${owner}: no H2 contains the primary keyword "${t.primaryKeyword}"`);
    if (!t.intro.toLowerCase().includes(kw))
      err(
        `${owner}: intro (first paragraph) does not contain the primary keyword "${t.primaryKeyword}"`,
      );
  }
  // Internal linking: every tool should be recommended by at least two other tools.
  const inbound = new Map(tools.map((t) => [t.slug, 0]));
  for (const t of tools) for (const r of t.relatedSlugs) inbound.set(r, (inbound.get(r) ?? 0) + 1);
  for (const [slug, n] of inbound)
    if (n < 2)
      err(`tool:${slug}: only ${n} other tool(s) link to it under "Related tools" (min 2)`);

  for (const c of categories) {
    checkLength(`category:${c.slug}`, 'metaTitle', c.metaTitle, TITLE, TITLE_T);
    checkLength(`category:${c.slug}`, 'metaDescription', c.metaDescription, DESC, DESC_T);
    checkBrand(`category:${c.slug}`, c.metaTitle);
  }
  for (const p of staticPages) {
    checkLength(`page:${p.path}`, 'metaTitle', p.metaTitle, TITLE, TITLE);
    checkLength(`page:${p.path}`, 'metaDescription', p.metaDescription, DESC, DESC_T);
    checkBrand(`page:${p.path}`, p.metaTitle);
  }
  checkLength('home', 'metaTitle', home.metaTitle, TITLE, TITLE_T);
  checkLength('home', 'metaDescription', home.metaDescription, DESC, DESC_T);
  checkBrand('home', home.metaTitle);

  // One OG image per indexable page (source and exported copy).
  for (const page of indexablePages()) {
    const file = `og/${ogKey(page.path)}.png`;
    if (!existsSync(path.join(ROOT, 'public', file)))
      err(`Missing OG image public/${file} for ${page.path}`);
    if (!existsSync(path.join(OUT, file))) err(`Missing OG image out/${file} for ${page.path}`);
  }
}

// ---------------------------------------------------------------------------
// 2. HTML checks on /out
// ---------------------------------------------------------------------------

function walk(dir: string): string[] {
  const files: string[] = [];
  for (const name of readdirSync(dir)) {
    const full = path.join(dir, name);
    if (statSync(full).isDirectory()) {
      if (name === '_next') continue;
      files.push(...walk(full));
    } else if (name.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function fileToPath(file: string): string {
  const rel = path.relative(OUT, file).replace(/\\/g, '/');
  if (rel === 'index.html') return '/';
  return `/${rel.replace(/\/index\.html$/, '').replace(/\.html$/, '')}`;
}

/** Does a site-relative URL resolve to a file in /out (as Cloudflare Pages would serve it)? */
function resolves(urlPath: string): boolean {
  const clean = decodeURIComponent(urlPath.split('#')[0]!.split('?')[0]!);
  if (clean === '/' || clean === '') return existsSync(path.join(OUT, 'index.html'));
  const rel = clean.replace(/^\//, '');
  const candidates = [rel, `${rel}.html`, path.join(rel, 'index.html')];
  return candidates.some(
    (c) => existsSync(path.join(OUT, c)) && statSync(path.join(OUT, c)).isFile(),
  );
}

function countWords(text: string): number {
  return text.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
}

function visibleText(el: HTMLElement): string {
  const clone = parse(el.toString());
  for (const node of clone.querySelectorAll(
    'script, style, noscript, template, [data-no-wordcount]',
  ))
    node.remove();
  return clone.textContent.replace(/\s+/g, ' ');
}

const BANNED_TYPES = ['HowTo', 'AggregateRating', 'Review', 'SearchAction'];

function collectTypes(node: unknown, out: Set<string>) {
  if (Array.isArray(node)) node.forEach((n) => collectTypes(n, out));
  else if (node && typeof node === 'object') {
    for (const [k, v] of Object.entries(node)) {
      if (k === '@type') (Array.isArray(v) ? v : [v]).forEach((t) => out.add(String(t)));
      else collectTypes(v, out);
    }
  }
}

function findFaqPage(
  node: unknown,
): { mainEntity: { name: string; acceptedAnswer: { text: string } }[] } | undefined {
  if (Array.isArray(node)) {
    for (const n of node) {
      const f = findFaqPage(n);
      if (f) return f;
    }
  } else if (node && typeof node === 'object') {
    const obj = node as Record<string, unknown>;
    if (obj['@type'] === 'FAQPage') return obj as never;
    for (const v of Object.values(obj)) {
      const f = findFaqPage(v);
      if (f) return f;
    }
  }
  return undefined;
}

type PageKind = 'home' | 'category' | 'tool' | 'static' | '404';

function pageKind(p: string): PageKind {
  if (p === '/404' || p === '/_not-found') return '404';
  if (p === '/') return 'home';
  if (tools.some((t) => toolPath(t.category, t.slug) === p)) return 'tool';
  if (categories.some((c) => categoryPath(c.slug) === p)) return 'category';
  return 'static';
}

function htmlChecks() {
  if (!existsSync(OUT)) {
    err('out/ does not exist. Run `npm run build` first.');
    return;
  }
  for (const f of [
    'robots.txt',
    'sitemap.xml',
    'ads.txt',
    '_headers',
    '404.html',
    'favicon.ico',
    'site.webmanifest',
    'apple-touch-icon.png',
    'icon-192.png',
    'icon-512.png',
    'icon.svg',
  ]) {
    if (!existsSync(path.join(OUT, f))) err(`out/${f} is missing`);
  }

  const files = walk(OUT);
  const pages = new Map<string, HTMLElement>();
  const links = new Map<string, Set<string>>();

  for (const file of files) {
    const p = fileToPath(file);
    const kind = pageKind(p);
    const doc = parse(readFileSync(file, 'utf8'), { comment: false });
    pages.set(p, doc);
    const where = `${p} (${path.relative(ROOT, file)})`;

    // <html lang>, viewport, theme-color
    if (doc.querySelector('html')?.getAttribute('lang') !== 'en')
      err(`${where}: <html lang="en"> missing`);
    if (!doc.querySelector('meta[name="viewport"]')) err(`${where}: viewport meta missing`);
    if (doc.querySelectorAll('meta[name="theme-color"]').length < 2)
      err(`${where}: light/dark theme-color meta missing`);

    // Title & description
    const title = doc.querySelector('title')?.textContent.trim() ?? '';
    if (!title) err(`${where}: <title> missing`);
    else if (kind !== '404' && (title.length < L.title.min || title.length > L.title.max))
      err(`${where}: <title> is ${title.length} chars (${L.title.min}–${L.title.max}): "${title}"`);
    const desc =
      doc.querySelector('meta[name="description"]')?.getAttribute('content')?.trim() ?? '';
    if (!desc) err(`${where}: meta description missing`);
    else if (kind !== '404' && (desc.length < L.description.min || desc.length > L.description.max))
      err(
        `${where}: meta description is ${desc.length} chars (${L.description.min}–${L.description.max})`,
      );

    // Robots / canonical
    const robots = doc.querySelector('meta[name="robots"]')?.getAttribute('content') ?? '';
    const noindex = robots.includes('noindex');
    if (kind === '404') {
      if (!noindex) err(`${where}: 404 page must be noindex`);
    } else {
      if (noindex) err(`${where}: public page is noindex`);
      if (!robots.includes('max-image-preview:large') || !robots.includes('max-snippet:-1'))
        err(`${where}: robots meta must include max-image-preview:large and max-snippet:-1`);
      const canonical = doc.querySelector('link[rel="canonical"]')?.getAttribute('href') ?? '';
      if (!canonical) err(`${where}: canonical missing`);
      else if (canonical !== absoluteUrl(p))
        err(`${where}: canonical "${canonical}" should be "${absoluteUrl(p)}"`);

      // Open Graph / Twitter
      for (const prop of [
        'og:type',
        'og:url',
        'og:title',
        'og:description',
        'og:site_name',
        'og:locale',
        'og:image',
        'og:image:width',
        'og:image:height',
      ]) {
        if (!doc.querySelector(`meta[property="${prop}"]`)) err(`${where}: ${prop} missing`);
      }
      if (
        doc.querySelector('meta[name="twitter:card"]')?.getAttribute('content') !==
        'summary_large_image'
      )
        err(`${where}: twitter:card summary_large_image missing`);
      const ogImage = doc.querySelector('meta[property="og:image"]')?.getAttribute('content') ?? '';
      if (ogImage.startsWith(SITE_URL)) {
        if (!resolves(ogImage.slice(SITE_URL.length)))
          err(`${where}: og:image ${ogImage} does not exist in out/`);
      } else if (ogImage) err(`${where}: og:image must be an absolute URL on ${SITE_URL}`);
    }

    // Exactly one H1, no skipped heading levels inside <body>
    const h1s = doc.querySelectorAll('h1');
    if (h1s.length !== 1) err(`${where}: has ${h1s.length} <h1> elements (exactly 1 required)`);
    let prev = 0;
    for (const h of doc.querySelectorAll('h1, h2, h3, h4, h5, h6')) {
      const level = Number(h.tagName.slice(1));
      if (prev && level > prev + 1)
        err(
          `${where}: heading level skipped (h${prev} -> h${level}: "${h.textContent.trim().slice(0, 50)}")`,
        );
      prev = level;
    }

    // JSON-LD
    const types = new Set<string>();
    let faqLd: ReturnType<typeof findFaqPage>;
    const ldScripts = doc.querySelectorAll('script[type="application/ld+json"]');
    if (ldScripts.length === 0) err(`${where}: no JSON-LD`);
    for (const s of ldScripts) {
      try {
        const data = JSON.parse(s.textContent) as Record<string, unknown>;
        if (data['@context'] !== 'https://schema.org')
          err(`${where}: JSON-LD missing @context https://schema.org`);
        collectTypes(data, types);
        faqLd = faqLd ?? findFaqPage(data);
      } catch (e) {
        err(`${where}: invalid JSON-LD (${(e as Error).message})`);
      }
    }
    for (const banned of BANNED_TYPES)
      if (types.has(banned)) err(`${where}: JSON-LD must not use ${banned}`);
    const required: string[] = ['Organization', 'WebSite'];
    if (kind === 'tool') required.push('WebApplication', 'BreadcrumbList', 'FAQPage', 'Offer');
    if (kind === 'category') required.push('CollectionPage', 'BreadcrumbList', 'ItemList');
    if (kind === 'static') required.push('BreadcrumbList');
    for (const t of required) if (!types.has(t)) err(`${where}: JSON-LD ${t} missing`);

    // FAQPage must match the visible FAQ exactly
    if (faqLd) {
      const visible = doc.querySelectorAll('[data-faq-item]').map((item) => ({
        q: item.querySelector('[data-faq-question]')?.textContent ?? '',
        a: item.querySelector('[data-faq-answer]')?.textContent ?? '',
      }));
      const ld = faqLd.mainEntity.map((m) => ({ q: m.name, a: m.acceptedAnswer.text }));
      if (JSON.stringify(visible) !== JSON.stringify(ld))
        err(`${where}: FAQPage JSON-LD does not match the visible FAQ text`);
    }

    // Images: alt, width, height
    for (const img of doc.querySelectorAll('img')) {
      const src = img.getAttribute('src') ?? '';
      if (!img.getAttribute('alt')?.trim())
        err(`${where}: <img src="${src.slice(0, 60)}"> has no alt text`);
      if (!img.getAttribute('width') || !img.getAttribute('height'))
        err(`${where}: <img src="${src.slice(0, 60)}"> missing width/height`);
    }

    // Internal links
    const outgoing = new Set<string>();
    for (const a of doc.querySelectorAll('a[href]')) {
      let href = a.getAttribute('href') ?? '';
      if (href.startsWith(SITE_URL)) href = href.slice(SITE_URL.length) || '/';
      if (!href.startsWith('/') || href.startsWith('//')) continue;
      if (href !== '/' && href.split('#')[0]!.split('?')[0]!.endsWith('/'))
        err(`${where}: internal link with trailing slash: ${href}`);
      if (!resolves(href)) err(`${where}: broken internal link ${href}`);
      outgoing.add(href.split('#')[0]!.split('?')[0]! || '/');
    }
    links.set(p, outgoing);

    // Word counts (main content only; tool UI, cards, ads and breadcrumbs are excluded)
    const main = doc.querySelector('main');
    if (!main) err(`${where}: <main> missing`);
    else {
      const words = countWords(visibleText(main));
      const min = kind === 'tool' || kind === 'category' || kind === 'home' ? L.words[kind] : 0;
      if (words < min) err(`${where}: ${words} words of content (min ${min})`);
    }
  }

  // Sitemap covers every indexable page and only existing pages
  const sitemapFile = path.join(OUT, 'sitemap.xml');
  if (existsSync(sitemapFile)) {
    const xml = readFileSync(sitemapFile, 'utf8');
    const locs = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]!);
    const sitemapPaths = new Set(
      locs.map((l) => (l === SITE_URL ? '/' : l.slice(SITE_URL.length))),
    );
    for (const l of locs)
      if (!l.startsWith(SITE_URL)) err(`sitemap.xml: ${l} is not on ${SITE_URL}`);
    for (const sp of sitemapPaths)
      if (!pages.has(sp)) err(`sitemap.xml lists ${sp}, which has no page in out/`);
    for (const p of pages.keys()) {
      if (pageKind(p) === '404') continue;
      if (!sitemapPaths.has(p)) err(`${p} exists but is not in sitemap.xml`);
    }
  }

  // Click depth from the homepage (<= 3) and no orphans
  const depth = new Map<string, number>([['/', 0]]);
  const queue = ['/'];
  while (queue.length) {
    const cur = queue.shift()!;
    for (const next of links.get(cur) ?? []) {
      if (!depth.has(next) && pages.has(next)) {
        depth.set(next, (depth.get(cur) ?? 0) + 1);
        queue.push(next);
      }
    }
  }
  for (const p of pages.keys()) {
    if (pageKind(p) === '404') continue;
    const d = depth.get(p);
    if (d === undefined) err(`${p} is not reachable from the homepage (orphan page)`);
    else if (d > L.maxClickDepth)
      err(`${p} is ${d} clicks from the homepage (max ${L.maxClickDepth})`);
  }

  // Every active category and tool must have a page
  for (const c of activeCategories())
    if (!pages.has(categoryPath(c.slug)))
      err(`category page ${categoryPath(c.slug)} missing in out/`);
  for (const t of tools)
    if (!pages.has(toolPath(t.category, t.slug)))
      err(`tool page ${toolPath(t.category, t.slug)} missing in out/`);

  console.log(`check:seo: inspected ${pages.size} HTML pages in out/`);
}

registryChecks();
htmlChecks();

for (const w of warnings) console.warn(`  warn  ${w}`);
for (const e of errors) console.error(`  ERROR ${e}`);
if (errors.length) {
  console.error(
    `\ncheck:seo FAILED with ${errors.length} error(s), ${warnings.length} warning(s).`,
  );
  process.exit(1);
}
console.log(`check:seo passed (${warnings.length} warning(s)).`);

/**
 * Pre-build asset generation (runs automatically before `next build` and `next dev`):
 *  - one 1200×630 Open Graph PNG per indexable page -> public/og/<key>.png
 *  - favicon.ico (16/32/48), icon.svg, apple-touch-icon.png (180), icon-192.png, icon-512.png
 *  - site.webmanifest
 *
 * Uses satori (layout -> SVG) and @resvg/resvg-js (SVG -> PNG). No network access needed.
 */
import { Resvg } from '@resvg/resvg-js';
import { mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import satori from 'satori';
import { LOGO_PATHS, LOGO_VIEWBOX, logoSvg } from '../src/config/brand';
import {
  BRAND_COLOR,
  DOMAIN,
  SITE_DESCRIPTION,
  SITE_NAME,
  SITE_TAGLINE,
  THEME_COLOR_LIGHT,
} from '../src/config/site';
import {
  activeCategories,
  getCategory,
  staticPages,
  tools,
  toolsInCategory,
  urlOf,
} from '../src/data';
import { categoryPath, ogKey } from '../src/lib/routes';

const ROOT = path.resolve(import.meta.dirname, '..');
const PUBLIC = path.join(ROOT, 'public');
const OG_DIR = path.join(PUBLIC, 'og');
const require = createRequire(import.meta.url);

function font(weight: number): Buffer {
  return readFileSync(require.resolve(`@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
}

const FONTS = [
  { name: 'Inter', data: font(500), weight: 500 as const, style: 'normal' as const },
  { name: 'Inter', data: font(700), weight: 700 as const, style: 'normal' as const },
  { name: 'Inter', data: font(800), weight: 800 as const, style: 'normal' as const },
];

// Minimal element factory for satori (avoids needing React/JSX in a Node script).
type Child = SatoriNode | string;
interface SatoriNode {
  type: string;
  props: Record<string, unknown> & { children?: Child | Child[] };
}
function h(type: string, props: Record<string, unknown>, ...children: Child[]): SatoriNode {
  return { type, props: { ...props, children: children.length === 1 ? children[0] : children } };
}

const logoDataUri = `data:image/svg+xml;base64,${Buffer.from(logoSvg(96)).toString('base64')}`;

interface OgEntry {
  path: string;
  eyebrow: string;
  title: string;
  subtitle: string;
}

function ogEntries(): OgEntry[] {
  const entries: OgEntry[] = [
    { path: '/', eyebrow: 'Free online tools', title: SITE_TAGLINE, subtitle: SITE_DESCRIPTION },
  ];
  for (const c of activeCategories()) {
    const count = toolsInCategory(c.slug).length;
    entries.push({
      path: categoryPath(c.slug),
      eyebrow: `${count} free ${count === 1 ? 'tool' : 'tools'}`,
      title: c.name,
      subtitle: c.intro,
    });
  }
  for (const t of tools) {
    entries.push({
      path: urlOf(t),
      eyebrow: getCategory(t.category)?.name ?? '',
      title: t.name,
      subtitle: t.intro,
    });
  }
  for (const p of staticPages) {
    entries.push({ path: p.path, eyebrow: SITE_NAME, title: p.name, subtitle: p.metaDescription });
  }
  return entries;
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  return `${text.slice(0, max - 1).replace(/\s+\S*$/, '')}…`;
}

function ogLayout(entry: OgEntry): SatoriNode {
  const titleSize = entry.title.length > 34 ? 64 : 78;
  return h(
    'div',
    {
      style: {
        width: 1200,
        height: 630,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '60px 72px 56px',
        backgroundColor: '#0b1120',
        backgroundImage: `radial-gradient(circle at 100% 0%, ${BRAND_COLOR}66 0%, transparent 55%), radial-gradient(circle at 0% 100%, #0ea5e933 0%, transparent 50%)`,
        color: '#ffffff',
        fontFamily: 'Inter',
      },
    },
    h(
      'div',
      { style: { display: 'flex', alignItems: 'center', gap: '20px' } },
      h('img', { src: logoDataUri, width: 64, height: 64 }),
      h('div', { style: { fontSize: 36, fontWeight: 700, letterSpacing: '-0.01em' } }, SITE_NAME),
    ),
    h(
      'div',
      { style: { display: 'flex', flexDirection: 'column' } },
      h(
        'div',
        {
          style: {
            fontSize: 28,
            fontWeight: 700,
            color: '#a5b4fc',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
          },
        },
        entry.eyebrow,
      ),
      h(
        'div',
        {
          style: {
            marginTop: 16,
            fontSize: titleSize,
            fontWeight: 800,
            lineHeight: 1.08,
            letterSpacing: '-0.025em',
            maxWidth: 1050,
          },
        },
        truncate(entry.title, 60),
      ),
      h(
        'div',
        {
          style: {
            marginTop: 24,
            fontSize: 28,
            fontWeight: 500,
            color: '#cbd5e1',
            maxWidth: 1000,
            lineHeight: 1.4,
          },
        },
        truncate(entry.subtitle, 150),
      ),
    ),
    h(
      'div',
      {
        style: {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: 24,
          fontWeight: 500,
          color: '#94a3b8',
        },
      },
      h('div', {}, 'Free  ·  No sign-up  ·  Runs in your browser'),
      h('div', { style: { color: '#e2e8f0', fontWeight: 700 } }, DOMAIN),
    ),
  );
}

function svgToPng(svg: string, width: number): Buffer {
  return Buffer.from(new Resvg(svg, { fitTo: { mode: 'width', value: width } }).render().asPng());
}

/** Build an .ico file that embeds PNG images (supported by all current browsers). */
function buildIco(pngs: { size: number; data: Buffer }[]): Buffer {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(pngs.length, 4);
  const entries: Buffer[] = [];
  let offset = 6 + 16 * pngs.length;
  for (const { size, data } of pngs) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0);
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2);
    e.writeUInt8(0, 3);
    e.writeUInt16LE(1, 4);
    e.writeUInt16LE(32, 6);
    e.writeUInt32LE(data.length, 8);
    e.writeUInt32LE(offset, 12);
    entries.push(e);
    offset += data.length;
  }
  return Buffer.concat([header, ...entries, ...pngs.map((p) => p.data)]);
}

/** Full-bleed variant for apple-touch-icon (iOS adds its own rounded mask). */
function fullBleedLogoSvg(size: number): string {
  const c = LOGO_PATHS.cursor;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${LOGO_VIEWBOX}"><rect width="64" height="64" fill="${BRAND_COLOR}"/><path d="${LOGO_PATHS.left}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="${LOGO_PATHS.right}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" rx="${c.rx}" fill="#fff"/></svg>`;
}

async function main() {
  const started = Date.now();

  // Icons
  writeFileSync(path.join(PUBLIC, 'icon.svg'), logoSvg(64));
  writeFileSync(path.join(PUBLIC, 'icon-192.png'), svgToPng(logoSvg(192), 192));
  writeFileSync(path.join(PUBLIC, 'icon-512.png'), svgToPng(logoSvg(512), 512));
  writeFileSync(path.join(PUBLIC, 'apple-touch-icon.png'), svgToPng(fullBleedLogoSvg(180), 180));
  writeFileSync(
    path.join(PUBLIC, 'favicon.ico'),
    buildIco([16, 32, 48].map((size) => ({ size, data: svgToPng(logoSvg(size), size) }))),
  );

  // Web app manifest
  const manifest = {
    name: SITE_NAME,
    short_name: SITE_NAME,
    description: SITE_DESCRIPTION,
    start_url: '/',
    scope: '/',
    display: 'standalone',
    background_color: THEME_COLOR_LIGHT,
    theme_color: BRAND_COLOR,
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon.svg', sizes: 'any', type: 'image/svg+xml' },
    ],
  };
  writeFileSync(path.join(PUBLIC, 'site.webmanifest'), `${JSON.stringify(manifest, null, 2)}\n`);

  // Open Graph images (regenerated from scratch so removed pages leave no stale files)
  rmSync(OG_DIR, { recursive: true, force: true });
  mkdirSync(OG_DIR, { recursive: true });
  const entries = ogEntries();
  for (const entry of entries) {
    const svg = await satori(ogLayout(entry) as unknown as React.ReactNode, {
      width: 1200,
      height: 630,
      fonts: FONTS,
    });
    writeFileSync(path.join(OG_DIR, `${ogKey(entry.path)}.png`), svgToPng(svg, 1200));
  }

  console.log(
    `generate-assets: ${entries.length} OG images, icons and manifest written in ${Date.now() - started} ms`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});

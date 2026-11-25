import { BRAND_COLOR } from './site';

/**
 * Original logo mark: a rounded tile with an angle-bracket pair and a cursor block,
 * suggesting "tools that run in the browser". Used by the header, favicons and OG images.
 */
export const LOGO_VIEWBOX = '0 0 64 64';

export const LOGO_PATHS = {
  tile: 'M14 2h36a12 12 0 0 1 12 12v36a12 12 0 0 1-12 12H14A12 12 0 0 1 2 50V14A12 12 0 0 1 14 2z',
  left: 'M24 20 12 32l12 12',
  right: 'M40 20l12 12-12 12',
  cursor: { x: 28, y: 38, width: 8, height: 6, rx: 1.5 },
} as const;

/** Standalone SVG string (for favicon.svg and image generation). */
export function logoSvg(size = 64, color = BRAND_COLOR): string {
  const c = LOGO_PATHS.cursor;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="${LOGO_VIEWBOX}"><path d="${LOGO_PATHS.tile}" fill="${color}"/><path d="${LOGO_PATHS.left}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><path d="${LOGO_PATHS.right}" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/><rect x="${c.x}" y="${c.y}" width="${c.width}" height="${c.height}" rx="${c.rx}" fill="#fff"/></svg>`;
}

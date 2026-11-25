import { readFileSync } from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { BRAND_COLOR, SITE_NAME, THEME_COLOR_DARK, THEME_COLOR_LIGHT, brandTitle } from './site';
import { SEO_LIMITS } from './seo';

const css = readFileSync(path.join(import.meta.dirname, '..', 'app', 'globals.css'), 'utf8');

function cssVar(block: string, name: string): string | undefined {
  return new RegExp(`--${name}:\\s*(#[0-9a-fA-F]{6})`).exec(block)?.[1]?.toLowerCase();
}

describe('brand colours stay in sync between config and CSS', () => {
  const light = css.slice(css.indexOf(':root {'), css.indexOf("[data-theme='dark'] {"));
  const dark = css.slice(css.indexOf("[data-theme='dark'] {"), css.indexOf('@theme inline'));
  it('accent colour', () => expect(cssVar(light, 'accent')).toBe(BRAND_COLOR.toLowerCase()));
  it('light background = light theme-color', () =>
    expect(cssVar(light, 'bg')).toBe(THEME_COLOR_LIGHT.toLowerCase()));
  it('dark background = dark theme-color', () =>
    expect(cssVar(dark, 'bg')).toBe(THEME_COLOR_DARK.toLowerCase()));
});

describe('brandTitle', () => {
  it('appends the site name when it fits', () => {
    expect(brandTitle('JSON Formatter')).toBe(`JSON Formatter | ${SITE_NAME}`);
  });
  it('drops the suffix instead of exceeding the title limit', () => {
    const base = 'x'.repeat(SEO_LIMITS.title.max - 2);
    expect(brandTitle(base)).toBe(base);
  });
});

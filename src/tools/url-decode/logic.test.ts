import { describe, expect, it } from 'vitest';
import { urlEncode } from '../url-encode/logic';
import { findMalformedEscape, urlDecode } from './logic';

const enc = { mode: 'component' as const, spaceAsPlus: false, perLine: false };

describe('urlEncode', () => {
  it('encodes components, including reserved characters and UTF-8', () => {
    const r = urlEncode('a b&c=d/é?#', enc);
    expect(r.ok && r.output).toBe('a%20b%26c%3Dd%2F%C3%A9%3F%23');
  });
  it('keeps URL structure in full-URL mode', () => {
    const r = urlEncode('https://example.com/a path/?q=café&x=1#top', { ...enc, mode: 'full' });
    expect(r.ok && r.output).toBe('https://example.com/a%20path/?q=caf%C3%A9&x=1#top');
  });
  it('supports + for spaces and per-line encoding', () => {
    const r = urlEncode('a b\nc&d', { ...enc, spaceAsPlus: true, perLine: true });
    expect(r.ok && r.output).toBe('a+b\nc%26d');
  });
  it('reports lone surrogates', () => {
    expect(urlEncode('\uD800', enc).ok).toBe(false);
  });
});

describe('urlDecode', () => {
  const dec = { plusAsSpace: false, decodeAll: false };
  it('decodes percent-escapes and UTF-8', () => {
    const r = urlDecode('a%20b%26c%3Dd%2F%C3%A9', dec);
    expect(r.ok && r.output).toBe('a b&c=d/é');
  });
  it('treats + as space only when asked', () => {
    expect(urlDecode('a+b', dec).ok && (urlDecode('a+b', dec) as { output: string }).output).toBe(
      'a+b',
    );
    const r = urlDecode('a+b%2Bc', { ...dec, plusAsSpace: true });
    expect(r.ok && r.output).toBe('a b+c');
  });
  it('detects and decodes double encoding', () => {
    const once = urlDecode('caf%25C3%25A9', dec);
    expect(once.ok && once.output).toBe('caf%C3%A9');
    expect(once.ok && once.warnings?.length).toBe(1);
    const all = urlDecode('caf%25C3%25A9', { ...dec, decodeAll: true });
    expect(all.ok && all.output).toBe('café');
  });
  it('explains malformed escapes with a position', () => {
    const r = urlDecode('100% sure', dec);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.message).toMatch(/position 4/);
    expect(findMalformedEscape('ok %E0%A4 then')?.reason).toMatch(/UTF-8/);
    expect(findMalformedEscape('fine%20')).toBeNull();
  });
});

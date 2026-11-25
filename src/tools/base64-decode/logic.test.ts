import { describe, expect, it } from 'vitest';
import { bytesToBase64, encodeTextBase64, normalizeBase64 } from '@/lib/base64';
import { encodeBase64, fileToBase64Output, wrapLines } from '../base64-encode/logic';
import { decodeBase64, suggestFilename } from './logic';

describe('encodeBase64', () => {
  it('encodes ASCII and UTF-8 text (RFC 4648 vectors)', () => {
    const vectors: [string, string][] = [
      ['', ''],
      ['f', 'Zg=='],
      ['fo', 'Zm8='],
      ['foo', 'Zm9v'],
      ['foobar', 'Zm9vYmFy'],
    ];
    for (const [plain, b64] of vectors) {
      const r = encodeBase64(plain, { urlSafe: false, wrap: false });
      expect(r.ok && r.output).toBe(b64);
    }
    expect(encodeTextBase64('héllo 😀')).toBe('aMOpbGxvIPCfmIA=');
  });
  it('produces URL-safe output without padding', () => {
    const r = encodeBase64('??>>', { urlSafe: true, wrap: false });
    expect(r.ok && r.output).toBe('Pz8-Pg');
  });
  it('wraps at 76 characters', () => {
    expect(wrapLines('a'.repeat(80))).toBe(`${'a'.repeat(76)}\naaaa`);
  });
  it('builds data URLs for files', () => {
    expect(fileToBase64Output('AAE=', 'image/png', true, false)).toBe('data:image/png;base64,AAE=');
    expect(fileToBase64Output('+/8=', '', false, true)).toBe('-_8');
  });
  it('handles large inputs in chunks', () => {
    const big = new Uint8Array(100_000).fill(65);
    expect(bytesToBase64(big).length).toBe(Math.ceil(100_000 / 3) * 4);
  });
});

describe('decodeBase64', () => {
  it('decodes text, URL-safe input, missing padding and whitespace', () => {
    const r = decodeBase64('aMOpbGxv\nIPCfmIA');
    expect(r.ok && r.text).toBe('héllo 😀');
    const u = decodeBase64('Pz8-Pg');
    expect(u.ok && u.text).toBe('??>>');
    expect(u.ok && u.urlSafe).toBe(true);
  });
  it('reads data URLs and detects file types', () => {
    const png = 'data:image/png;base64,iVBORw0KGgo=';
    const r = decodeBase64(png);
    expect(r.ok && r.mime).toBe('image/png');
    expect(r.ok && r.file?.ext).toBe('png');
    if (r.ok) expect(suggestFilename(r)).toBe('decoded.png');
  });
  it('flags binary data that is not UTF-8', () => {
    const r = decodeBase64('/wD+');
    expect(r.ok && r.text).toBe(null);
    if (r.ok) expect(suggestFilename(r)).toBe('decoded.bin');
  });
  it('rejects invalid characters, misplaced padding and bad length', () => {
    const bad = decodeBase64('abc$');
    expect(!bad.ok && bad.message).toMatch(/"\$" at position 4/);
    expect(decodeBase64('ab=c').ok).toBe(false);
    expect(decodeBase64('abcde').ok).toBe(false);
  });
  it('normalizes padding', () => {
    expect(normalizeBase64('Zg').base64).toBe('Zg==');
  });
});

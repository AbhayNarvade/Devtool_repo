/** UTF-8 safe Base64 helpers (no dependencies; work in browsers and Node). */

export function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const CHUNK = 0x8000;
  for (let i = 0; i < bytes.length; i += CHUNK) {
    binary += String.fromCharCode(...bytes.subarray(i, i + CHUNK));
  }
  return btoa(binary);
}

export function toUrlSafe(b64: string, keepPadding = false): string {
  const s = b64.replace(/\+/g, '-').replace(/\//g, '_');
  return keepPadding ? s : s.replace(/=+$/, '');
}

export function encodeTextBase64(text: string): string {
  return bytesToBase64(new TextEncoder().encode(text));
}

export class Base64Error extends Error {}

export interface NormalizedBase64 {
  base64: string;
  /** MIME type when the input was a data: URL. */
  mime?: string;
  urlSafe: boolean;
}

/** Accepts standard or URL-safe Base64, with or without padding, whitespace or a data: URL prefix. */
export function normalizeBase64(input: string): NormalizedBase64 {
  let s = input.trim();
  let mime: string | undefined;
  const dataUrl = /^data:([^;,]*)(?:;[^,]*)?;base64,/i.exec(s);
  if (dataUrl) {
    mime = dataUrl[1] || undefined;
    s = s.slice(dataUrl[0].length);
  }
  s = s.replace(/\s+/g, '');
  const urlSafe = /[-_]/.test(s);
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  const bad = /[^A-Za-z0-9+/=]/.exec(s);
  if (bad) {
    throw new Base64Error(
      `"${bad[0]}" at position ${bad.index + 1} is not a Base64 character. Valid characters are A–Z, a–z, 0–9, +, / (or - and _ for URL-safe) and = padding.`,
    );
  }
  const firstPad = s.indexOf('=');
  if (firstPad !== -1 && /[^=]/.test(s.slice(firstPad))) {
    throw new Base64Error('Padding "=" may only appear at the end of Base64 data.');
  }
  s = s.replace(/=+$/, '');
  if (s.length % 4 === 1) {
    throw new Base64Error(
      'The input length is not valid Base64: it looks truncated (one character too many or too few).',
    );
  }
  s += '='.repeat((4 - (s.length % 4)) % 4);
  return { base64: s, mime, urlSafe };
}

export function base64ToBytes(input: string): Uint8Array {
  const { base64 } = normalizeBase64(input);
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

/** Decode bytes as UTF-8, or return null when they are not valid UTF-8 text. */
export function bytesToUtf8(bytes: Uint8Array): string | null {
  try {
    return new TextDecoder('utf-8', { fatal: true }).decode(bytes);
  } catch {
    return null;
  }
}

/** Detect common file types from their first bytes ("magic numbers"). */
export function sniffFileType(
  bytes: Uint8Array,
): { ext: string; mime: string; label: string } | null {
  const starts = (...sig: number[]) => sig.every((b, i) => bytes[i] === b);
  const ascii = (offset: number, text: string) =>
    [...text].every((c, i) => bytes[offset + i] === c.charCodeAt(0));
  if (starts(0x89, 0x50, 0x4e, 0x47)) return { ext: 'png', mime: 'image/png', label: 'PNG image' };
  if (starts(0xff, 0xd8, 0xff)) return { ext: 'jpg', mime: 'image/jpeg', label: 'JPEG image' };
  if (ascii(0, 'GIF8')) return { ext: 'gif', mime: 'image/gif', label: 'GIF image' };
  if (ascii(0, 'RIFF') && ascii(8, 'WEBP'))
    return { ext: 'webp', mime: 'image/webp', label: 'WebP image' };
  if (ascii(0, '%PDF')) return { ext: 'pdf', mime: 'application/pdf', label: 'PDF document' };
  if (starts(0x50, 0x4b, 0x03, 0x04))
    return { ext: 'zip', mime: 'application/zip', label: 'ZIP archive (or DOCX/XLSX)' };
  if (starts(0x1f, 0x8b)) return { ext: 'gz', mime: 'application/gzip', label: 'Gzip archive' };
  if (ascii(4, 'ftyp')) return { ext: 'mp4', mime: 'video/mp4', label: 'MP4 / MOV video' };
  if (ascii(0, 'ID3') || starts(0xff, 0xfb))
    return { ext: 'mp3', mime: 'audio/mpeg', label: 'MP3 audio' };
  if (ascii(0, 'wOF2')) return { ext: 'woff2', mime: 'font/woff2', label: 'WOFF2 font' };
  return null;
}

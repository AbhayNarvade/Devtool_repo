import {
  Base64Error,
  base64ToBytes,
  bytesToUtf8,
  normalizeBase64,
  sniffFileType,
} from '@/lib/base64';

export type DecodeResult =
  | {
      ok: true;
      bytes: Uint8Array;
      text: string | null;
      mime?: string;
      file: ReturnType<typeof sniffFileType>;
      urlSafe: boolean;
    }
  | { ok: false; message: string };

export function decodeBase64(input: string): DecodeResult {
  try {
    const { mime, urlSafe } = normalizeBase64(input);
    const bytes = base64ToBytes(input);
    const file = sniffFileType(bytes);
    const text = file ? null : bytesToUtf8(bytes);
    return { ok: true, bytes, text, mime, file, urlSafe };
  } catch (e) {
    if (e instanceof Base64Error) return { ok: false, message: e.message };
    return { ok: false, message: 'The input could not be decoded as Base64.' };
  }
}

/** Suggested download filename for decoded bytes. */
export function suggestFilename(result: Extract<DecodeResult, { ok: true }>): string {
  if (result.file) return `decoded.${result.file.ext}`;
  if (result.mime) {
    const sub = result.mime.split('/')[1]?.replace(/[^a-z0-9]+/gi, '') || 'bin';
    return `decoded.${sub === 'plain' ? 'txt' : sub}`;
  }
  return result.text !== null ? 'decoded.txt' : 'decoded.bin';
}

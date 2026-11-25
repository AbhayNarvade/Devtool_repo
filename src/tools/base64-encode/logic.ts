import { encodeTextBase64, toUrlSafe } from '@/lib/base64';
import { ok, type ConvertResult } from '@/lib/convert';

export interface Base64EncodeOptions {
  urlSafe: boolean;
  /** Wrap output at 76 characters per line (MIME style). */
  wrap: boolean;
}

export function wrapLines(text: string, width = 76): string {
  if (width <= 0) return text;
  const lines: string[] = [];
  for (let i = 0; i < text.length; i += width) lines.push(text.slice(i, i + width));
  return lines.join('\n');
}

export function encodeBase64(input: string, options: Base64EncodeOptions): ConvertResult {
  let out = encodeTextBase64(input);
  if (options.urlSafe) out = toUrlSafe(out);
  if (options.wrap) out = wrapLines(out);
  return ok(out);
}

/** Base64 for a file's bytes, optionally as a data: URL. */
export function fileToBase64Output(
  base64: string,
  mime: string,
  asDataUrl: boolean,
  urlSafe: boolean,
): string {
  if (asDataUrl) return `data:${mime || 'application/octet-stream'};base64,${base64}`;
  return urlSafe ? toUrlSafe(base64) : base64;
}

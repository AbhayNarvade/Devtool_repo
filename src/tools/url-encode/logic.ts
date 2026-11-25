import { fail, ok, type ConvertResult } from '@/lib/convert';

export type UrlEncodeMode = 'component' | 'full';

export interface UrlEncodeOptions {
  mode: UrlEncodeMode;
  /** application/x-www-form-urlencoded style: spaces become "+" (component mode only). */
  spaceAsPlus: boolean;
  /** Encode every line separately (useful for lists of values). */
  perLine: boolean;
}

function encodeOne(value: string, options: UrlEncodeOptions): string {
  if (options.mode === 'full') return encodeURI(value);
  const encoded = encodeURIComponent(value);
  return options.spaceAsPlus ? encoded.replace(/%20/g, '+') : encoded;
}

export function urlEncode(input: string, options: UrlEncodeOptions): ConvertResult {
  try {
    const out = options.perLine
      ? input
          .split(/\r?\n/)
          .map((line) => encodeOne(line, options))
          .join('\n')
      : encodeOne(input, options);
    return ok(out);
  } catch {
    return fail(
      'Cannot encode this text',
      'The input contains an unpaired surrogate character (half of an emoji or symbol), which cannot be encoded as UTF-8.',
    );
  }
}

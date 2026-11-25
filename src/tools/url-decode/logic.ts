import { fail, ok, type ConvertResult } from '@/lib/convert';

export interface UrlDecodeOptions {
  /** Treat "+" as a space (query strings / form data). */
  plusAsSpace: boolean;
  /** Keep decoding while the result still contains percent-escapes (double-encoded input). */
  decodeAll: boolean;
}

/** Find the first malformed escape, for a precise error message. */
export function findMalformedEscape(
  text: string,
): { index: number; sequence: string; reason: string } | null {
  const badPercent = /%(?![0-9A-Fa-f]{2})/.exec(text);
  const runs = text.matchAll(/(?:%[0-9A-Fa-f]{2})+/g);
  for (const run of runs) {
    if (badPercent && badPercent.index < (run.index ?? 0)) break;
    try {
      decodeURIComponent(run[0]);
    } catch {
      return {
        index: run.index ?? 0,
        sequence: run[0].length > 24 ? `${run[0].slice(0, 24)}…` : run[0],
        reason: 'these bytes are not valid UTF-8',
      };
    }
  }
  if (badPercent) {
    return {
      index: badPercent.index,
      sequence: text.slice(badPercent.index, badPercent.index + 3),
      reason:
        '"%" must be followed by two hexadecimal digits (write a literal percent sign as %25)',
    };
  }
  return null;
}

export function urlDecode(input: string, options: UrlDecodeOptions): ConvertResult {
  let current = options.plusAsSpace ? input.replace(/\+/g, ' ') : input;
  let rounds = 0;
  const maxRounds = options.decodeAll ? 10 : 1;
  while (rounds < maxRounds) {
    let next: string;
    try {
      next = decodeURIComponent(current);
    } catch {
      const bad = findMalformedEscape(current);
      const where = bad ? ` at position ${bad.index + 1} ("${bad.sequence}"): ${bad.reason}.` : '.';
      return fail('Malformed URL encoding', `The text contains an invalid percent-escape${where}`);
    }
    rounds++;
    if (next === current) break;
    current = next;
    if (!/%[0-9A-Fa-f]{2}/.test(current)) break;
  }
  const stillEncoded = !options.decodeAll && /%[0-9A-Fa-f]{2}/.test(current);
  return ok(current, {
    info: options.decodeAll && rounds > 1 ? `Decoded ${rounds} layers of encoding.` : undefined,
    warnings: stillEncoded
      ? [
          'The result still contains percent-escapes, so the input may be double-encoded. Turn on "Decode repeatedly" to decode every layer.',
        ]
      : undefined,
  });
}

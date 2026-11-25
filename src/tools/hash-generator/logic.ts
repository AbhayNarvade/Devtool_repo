import { md5 } from 'js-md5';

export const HASH_ALGORITHMS = ['MD5', 'SHA-1', 'SHA-256', 'SHA-384', 'SHA-512'] as const;
export type HashAlgorithm = (typeof HASH_ALGORITHMS)[number];

export function toHex(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
}

/** Hash bytes with one algorithm. SHA uses the Web Crypto API; MD5 (not in Web Crypto) uses js-md5. */
export async function hashBytes(algorithm: HashAlgorithm, bytes: Uint8Array): Promise<string> {
  if (algorithm === 'MD5') return md5(bytes);
  return toHex(await crypto.subtle.digest(algorithm, bytes as Uint8Array<ArrayBuffer>));
}

export async function hashText(
  text: string,
  algorithms: readonly HashAlgorithm[] = HASH_ALGORITHMS,
): Promise<Record<HashAlgorithm, string>> {
  const bytes = new TextEncoder().encode(text);
  const entries = await Promise.all(
    algorithms.map(async (a) => [a, await hashBytes(a, bytes)] as const),
  );
  return Object.fromEntries(entries) as Record<HashAlgorithm, string>;
}

/** Normalise a pasted hash for comparison (case and surrounding whitespace do not matter). */
export function normalizeHash(value: string): string {
  return value.trim().toLowerCase().replace(/^0x/, '');
}

/** Which algorithm (if any) produced a hash equal to `expected`. */
export function findMatch(
  results: Partial<Record<HashAlgorithm, string>>,
  expected: string,
): HashAlgorithm | null {
  const want = normalizeHash(expected);
  if (!want) return null;
  for (const [alg, value] of Object.entries(results))
    if (value === want) return alg as HashAlgorithm;
  return null;
}

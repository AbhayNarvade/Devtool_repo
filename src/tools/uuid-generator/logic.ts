export type UuidVersion = 'v4' | 'v7';

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
export const MAX_COUNT = 1000;

type RandomFill = (bytes: Uint8Array) => Uint8Array;
const defaultRandom: RandomFill = (bytes) => crypto.getRandomValues(bytes);

function hex(bytes: Uint8Array): string {
  const h = Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('');
  return `${h.slice(0, 8)}-${h.slice(8, 12)}-${h.slice(12, 16)}-${h.slice(16, 20)}-${h.slice(20)}`;
}

/** RFC 9562 version 4 (random) UUID. */
export function uuidV4(random: RandomFill = defaultRandom): string {
  if (random === defaultRandom && typeof crypto.randomUUID === 'function')
    return crypto.randomUUID();
  const b = random(new Uint8Array(16));
  b[6] = (b[6]! & 0x0f) | 0x40;
  b[8] = (b[8]! & 0x3f) | 0x80;
  return hex(b);
}

const RAND_BITS = 74n;
const RAND_MAX = (1n << RAND_BITS) - 1n;

/**
 * RFC 9562 version 7 UUIDs: 48-bit Unix millisecond timestamp + 74 random bits.
 * The returned generator is monotonic: within the same millisecond, the random part is
 * incremented, so UUIDs generated in bulk always sort in creation order.
 */
export function createUuidV7Generator(
  now: () => number = Date.now,
  random: RandomFill = defaultRandom,
) {
  let lastMs = -1;
  let lastRand = 0n;
  return function uuidV7(): string {
    let ms = now();
    let rand: bigint;
    if (ms <= lastMs) {
      ms = lastMs;
      rand = lastRand + 1n;
      if (rand > RAND_MAX) {
        ms += 1;
        rand = randomBits(random);
      }
    } else {
      rand = randomBits(random);
    }
    lastMs = ms;
    lastRand = rand;

    const b = new Uint8Array(16);
    let t = BigInt(ms);
    for (let i = 5; i >= 0; i--) {
      b[i] = Number(t & 0xffn);
      t >>= 8n;
    }
    const randA = Number(rand >> 62n); // 12 bits
    let randB = rand & ((1n << 62n) - 1n); // 62 bits
    b[6] = 0x70 | (randA >> 8);
    b[7] = randA & 0xff;
    for (let i = 15; i >= 9; i--) {
      b[i] = Number(randB & 0xffn);
      randB >>= 8n;
    }
    b[8] = 0x80 | Number(randB & 0x3fn);
    return hex(b);
  };
}

function randomBits(random: RandomFill): bigint {
  const bytes = random(new Uint8Array(10));
  let n = 0n;
  for (const byte of bytes) n = (n << 8n) | BigInt(byte);
  // Keep the top bit clear so there is room to increment within the same millisecond.
  return n & (RAND_MAX >> 1n);
}

/** Version nibble of a UUID string (4, 7, ...), or null if it is not a UUID. */
export function uuidVersion(uuid: string): number | null {
  return UUID_RE.test(uuid) ? parseInt(uuid[14]!, 16) : null;
}

/** Creation time (epoch ms) embedded in a UUID v7, or null. */
export function uuidV7Timestamp(uuid: string): number | null {
  if (uuidVersion(uuid) !== 7) return null;
  return parseInt(uuid.replace(/-/g, '').slice(0, 12), 16);
}

const sharedV7 = createUuidV7Generator();

export function generateUuids(version: UuidVersion, count: number, uppercase: boolean): string[] {
  const n = Math.min(MAX_COUNT, Math.max(1, Math.floor(count) || 1));
  const make = version === 'v7' ? sharedV7 : () => uuidV4();
  const list = Array.from({ length: n }, make);
  return uppercase ? list.map((u) => u.toUpperCase()) : list;
}

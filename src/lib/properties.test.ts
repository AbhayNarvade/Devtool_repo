/**
 * Property-based tests: thousands of generated inputs checked against independent references
 * (the platform's own JSON.parse, round trips, mathematical invariants). A fixed seed keeps
 * runs reproducible.
 */
import { describe, expect, it } from 'vitest';
import { base64ToBytes, bytesToBase64, bytesToUtf8, encodeTextBase64 } from '@/lib/base64';
import { findJsonError, parseJson } from '@/lib/json';
import { computeResize } from '@/lib/image/geometry';
import { fromOctal, fromSymbolic, toOctal, toSymbolic } from '@/tools/chmod-calculator/logic';
import { csvToJson } from '@/tools/csv-to-json/logic';
import { diffJson } from '@/tools/json-compare/logic';
import { jsonToCsv } from '@/tools/json-to-csv/logic';
import { jsonToYaml } from '@/tools/json-to-yaml/logic';
import {
  calculateSubnet,
  maskToPrefix,
  parseIPv4,
  prefixToMask,
} from '@/tools/subnet-calculator/logic';
import { urlDecode } from '@/tools/url-decode/logic';
import { urlEncode } from '@/tools/url-encode/logic';
import { createUuidV7Generator } from '@/tools/uuid-generator/logic';
import { yamlToJson } from '@/tools/yaml-to-json/logic';

/** Small deterministic PRNG (mulberry32). */
function rng(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const R = rng(20261126);
const int = (n: number) => Math.floor(R() * n);
const pick = <T>(xs: readonly T[]) => xs[int(xs.length)]!;

const CHARS = [
  'a',
  'Z',
  '0',
  ' ',
  '"',
  '\\',
  '/',
  ',',
  ':',
  '\n',
  '\t',
  'é',
  '😀',
  '中',
  '&',
  '=',
  '+',
  '%',
  '#',
  '?',
  "'",
  '\u2028',
];
function randomString(max = 12): string {
  return Array.from({ length: int(max) }, () => pick(CHARS)).join('');
}
function randomJson(depth = 0): unknown {
  const kind = depth > 3 ? int(4) : int(6);
  switch (kind) {
    case 0:
      return randomString();
    case 1:
      return pick([0, -1, 1.5, 1e21, -0.000123, 42, 9007199254740991]);
    case 2:
      return pick([true, false]);
    case 3:
      return null;
    case 4:
      return Array.from({ length: int(4) }, () => randomJson(depth + 1));
    default: {
      const o: Record<string, unknown> = {};
      for (let i = 0; i < int(4); i++) o[randomString(6) || 'k'] = randomJson(depth + 1);
      return o;
    }
  }
}

describe('JSON error locator agrees with JSON.parse', () => {
  it('on 3000 valid documents and random mutations of them', () => {
    const MUTATIONS = [
      '',
      ',',
      '}',
      ']',
      '"',
      "'",
      ':',
      'x',
      '01',
      ' ',
      '\n',
      'undefined',
      '{',
      '[',
      '\\',
    ];
    for (let i = 0; i < 3000; i++) {
      const valid = JSON.stringify(randomJson(), null, int(2) ? 2 : undefined);
      expect(findJsonError(valid)).toBeNull();
      const pos = int(valid.length + 1);
      const mutated = valid.slice(0, pos) + pick(MUTATIONS) + valid.slice(pos + int(2));
      let nativeOk = true;
      try {
        JSON.parse(mutated);
      } catch {
        nativeOk = false;
      }
      const issue = findJsonError(mutated);
      expect(issue === null, `input: ${JSON.stringify(mutated)}`).toBe(nativeOk);
      if (issue) {
        expect(issue.line).toBeGreaterThanOrEqual(1);
        expect(issue.position).toBeLessThanOrEqual(mutated.length);
      }
      expect(parseJson(mutated).ok).toBe(nativeOk);
    }
  });
});

describe('round trips', () => {
  it('Base64: random bytes and Unicode text survive encode -> decode', () => {
    for (let i = 0; i < 500; i++) {
      const bytes = Uint8Array.from({ length: int(64) }, () => int(256));
      expect([...base64ToBytes(bytesToBase64(bytes))]).toEqual([...bytes]);
      const text = randomString(30);
      expect(bytesToUtf8(base64ToBytes(encodeTextBase64(text)))).toBe(text);
    }
  });

  it('URL: encode -> decode returns the original (component, full and + modes)', () => {
    for (let i = 0; i < 500; i++) {
      const text = randomString(30).replace(/\u2028/g, '');
      for (const [mode, plus] of [
        ['component', false],
        ['component', true],
        ['full', false],
      ] as const) {
        const enc = urlEncode(text, { mode, spaceAsPlus: plus, perLine: false });
        expect(enc.ok).toBe(true);
        if (!enc.ok) continue;
        // In full-URL mode a literal "+" or "%"-sequence in the text stays as typed, so only
        // check full mode on text without them.
        if (mode === 'full' && /[+%#?&=]/.test(text)) continue;
        const dec = urlDecode(enc.output, { plusAsSpace: plus, decodeAll: false });
        expect(dec.ok && dec.output, `${mode}/${plus}: ${JSON.stringify(text)}`).toBe(text);
      }
    }
  });

  it('JSON -> YAML -> JSON preserves every value', () => {
    for (let i = 0; i < 1000; i++) {
      const value = randomJson();
      const json = JSON.stringify(value);
      const yaml = jsonToYaml(json, { indent: 2, sortKeys: false });
      expect(yaml.ok).toBe(true);
      if (!yaml.ok) continue;
      const back = yamlToJson(yaml.output, { indent: 'minify', multiDocument: false });
      expect(back.ok && JSON.parse(back.output), `yaml:\n${yaml.output}`).toEqual(JSON.parse(json));
    }
  });

  it('flat records: JSON -> CSV -> JSON preserves text values', () => {
    for (let i = 0; i < 300; i++) {
      const cols = Array.from({ length: 1 + int(4) }, (_, c) => `col${c}`);
      const rows = Array.from({ length: 1 + int(5) }, () =>
        Object.fromEntries(cols.map((c) => [c, `v${randomString(8).replace(/\u2028/g, '')}`])),
      );
      for (const delimiter of [',', ';', '\t', '|'] as const) {
        const csv = jsonToCsv(JSON.stringify(rows), { delimiter, flatten: true });
        expect(csv.ok).toBe(true);
        if (!csv.ok) continue;
        const back = csvToJson(csv.output, {
          header: true,
          delimiter,
          dynamicTyping: false,
          minify: true,
        });
        expect(back.ok && JSON.parse(back.output), csv.output).toEqual(rows);
      }
    }
  });

  it('chmod: all 4096 modes convert octal -> symbolic -> octal exactly', () => {
    for (let mode = 0; mode < 0o10000; mode++) {
      const octal = mode.toString(8).padStart(4, '0');
      const p = fromOctal(octal)!;
      const expected = mode >= 0o1000 ? octal : octal.slice(1);
      expect(toOctal(p)).toBe(expected);
      expect(toOctal(fromSymbolic(toSymbolic(p))!)).toBe(expected);
    }
  });
});

describe('invariants', () => {
  it('subnets: network <= address <= broadcast, counts and masks are consistent', () => {
    for (let prefix = 0; prefix <= 32; prefix++) {
      expect(maskToPrefix(prefixToMask(prefix))).toBe(prefix);
    }
    for (let i = 0; i < 2000; i++) {
      const ip = (int(256) * 16777216 + int(256) * 65536 + int(256) * 256 + int(256)) >>> 0;
      const prefix = int(33);
      const s = calculateSubnet(ip, prefix);
      const net = parseIPv4(s.network)!;
      const bc = parseIPv4(s.broadcast)!;
      expect(net <= ip && ip <= bc).toBe(true);
      expect(bc - net + 1).toBe(s.totalAddresses);
      expect(s.totalAddresses).toBe(2 ** (32 - prefix));
      expect(s.usableHosts).toBe(prefix === 32 ? 1 : prefix === 31 ? 2 : s.totalAddresses - 2);
      const first = parseIPv4(s.firstHost)!;
      const last = parseIPv4(s.lastHost)!;
      expect(first <= last).toBe(true);
      expect(last - first + 1).toBe(s.usableHosts);
    }
  });

  it('resize: keep-aspect results never exceed the box and keep the ratio', () => {
    for (let i = 0; i < 2000; i++) {
      const original = { width: 1 + int(8000), height: 1 + int(8000) };
      const width = 1 + int(4000);
      const height = 1 + int(4000);
      const r = computeResize(original, { mode: 'pixels', width, height, keepAspect: true });
      expect(r.width).toBeLessThanOrEqual(width);
      expect(r.height).toBeLessThanOrEqual(height);
      expect(r.width >= 1 && r.height >= 1).toBe(true);
      // Ratio is kept within rounding error (one pixel on the smaller side).
      const expectedHeight = (r.width * original.height) / original.width;
      expect(Math.abs(r.height - expectedHeight)).toBeLessThanOrEqual(
        1 + original.height / original.width,
      );
    }
  });

  it('UUID v7: strictly increasing under a random, sometimes-backwards clock', () => {
    let t = 1_700_000_000_000;
    const gen = createUuidV7Generator(() => (t += int(3) - 1));
    let prev = '';
    for (let i = 0; i < 5000; i++) {
      const id = gen();
      expect(id > prev).toBe(true);
      prev = id;
    }
  });

  it('JSON compare: a document equals itself and reordered keys are equal', () => {
    const shuffle = (v: unknown): unknown => {
      if (Array.isArray(v)) return v.map(shuffle);
      if (v && typeof v === 'object') {
        const entries = Object.entries(v).reverse();
        return Object.fromEntries(entries.map(([k, x]) => [k, shuffle(x)]));
      }
      return v;
    };
    for (let i = 0; i < 1000; i++) {
      const v = randomJson();
      expect(diffJson(v, v, { ignoreArrayOrder: false })).toEqual([]);
      expect(diffJson(v, shuffle(v), { ignoreArrayOrder: false })).toEqual([]);
      expect(diffJson(v, shuffle(v), { ignoreArrayOrder: true })).toEqual([]);
    }
  });
});

import { describe, expect, it } from 'vitest';
import {
  createUuidV7Generator,
  generateUuids,
  uuidV4,
  uuidV7Timestamp,
  uuidVersion,
} from './logic';

const V4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
const V7 = /^[0-9a-f]{8}-[0-9a-f]{4}-7[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;

describe('uuid v4', () => {
  it('has the RFC 9562 version and variant bits', () => {
    for (let i = 0; i < 50; i++) expect(uuidV4()).toMatch(V4);
    expect(uuidV4((b) => b.fill(0xff))).toBe('ffffffff-ffff-4fff-bfff-ffffffffffff');
  });
});

describe('uuid v7', () => {
  it('encodes the timestamp, version 7 and variant', () => {
    const ms = Date.UTC(2026, 0, 1);
    const gen = createUuidV7Generator(() => ms);
    const id = gen();
    expect(id).toMatch(V7);
    expect(id.slice(0, 13)).toBe(
      `${ms.toString(16).padStart(12, '0').slice(0, 8)}-${ms.toString(16).padStart(12, '0').slice(8)}`,
    );
    expect(uuidV7Timestamp(id)).toBe(ms);
    expect(uuidVersion(id)).toBe(7);
  });
  it('is monotonic within the same millisecond', () => {
    const gen = createUuidV7Generator(() => 1_700_000_000_000);
    const ids = Array.from({ length: 1000 }, gen);
    expect([...ids].sort()).toEqual(ids);
    expect(new Set(ids).size).toBe(1000);
    for (const id of ids) expect(id).toMatch(V7);
  });
  it('never goes backwards when the clock does', () => {
    let t = 2_000;
    const gen = createUuidV7Generator(() => t);
    const a = gen();
    t = 1_000;
    const b = gen();
    expect(b > a).toBe(true);
  });
});

describe('generateUuids', () => {
  it('clamps the count and supports uppercase', () => {
    expect(generateUuids('v4', 0, false)).toHaveLength(1);
    expect(generateUuids('v7', 5000, false)).toHaveLength(1000);
    expect(generateUuids('v4', 3, true).every((u) => u === u.toUpperCase())).toBe(true);
  });
});

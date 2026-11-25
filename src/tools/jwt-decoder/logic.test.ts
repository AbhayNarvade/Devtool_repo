import { describe, expect, it } from 'vitest';
import { decodeJwt, humanDuration } from './logic';

// HS256 token signed with "your-256-bit-secret"; iat 2026-01-01T00:00:00Z, exp one hour later.
const TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImVtYWlsIjoiYWRhQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiYWRtaW4iLCJlZGl0b3IiXSwiaWF0IjoxNzY3MjI1NjAwLCJleHAiOjE3NjcyMjkyMDAsImlzcyI6Imh0dHBzOi8vYXV0aC5leGFtcGxlLmNvbSIsImF1ZCI6ImV4YW1wbGUtYXBpIn0.tQ4UspH0hzKk9wrbQcessfwOzdlX2DhGkOGuUKXMGjc';
const IAT = Date.UTC(2026, 0, 1);

describe('decodeJwt', () => {
  it('decodes header, payload and times', () => {
    const r = decodeJwt(TOKEN, IAT + 60_000);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.header).toEqual({ alg: 'HS256', typ: 'JWT' });
    expect((r.payload as { name: string }).name).toBe('Ada Lovelace');
    expect(r.times.map((t) => [t.claim, t.iso])).toEqual([
      ['iat', '2026-01-01T00:00:00.000Z'],
      ['exp', '2026-01-01T01:00:00.000Z'],
    ]);
    expect(r.status).toBe('valid');
    expect(r.expiresIn).toBe(3540);
    expect(r.signature).toBe('tQ4UspH0hzKk9wrbQcessfwOzdlX2DhGkOGuUKXMGjc');
  });
  it('detects expiry and accepts a Bearer prefix', () => {
    const r = decodeJwt(`Bearer ${TOKEN}`, IAT + 2 * 3600_000);
    expect(r.ok && r.status).toBe('expired');
  });
  it('flags alg none, JWE and malformed tokens', () => {
    const none = decodeJwt('eyJhbGciOiJub25lIn0.eyJzdWIiOiJ4In0.');
    expect(none.ok && none.warnings[0]).toMatch(/unsigned/);
    expect(decodeJwt('a.b.c.d.e')).toMatchObject({
      ok: false,
      message: expect.stringMatching(/encrypted/),
    });
    expect(decodeJwt('abc')).toMatchObject({
      ok: false,
      message: expect.stringMatching(/three parts/),
    });
    expect(decodeJwt('e30.bm90IGpzb24.x')).toMatchObject({
      ok: false,
      message: expect.stringMatching(/not valid JSON/),
    });
  });
  it('handles nbf and non-numeric times', () => {
    // {"alg":"HS256"} . {"nbf":4102444800,"exp":"soon"}
    const t = 'eyJhbGciOiJIUzI1NiJ9.eyJuYmYiOjQxMDI0NDQ4MDAsImV4cCI6InNvb24ifQ.sig';
    const r = decodeJwt(t, IAT);
    expect(r.ok && r.status).toBe('not-yet-valid');
    expect(r.ok && r.warnings.some((w) => w.includes('"exp"'))).toBe(true);
  });
});

describe('humanDuration', () => {
  it('formats durations', () => {
    expect(humanDuration(3540)).toBe('59 minutes');
    expect(humanDuration(-90061)).toBe('1 day 1 hour');
    expect(humanDuration(0)).toBe('0 seconds');
  });
});

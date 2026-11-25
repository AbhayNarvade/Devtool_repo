import { describe, expect, it } from 'vitest';
import { dateTimeToMs, describeTimestamp, parseTimestamp, relativeTime } from './logic';

describe('parseTimestamp', () => {
  it('auto-detects seconds and milliseconds', () => {
    expect(parseTimestamp('1767225600')).toEqual({ ok: true, ms: 1767225600000, unit: 's' });
    expect(parseTimestamp('1767225600000')).toEqual({ ok: true, ms: 1767225600000, unit: 'ms' });
    expect(parseTimestamp(' 1,767,225,600 ')).toMatchObject({ ok: true, unit: 's' });
  });
  it('respects a forced unit, negatives and decimals', () => {
    expect(parseTimestamp('1767225600', 'ms')).toEqual({ ok: true, ms: 1767225600, unit: 'ms' });
    expect(parseTimestamp('-86400')).toEqual({ ok: true, ms: -86400000, unit: 's' });
    expect(parseTimestamp('1.5')).toEqual({ ok: true, ms: 1500, unit: 's' });
  });
  it('rejects invalid input', () => {
    expect(parseTimestamp('abc').ok).toBe(false);
    expect(parseTimestamp('').ok).toBe(false);
    expect(parseTimestamp('9'.repeat(20), 'ms').ok).toBe(false);
  });
});

describe('describeTimestamp', () => {
  it('formats UTC, ISO 8601 and relative times', () => {
    const d = describeTimestamp(1767225600000, 1767225600000 + 3 * 86_400_000, 'UTC');
    expect(d.iso).toBe('2026-01-01T00:00:00.000Z');
    expect(d.seconds).toBe(1767225600);
    expect(d.utc).toBe('Thursday, January 1, 2026 at 00:00:00 UTC');
    expect(d.relative).toBe('3 days ago');
  });
  it('formats in another time zone', () => {
    expect(describeTimestamp(1767225600000, 0, 'Asia/Kolkata').local).toBe(
      'Thursday, January 1, 2026 at 05:30:00 GMT+5:30',
    );
  });
  it('relative time handles future and seconds', () => {
    expect(relativeTime(7200_000, 0)).toBe('in 2 hours');
    expect(relativeTime(0, 0)).toBe('now');
  });
});

describe('dateTimeToMs', () => {
  it('converts UTC date-times and rejects impossible dates', () => {
    expect(dateTimeToMs('2026-01-01T00:00', 'UTC')).toBe(1767225600000);
    expect(dateTimeToMs('2026-01-01 00:00:30.5', 'UTC')).toBe(1767225630500);
    expect(dateTimeToMs('2026-02-30T00:00', 'UTC')).toBeNull();
    expect(dateTimeToMs('nonsense', 'UTC')).toBeNull();
  });
});

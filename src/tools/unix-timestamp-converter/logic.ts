export type TimestampUnit = 'auto' | 's' | 'ms';

export type ParsedTimestamp =
  { ok: true; ms: number; unit: 's' | 'ms' } | { ok: false; message: string };

/** Largest time a JavaScript Date can represent (±100,000,000 days from 1970). */
const MAX_MS = 8.64e15;

/**
 * Parse a Unix timestamp. In "auto" mode values with 12 or more integer digits are treated as
 * milliseconds (1e11 seconds is the year 5138, so real second-based timestamps are shorter).
 */
export function parseTimestamp(input: string, unit: TimestampUnit = 'auto'): ParsedTimestamp {
  const text = input.trim().replace(/[_,\s]/g, '');
  if (!text) return { ok: false, message: 'Enter a timestamp.' };
  if (!/^-?\d+(\.\d+)?$/.test(text)) {
    return {
      ok: false,
      message: 'A Unix timestamp is a whole number of seconds or milliseconds, such as 1767225600.',
    };
  }
  const value = Number(text);
  const resolved: 's' | 'ms' = unit === 'auto' ? (Math.abs(value) >= 1e11 ? 'ms' : 's') : unit;
  const ms = resolved === 's' ? value * 1000 : value;
  if (!Number.isFinite(ms) || Math.abs(ms) > MAX_MS) {
    return {
      ok: false,
      message: 'This timestamp is outside the range of dates that can be represented.',
    };
  }
  return { ok: true, ms: Math.round(ms), unit: resolved };
}

export function formatInZone(ms: number, timeZone?: string): string {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZone,
    timeZoneName: 'short',
  }).format(new Date(ms));
}

/** "3 days ago" / "in 2 hours" relative to `now`. */
export function relativeTime(ms: number, now: number): string {
  const diff = (ms - now) / 1000;
  const abs = Math.abs(diff);
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const units: [Intl.RelativeTimeFormatUnit, number][] = [
    ['year', 31_536_000],
    ['month', 2_592_000],
    ['week', 604_800],
    ['day', 86_400],
    ['hour', 3600],
    ['minute', 60],
  ];
  for (const [unit, size] of units) {
    if (abs >= size) return rtf.format(Math.round(diff / size), unit);
  }
  return rtf.format(Math.round(diff), 'second');
}

export interface DateDetails {
  seconds: number;
  milliseconds: number;
  iso: string;
  utc: string;
  local: string;
  relative: string;
}

export function describeTimestamp(ms: number, now: number, timeZone?: string): DateDetails {
  return {
    seconds: Math.floor(ms / 1000),
    milliseconds: ms,
    iso: new Date(ms).toISOString(),
    utc: formatInZone(ms, 'UTC'),
    local: formatInZone(ms, timeZone),
    relative: relativeTime(ms, now),
  };
}

/**
 * Convert a date and time typed by the user ("2026-01-01T09:30" or "2026-01-01T09:30:15")
 * into epoch milliseconds, interpreted in local time or UTC.
 */
export function dateTimeToMs(value: string, zone: 'local' | 'UTC'): number | null {
  const m = /^(\d{4,6})-(\d{2})-(\d{2})(?:[T ](\d{2}):(\d{2})(?::(\d{2})(?:\.(\d{1,3}))?)?)?$/.exec(
    value.trim(),
  );
  if (!m) return null;
  const [, y, mo, d, h = '0', mi = '0', s = '0', frac = '0'] = m;
  const parts = [
    Number(y),
    Number(mo) - 1,
    Number(d),
    Number(h),
    Number(mi),
    Number(s),
    Number(frac.padEnd(3, '0')),
  ] as const;
  if (
    parts[1] > 11 ||
    parts[2] < 1 ||
    parts[2] > 31 ||
    parts[3] > 23 ||
    parts[4] > 59 ||
    parts[5] > 59
  )
    return null;
  const ms = zone === 'UTC' ? Date.UTC(...parts) : new Date(...parts).getTime();
  // Reject dates that rolled over, e.g. February 30.
  const check = new Date(ms);
  const day = zone === 'UTC' ? check.getUTCDate() : check.getDate();
  return Number.isNaN(ms) || day !== parts[2] ? null : ms;
}

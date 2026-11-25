import { describe, expect, it } from 'vitest';
import { formatDisplayDate, latestDate } from './date';

describe('dates', () => {
  it('formats ISO dates for display in UTC', () => {
    expect(formatDisplayDate('2026-11-25')).toBe('November 25, 2026');
    expect(formatDisplayDate('2026-01-01')).toBe('January 1, 2026');
  });
  it('finds the latest date', () => {
    expect(latestDate(['2026-01-02', '2026-11-25', '2025-12-31'])).toBe('2026-11-25');
    expect(() => latestDate([])).toThrow();
  });
});

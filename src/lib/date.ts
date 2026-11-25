/** "2026-11-25" -> "November 25, 2026" (UTC, so the build machine's time zone never matters). */
export function formatDisplayDate(isoDate: string): string {
  return new Date(`${isoDate}T00:00:00Z`).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Latest of several ISO dates (YYYY-MM-DD strings compare correctly as text). */
export function latestDate(dates: string[]): string {
  if (dates.length === 0) throw new Error('latestDate() needs at least one date');
  return dates.reduce((a, b) => (a > b ? a : b));
}

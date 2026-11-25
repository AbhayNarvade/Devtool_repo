import { describe, expect, it } from 'vitest';
import { CRON_FIELDS, buildField, checkCron, describeCron, nextRuns, parseField } from './logic';

describe('checkCron', () => {
  it('accepts 5-field expressions and macros', () => {
    expect(checkCron(' */5  *  * * * ')).toEqual({
      ok: true,
      fields: ['*/5', '*', '*', '*', '*'],
      expression: '*/5 * * * *',
    });
    expect(checkCron('@daily')).toMatchObject({ ok: true, expression: '0 0 * * *' });
  });
  it('rejects wrong field counts and out-of-range values', () => {
    expect(checkCron('* * *')).toMatchObject({
      ok: false,
      message: expect.stringMatching(/5 fields.*has 3/),
    });
    expect(checkCron('0 * * * * *')).toMatchObject({
      ok: false,
      message: expect.stringMatching(/seconds/),
    });
    expect(checkCron('61 * * * *')).toMatchObject({
      ok: false,
      message: expect.stringMatching(/0-59/),
    });
  });
});

describe('describeCron', () => {
  it('produces human-readable text', () => {
    expect(describeCron('*/5 * * * *', false)).toBe('Every 5 minutes');
    expect(describeCron('0 9 * * 1-5', false)).toBe('At 09:00 AM, Monday through Friday');
    expect(describeCron('0 9 * * 1-5', true)).toBe('At 09:00, Monday through Friday');
  });
});

describe('nextRuns', () => {
  it('lists upcoming runs in a time zone', () => {
    const runs = nextRuns('*/15 9-17 * * 1-5', 3, new Date('2026-11-25T08:50:00Z'), 'UTC');
    expect(runs.map((d) => d.toISOString())).toEqual([
      '2026-11-25T09:00:00.000Z',
      '2026-11-25T09:15:00.000Z',
      '2026-11-25T09:30:00.000Z',
    ]);
    const ist = nextRuns('0 9 * * *', 1, new Date('2026-11-25T00:00:00Z'), 'Asia/Kolkata');
    expect(ist[0]!.toISOString()).toBe('2026-11-25T03:30:00.000Z');
  });
  it('skips to the next valid weekday', () => {
    // 2026-11-28 is a Saturday.
    const runs = nextRuns('0 9 * * 1-5', 1, new Date('2026-11-28T10:00:00Z'), 'UTC');
    expect(runs[0]!.toISOString()).toBe('2026-11-30T09:00:00.000Z');
  });
});

describe('builder fields', () => {
  const minute = CRON_FIELDS[0]!;
  const dow = CRON_FIELDS[4]!;
  it('round-trips common field syntaxes', () => {
    for (const text of ['*', '*/10', '5-30', '0,15,30,45'])
      expect(buildField(parseField(text, minute))).toBe(text);
    expect(parseField('1-5', dow).mode).toBe('range');
    expect(parseField('3,1', dow)).toMatchObject({ mode: 'specific', values: [1, 3] });
  });
  it('treats unusual syntax as custom', () => {
    expect(parseField('MON-FRI', dow)).toMatchObject({ mode: 'custom', custom: 'MON-FRI' });
    expect(parseField('70', minute).mode).toBe('custom');
    expect(buildField(parseField('1-5/2', minute))).toBe('1-5/2');
  });
});

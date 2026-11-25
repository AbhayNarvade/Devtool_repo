import cronstrue from 'cronstrue';
import { CronExpressionParser } from 'cron-parser';

export interface CronFieldDef {
  key: 'minute' | 'hour' | 'dayOfMonth' | 'month' | 'dayOfWeek';
  label: string;
  min: number;
  max: number;
  /** Display names for values (months, weekdays). */
  names?: string[];
}

export const CRON_FIELDS: CronFieldDef[] = [
  { key: 'minute', label: 'Minute', min: 0, max: 59 },
  { key: 'hour', label: 'Hour', min: 0, max: 23 },
  { key: 'dayOfMonth', label: 'Day of month', min: 1, max: 31 },
  {
    key: 'month',
    label: 'Month',
    min: 1,
    max: 12,
    names: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  },
  {
    key: 'dayOfWeek',
    label: 'Day of week',
    min: 0,
    max: 6,
    names: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  },
];

export const CRON_MACROS: Record<string, string> = {
  '@yearly': '0 0 1 1 *',
  '@annually': '0 0 1 1 *',
  '@monthly': '0 0 1 * *',
  '@weekly': '0 0 * * 0',
  '@daily': '0 0 * * *',
  '@midnight': '0 0 * * *',
  '@hourly': '0 * * * *',
};

export const CRON_PRESETS: { label: string; expression: string }[] = [
  { label: 'Every minute', expression: '* * * * *' },
  { label: 'Every 5 minutes', expression: '*/5 * * * *' },
  { label: 'Every 15 minutes', expression: '*/15 * * * *' },
  { label: 'Every hour', expression: '0 * * * *' },
  { label: 'Every day at midnight', expression: '0 0 * * *' },
  { label: 'Every day at 9:00', expression: '0 9 * * *' },
  { label: 'Weekdays at 9:00', expression: '0 9 * * 1-5' },
  { label: 'Every Sunday at 3:00', expression: '0 3 * * 0' },
  { label: 'First day of every month', expression: '0 0 1 * *' },
  { label: 'Every January 1st', expression: '0 0 1 1 *' },
];

export type CronCheck =
  { ok: true; fields: string[]; expression: string } | { ok: false; message: string };

/** Validate a standard 5-field expression (macros such as @daily are expanded). */
export function checkCron(input: string): CronCheck {
  const raw = input.trim().replace(/\s+/g, ' ');
  if (!raw) return { ok: false, message: 'Enter a cron expression, for example */5 * * * *.' };
  const expanded = CRON_MACROS[raw.toLowerCase()] ?? raw;
  const fields = expanded.split(' ');
  if (fields.length !== 5) {
    return {
      ok: false,
      message: `A standard cron expression has 5 fields (minute hour day-of-month month day-of-week), but this one has ${fields.length}.${
        fields.length === 6
          ? ' Six-field expressions with seconds (Quartz, Spring) are not supported here.'
          : ''
      }`,
    };
  }
  try {
    CronExpressionParser.parse(expanded, { currentDate: new Date(0) });
  } catch (e) {
    return { ok: false, message: e instanceof Error ? e.message : String(e) };
  }
  return { ok: true, fields, expression: expanded };
}

export function describeCron(expression: string, use24Hour: boolean): string {
  return cronstrue.toString(expression, { use24HourTimeFormat: use24Hour, verbose: false });
}

/** Next run times as Date objects, evaluated in the given IANA time zone. */
export function nextRuns(expression: string, count: number, from: Date, timeZone: string): Date[] {
  const it = CronExpressionParser.parse(expression, { currentDate: from, tz: timeZone });
  return Array.from({ length: count }, () => it.next().toDate());
}

// ---------- Visual builder ----------

export type FieldMode = 'every' | 'step' | 'specific' | 'range' | 'custom';

export interface FieldState {
  mode: FieldMode;
  step: number;
  values: number[];
  from: number;
  to: number;
  custom: string;
}

export function defaultField(def: CronFieldDef): FieldState {
  return { mode: 'every', step: 5, values: [def.min], from: def.min, to: def.max, custom: '*' };
}

const inRange = (n: number, def: CronFieldDef) =>
  Number.isInteger(n) && n >= def.min && n <= def.max;

/** Interpret one field of an expression for the builder; unusual syntax becomes "custom". */
export function parseField(text: string, def: CronFieldDef): FieldState {
  const base = { ...defaultField(def), custom: text };
  if (text === '*') return { ...base, mode: 'every' };
  let m = /^\*\/(\d+)$/.exec(text);
  if (m) {
    const step = Number(m[1]);
    if (step >= 1 && step <= def.max) return { ...base, mode: 'step', step };
  }
  m = /^(\d+)-(\d+)$/.exec(text);
  if (m) {
    const from = Number(m[1]);
    const to = Number(m[2]);
    if (inRange(from, def) && inRange(to, def) && from <= to)
      return { ...base, mode: 'range', from, to };
  }
  if (/^\d+(,\d+)*$/.test(text)) {
    const values = [...new Set(text.split(',').map(Number))].sort((a, b) => a - b);
    if (values.every((v) => inRange(v, def))) return { ...base, mode: 'specific', values };
  }
  return { ...base, mode: 'custom' };
}

export function buildField(state: FieldState): string {
  switch (state.mode) {
    case 'every':
      return '*';
    case 'step':
      return `*/${Math.max(1, Math.floor(state.step) || 1)}`;
    case 'range':
      return `${Math.min(state.from, state.to)}-${Math.max(state.from, state.to)}`;
    case 'specific':
      return state.values.length ? [...state.values].sort((a, b) => a - b).join(',') : '*';
    case 'custom':
      return state.custom.trim() || '*';
  }
}

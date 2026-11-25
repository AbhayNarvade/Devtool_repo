'use client';

import { useId, useMemo, useState } from 'react';
import { CopyButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  Checkbox,
  ErrorAlert,
  Segmented,
  ToolPanel,
} from '@/components/tool/controls';
import { useNow } from '@/lib/useNow';
import {
  CRON_FIELDS,
  CRON_PRESETS,
  buildField,
  checkCron,
  defaultField,
  describeCron,
  nextRuns,
  parseField,
  type CronFieldDef,
  type FieldMode,
  type FieldState,
} from './logic';

const SAMPLE = '30 8 * * 1-5';
const MODES: { value: FieldMode; label: string }[] = [
  { value: 'every', label: 'Every' },
  { value: 'step', label: 'Every N' },
  { value: 'range', label: 'Range' },
  { value: 'specific', label: 'Specific' },
  { value: 'custom', label: 'Custom' },
];

const numberClass =
  'h-9 w-20 rounded-lg border border-border-strong bg-card px-2 text-sm focus:border-accent';

function FieldEditor({
  def,
  value,
  onChange,
}: {
  def: CronFieldDef;
  value: string;
  onChange: (text: string) => void;
}) {
  const id = useId();
  const state = parseField(value, def);
  const set = (patch: Partial<FieldState>) => onChange(buildField({ ...state, ...patch }));
  const label = (n: number) => def.names?.[n - def.min] ?? String(n);

  return (
    <div className="grid gap-2 border-b border-border py-3 sm:grid-cols-[9rem_9rem_1fr] sm:items-center">
      <label htmlFor={`${id}-mode`} className="text-sm font-semibold">
        {def.label} <span className="font-mono font-normal text-fg-muted">({value})</span>
      </label>
      <select
        id={`${id}-mode`}
        value={state.mode}
        onChange={(e) => {
          const mode = e.target.value as FieldMode;
          const base = { ...defaultField(def), ...state, mode };
          onChange(buildField(mode === 'custom' ? { ...base, custom: value } : base));
        }}
        className="h-9 rounded-lg border border-border-strong bg-card px-2 text-sm focus:border-accent"
      >
        {MODES.map((m) => (
          <option key={m.value} value={m.value}>
            {m.label}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap items-center gap-2 text-sm">
        {state.mode === 'every' ? (
          <span className="text-fg-muted">Every {def.label.toLowerCase()}</span>
        ) : null}
        {state.mode === 'step' ? (
          <>
            <label htmlFor={`${id}-step`}>Every</label>
            <input
              id={`${id}-step`}
              type="number"
              min={1}
              max={def.max}
              value={state.step}
              onChange={(e) => set({ step: e.target.valueAsNumber })}
              className={numberClass}
            />
            <span>{def.label.toLowerCase()}s</span>
          </>
        ) : null}
        {state.mode === 'range' ? (
          <>
            <label htmlFor={`${id}-from`}>From</label>
            <select
              id={`${id}-from`}
              value={state.from}
              onChange={(e) => set({ from: Number(e.target.value) })}
              className={numberClass}
            >
              {Array.from({ length: def.max - def.min + 1 }, (_, i) => def.min + i).map((n) => (
                <option key={n} value={n}>
                  {label(n)}
                </option>
              ))}
            </select>
            <label htmlFor={`${id}-to`}>to</label>
            <select
              id={`${id}-to`}
              value={state.to}
              onChange={(e) => set({ to: Number(e.target.value) })}
              className={numberClass}
            >
              {Array.from({ length: def.max - def.min + 1 }, (_, i) => def.min + i).map((n) => (
                <option key={n} value={n}>
                  {label(n)}
                </option>
              ))}
            </select>
          </>
        ) : null}
        {state.mode === 'specific' ? (
          def.names ? (
            <div className="flex flex-wrap gap-1.5" role="group" aria-label={`${def.label} values`}>
              {def.names.map((name, i) => {
                const n = def.min + i;
                const on = state.values.includes(n);
                return (
                  <button
                    key={n}
                    type="button"
                    aria-pressed={on}
                    onClick={() => {
                      const values = on
                        ? state.values.filter((v) => v !== n)
                        : [...state.values, n];
                      set({ values: values.length ? values : [n] });
                    }}
                    className={`rounded-md border px-2 py-1 text-xs font-medium ${on ? 'border-accent bg-accent text-accent-fg' : 'border-border-strong bg-card hover:bg-bg-muted'}`}
                  >
                    {name}
                  </button>
                );
              })}
            </div>
          ) : (
            <>
              <label htmlFor={`${id}-values`}>Values</label>
              <input
                id={`${id}-values`}
                defaultValue={state.values.join(',')}
                key={value}
                onBlur={(e) => onChange(e.target.value.replace(/\s+/g, '') || String(def.min))}
                onKeyDown={(e) => {
                  if (e.key === 'Enter')
                    onChange(e.currentTarget.value.replace(/\s+/g, '') || String(def.min));
                }}
                placeholder={`e.g. ${def.min},${def.min + 15}`}
                className="h-9 w-40 rounded-lg border border-border-strong bg-card px-2 font-mono text-sm focus:border-accent"
              />
              <span className="text-xs text-fg-muted">
                {def.min}–{def.max}, comma separated
              </span>
            </>
          )
        ) : null}
        {state.mode === 'custom' ? (
          <>
            <label htmlFor={`${id}-custom`}>Field</label>
            <input
              id={`${id}-custom`}
              value={value}
              onChange={(e) => onChange(e.target.value.replace(/\s+/g, ''))}
              className="h-9 w-40 rounded-lg border border-border-strong bg-card px-2 font-mono text-sm focus:border-accent"
            />
          </>
        ) : null}
      </div>
    </div>
  );
}

export default function CronGeneratorTool() {
  const id = useId();
  const [expression, setExpression] = useState('*/15 * * * *');
  const [use24, setUse24] = useState(true);
  const [zone, setZone] = useState<'local' | 'UTC'>('local');
  const now = useNow();
  const minute = now ? Math.floor(now / 60_000) : null;

  const check = useMemo(() => checkCron(expression), [expression]);
  const fields = check.ok ? check.fields : expression.trim().split(/\s+/);
  const description = useMemo(() => {
    if (!check.ok) return null;
    try {
      return describeCron(check.expression, use24);
    } catch {
      return null;
    }
  }, [check, use24]);
  const tz =
    minute !== null
      ? zone === 'UTC'
        ? 'UTC'
        : Intl.DateTimeFormat().resolvedOptions().timeZone
      : null;
  const runs = useMemo(() => {
    if (!check.ok || minute === null || !tz) return [];
    try {
      return nextRuns(check.expression, 10, new Date(minute * 60_000), tz);
    } catch {
      return [];
    }
  }, [check, minute, tz]);
  const fmt = tz
    ? new Intl.DateTimeFormat('en-US', {
        weekday: 'short',
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: !use24,
        timeZone: tz,
        timeZoneName: 'short',
      })
    : null;

  const setField = (index: number, text: string) => {
    const next = [...(fields.length === 5 ? fields : ['*', '*', '*', '*', '*'])];
    next[index] = text || '*';
    setExpression(next.join(' '));
  };

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-0 flex-1">
          <label htmlFor={`${id}-expr`} className="mb-1 block text-sm font-semibold">
            Cron expression
          </label>
          <input
            id={`${id}-expr`}
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            spellCheck={false}
            autoComplete="off"
            aria-invalid={!check.ok}
            className="h-12 w-full rounded-lg border border-border-strong bg-card px-3 font-mono text-lg tracking-wide focus:border-accent"
          />
        </div>
        <div className="flex flex-col">
          <label htmlFor={`${id}-preset`} className="mb-1 text-sm font-medium">
            Common presets
          </label>
          <select
            id={`${id}-preset`}
            value=""
            onChange={(e) => e.target.value && setExpression(e.target.value)}
            className="h-12 rounded-lg border border-border-strong bg-card px-3 text-[0.95rem] focus:border-accent"
          >
            <option value="">Choose a preset…</option>
            {CRON_PRESETS.map((p) => (
              <option key={p.expression} value={p.expression}>
                {p.label} ({p.expression})
              </option>
            ))}
          </select>
        </div>
      </div>
      <ActionBar className="mt-3">
        <CopyButton
          text={check.ok ? check.expression : expression}
          size="sm"
          label="Copy expression"
        />
        <Button icon="file" size="sm" onClick={() => setExpression(SAMPLE)}>
          Load sample
        </Button>
        <Button icon="trash" size="sm" variant="ghost" onClick={() => setExpression('* * * * *')}>
          Reset
        </Button>
      </ActionBar>

      <div className="mt-5" aria-live="polite" data-tool-output="">
        {!check.ok ? (
          <ErrorAlert title="Invalid cron expression">{check.message}</ErrorAlert>
        ) : description ? (
          <p className="rounded-lg bg-accent-soft px-4 py-3 text-lg font-semibold text-accent-text">
            “{description}”
          </p>
        ) : null}
      </div>

      <section aria-labelledby={`${id}-builder`} className="mt-6">
        <h2 id={`${id}-builder`} className="text-base font-semibold">
          Visual builder
        </h2>
        {fields.length === 5 ? (
          CRON_FIELDS.map((def, i) => (
            <FieldEditor
              key={def.key}
              def={def}
              value={fields[i] ?? '*'}
              onChange={(t) => setField(i, t)}
            />
          ))
        ) : (
          <p className="mt-2 text-sm text-fg-muted">
            Fix the expression above to use the builder, or choose a preset.
          </p>
        )}
      </section>

      <section aria-labelledby={`${id}-runs`} className="mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id={`${id}-runs`} className="text-base font-semibold">
            Next 10 run times
          </h2>
          <div className="flex flex-wrap items-end gap-4">
            <Segmented
              label="Time zone"
              value={zone}
              onChange={setZone}
              options={[
                { value: 'local', label: 'Local' },
                { value: 'UTC', label: 'UTC' },
              ]}
            />
            <Checkbox label="24-hour clock" checked={use24} onChange={setUse24} />
          </div>
        </div>
        {runs.length && fmt ? (
          <ol className="mt-3 grid gap-1.5 font-mono text-sm sm:grid-cols-2">
            {runs.map((d) => (
              <li key={d.getTime()} className="rounded-md bg-bg-subtle px-3 py-1.5">
                {fmt.format(d)}
              </li>
            ))}
          </ol>
        ) : (
          <p className="mt-3 text-sm text-fg-muted">
            {check.ok ? 'Calculating…' : 'No run times for an invalid expression.'}
          </p>
        )}
        {tz ? (
          <p className="mt-2 text-xs text-fg-muted">
            Times shown in {tz}. Cron daemons use the time zone of the server they run on.
          </p>
        ) : null}
      </section>
    </ToolPanel>
  );
}

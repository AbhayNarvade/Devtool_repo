'use client';

import { useMemo, useState } from 'react';
import { CopyButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  ErrorAlert,
  Segmented,
  TextInput,
  ToolPanel,
} from '@/components/tool/controls';
import { useNow } from '@/lib/useNow';
import { dateTimeToMs, describeTimestamp, parseTimestamp, type TimestampUnit } from './logic';

const SAMPLE = '1767225600';

function Row({ label, value }: { label: string; value: string }) {
  return (
    <tr className="border-b border-border align-top">
      <th
        scope="row"
        className="py-2 pr-4 text-left text-sm font-medium whitespace-nowrap text-fg-muted"
      >
        {label}
      </th>
      <td className="py-2 pr-2 font-mono text-sm break-all">{value}</td>
      <td className="py-1 text-right">
        <CopyButton text={value} size="sm" label="Copy" />
      </td>
    </tr>
  );
}

export default function UnixTimestampTool() {
  const now = useNow();
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState<TimestampUnit>('auto');
  const [dateInput, setDateInput] = useState('');
  const [zone, setZone] = useState<'local' | 'UTC'>('local');

  const parsed = useMemo(() => (input.trim() ? parseTimestamp(input, unit) : null), [input, unit]);
  const details = parsed?.ok && now ? describeTimestamp(parsed.ms, now) : null;
  const fromDate = dateInput ? dateTimeToMs(dateInput, zone) : null;
  const localZone = now ? Intl.DateTimeFormat().resolvedOptions().timeZone : '';

  return (
    <ToolPanel className="space-y-8">
      <section aria-labelledby="ts-now">
        <h2 id="ts-now" className="text-sm font-semibold text-fg-muted">
          Current Unix time
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-x-6 gap-y-2">
          <p className="min-w-[11ch] font-mono text-3xl font-bold tabular-nums">
            {now ? Math.floor(now / 1000) : '—'}
          </p>
          <p className="font-mono text-sm text-fg-muted tabular-nums">{now ? `${now} ms` : ''}</p>
          <ActionBar>
            <CopyButton
              text={() => String(Math.floor(Date.now() / 1000))}
              size="sm"
              label="Copy seconds"
            />
            <Button
              size="sm"
              icon="arrowDown"
              onClick={() => setInput(String(Math.floor(Date.now() / 1000)))}
            >
              Use now
            </Button>
          </ActionBar>
        </div>
      </section>

      <section aria-labelledby="ts-to-date" className="space-y-4">
        <h2 id="ts-to-date" className="text-lg font-semibold">
          Timestamp to date
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <TextInput
            label="Unix timestamp"
            value={input}
            onChange={setInput}
            placeholder="e.g. 1767225600 or 1767225600000"
            mono
            className="w-full max-w-xs"
          />
          <Segmented
            label="Unit"
            value={unit}
            onChange={setUnit}
            options={[
              { value: 'auto', label: 'Auto' },
              { value: 's', label: 'Seconds' },
              { value: 'ms', label: 'Milliseconds' },
            ]}
          />
        </div>
        <ActionBar>
          <Button icon="file" size="sm" onClick={() => setInput(SAMPLE)}>
            Load sample
          </Button>
          <Button
            icon="trash"
            size="sm"
            variant="ghost"
            onClick={() => setInput('')}
            disabled={!input}
          >
            Clear
          </Button>
        </ActionBar>
        <div aria-live="polite" data-tool-output="">
          {parsed && !parsed.ok ? (
            <ErrorAlert title="Invalid timestamp">{parsed.message}</ErrorAlert>
          ) : null}
          {parsed?.ok && details ? (
            <table className="w-full">
              <tbody>
                <Row
                  label={`Interpreted as`}
                  value={parsed.unit === 's' ? 'Seconds' : 'Milliseconds'}
                />
                <Row label="ISO 8601 (UTC)" value={details.iso} />
                <Row label="UTC" value={details.utc} />
                <Row label={`Local (${localZone})`} value={details.local} />
                <Row label="Relative" value={details.relative} />
                <Row label="Seconds" value={String(details.seconds)} />
                <Row label="Milliseconds" value={String(details.milliseconds)} />
              </tbody>
            </table>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="date-to-ts" className="space-y-4">
        <h2 id="date-to-ts" className="text-lg font-semibold">
          Date to timestamp
        </h2>
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label htmlFor="ts-date" className="mb-1 text-sm font-medium">
              Date and time
            </label>
            <input
              id="ts-date"
              type="datetime-local"
              step={1}
              value={dateInput}
              onChange={(e) => setDateInput(e.target.value)}
              className="h-10 rounded-lg border border-border-strong bg-card px-3 text-fg focus:border-accent"
            />
          </div>
          <Segmented
            label="Interpret as"
            value={zone}
            onChange={setZone}
            options={[
              { value: 'local', label: 'Local time' },
              { value: 'UTC', label: 'UTC' },
            ]}
          />
        </div>
        {fromDate !== null ? (
          <table className="w-full" aria-live="polite">
            <tbody>
              <Row label="Seconds" value={String(Math.floor(fromDate / 1000))} />
              <Row label="Milliseconds" value={String(fromDate)} />
              <Row label="ISO 8601 (UTC)" value={new Date(fromDate).toISOString()} />
            </tbody>
          </table>
        ) : dateInput ? (
          <ErrorAlert title="Invalid date">
            This date does not exist in the chosen time zone.
          </ErrorAlert>
        ) : null}
      </section>
    </ToolPanel>
  );
}

'use client';

import { useDeferredValue, useMemo, useState } from 'react';
import { CopyButton, DownloadButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  Checkbox,
  ErrorAlert,
  InfoNote,
  TextArea,
  ToolPanel,
} from '@/components/tool/controls';
import { compareJson, diffReport, preview, type DiffKind } from './logic';

const SAMPLE_A = `{
  "id": 42,
  "name": "Starter plan",
  "price": 9.99,
  "currency": "USD",
  "features": ["5 projects", "Email support"],
  "limits": { "storageGb": 10, "users": 3 },
  "legacy": true
}`;
const SAMPLE_B = `{
  "name": "Starter plan",
  "id": 42,
  "price": 12,
  "currency": "USD",
  "features": ["5 projects", "Email support", "API access"],
  "limits": { "storageGb": "20", "users": 3 },
  "trialDays": 14
}`;

const KIND: Record<DiffKind, { label: string; className: string }> = {
  added: { label: 'Added', className: 'bg-success-soft text-success' },
  removed: { label: 'Removed', className: 'bg-danger-soft text-danger' },
  changed: { label: 'Changed', className: 'bg-warning-soft text-warning' },
  type: { label: 'Type changed', className: 'bg-accent-soft text-accent-text' },
};

export default function JsonCompareTool() {
  const [left, setLeft] = useState('');
  const [right, setRight] = useState('');
  const [ignoreArrayOrder, setIgnoreArrayOrder] = useState(false);
  const a = useDeferredValue(left);
  const b = useDeferredValue(right);

  const result = useMemo(
    () => (a.trim() && b.trim() ? compareJson(a, b, { ignoreArrayOrder }) : null),
    [a, b, ignoreArrayOrder],
  );
  const report = result?.ok ? diffReport(result.diffs) : '';

  return (
    <ToolPanel>
      <div className="mb-4">
        <Checkbox
          label="Ignore array order"
          description="Treat arrays as unordered lists (a set with duplicates)"
          checked={ignoreArrayOrder}
          onChange={setIgnoreArrayOrder}
        />
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <TextArea
          label="Original JSON"
          value={left}
          onChange={setLeft}
          placeholder="Paste the first (old) JSON"
          invalid={result?.ok === false && result.side === 'original'}
        />
        <TextArea
          label="Modified JSON"
          value={right}
          onChange={setRight}
          placeholder="Paste the second (new) JSON"
          invalid={result?.ok === false && result.side === 'modified'}
        />
      </div>
      <ActionBar className="mt-3">
        <Button
          icon="file"
          size="sm"
          onClick={() => {
            setLeft(SAMPLE_A);
            setRight(SAMPLE_B);
          }}
        >
          Load sample
        </Button>
        <Button
          icon="refresh"
          size="sm"
          onClick={() => {
            setLeft(right);
            setRight(left);
          }}
          disabled={!left && !right}
        >
          Swap sides
        </Button>
        <Button
          icon="trash"
          size="sm"
          variant="ghost"
          onClick={() => {
            setLeft('');
            setRight('');
          }}
          disabled={!left && !right}
        >
          Clear
        </Button>
      </ActionBar>

      <div className="mt-5 space-y-4" aria-live="polite" data-tool-output="">
        {result && !result.ok ? (
          <ErrorAlert title={`The ${result.side} JSON is invalid`}>
            <span className="font-medium">
              Line {result.issue.line}, column {result.issue.column}:{' '}
            </span>
            {result.issue.message}
          </ErrorAlert>
        ) : null}
        {result?.ok && result.diffs.length === 0 ? (
          <InfoNote tone="success">
            The two documents are equivalent: same data, ignoring whitespace and key order
            {ignoreArrayOrder ? ' and array order' : ''}.
          </InfoNote>
        ) : null}
        {result?.ok && result.diffs.length > 0 ? (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-semibold">
                {result.diffs.length} difference{result.diffs.length === 1 ? '' : 's'}:
              </span>
              {(Object.keys(KIND) as DiffKind[])
                .filter((k) => result.counts[k] > 0)
                .map((k) => (
                  <span
                    key={k}
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${KIND[k].className}`}
                  >
                    {result.counts[k]} {KIND[k].label.toLowerCase()}
                  </span>
                ))}
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <caption className="sr-only">Differences</caption>
                <thead>
                  <tr className="border-b border-border text-fg-muted">
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Path
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Change
                    </th>
                    <th scope="col" className="py-2 pr-3 font-medium">
                      Original
                    </th>
                    <th scope="col" className="py-2 font-medium">
                      Modified
                    </th>
                  </tr>
                </thead>
                <tbody className="font-mono">
                  {result.diffs.slice(0, 500).map((d) => (
                    <tr key={`${d.path}-${d.kind}`} className="border-b border-border align-top">
                      <td className="py-1.5 pr-3 break-all">{d.path}</td>
                      <td className="py-1.5 pr-3 font-sans">
                        <span
                          className={`rounded px-1.5 py-0.5 text-xs font-semibold whitespace-nowrap ${KIND[d.kind].className}`}
                        >
                          {KIND[d.kind].label}
                        </span>
                      </td>
                      <td className="py-1.5 pr-3 break-all">{preview(d.left)}</td>
                      <td className="py-1.5 break-all">{preview(d.right)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {result.diffs.length > 500 ? (
                <p className="mt-2 text-sm text-fg-muted">
                  Showing the first 500 differences; the report includes all of them.
                </p>
              ) : null}
            </div>
            <ActionBar>
              <CopyButton text={report} size="sm" label="Copy report" />
              <DownloadButton size="sm" getText={() => `${report}\n`} filename="json-diff.txt" />
            </ActionBar>
          </>
        ) : null}
      </div>
    </ToolPanel>
  );
}

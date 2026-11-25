'use client';

import { useMemo, useState } from 'react';
import { CopyButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  ErrorAlert,
  InfoNote,
  TextArea,
  ToolPanel,
} from '@/components/tool/controls';
import { useNow } from '@/lib/useNow';
import { decodeJwt, humanDuration } from './logic';

const SAMPLE =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImVtYWlsIjoiYWRhQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiYWRtaW4iLCJlZGl0b3IiXSwiaWF0IjoxNzY3MjI1NjAwLCJleHAiOjE3NjcyMjkyMDAsImlzcyI6Imh0dHBzOi8vYXV0aC5leGFtcGxlLmNvbSIsImF1ZCI6ImV4YW1wbGUtYXBpIn0.tQ4UspH0hzKk9wrbQcessfwOzdlX2DhGkOGuUKXMGjc';

const STATUS_STYLE = {
  valid: 'bg-success-soft text-success',
  expired: 'bg-danger-soft text-danger',
  'not-yet-valid': 'bg-warning-soft text-warning',
  'no-expiry': 'bg-bg-muted text-fg-muted',
} as const;

function JsonBlock({ title, value }: { title: string; value: unknown }) {
  const text = JSON.stringify(value, null, 2);
  return (
    <div className="min-w-0">
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <h2 className="text-sm font-semibold">{title}</h2>
        <CopyButton text={text} size="sm" label="Copy" />
      </div>
      <pre
        className="max-h-80 overflow-auto rounded-lg border border-border bg-code-bg p-3 font-mono text-sm"
        tabIndex={0}
      >
        {text}
      </pre>
    </div>
  );
}

export default function JwtDecoderTool() {
  const [input, setInput] = useState('');
  const now = useNow();
  const result = useMemo(() => (input.trim() && now ? decodeJwt(input, now) : null), [input, now]);

  return (
    <ToolPanel>
      <InfoNote tone="warning">
        <strong>Decoding only:</strong> this tool reads the token but does <strong>not</strong>{' '}
        verify its signature. Anyone can create a token with any content, so never trust a decoded
        JWT until your server has verified it with the secret or public key.
      </InfoNote>
      <div className="mt-5 flex flex-col gap-3">
        <TextArea
          label="Encoded JWT"
          value={input}
          onChange={setInput}
          rows={5}
          placeholder="Paste a token: eyJhbGciOi…  (a leading “Bearer ” is removed automatically)"
          invalid={result ? !result.ok : false}
        />
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
      </div>

      <div className="mt-5 space-y-5" aria-live="polite" data-tool-output="">
        {result && !result.ok ? (
          <ErrorAlert title="Cannot decode this token">{result.message}</ErrorAlert>
        ) : null}
        {result?.ok ? (
          <>
            <div className="flex flex-wrap items-center gap-3">
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${STATUS_STYLE[result.status]}`}
              >
                {result.status === 'valid'
                  ? `Not expired: expires in ${humanDuration(result.expiresIn ?? 0)}`
                  : result.status === 'expired'
                    ? `Expired ${humanDuration(result.expiresIn ?? 0)} ago`
                    : result.status === 'not-yet-valid'
                      ? 'Not valid yet (nbf is in the future)'
                      : 'No expiry (exp) claim'}
              </span>
              <span className="text-sm text-fg-muted">Signature not verified</span>
            </div>
            {result.warnings.map((w) => (
              <InfoNote key={w} tone="warning">
                {w}
              </InfoNote>
            ))}
            <div className="grid gap-5 lg:grid-cols-2">
              <JsonBlock title="Header" value={result.header} />
              <JsonBlock title="Payload (claims)" value={result.payload} />
            </div>
            {result.times.length ? (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <caption className="mb-2 text-left text-sm font-semibold">Time claims</caption>
                  <thead>
                    <tr className="border-b border-border text-fg-muted">
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Claim
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium">
                        Value
                      </th>
                      <th scope="col" className="py-2 pr-4 font-medium">
                        UTC (ISO 8601)
                      </th>
                      <th scope="col" className="py-2 font-medium">
                        Your time zone
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.times.map((t) => (
                      <tr key={t.claim} className="border-b border-border">
                        <td className="py-2 pr-4">{t.label}</td>
                        <td className="py-2 pr-4 font-mono">{t.seconds}</td>
                        <td className="py-2 pr-4 font-mono">{t.iso}</td>
                        <td className="py-2">{new Date(t.seconds * 1000).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : null}
            <div>
              <h2 className="mb-1.5 text-sm font-semibold">Signature (Base64URL, not verified)</h2>
              <p className="rounded-lg border border-border bg-code-bg p-3 font-mono text-sm break-all">
                {result.signature || '(empty)'}
              </p>
            </div>
          </>
        ) : null}
      </div>
    </ToolPanel>
  );
}

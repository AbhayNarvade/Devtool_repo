'use client';

import { useEffect, useId, useMemo, useState, type ReactNode } from 'react';
import type { ConvertResult } from '@/lib/convert';
import { formatBytes, utf8Length } from '@/lib/download';
import { previewText } from '@/lib/preview';
import { CopyButton, DownloadButton } from './actions';
import { ActionBar, Button, ErrorAlert, InfoNote, TextArea, ToolPanel } from './controls';
import { FileDropzone } from './FileDropzone';

export interface TextConverterProps {
  inputLabel: string;
  outputLabel: string;
  inputPlaceholder?: string;
  sample: string;
  /** Converts input to output. Recreate (useCallback) when options change. */
  convert: (input: string) => ConvertResult | Promise<ConvertResult>;
  /** Option controls rendered above the editors. */
  options?: ReactNode;
  outputFilename: string;
  outputMime?: string;
  /** Accept attribute for opening an input file (e.g. ".json,application/json"). */
  inputAccept?: string;
  inputFileLabel?: string;
  /** Debounce in ms for live conversion. */
  delay?: number;
  /** Extra content shown under the output (e.g. a success badge). */
  renderStatus?: (result: ConvertResult) => ReactNode;
}

/** Input -> output text tool with live conversion, sample, clear, open file, copy and download. */
export function TextConverter({
  inputLabel,
  outputLabel,
  inputPlaceholder,
  sample,
  convert,
  options,
  outputFilename,
  outputMime = 'text/plain',
  inputAccept,
  inputFileLabel = 'Open file',
  delay = 150,
  renderStatus,
}: TextConverterProps) {
  const id = useId();
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ConvertResult | null>(null);
  const [showOpen, setShowOpen] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);

  async function loadFile(file: File | undefined) {
    if (!file) return;
    try {
      setInput(await file.text());
      setFileError(null);
      setShowOpen(false);
    } catch {
      setFileError(`"${file.name}" could not be read as text.`);
    }
  }

  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      if (!input.trim()) {
        if (!cancelled) setResult(null);
        return;
      }
      try {
        const r = await convert(input);
        if (!cancelled) setResult(r);
      } catch (e) {
        if (!cancelled)
          setResult({
            ok: false,
            error: {
              title: 'Something went wrong',
              message: e instanceof Error ? e.message : String(e),
            },
          });
      }
    }, delay);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [input, convert, delay]);

  const output = result?.ok ? result.output : '';
  const shown = useMemo(() => previewText(output), [output]);
  const errorId = `${id}-error`;

  return (
    <ToolPanel>
      {options ? (
        <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-4">{options}</div>
      ) : null}
      <div className="grid gap-5 lg:grid-cols-2">
        <div
          className={`flex min-w-0 flex-col gap-3 rounded-lg ${dragging ? 'outline-2 outline-offset-4 outline-dashed outline-[var(--accent)]' : ''}`}
          onDragOver={(e) => {
            if (!inputAccept || !e.dataTransfer.types.includes('Files')) return;
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) setDragging(false);
          }}
          onDrop={(e) => {
            if (!inputAccept || e.dataTransfer.files.length === 0) return;
            e.preventDefault();
            setDragging(false);
            void loadFile(e.dataTransfer.files[0]);
          }}
        >
          <TextArea
            id={`${id}-in`}
            label={inputLabel}
            value={input}
            onChange={setInput}
            placeholder={
              inputAccept
                ? `${inputPlaceholder ?? ''}\n\nYou can also drop a file here.`.trim()
                : inputPlaceholder
            }
            invalid={result ? !result.ok : false}
            describedBy={result && !result.ok ? errorId : undefined}
          />
          <ActionBar>
            <Button icon="file" size="sm" onClick={() => setInput(sample)}>
              Load sample
            </Button>
            {inputAccept ? (
              <Button
                icon="upload"
                size="sm"
                onClick={() => setShowOpen((s) => !s)}
                aria-expanded={showOpen}
              >
                {inputFileLabel}
              </Button>
            ) : null}
            <Button
              icon="trash"
              size="sm"
              variant="ghost"
              onClick={() => setInput('')}
              disabled={!input}
            >
              Clear
            </Button>
            {input ? (
              <span className="ml-auto text-xs text-fg-muted">
                {formatBytes(utf8Length(input))}
              </span>
            ) : null}
          </ActionBar>
          {inputAccept && showOpen ? (
            <FileDropzone
              compact
              accept={inputAccept}
              label="Choose file"
              onFiles={([file]) => void loadFile(file)}
            />
          ) : null}
          {fileError ? <ErrorAlert title="File could not be opened">{fileError}</ErrorAlert> : null}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          <TextArea
            id={`${id}-out`}
            label={outputLabel}
            value={shown.text}
            readOnly
            placeholder="Output appears here as you type."
          />
          {shown.truncated ? (
            <p className="text-sm text-fg-muted">
              The output is large, so the box shows the beginning only to keep the page fast. Copy
              and Download include the complete output.
            </p>
          ) : null}
          <ActionBar>
            <CopyButton text={output} size="sm" disabled={!output} label="Copy output" />
            <DownloadButton
              size="sm"
              getText={() => output}
              filename={outputFilename}
              mime={outputMime}
              disabled={!output}
            />
            {output ? (
              <span className="ml-auto text-xs text-fg-muted">
                {formatBytes(utf8Length(output))}
              </span>
            ) : null}
          </ActionBar>
        </div>
      </div>

      <div className="mt-4 space-y-2" aria-live="polite">
        {result && !result.ok ? (
          <div id={errorId}>
            <ErrorAlert title={result.error.title}>
              {result.error.line ? (
                <span className="font-medium">
                  Line {result.error.line}
                  {result.error.column ? `, column ${result.error.column}` : ''}:{' '}
                </span>
              ) : null}
              {result.error.message}
            </ErrorAlert>
          </div>
        ) : null}
        {result?.ok && result.info ? <InfoNote tone="success">{result.info}</InfoNote> : null}
        {result?.ok && result.warnings?.length
          ? result.warnings.map((w) => (
              <InfoNote key={w} tone="warning">
                {w}
              </InfoNote>
            ))
          : null}
        {result && renderStatus ? renderStatus(result) : null}
      </div>
    </ToolPanel>
  );
}

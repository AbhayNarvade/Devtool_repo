'use client';

import { useMemo, useState } from 'react';
import { CopyButton, DownloadButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  ErrorAlert,
  InfoNote,
  PrivacyNote,
  TextArea,
  ToolPanel,
} from '@/components/tool/controls';
import { FileDropzone } from '@/components/tool/FileDropzone';
import { formatBytes } from '@/lib/download';
import { decodeBase64, suggestFilename } from './logic';

const SAMPLE = 'eyJ1c2VyIjoibWFyaWEiLCJyb2xlIjoiZWRpdG9yIiwibm90ZSI6IkNhZsOpIOKYlSJ9';

export default function Base64DecodeTool() {
  const [input, setInput] = useState('');
  const [showOpen, setShowOpen] = useState(false);
  const result = useMemo(() => (input.trim() ? decodeBase64(input) : null), [input]);

  const imageUrl = useMemo(() => {
    if (!result?.ok || !result.file?.mime.startsWith('image/')) return null;
    return `data:${result.file.mime};base64,${input
      .trim()
      .replace(/^data:[^,]*,/, '')
      .replace(/\s+/g, '')
      .replace(/-/g, '+')
      .replace(/_/g, '/')}`;
  }, [result, input]);

  return (
    <ToolPanel>
      <div className="grid gap-5 lg:grid-cols-2">
        <div className="flex min-w-0 flex-col gap-3">
          <TextArea
            label="Base64 input"
            value={input}
            onChange={setInput}
            placeholder="Paste Base64, URL-safe Base64 or a data: URL"
            invalid={result ? !result.ok : false}
          />
          <ActionBar>
            <Button icon="file" size="sm" onClick={() => setInput(SAMPLE)}>
              Load sample
            </Button>
            <Button
              icon="upload"
              size="sm"
              onClick={() => setShowOpen((s) => !s)}
              aria-expanded={showOpen}
            >
              Open text file
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
          {showOpen ? (
            <FileDropzone
              compact
              accept=".txt,.b64,.base64,text/plain"
              label="Choose file"
              onFiles={async ([f]) => {
                if (!f) return;
                setInput(await f.text());
                setShowOpen(false);
              }}
            />
          ) : null}
        </div>

        <div className="flex min-w-0 flex-col gap-3" aria-live="polite">
          {result?.ok && result.text !== null ? (
            <>
              <TextArea label="Decoded text (UTF-8)" value={result.text} readOnly mono />
              <ActionBar>
                <CopyButton text={result.text} size="sm" label="Copy text" />
                <DownloadButton
                  size="sm"
                  getText={() => result.text ?? ''}
                  filename={suggestFilename(result)}
                />
                <span className="ml-auto text-xs text-fg-muted">
                  {formatBytes(result.bytes.length)}
                </span>
              </ActionBar>
            </>
          ) : result?.ok ? (
            <div className="flex flex-col gap-3">
              <p className="text-sm font-semibold">Decoded file</p>
              <InfoNote>
                {result.file
                  ? `This looks like a ${result.file.label}`
                  : 'This is binary data, not readable UTF-8 text'}{' '}
                ({formatBytes(result.bytes.length)}). Download it to open it with the right app.
              </InfoNote>
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={imageUrl}
                  alt="Preview of the decoded image"
                  width={320}
                  height={240}
                  className="max-h-60 w-auto rounded-lg border border-border bg-bg-subtle object-contain"
                />
              ) : null}
              <ActionBar>
                <DownloadButton
                  size="sm"
                  variant="primary"
                  label="Download file"
                  getBlob={() =>
                    new Blob([result.bytes as Uint8Array<ArrayBuffer>], {
                      type: result.file?.mime ?? result.mime ?? 'application/octet-stream',
                    })
                  }
                  filename={suggestFilename(result)}
                />
              </ActionBar>
            </div>
          ) : (
            <TextArea
              label="Decoded output"
              value=""
              readOnly
              placeholder="Decoded text appears here as you type."
            />
          )}
          <PrivacyNote />
        </div>
      </div>
      {result && !result.ok ? (
        <div className="mt-4">
          <ErrorAlert title="Invalid Base64">{result.message}</ErrorAlert>
        </div>
      ) : null}
      {result?.ok && result.urlSafe ? (
        <div className="mt-4">
          <InfoNote>
            URL-safe Base64 detected (- and _ characters) and decoded automatically.
          </InfoNote>
        </div>
      ) : null}
    </ToolPanel>
  );
}

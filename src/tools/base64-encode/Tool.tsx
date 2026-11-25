'use client';

import { useCallback, useState } from 'react';
import { CopyButton, DownloadButton } from '@/components/tool/actions';
import {
  ActionBar,
  Checkbox,
  ErrorAlert,
  InfoNote,
  PrivacyNote,
  Segmented,
  TextArea,
  ToolPanel,
} from '@/components/tool/controls';
import { FileDropzone } from '@/components/tool/FileDropzone';
import { TextConverter } from '@/components/tool/TextConverter';
import { formatBytes } from '@/lib/download';
import { encodeBase64, fileToBase64Output } from './logic';

const SAMPLE = 'Hello, world! Grüße aus München 👋';
const PREVIEW_LIMIT = 200_000;

function readAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error ?? new Error('Could not read the file'));
    reader.readAsDataURL(file);
  });
}

function FileMode({ urlSafe }: { urlSafe: boolean }) {
  const [file, setFile] = useState<{
    name: string;
    size: number;
    type: string;
    base64: string;
  } | null>(null);
  const [asDataUrl, setAsDataUrl] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const output = file
    ? fileToBase64Output(file.base64, file.type, asDataUrl, urlSafe && !asDataUrl)
    : '';
  const preview = output.length > PREVIEW_LIMIT ? `${output.slice(0, PREVIEW_LIMIT)}…` : output;

  return (
    <div className="space-y-4">
      <FileDropzone
        acceptPaste
        label="Choose a file to encode"
        hint="Any file type. Large files (over ~50 MB) may be slow."
        onFiles={async ([f]) => {
          if (!f) return;
          setBusy(true);
          setError(null);
          try {
            // FileReader encodes natively and asynchronously, so big files do not freeze the page.
            const dataUrl = await readAsDataUrl(f);
            setFile({
              name: f.name,
              size: f.size,
              type: f.type,
              base64: dataUrl.slice(dataUrl.indexOf(',') + 1),
            });
          } catch (e) {
            setError(e instanceof Error ? e.message : 'Could not read the file');
          } finally {
            setBusy(false);
          }
        }}
      />
      <PrivacyNote />
      {busy ? <p role="status">Reading file…</p> : null}
      {error ? <ErrorAlert title="File could not be read">{error}</ErrorAlert> : null}
      {file ? (
        <>
          <InfoNote tone="success">
            <strong>{file.name}</strong> ({formatBytes(file.size)}
            {file.type ? `, ${file.type}` : ''}) encoded to {formatBytes(output.length)} of Base64
            text.
          </InfoNote>
          <Checkbox
            label="Output as data URL"
            description="data:<type>;base64,… for use in HTML or CSS"
            checked={asDataUrl}
            onChange={setAsDataUrl}
          />
          <TextArea label="Base64 output" value={preview} readOnly rows={10} />
          {output.length > PREVIEW_LIMIT ? (
            <p className="text-sm text-fg-muted">
              Preview shortened to keep the page fast. Copy and Download include the full output.
            </p>
          ) : null}
          <ActionBar>
            <CopyButton text={output} size="sm" label="Copy Base64" />
            <DownloadButton size="sm" getText={() => output} filename={`${file.name}.base64.txt`} />
          </ActionBar>
        </>
      ) : null}
    </div>
  );
}

export default function Base64EncodeTool() {
  const [source, setSource] = useState<'text' | 'file'>('text');
  const [urlSafe, setUrlSafe] = useState(false);
  const [wrap, setWrap] = useState(false);
  const convert = useCallback(
    (input: string) => encodeBase64(input, { urlSafe, wrap }),
    [urlSafe, wrap],
  );

  const sourceSwitch = (
    <Segmented
      label="Encode"
      value={source}
      onChange={setSource}
      options={[
        { value: 'text', label: 'Text' },
        { value: 'file', label: 'File' },
      ]}
    />
  );
  const urlSafeBox = (
    <Checkbox label="URL-safe (- and _ , no padding)" checked={urlSafe} onChange={setUrlSafe} />
  );

  if (source === 'file') {
    return (
      <ToolPanel>
        <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-4">
          {sourceSwitch}
          {urlSafeBox}
        </div>
        <FileMode urlSafe={urlSafe} />
      </ToolPanel>
    );
  }
  return (
    <TextConverter
      inputLabel="Text to encode"
      outputLabel="Base64 output"
      inputPlaceholder="Type or paste text; it is encoded as UTF-8"
      sample={SAMPLE}
      convert={convert}
      outputFilename="encoded.base64.txt"
      options={
        <>
          {sourceSwitch}
          {urlSafeBox}
          <Checkbox label="Wrap lines at 76 characters" checked={wrap} onChange={setWrap} />
        </>
      }
    />
  );
}

'use client';

import { useEffect, useRef, useState } from 'react';
import { CopyButton } from '@/components/tool/actions';
import {
  ActionBar,
  Button,
  Checkbox,
  ErrorAlert,
  InfoNote,
  PrivacyNote,
  Segmented,
  TextArea,
  TextInput,
  ToolPanel,
} from '@/components/tool/controls';
import { FileDropzone } from '@/components/tool/FileDropzone';
import { formatBytes } from '@/lib/download';
import { HASH_ALGORITHMS, findMatch, hashText, type HashAlgorithm } from './logic';

const SAMPLE = 'The quick brown fox jumps over the lazy dog';
type Results = Partial<Record<HashAlgorithm, string>>;

export default function HashGeneratorTool() {
  const [source, setSource] = useState<'text' | 'file'>('text');
  const [text, setText] = useState('');
  const [algorithms, setAlgorithms] = useState<HashAlgorithm[]>([...HASH_ALGORITHMS]);
  const [uppercase, setUppercase] = useState(false);
  const [expected, setExpected] = useState('');
  const [textResults, setTextResults] = useState<Results>({});
  const [file, setFile] = useState<{ name: string; size: number } | null>(null);
  const [fileResults, setFileResults] = useState<Results>({});
  const [progress, setProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const workerRef = useRef<Worker | null>(null);
  const fileRef = useRef<File | null>(null);
  const jobRef = useRef(0);

  useEffect(() => () => workerRef.current?.terminate(), []);

  // Text hashing (fast, main thread, debounced).
  useEffect(() => {
    let cancelled = false;
    const handle = setTimeout(async () => {
      const r = source === 'text' && text ? await hashText(text, algorithms) : {};
      if (!cancelled) setTextResults(r);
    }, 120);
    return () => {
      cancelled = true;
      clearTimeout(handle);
    };
  }, [text, algorithms, source]);

  function hashFile(f: File) {
    fileRef.current = f;
    workerRef.current?.terminate();
    const worker = new Worker(new URL('./worker.ts', import.meta.url), { type: 'module' });
    workerRef.current = worker;
    const id = ++jobRef.current;
    setFile({ name: f.name, size: f.size });
    setFileResults({});
    setError(null);
    setProgress(0);
    worker.onmessage = (e: MessageEvent) => {
      const msg = e.data as
        | { id: number; type: 'progress'; done: number; total: number }
        | { id: number; type: 'done'; results: Results }
        | { id: number; type: 'error'; message: string };
      if (msg.id !== jobRef.current) return;
      if (msg.type === 'progress') setProgress(msg.total ? msg.done / msg.total : 1);
      else if (msg.type === 'done') {
        setFileResults(msg.results);
        setProgress(null);
      } else {
        setError(msg.message);
        setProgress(null);
      }
    };
    worker.onerror = () => {
      setError(
        'Hashing failed. The file may be too large for the memory available in this browser.',
      );
      setProgress(null);
    };
    worker.postMessage({ id, file: f, algorithms });
  }

  // Re-hash the current file when the algorithm selection changes (otherwise newly ticked
  // algorithms would show nothing until the file is chosen again).
  const algorithmsKey = algorithms.join(',');
  const hashFileRef = useRef(hashFile);
  useEffect(() => {
    hashFileRef.current = hashFile;
  });
  useEffect(() => {
    if (source !== 'file' || !fileRef.current || !algorithmsKey) return;
    const handle = setTimeout(() => fileRef.current && hashFileRef.current(fileRef.current), 150);
    return () => clearTimeout(handle);
  }, [algorithmsKey, source]);

  const results = source === 'text' ? textResults : fileResults;
  const shown = algorithms.filter((a) => results[a]);
  const match = expected.trim() ? findMatch(results, expected) : null;

  return (
    <ToolPanel>
      <div className="flex flex-wrap items-end gap-x-6 gap-y-4">
        <Segmented
          label="Hash"
          value={source}
          onChange={setSource}
          options={[
            { value: 'text', label: 'Text' },
            { value: 'file', label: 'File' },
          ]}
        />
        <fieldset>
          <legend className="mb-1 text-sm font-medium">Algorithms</legend>
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {HASH_ALGORITHMS.map((a) => (
              <Checkbox
                key={a}
                label={a}
                checked={algorithms.includes(a)}
                onChange={(on) =>
                  setAlgorithms((cur) =>
                    on
                      ? HASH_ALGORITHMS.filter((x) => x === a || cur.includes(x))
                      : cur.filter((x) => x !== a),
                  )
                }
              />
            ))}
          </div>
        </fieldset>
        <Checkbox label="Uppercase hex" checked={uppercase} onChange={setUppercase} />
      </div>

      <div className="mt-5">
        {source === 'text' ? (
          <div className="flex flex-col gap-3">
            <TextArea
              label="Text to hash (UTF-8)"
              value={text}
              onChange={setText}
              rows={6}
              mono={false}
            />
            <ActionBar>
              <Button icon="file" size="sm" onClick={() => setText(SAMPLE)}>
                Load sample
              </Button>
              <Button
                icon="trash"
                size="sm"
                variant="ghost"
                onClick={() => setText('')}
                disabled={!text}
              >
                Clear
              </Button>
            </ActionBar>
          </div>
        ) : (
          <div className="space-y-3">
            <FileDropzone
              acceptPaste
              label="Choose a file to hash"
              hint="Any file type. Hashing runs in a background thread."
              onFiles={([f]) => f && hashFile(f)}
            />
            <PrivacyNote />
            {file ? (
              <p className="text-sm">
                <strong>{file.name}</strong> ({formatBytes(file.size)})
                {progress !== null ? ` · hashing ${Math.round(progress * 100)}%` : ''}
              </p>
            ) : null}
            {progress !== null ? (
              <progress
                className="h-2 w-full accent-[var(--accent)]"
                value={progress}
                max={1}
                aria-label="Hashing progress"
              />
            ) : null}
            {error ? <ErrorAlert title="Could not hash the file">{error}</ErrorAlert> : null}
          </div>
        )}
      </div>

      {algorithms.length === 0 ? (
        <div className="mt-5">
          <InfoNote>Select at least one algorithm.</InfoNote>
        </div>
      ) : null}

      {shown.length ? (
        <div className="mt-6 overflow-x-auto" aria-live="polite" data-tool-output="">
          <table className="w-full text-left">
            <caption className="sr-only">Hash results</caption>
            <tbody>
              {shown.map((a) => {
                const value = uppercase ? results[a]!.toUpperCase() : results[a]!;
                return (
                  <tr
                    key={a}
                    className={`border-b border-border align-top ${match === a ? 'bg-success-soft' : ''}`}
                  >
                    <th scope="row" className="py-2.5 pr-4 text-sm font-semibold whitespace-nowrap">
                      {a}
                    </th>
                    <td className="py-2.5 pr-2 font-mono text-sm break-all">{value}</td>
                    <td className="py-1.5 text-right">
                      <CopyButton text={value} size="sm" label="Copy" />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : null}

      <div className="mt-6 max-w-2xl space-y-2">
        <TextInput
          label="Verify: paste an expected hash (optional)"
          value={expected}
          onChange={setExpected}
          mono
        />
        {expected.trim() && shown.length ? (
          match ? (
            <InfoNote tone="success">Match: the {match} hash is identical.</InfoNote>
          ) : (
            <InfoNote tone="warning">No match with any of the calculated hashes.</InfoNote>
          )
        ) : null}
      </div>
    </ToolPanel>
  );
}

'use client';

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { downloadBlob, formatBytes } from '@/lib/download';
import { savingsPercent, uniqueNames } from '@/lib/image/formats';
import { useToast } from '../ui/Toast';
import { ActionBar, Button, ErrorAlert, PrivacyNote, ToolPanel } from './controls';
import { FileDropzone } from './FileDropzone';

export interface BatchOutput {
  blob: Blob;
  name: string;
  width?: number;
  height?: number;
  /** Short note shown under the result (e.g. "Original kept: already optimized"). */
  note?: string;
}

interface Item {
  id: number;
  file: File;
  preview: string;
  status: 'queued' | 'working' | 'done' | 'error';
  /** Settings key the current result (or error) belongs to. */
  doneKey?: string;
  result?: BatchOutput & { url: string };
  error?: string;
}

export interface ImageBatchProps {
  accept: string;
  /** Text under the drop button, e.g. "PNG, JPG or WebP". */
  hint: string;
  /** Converts one file. Must be stable or change together with `settingsKey`. */
  process: (file: File) => Promise<BatchOutput>;
  /** Changing this re-processes every image with the new settings. */
  settingsKey: string;
  options?: ReactNode;
  /** Creates a sample input file for "Load sample". */
  sample: () => Promise<File>;
  zipName: string;
  /** Past-tense verb for the summary: "compressed", "converted", "resized". */
  verb: string;
  /** Show size savings (compression) rather than just sizes. */
  emphasizeSavings?: boolean;
  /** Extra notes shown above the results (limitations, browser support). */
  notes?: ReactNode;
}

/** Drag-and-drop batch image processor with per-file results, savings and ZIP download. */
export function ImageBatch({
  accept,
  hint,
  process,
  settingsKey,
  options,
  sample,
  zipName,
  verb,
  emphasizeSavings = false,
  notes,
}: ImageBatchProps) {
  const toast = useToast();
  const [items, setItems] = useState<Item[]>([]);
  const [zipping, setZipping] = useState(false);
  const [sampleError, setSampleError] = useState<string | null>(null);
  const nextId = useRef(0);
  const itemsRef = useRef(items);
  const keyRef = useRef(settingsKey);
  const processRef = useRef(process);
  const running = useRef(false);

  useEffect(() => {
    itemsRef.current = items;
    keyRef.current = settingsKey;
    processRef.current = process;
  });

  /** Process queued items one at a time with the latest settings. */
  const pump = useCallback(async () => {
    if (running.current) return;
    running.current = true;
    try {
      for (;;) {
        const key = keyRef.current;
        const next = itemsRef.current.find((i) => i.doneKey !== key && i.status !== 'working');
        if (!next) break;
        setItems((list) => list.map((i) => (i.id === next.id ? { ...i, status: 'working' } : i)));
        let update: Partial<Item>;
        try {
          const out = await processRef.current(next.file);
          update = {
            status: 'done',
            doneKey: key,
            error: undefined,
            result: { ...out, url: URL.createObjectURL(out.blob) },
          };
        } catch (e) {
          update = {
            status: 'error',
            doneKey: key,
            result: undefined,
            error: e instanceof Error ? e.message : String(e),
          };
        }
        setItems((list) =>
          list.map((i) => {
            if (i.id !== next.id) {
              return i;
            }
            if (i.result) URL.revokeObjectURL(i.result.url);
            return { ...i, ...update };
          }),
        );
        // Let React commit so itemsRef reflects the update before picking the next item.
        await new Promise((r) => setTimeout(r, 0));
        // The item may have been removed while it was being processed.
        if (update.result && !itemsRef.current.some((i) => i.id === next.id))
          URL.revokeObjectURL(update.result.url);
      }
    } finally {
      running.current = false;
    }
  }, []);

  // Re-run when files are added or settings change (debounced while sliders move).
  useEffect(() => {
    const handle = setTimeout(() => void pump(), 250);
    return () => clearTimeout(handle);
  }, [items.length, settingsKey, pump]);

  // Free object URLs when the tool unmounts.
  useEffect(
    () => () => {
      for (const i of itemsRef.current) {
        URL.revokeObjectURL(i.preview);
        if (i.result) URL.revokeObjectURL(i.result.url);
      }
    },
    [],
  );

  const addFiles = (files: File[]) => {
    setSampleError(null);
    setItems((list) => [
      ...list,
      ...files.map((file) => ({
        id: ++nextId.current,
        file,
        preview: URL.createObjectURL(file),
        status: 'queued' as const,
      })),
    ]);
  };

  const remove = (id: number) =>
    setItems((list) =>
      list.filter((i) => {
        if (i.id !== id) return true;
        URL.revokeObjectURL(i.preview);
        if (i.result) URL.revokeObjectURL(i.result.url);
        return false;
      }),
    );

  const clearAll = () => {
    for (const i of items) {
      URL.revokeObjectURL(i.preview);
      if (i.result) URL.revokeObjectURL(i.result.url);
    }
    setItems([]);
  };

  const done = items.filter((i) => i.status === 'done' && i.result);
  const working = items.some((i) => i.status === 'working' || i.doneKey !== settingsKey);
  const before = done.reduce((s, i) => s + i.file.size, 0);
  const after = done.reduce((s, i) => s + (i.result?.blob.size ?? 0), 0);

  async function downloadZip() {
    setZipping(true);
    try {
      const { default: JSZip } = await import('jszip');
      const zip = new JSZip();
      const names = uniqueNames(done.map((i) => i.result!.name));
      done.forEach((i, n) => zip.file(names[n]!, i.result!.blob));
      downloadBlob(await zip.generateAsync({ type: 'blob' }), zipName);
    } catch {
      toast('Could not create the ZIP file', 'error');
    } finally {
      setZipping(false);
    }
  }

  return (
    <ToolPanel>
      {options ? (
        <div className="mb-5 flex flex-wrap items-end gap-x-6 gap-y-4">{options}</div>
      ) : null}
      <FileDropzone
        multiple
        acceptPaste
        accept={accept}
        label="Choose images"
        hint={hint}
        onFiles={addFiles}
      />
      <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
        <PrivacyNote />
        <ActionBar>
          <Button
            icon="file"
            size="sm"
            onClick={async () => {
              try {
                addFiles([await sample()]);
              } catch (e) {
                setSampleError(e instanceof Error ? e.message : String(e));
              }
            }}
          >
            Load sample
          </Button>
          <Button
            icon="trash"
            size="sm"
            variant="ghost"
            onClick={clearAll}
            disabled={!items.length}
          >
            Clear all
          </Button>
        </ActionBar>
      </div>
      {sampleError ? (
        <div className="mt-3">
          <ErrorAlert title="Sample not available">{sampleError}</ErrorAlert>
        </div>
      ) : null}
      {notes ? <div className="mt-4 space-y-2">{notes}</div> : null}

      {items.length ? (
        <div className="mt-6" data-tool-output="">
          <p className="mb-3 text-sm font-semibold" aria-live="polite">
            {working
              ? `Processing… ${done.length} of ${items.length} ${verb}`
              : `${done.length} of ${items.length} image${items.length === 1 ? '' : 's'} ${verb}`}
            {done.length && emphasizeSavings
              ? ` · ${formatBytes(before)} → ${formatBytes(after)} (${savingsPercent(before, after) >= 0 ? `${savingsPercent(before, after)}% smaller` : `${-savingsPercent(before, after)}% larger`})`
              : ''}
          </p>
          <ul className="divide-y divide-border rounded-xl border border-border">
            {items.map((item) => {
              const pct = item.result ? savingsPercent(item.file.size, item.result.blob.size) : 0;
              return (
                <li key={item.id} className="flex flex-wrap items-center gap-3 p-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.result?.url ?? item.preview}
                    alt={`Preview of ${item.file.name}`}
                    width={56}
                    height={56}
                    className="h-14 w-14 shrink-0 rounded-md border border-border bg-[repeating-conic-gradient(var(--bg-muted)_0%_25%,var(--bg)_0%_50%)] bg-[length:12px_12px] object-contain"
                  />
                  <div className="min-w-0 flex-1">
                    <p
                      className="truncate text-sm font-medium"
                      title={item.result?.name ?? item.file.name}
                    >
                      {item.result?.name ?? item.file.name}
                    </p>
                    <p className="text-xs text-fg-muted">
                      {formatBytes(item.file.size)}
                      {item.result ? ` → ${formatBytes(item.result.blob.size)}` : ''}
                      {item.result?.width
                        ? ` · ${item.result.width} × ${item.result.height}px`
                        : ''}
                      {item.status === 'working' ||
                      (item.status !== 'error' && item.doneKey !== settingsKey)
                        ? ' · processing…'
                        : ''}
                    </p>
                    {item.result?.note ? (
                      <p className="text-xs text-fg-muted">{item.result.note}</p>
                    ) : null}
                    {item.status === 'error' ? (
                      <p className="text-xs text-danger">{item.error}</p>
                    ) : null}
                  </div>
                  {item.result && emphasizeSavings ? (
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-semibold ${pct > 0 ? 'bg-success-soft text-success' : 'bg-bg-muted text-fg-muted'}`}
                    >
                      {pct > 0 ? `−${pct}%` : pct === 0 ? '0%' : `+${-pct}%`}
                    </span>
                  ) : null}
                  <div className="flex items-center gap-1">
                    {item.result ? (
                      <Button
                        size="sm"
                        icon="download"
                        onClick={() => downloadBlob(item.result!.blob, item.result!.name)}
                        aria-label={`Download ${item.result.name}`}
                      >
                        Download
                      </Button>
                    ) : null}
                    <Button
                      size="sm"
                      variant="ghost"
                      icon="close"
                      onClick={() => remove(item.id)}
                      aria-label={`Remove ${item.file.name}`}
                    >
                      <span className="sr-only">Remove</span>
                    </Button>
                  </div>
                </li>
              );
            })}
          </ul>
          {done.length > 1 ? (
            <ActionBar className="mt-4">
              <Button
                variant="primary"
                icon="download"
                onClick={downloadZip}
                disabled={zipping || working}
              >
                {zipping ? 'Creating ZIP…' : `Download all (${done.length}) as ZIP`}
              </Button>
            </ActionBar>
          ) : null}
        </div>
      ) : null}
    </ToolPanel>
  );
}

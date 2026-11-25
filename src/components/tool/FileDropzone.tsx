'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { UiIcon } from '../Icon';

interface FileDropzoneProps {
  onFiles: (files: File[]) => void;
  /** input accept attribute, e.g. "image/png,image/jpeg" or ".json,application/json" */
  accept?: string;
  multiple?: boolean;
  label?: string;
  hint?: string;
  /** Also accept files pasted with Ctrl/Cmd+V anywhere on the page. */
  acceptPaste?: boolean;
  compact?: boolean;
}

function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;
  const rules = accept.split(',').map((r) => r.trim().toLowerCase());
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((r) =>
    r.startsWith('.')
      ? name.endsWith(r)
      : r.endsWith('/*')
        ? type.startsWith(r.slice(0, -1))
        : type === r,
  );
}

/** Drag-and-drop area + file picker (keyboard accessible) + optional paste support. */
export function FileDropzone({
  onFiles,
  accept,
  multiple = false,
  label = 'Choose a file',
  hint,
  acceptPaste = false,
  compact = false,
}: FileDropzoneProps) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [rejected, setRejected] = useState<string | null>(null);
  const onFilesRef = useRef(onFiles);
  useEffect(() => {
    onFilesRef.current = onFiles;
  }, [onFiles]);

  const handle = (list: FileList | File[] | null) => {
    if (!list) return;
    const all = Array.from(list);
    const ok = all.filter((f) => matchesAccept(f, accept));
    const picked = multiple ? ok : ok.slice(0, 1);
    setRejected(
      all.length > ok.length
        ? `${all.length - ok.length} file(s) skipped because the type is not supported.`
        : null,
    );
    if (picked.length) onFilesRef.current(picked);
  };
  const handleRef = useRef(handle);
  useEffect(() => {
    handleRef.current = handle;
  });

  useEffect(() => {
    if (!acceptPaste) return;
    const onPaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA')) return;
      const files = e.clipboardData?.files;
      if (files && files.length) {
        e.preventDefault();
        handleRef.current(files);
      }
    };
    document.addEventListener('paste', onPaste);
    return () => document.removeEventListener('paste', onPaste);
  }, [acceptPaste]);

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragging(false);
          handle(e.dataTransfer.files);
        }}
        className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-colors ${
          compact ? 'gap-2 p-4' : 'gap-3 p-8 sm:p-10'
        } ${dragging ? 'border-accent bg-accent-soft' : 'border-border-strong bg-bg-subtle'}`}
      >
        {!compact ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-accent-soft text-accent-text">
            <UiIcon name="upload" className="h-6 w-6" />
          </span>
        ) : null}
        <div>
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="rounded-lg bg-accent px-4 py-2 font-semibold text-accent-fg hover:bg-accent-hover"
          >
            {label}
          </button>
          <p className="mt-2 text-sm text-fg-muted">
            or drag and drop {multiple ? 'files' : 'a file'} here{acceptPaste ? ', or paste' : ''}
          </p>
          {hint ? <p className="mt-1 text-xs text-fg-muted">{hint}</p> : null}
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          tabIndex={-1}
          aria-hidden="true"
          onChange={(e) => {
            handle(e.target.files);
            e.target.value = '';
          }}
        />
      </div>
      {rejected ? (
        <p role="status" className="mt-2 text-sm text-warning">
          {rejected}
        </p>
      ) : null}
    </div>
  );
}

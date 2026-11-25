'use client';

import { downloadBlob, downloadText } from '@/lib/download';
import { useToast } from '../ui/Toast';
import { Button } from './controls';

/** Copies text to the clipboard and confirms with a toast. */
export function CopyButton({
  text,
  label = 'Copy',
  disabled,
  size,
  variant = 'secondary',
}: {
  text: string | (() => string);
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary';
}) {
  const toast = useToast();
  return (
    <Button
      icon="copy"
      size={size}
      variant={variant}
      disabled={disabled}
      onClick={async () => {
        const value = typeof text === 'function' ? text() : text;
        try {
          await navigator.clipboard.writeText(value);
          toast('Copied to clipboard');
        } catch {
          toast('Copy failed: your browser blocked clipboard access', 'error');
        }
      }}
    >
      {label}
    </Button>
  );
}

export function DownloadButton({
  getText,
  getBlob,
  filename,
  mime = 'text/plain',
  label = 'Download',
  disabled,
  size,
  variant = 'secondary',
}: {
  getText?: () => string;
  getBlob?: () => Blob | Promise<Blob>;
  filename: string | (() => string);
  mime?: string;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  variant?: 'primary' | 'secondary';
}) {
  const toast = useToast();
  return (
    <Button
      icon="download"
      size={size}
      variant={variant}
      disabled={disabled}
      onClick={async () => {
        const name = typeof filename === 'function' ? filename() : filename;
        try {
          if (getBlob) downloadBlob(await getBlob(), name);
          else if (getText) downloadText(getText(), name, mime);
        } catch {
          toast('Download failed', 'error');
        }
      }}
    >
      {label}
    </Button>
  );
}

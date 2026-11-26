'use client';

import { useCallback, useEffect, useRef } from 'react';
import { render, type RenderTask } from './render';

type Pending = {
  file: Blob;
  task: RenderTask;
  resolve: (r: RenderResult) => void;
  reject: (e: Error) => void;
};
export interface RenderResult {
  blob: Blob;
  width: number;
  height: number;
}

const workerSupported = () =>
  typeof Worker !== 'undefined' &&
  typeof OffscreenCanvas !== 'undefined' &&
  'convertToBlob' in OffscreenCanvas.prototype;

/**
 * Runs image jobs in a dedicated Web Worker so large batches never block the page.
 * Falls back to the main thread when workers with OffscreenCanvas are unavailable, or if the
 * worker fails to start (jobs that were waiting are re-run on the main thread).
 */
export class ImageProcessor {
  private worker: Worker | null = null;
  private workerBroken = false;
  private nextId = 0;
  private pending = new Map<number, Pending>();

  private getWorker(): Worker | null {
    if (this.workerBroken || !workerSupported()) return null;
    if (!this.worker) {
      const worker = new Worker(new URL('./image.worker.ts', import.meta.url), { type: 'module' });
      worker.onmessage = (e: MessageEvent) => {
        const msg = e.data as {
          id: number;
          ok: boolean;
          blob?: Blob;
          width?: number;
          height?: number;
          message?: string;
        };
        const p = this.pending.get(msg.id);
        if (!p) return;
        this.pending.delete(msg.id);
        if (msg.ok && msg.blob)
          p.resolve({ blob: msg.blob, width: msg.width ?? 0, height: msg.height ?? 0 });
        else p.reject(new Error(msg.message ?? 'The image could not be processed.'));
      };
      worker.onerror = (event) => {
        event.preventDefault();
        worker.terminate();
        this.worker = null;
        this.workerBroken = true;
        const waiting = [...this.pending.values()];
        this.pending.clear();
        for (const p of waiting) render(p.file, p.task).then(p.resolve, p.reject);
      };
      this.worker = worker;
    }
    return this.worker;
  }

  run(file: Blob, task: RenderTask): Promise<RenderResult> {
    const worker = this.getWorker();
    if (!worker) return render(file, task);
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { file, task, resolve, reject });
      worker.postMessage({ id, file, task });
    });
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
    for (const p of this.pending.values()) p.reject(new Error('Cancelled'));
    this.pending.clear();
  }
}

/** Shared processor for a component: created on first use, disposed on unmount. */
export function useImageProcessor(): () => ImageProcessor {
  const ref = useRef<ImageProcessor | null>(null);
  useEffect(
    () => () => {
      ref.current?.dispose();
      ref.current = null;
    },
    [],
  );
  return useCallback(() => (ref.current ??= new ImageProcessor()), []);
}

/** Natural size of an image file (EXIF orientation applied). */
export async function imageSize(file: Blob): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

/**
 * A generated sample image for "Load sample" (no network request needed): a colorful scene,
 * with a transparent border when `transparent` is true so PNG → JPG background handling is visible.
 */
export async function makeSampleImage(
  format: 'png' | 'jpg' | 'webp',
  transparent = format !== 'jpg',
): Promise<File> {
  const w = 1600;
  const h = 1067;
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d')!;
  const inset = transparent ? 60 : 0;
  const sky = ctx.createLinearGradient(0, 0, 0, h);
  sky.addColorStop(0, '#1e3a8a');
  sky.addColorStop(0.55, '#f472b6');
  sky.addColorStop(1, '#fbbf24');
  ctx.save();
  ctx.beginPath();
  ctx.roundRect(inset, inset, w - inset * 2, h - inset * 2, transparent ? 48 : 0);
  ctx.clip();
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#fde68a';
  ctx.beginPath();
  ctx.arc(w * 0.7, h * 0.55, 140, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#312e81';
  ctx.beginPath();
  ctx.moveTo(0, h);
  ctx.lineTo(w * 0.25, h * 0.5);
  ctx.lineTo(w * 0.5, h);
  ctx.moveTo(w * 0.35, h);
  ctx.lineTo(w * 0.62, h * 0.42);
  ctx.lineTo(w * 0.95, h);
  ctx.fill();
  for (let i = 0; i < 400; i++) {
    ctx.fillStyle = `rgba(255,255,255,${(i % 7) / 20})`;
    ctx.fillRect((i * 397) % w, (i * 151) % (h * 0.5), 3, 3);
  }
  ctx.restore();
  const mime = format === 'jpg' ? 'image/jpeg' : `image/${format}`;
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, 0.95));
  if (!blob || blob.type !== mime)
    throw new Error(`This browser cannot create a sample ${format.toUpperCase()} image.`);
  return new File([blob], `sample-landscape.${format}`, { type: mime });
}

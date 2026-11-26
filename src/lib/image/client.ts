'use client';

import { render, type RenderTask } from './render';

type Pending = { resolve: (r: RenderResult) => void; reject: (e: Error) => void };
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
 * Falls back to the main thread in browsers without OffscreenCanvas in workers.
 */
export class ImageProcessor {
  private worker: Worker | null = null;
  private nextId = 0;
  private pending = new Map<number, Pending>();

  private getWorker(): Worker | null {
    if (!workerSupported()) return null;
    if (!this.worker) {
      this.worker = new Worker(new URL('./image.worker.ts', import.meta.url), { type: 'module' });
      this.worker.onmessage = (e: MessageEvent) => {
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
      this.worker.onerror = () => {
        for (const p of this.pending.values())
          p.reject(new Error('The image worker stopped unexpectedly (the file may be too large).'));
        this.pending.clear();
        this.worker?.terminate();
        this.worker = null;
      };
    }
    return this.worker;
  }

  run(file: Blob, task: RenderTask): Promise<RenderResult> {
    const worker = this.getWorker();
    if (!worker) return render(file, task);
    const id = ++this.nextId;
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      worker.postMessage({ id, file, task });
    });
  }

  dispose() {
    this.worker?.terminate();
    this.worker = null;
    this.pending.clear();
  }
}

/** Natural size of an image file (EXIF orientation applied). */
export async function imageSize(file: Blob): Promise<{ width: number; height: number }> {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const size = { width: bitmap.width, height: bitmap.height };
  bitmap.close();
  return size;
}

/**
 * A generated sample image for "Load sample" (no network request needed): a colourful scene,
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

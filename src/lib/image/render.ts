import { IMAGE_FORMATS, type ImageFormatKey } from './formats';
import { canvasSizeProblem, computeResize, type ResizeSpec, type Size } from './geometry';

/** A conversion/resize job. Runs in the image worker, or on the main thread as a fallback. */
export interface RenderTask {
  to: ImageFormatKey;
  /** 0–1, used for JPG and WebP. */
  quality: number;
  /** Fill colour behind transparent pixels (always applied for JPG, which has no transparency). */
  background?: string;
  /** Output size; defaults to the source size. */
  size?: Size;
  /** Resize rule applied to the decoded size (ignored when `size` is set). */
  resize?: ResizeSpec;
}

type AnyCanvas = OffscreenCanvas | HTMLCanvasElement;
type AnyContext = OffscreenCanvasRenderingContext2D | CanvasRenderingContext2D;

export class ImageRenderError extends Error {}

export function createCanvas(width: number, height: number): AnyCanvas {
  if (typeof OffscreenCanvas !== 'undefined') return new OffscreenCanvas(width, height);
  const c = document.createElement('canvas');
  c.width = width;
  c.height = height;
  return c;
}

function context(canvas: AnyCanvas): AnyContext {
  const ctx = canvas.getContext('2d') as AnyContext | null;
  if (!ctx)
    throw new ImageRenderError(
      'This browser could not create a drawing surface of that size. Try a smaller image.',
    );
  return ctx;
}

/** Decode a file, applying its EXIF orientation. */
export async function decode(file: Blob): Promise<ImageBitmap> {
  try {
    return await createImageBitmap(file, { imageOrientation: 'from-image' });
  } catch {
    throw new ImageRenderError(
      'This file could not be read as an image. It may be damaged or in a format your browser cannot open.',
    );
  }
}

/**
 * Draw `source` at `size`. Large reductions are done in halving steps, which gives a sharper,
 * less aliased result than a single high-ratio downscale.
 */
export function drawScaled(
  source: CanvasImageSource & { width: number; height: number },
  size: Size,
): AnyCanvas {
  let current: CanvasImageSource & { width: number; height: number } = source;
  let w = source.width;
  let h = source.height;
  while (w / 2 >= size.width && h / 2 >= size.height) {
    w = Math.max(size.width, Math.round(w / 2));
    h = Math.max(size.height, Math.round(h / 2));
    const step = createCanvas(w, h);
    const sctx = context(step);
    sctx.imageSmoothingQuality = 'high';
    sctx.drawImage(current, 0, 0, w, h);
    current = step;
  }
  const out = createCanvas(size.width, size.height);
  const ctx = context(out);
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(current, 0, 0, size.width, size.height);
  return out;
}

/** Flatten transparency onto a solid colour (needed for JPG). */
export function flatten(canvas: AnyCanvas, color: string): AnyCanvas {
  const out = createCanvas(canvas.width, canvas.height);
  const ctx = context(out);
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, out.width, out.height);
  ctx.drawImage(canvas, 0, 0);
  return out;
}

export async function encode(
  canvas: AnyCanvas,
  to: ImageFormatKey,
  quality: number,
): Promise<Blob> {
  const { mime, label } = IMAGE_FORMATS[to];
  const q = Math.min(1, Math.max(0.01, quality));
  const blob =
    'convertToBlob' in canvas
      ? await canvas.convertToBlob({ type: mime, quality: q })
      : await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, mime, q));
  if (!blob || blob.size === 0)
    throw new ImageRenderError(
      'The image could not be encoded. It may be too large for this device.',
    );
  // Browsers fall back to PNG for formats they cannot write (Safari cannot encode WebP).
  if (blob.type !== mime) {
    throw new ImageRenderError(
      `This browser cannot create ${label} files. Please use a current version of Chrome, Edge or Firefox.`,
    );
  }
  return blob;
}

/** Full pipeline: decode → resize → (flatten) → encode. */
export async function render(
  file: Blob,
  task: RenderTask,
): Promise<{ blob: Blob; width: number; height: number }> {
  const bitmap = await decode(file);
  try {
    const natural = { width: bitmap.width, height: bitmap.height };
    const size = task.size ?? (task.resize ? computeResize(natural, task.resize) : natural);
    const problem = canvasSizeProblem(size);
    if (problem) throw new ImageRenderError(problem);
    let canvas = drawScaled(bitmap, size);
    const background = task.to === 'jpg' ? (task.background ?? '#ffffff') : task.background;
    if (background) canvas = flatten(canvas, background);
    const blob = await encode(canvas, task.to, task.quality);
    return { blob, width: size.width, height: size.height };
  } finally {
    bitmap.close();
  }
}

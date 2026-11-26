/** Largest canvas edge supported by all current browsers. */
export const MAX_CANVAS_EDGE = 16384;
/** Safari/iOS limit the canvas area to 16,777,216 pixels; other browsers allow more. */
export const SAFE_CANVAS_AREA = 16_777_216;

export interface Size {
  width: number;
  height: number;
}

export type ResizeSpec =
  | { mode: 'percent'; percent: number }
  | { mode: 'pixels'; width?: number; height?: number; keepAspect: boolean };

const positive = (n: number | undefined) =>
  n !== undefined && Number.isFinite(n) && n > 0 ? n : undefined;

/**
 * Target size for a resize. With "keep aspect ratio" and both dimensions given, the image is
 * scaled to fit inside the box; with one dimension the other follows the original proportions.
 */
export function computeResize(original: Size, spec: ResizeSpec): Size {
  let width: number;
  let height: number;
  if (spec.mode === 'percent') {
    const f = (positive(spec.percent) ?? 100) / 100;
    width = original.width * f;
    height = original.height * f;
  } else {
    const w = positive(spec.width);
    const h = positive(spec.height);
    if (spec.keepAspect) {
      const scale =
        w && h
          ? Math.min(w / original.width, h / original.height)
          : w
            ? w / original.width
            : h
              ? h / original.height
              : 1;
      width = original.width * scale;
      height = original.height * scale;
    } else {
      width = w ?? original.width;
      height = h ?? original.height;
    }
  }
  return { width: Math.max(1, Math.round(width)), height: Math.max(1, Math.round(height)) };
}

/** Error message when a canvas of this size cannot be created reliably, or null. */
export function canvasSizeProblem(size: Size): string | null {
  if (size.width > MAX_CANVAS_EDGE || size.height > MAX_CANVAS_EDGE) {
    return `The result would be ${size.width} × ${size.height} pixels; browsers support at most ${MAX_CANVAS_EDGE} pixels per side.`;
  }
  return null;
}

/** Size of an image after rotating by a multiple of 90 degrees. */
export function rotatedSize(size: Size, rotation: number): Size {
  const quarter = (((Math.round(rotation / 90) % 4) + 4) % 4) as 0 | 1 | 2 | 3;
  return quarter % 2 ? { width: size.height, height: size.width } : size;
}

export interface PercentRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

/** Convert a crop in percent of the displayed image to whole source pixels, clamped to the image. */
export function percentToPixelCrop(
  crop: PercentRect,
  image: Size,
): { x: number; y: number; width: number; height: number } {
  const x = Math.max(0, Math.min(image.width - 1, Math.round((crop.x / 100) * image.width)));
  const y = Math.max(0, Math.min(image.height - 1, Math.round((crop.y / 100) * image.height)));
  const width = Math.max(
    1,
    Math.min(image.width - x, Math.round((crop.width / 100) * image.width)),
  );
  const height = Math.max(
    1,
    Math.min(image.height - y, Math.round((crop.height / 100) * image.height)),
  );
  return { x, y, width, height };
}

/** Largest centred rectangle (in percent) with the given aspect ratio inside an image. */
export function centeredAspectCrop(aspect: number, image: Size, coverage = 90): PercentRect {
  const imageAspect = image.width / image.height;
  let width = coverage;
  let height = coverage;
  if (aspect > imageAspect) height = (coverage * imageAspect) / aspect;
  else width = (coverage * aspect) / imageAspect;
  return { x: (100 - width) / 2, y: (100 - height) / 2, width, height };
}

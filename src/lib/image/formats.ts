/** Raster formats the image tools can write. Canvas can encode PNG, JPEG and (except Safari) WebP. */
export const IMAGE_FORMATS = {
  png: { key: 'png', mime: 'image/png', ext: 'png', label: 'PNG', lossy: false, alpha: true },
  jpg: { key: 'jpg', mime: 'image/jpeg', ext: 'jpg', label: 'JPG', lossy: true, alpha: false },
  webp: { key: 'webp', mime: 'image/webp', ext: 'webp', label: 'WebP', lossy: true, alpha: true },
} as const;

export type ImageFormatKey = keyof typeof IMAGE_FORMATS;
export type ImageFormat = (typeof IMAGE_FORMATS)[ImageFormatKey];

/** accept attribute for inputs that take any format we can read and write. */
export const ACCEPT_COMMON = 'image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp';

export function acceptFor(format: ImageFormatKey): string {
  return format === 'jpg' ? 'image/jpeg,.jpg,.jpeg' : `${IMAGE_FORMATS[format].mime},.${format}`;
}

/** Detect a file's format from its MIME type, falling back to the extension. */
export function formatOf(file: { name: string; type: string }): ImageFormatKey | null {
  const type = file.type.toLowerCase();
  if (type === 'image/png') return 'png';
  if (type === 'image/jpeg' || type === 'image/jpg' || type === 'image/pjpeg') return 'jpg';
  if (type === 'image/webp') return 'webp';
  const ext = /\.([a-z0-9]+)$/i.exec(file.name)?.[1]?.toLowerCase();
  if (ext === 'png') return 'png';
  if (ext === 'jpg' || ext === 'jpeg' || ext === 'jfif') return 'jpg';
  if (ext === 'webp') return 'webp';
  return null;
}

/** "holiday photo.PNG" + "jpg" -> "holiday photo.jpg" */
export function replaceExtension(name: string, ext: string): string {
  const base = name.replace(/\.[^./\\]+$/, '') || 'image';
  return `${base}.${ext}`;
}

/** Add a suffix before the extension: "a.jpg" + "-small" -> "a-small.jpg". */
export function addSuffix(name: string, suffix: string): string {
  const m = /^(.*?)(\.[^./\\]+)?$/.exec(name);
  return `${m?.[1] || 'image'}${suffix}${m?.[2] ?? ''}`;
}

/** Make file names unique for a ZIP archive: a.jpg, a (2).jpg, a (3).jpg … */
export function uniqueNames(names: string[]): string[] {
  const seen = new Map<string, number>();
  return names.map((name) => {
    const key = name.toLowerCase();
    const n = (seen.get(key) ?? 0) + 1;
    seen.set(key, n);
    return n === 1 ? name : addSuffix(name, ` (${n})`);
  });
}

/** Percentage saved (positive) or added (negative), rounded to one decimal. */
export function savingsPercent(before: number, after: number): number {
  if (before <= 0) return 0;
  return Math.round(((before - after) / before) * 1000) / 10;
}

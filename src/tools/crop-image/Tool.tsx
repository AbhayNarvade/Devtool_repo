'use client';

import { useEffect, useRef, useState } from 'react';
import ReactCrop, { type PercentCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  ActionBar,
  Button,
  ErrorAlert,
  InfoNote,
  PrivacyNote,
  Select,
  Slider,
  ToolPanel,
} from '@/components/tool/controls';
import { FileDropzone } from '@/components/tool/FileDropzone';
import { downloadBlob, formatBytes } from '@/lib/download';
import { makeSampleImage } from '@/lib/image/client';
import {
  ACCEPT_COMMON,
  IMAGE_FORMATS,
  addSuffix,
  formatOf,
  replaceExtension,
  type ImageFormatKey,
} from '@/lib/image/formats';
import {
  centeredAspectCrop,
  percentToPixelCrop,
  rotatedSize,
  type Size,
} from '@/lib/image/geometry';
import { createCanvas, decode, encode, flatten } from '@/lib/image/render';

const RATIOS = [
  { value: 'free', label: 'Free', aspect: undefined },
  { value: '1:1', label: '1:1 (square)', aspect: 1 },
  { value: '16:9', label: '16:9 (widescreen)', aspect: 16 / 9 },
  { value: '4:3', label: '4:3', aspect: 4 / 3 },
  { value: '9:16', label: '9:16 (stories)', aspect: 9 / 16 },
] as const;
type RatioKey = (typeof RATIOS)[number]['value'];
type OutputChoice = 'same' | ImageFormatKey;

const PREVIEW_MAX = 1600;

interface Working {
  /** Full-resolution, rotated and flipped image used for the final crop. */
  canvas: OffscreenCanvas | HTMLCanvasElement;
  size: Size;
  /** Downscaled preview shown in the cropper. */
  previewUrl: string;
}

async function buildWorking(
  file: File,
  rotation: number,
  flipH: boolean,
  flipV: boolean,
): Promise<Working> {
  const bitmap = await decode(file);
  try {
    const size = rotatedSize({ width: bitmap.width, height: bitmap.height }, rotation);
    const canvas = createCanvas(size.width, size.height);
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    ctx.translate(size.width / 2, size.height / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
    ctx.drawImage(bitmap, -bitmap.width / 2, -bitmap.height / 2);
    const scale = Math.min(1, PREVIEW_MAX / Math.max(size.width, size.height));
    const preview = createCanvas(Math.round(size.width * scale), Math.round(size.height * scale));
    const pctx = preview.getContext('2d') as CanvasRenderingContext2D;
    pctx.imageSmoothingQuality = 'high';
    pctx.drawImage(canvas, 0, 0, preview.width, preview.height);
    const blob = await encode(preview, 'png', 1);
    return { canvas, size, previewUrl: URL.createObjectURL(blob) };
  } finally {
    bitmap.close();
  }
}

export default function CropImageTool() {
  const [file, setFile] = useState<File | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [working, setWorking] = useState<Working | null>(null);
  const [crop, setCrop] = useState<PercentCrop>();
  const [ratio, setRatio] = useState<RatioKey>('free');
  const [output, setOutput] = useState<OutputChoice>('same');
  const [quality, setQuality] = useState(92);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [last, setLast] = useState<{
    name: string;
    size: number;
    width: number;
    height: number;
  } | null>(null);
  const workingRef = useRef<Working | null>(null);

  const aspect = RATIOS.find((r) => r.value === ratio)?.aspect;

  // Rebuild the working image when the file, rotation or flip changes.
  useEffect(() => {
    if (!file) return;
    let cancelled = false;
    buildWorking(file, rotation, flipH, flipV)
      .then((w) => {
        if (cancelled) {
          URL.revokeObjectURL(w.previewUrl);
          return;
        }
        if (workingRef.current) URL.revokeObjectURL(workingRef.current.previewUrl);
        workingRef.current = w;
        setWorking(w);
        setCrop({
          unit: '%',
          ...(aspect ? centeredAspectCrop(aspect, w.size) : { x: 5, y: 5, width: 90, height: 90 }),
        });
        setError(null);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : String(e));
      });
    return () => {
      cancelled = true;
    };
    // `aspect` is applied separately below; rebuilding is only needed for these inputs.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file, rotation, flipH, flipV]);

  useEffect(
    () => () => {
      if (workingRef.current) URL.revokeObjectURL(workingRef.current.previewUrl);
    },
    [],
  );

  function chooseRatio(next: RatioKey) {
    setRatio(next);
    const a = RATIOS.find((r) => r.value === next)?.aspect;
    if (a && working) setCrop({ unit: '%', ...centeredAspectCrop(a, working.size) });
  }

  const pixels = crop && working ? percentToPixelCrop(crop, working.size) : null;

  function setPixel(field: 'x' | 'y' | 'width' | 'height', value: number) {
    if (!pixels || !working || !Number.isFinite(value)) return;
    const next = { ...pixels, [field]: Math.round(value) };
    if (aspect && field === 'width') next.height = Math.round(next.width / aspect);
    if (aspect && field === 'height') next.width = Math.round(next.height * aspect);
    next.width = Math.max(1, Math.min(working.size.width, next.width));
    next.height = Math.max(1, Math.min(working.size.height, next.height));
    next.x = Math.max(0, Math.min(working.size.width - next.width, next.x));
    next.y = Math.max(0, Math.min(working.size.height - next.height, next.y));
    setCrop({
      unit: '%',
      x: (next.x / working.size.width) * 100,
      y: (next.y / working.size.height) * 100,
      width: (next.width / working.size.width) * 100,
      height: (next.height / working.size.height) * 100,
    });
  }

  async function exportCrop() {
    if (!file || !working || !pixels) return;
    setBusy(true);
    setError(null);
    try {
      const source = formatOf(file) ?? 'png';
      const target = output === 'same' ? source : output;
      let canvas = createCanvas(pixels.width, pixels.height);
      (canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(
        working.canvas,
        -pixels.x,
        -pixels.y,
      );
      if (target === 'jpg') canvas = flatten(canvas, '#ffffff');
      const blob = await encode(canvas, target, quality / 100);
      const name = addSuffix(replaceExtension(file.name, IMAGE_FORMATS[target].ext), '-cropped');
      downloadBlob(blob, name);
      setLast({ name, size: blob.size, width: pixels.width, height: pixels.height });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  }

  const loadFile = (f: File) => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setLast(null);
    setFile(f);
  };

  const pixelInput = (field: 'x' | 'y' | 'width' | 'height', label: string) => (
    <label className="flex flex-col text-sm font-medium">
      {label}
      <input
        type="number"
        min={field === 'width' || field === 'height' ? 1 : 0}
        value={pixels?.[field] ?? ''}
        onChange={(e) => setPixel(field, e.target.valueAsNumber)}
        className="mt-1 h-9 w-24 rounded-lg border border-border-strong bg-card px-2 font-mono text-sm focus:border-accent"
      />
    </label>
  );

  return (
    <ToolPanel>
      {!file ? (
        <>
          <FileDropzone
            accept={ACCEPT_COMMON}
            acceptPaste
            label="Choose an image to crop"
            hint="JPG, PNG or WebP"
            onFiles={([f]) => f && loadFile(f)}
          />
          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <PrivacyNote />
            <Button
              icon="file"
              size="sm"
              onClick={async () => {
                try {
                  loadFile(await makeSampleImage('jpg'));
                } catch (e) {
                  setError(e instanceof Error ? e.message : String(e));
                }
              }}
            >
              Load sample
            </Button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-4 flex flex-wrap items-end gap-x-6 gap-y-4">
            <Select
              label="Aspect ratio"
              value={ratio}
              onChange={chooseRatio}
              options={RATIOS.map((r) => ({ value: r.value, label: r.label }))}
            />
            <div className="flex flex-col">
              <span className="mb-1 text-sm font-medium">Rotate and flip</span>
              <ActionBar>
                <Button
                  size="sm"
                  icon="rotate"
                  onClick={() => setRotation((r) => (r + 270) % 360)}
                  aria-label="Rotate left 90 degrees"
                >
                  Left
                </Button>
                <Button
                  size="sm"
                  icon="refresh"
                  onClick={() => setRotation((r) => (r + 90) % 360)}
                  aria-label="Rotate right 90 degrees"
                >
                  Right
                </Button>
                <Button
                  size="sm"
                  icon="flipH"
                  aria-pressed={flipH}
                  onClick={() => setFlipH((f) => !f)}
                >
                  Flip horizontal
                </Button>
                <Button
                  size="sm"
                  icon="flipV"
                  aria-pressed={flipV}
                  onClick={() => setFlipV((f) => !f)}
                >
                  Flip vertical
                </Button>
              </ActionBar>
            </div>
          </div>

          <div data-tool-output="">
            <div className="flex justify-center rounded-xl bg-[repeating-conic-gradient(var(--bg-muted)_0%_25%,var(--bg)_0%_50%)] bg-[length:16px_16px] p-2">
              {working ? (
                <ReactCrop
                  crop={crop}
                  aspect={aspect}
                  keepSelection
                  ruleOfThirds
                  minWidth={8}
                  minHeight={8}
                  onChange={(_, percent) => setCrop(percent)}
                  className="max-h-[70vh]"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={working.previewUrl}
                    alt={`Image to crop: ${file.name}`}
                    width={working.size.width}
                    height={working.size.height}
                    className="max-h-[70vh] w-auto"
                  />
                </ReactCrop>
              ) : (
                <p className="p-10 text-fg-muted" role="status">
                  Loading image…
                </p>
              )}
            </div>
            <p className="mt-2 text-sm text-fg-muted">
              Drag the box or its handles to crop. Selected area:{' '}
              <span className="font-mono">
                {pixels ? `${pixels.width} × ${pixels.height}px` : '–'}
              </span>
              {working ? ` of ${working.size.width} × ${working.size.height}px` : ''}.
            </p>
          </div>

          <fieldset className="mt-4">
            <legend className="mb-1 text-sm font-medium">Exact crop in pixels</legend>
            <div className="flex flex-wrap gap-3">
              {pixelInput('x', 'Left (X)')}
              {pixelInput('y', 'Top (Y)')}
              {pixelInput('width', 'Width')}
              {pixelInput('height', 'Height')}
            </div>
          </fieldset>

          <div className="mt-5 flex flex-wrap items-end gap-x-6 gap-y-4">
            <Select
              label="Save as"
              value={output}
              onChange={setOutput}
              options={[
                {
                  value: 'same',
                  label: `Same as original (${IMAGE_FORMATS[formatOf(file) ?? 'png'].label})`,
                },
                { value: 'png', label: 'PNG' },
                { value: 'jpg', label: 'JPG' },
                { value: 'webp', label: 'WebP' },
              ]}
            />
            {(
              output === 'same'
                ? IMAGE_FORMATS[formatOf(file) ?? 'png'].lossy
                : IMAGE_FORMATS[output].lossy
            ) ? (
              <Slider
                label="Quality"
                value={quality}
                onChange={setQuality}
                min={10}
                max={100}
                suffix="%"
              />
            ) : null}
          </div>
          <ActionBar className="mt-5">
            <Button
              variant="primary"
              icon="download"
              onClick={exportCrop}
              disabled={!pixels || busy}
            >
              {busy ? 'Cropping…' : 'Crop and download'}
            </Button>
            <Button icon="trash" variant="ghost" onClick={() => setFile(null)}>
              Choose another image
            </Button>
          </ActionBar>
          {last ? (
            <div className="mt-4">
              <InfoNote tone="success">
                Saved <strong>{last.name}</strong>: {last.width} × {last.height}px,{' '}
                {formatBytes(last.size)}.
              </InfoNote>
            </div>
          ) : null}
          <div className="mt-3">
            <PrivacyNote />
          </div>
        </>
      )}
      {error ? (
        <div className="mt-4">
          <ErrorAlert title="Something went wrong">{error}</ErrorAlert>
        </div>
      ) : null}
    </ToolPanel>
  );
}

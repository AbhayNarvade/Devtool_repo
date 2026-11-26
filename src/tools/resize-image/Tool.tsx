'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Checkbox, NumberInput, Segmented, Select, Slider } from '@/components/tool/controls';
import { ImageBatch, type BatchOutput } from '@/components/tool/ImageBatch';
import { ImageProcessor, makeSampleImage } from '@/lib/image/client';
import {
  ACCEPT_COMMON,
  IMAGE_FORMATS,
  addSuffix,
  formatOf,
  replaceExtension,
  type ImageFormatKey,
} from '@/lib/image/formats';
import type { ResizeSpec } from '@/lib/image/geometry';

type OutputChoice = 'same' | ImageFormatKey;

export default function ResizeImageTool() {
  const [mode, setMode] = useState<'pixels' | 'percent'>('pixels');
  const [width, setWidth] = useState(1200);
  const [height, setHeight] = useState(Number.NaN);
  const [percent, setPercent] = useState(50);
  const [keepAspect, setKeepAspect] = useState(true);
  const [output, setOutput] = useState<OutputChoice>('same');
  const [quality, setQuality] = useState(90);
  const processor = useRef<ImageProcessor | null>(null);

  useEffect(() => {
    processor.current = new ImageProcessor();
    return () => processor.current?.dispose();
  }, []);

  const spec: ResizeSpec =
    mode === 'percent'
      ? { mode, percent }
      : {
          mode,
          keepAspect,
          width: Number.isFinite(width) ? width : undefined,
          height: Number.isFinite(height) ? height : undefined,
        };
  const specKey = JSON.stringify(spec);

  const process = useCallback(
    async (file: File): Promise<BatchOutput> => {
      const source = formatOf(file);
      if (!source) throw new Error('Unsupported file type. Use PNG, JPG or WebP.');
      const target = output === 'same' ? source : output;
      const resize = JSON.parse(specKey) as ResizeSpec;
      const result = await (processor.current ?? new ImageProcessor()).run(file, {
        to: target,
        quality: quality / 100,
        resize,
      });
      const name = addSuffix(
        replaceExtension(file.name, IMAGE_FORMATS[target].ext),
        `-${result.width}x${result.height}`,
      );
      return { ...result, name };
    },
    [specKey, output, quality],
  );

  const lossyOutput = output === 'jpg' || output === 'webp' || output === 'same';
  return (
    <ImageBatch
      accept={ACCEPT_COMMON}
      hint="JPG, PNG or WebP · batch supported"
      process={process}
      settingsKey={`${specKey}|${output}|${quality}`}
      sample={() => makeSampleImage('jpg')}
      zipName="resized-images.zip"
      verb="resized"
      options={
        <>
          <Segmented
            label="Resize by"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'pixels', label: 'Pixels' },
              { value: 'percent', label: 'Percentage' },
            ]}
          />
          {mode === 'pixels' ? (
            <>
              <NumberInput
                label="Width"
                value={width}
                onChange={setWidth}
                min={1}
                max={16384}
                suffix="px"
              />
              <NumberInput
                label="Height"
                value={height}
                onChange={setHeight}
                min={1}
                max={16384}
                suffix="px"
              />
              <Checkbox
                label="Keep aspect ratio"
                description={
                  keepAspect
                    ? 'Fits inside width × height; leave one empty to scale by the other'
                    : 'Stretches to the exact size'
                }
                checked={keepAspect}
                onChange={setKeepAspect}
              />
            </>
          ) : (
            <Slider
              label="Scale"
              value={percent}
              onChange={setPercent}
              min={1}
              max={200}
              suffix="%"
            />
          )}
          <Select
            label="Output format"
            value={output}
            onChange={setOutput}
            options={[
              { value: 'same', label: 'Same as original' },
              { value: 'jpg', label: 'JPG' },
              { value: 'png', label: 'PNG' },
              { value: 'webp', label: 'WebP' },
            ]}
          />
          {lossyOutput ? (
            <Slider
              label="Quality (JPG/WebP)"
              value={quality}
              onChange={setQuality}
              min={10}
              max={100}
              suffix="%"
            />
          ) : null}
        </>
      }
    />
  );
}

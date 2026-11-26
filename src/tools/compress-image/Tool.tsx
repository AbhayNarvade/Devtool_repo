'use client';

import { useCallback, useState } from 'react';
import { InfoNote, Select, Slider } from '@/components/tool/controls';
import { ImageBatch, type BatchOutput } from '@/components/tool/ImageBatch';
import { BROWSER_IMAGE_COMPRESSION_URL } from '@/config/vendor';
import { makeSampleImage } from '@/lib/image/client';
import {
  ACCEPT_COMMON,
  IMAGE_FORMATS,
  formatOf,
  replaceExtension,
  type ImageFormatKey,
} from '@/lib/image/formats';

type OutputChoice = 'same' | ImageFormatKey;
const MAX_SIZES = ['0', '3840', '2560', '1920', '1280', '800'] as const;
type MaxSize = (typeof MAX_SIZES)[number];

export default function CompressImageTool() {
  const [quality, setQuality] = useState(75);
  const [output, setOutput] = useState<OutputChoice>('same');
  const [maxSize, setMaxSize] = useState<MaxSize>('0');

  const process = useCallback(
    async (file: File): Promise<BatchOutput> => {
      const source = formatOf(file);
      if (!source) throw new Error('Unsupported file type. Use PNG, JPG or WebP.');
      const target: ImageFormatKey = output === 'same' ? source : output;
      const { default: imageCompression } = await import('browser-image-compression');
      const maxDim = Number(maxSize);
      const result = await imageCompression(file, {
        maxSizeMB: Number.POSITIVE_INFINITY,
        maxWidthOrHeight: maxDim || undefined,
        alwaysKeepResolution: !maxDim,
        initialQuality: quality / 100,
        maxIteration: 1,
        fileType: IMAGE_FORMATS[target].mime,
        useWebWorker: true,
        libURL: new URL(BROWSER_IMAGE_COMPRESSION_URL, window.location.origin).href,
        preserveExif: false,
      });
      const name = replaceExtension(file.name, IMAGE_FORMATS[target].ext);
      // Never hand back a bigger file in the same format: keep the original instead.
      if (target === source && !maxDim && result.size >= file.size) {
        return {
          blob: file,
          name: file.name,
          note: 'Already well optimised: the original was kept because re-encoding made it larger.',
        };
      }
      if (result.type !== IMAGE_FORMATS[target].mime) {
        throw new Error(
          `This browser cannot create ${IMAGE_FORMATS[target].label} files. Use Chrome, Edge or Firefox, or choose another output format.`,
        );
      }
      return { blob: result, name };
    },
    [quality, output, maxSize],
  );

  return (
    <ImageBatch
      accept={ACCEPT_COMMON}
      hint="JPG, PNG or WebP · as many images as you like"
      process={process}
      settingsKey={`${quality}|${output}|${maxSize}`}
      sample={() => makeSampleImage('jpg')}
      zipName="compressed-images.zip"
      verb="compressed"
      emphasizeSavings
      options={
        <>
          <Slider
            label="Quality"
            value={quality}
            onChange={setQuality}
            min={10}
            max={100}
            suffix="%"
          />
          <Select
            label="Output format"
            value={output}
            onChange={setOutput}
            options={[
              { value: 'same', label: 'Same as original' },
              { value: 'webp', label: 'WebP (usually smallest)' },
              { value: 'jpg', label: 'JPG' },
              { value: 'png', label: 'PNG (lossless)' },
            ]}
          />
          <Select
            label="Maximum width or height"
            value={maxSize}
            onChange={setMaxSize}
            options={MAX_SIZES.map((v) => ({
              value: v,
              label: v === '0' ? 'Keep original size' : `${v} px`,
            }))}
          />
        </>
      }
      notes={
        <InfoNote>
          The quality setting applies to JPG and WebP. PNG is lossless, so PNG files only get
          smaller by reducing their dimensions or converting them to WebP or JPG.
        </InfoNote>
      }
    />
  );
}

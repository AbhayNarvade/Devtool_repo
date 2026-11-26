'use client';

import { useCallback, useState } from 'react';
import { ColorInput, InfoNote, Select, Slider } from './controls';
import { ImageBatch, type BatchOutput } from './ImageBatch';
import { makeSampleImage, useImageProcessor } from '@/lib/image/client';
import {
  ACCEPT_COMMON,
  IMAGE_FORMATS,
  acceptFor,
  formatOf,
  replaceExtension,
  type ImageFormatKey,
} from '@/lib/image/formats';

interface ImageConvertProps {
  /** Fixed input format (dedicated pages such as PNG to JPG); undefined accepts PNG, JPG and WebP. */
  from?: ImageFormatKey;
  /** Fixed output format; undefined lets the user choose (the converter hub). */
  to?: ImageFormatKey;
}

/** Shared UI for the image converter hub and the six one-direction converter pages. */
export function ImageConvert({ from, to }: ImageConvertProps) {
  const [chosen, setChosen] = useState<ImageFormatKey>(to ?? 'webp');
  const [quality, setQuality] = useState(90);
  const [background, setBackground] = useState('#ffffff');
  const target = to ?? chosen;
  const lossy = IMAGE_FORMATS[target].lossy;
  const getProcessor = useImageProcessor();

  const process = useCallback(
    async (file: File): Promise<BatchOutput> => {
      const source = formatOf(file);
      if (!source || (from && source !== from)) {
        throw new Error(
          from
            ? `This is not a ${IMAGE_FORMATS[from].label} file. Use the Image Converter for other formats.`
            : 'Unsupported file type. Use PNG, JPG or WebP.',
        );
      }
      const result = await getProcessor().run(file, {
        to: target,
        quality: quality / 100,
        background: target === 'jpg' ? background : undefined,
      });
      return { ...result, name: replaceExtension(file.name, IMAGE_FORMATS[target].ext) };
    },
    [from, target, quality, background, getProcessor],
  );

  const sampleFormat = from ?? (target === 'png' ? 'jpg' : 'png');
  return (
    <ImageBatch
      accept={from ? acceptFor(from) : ACCEPT_COMMON}
      hint={
        from
          ? `${IMAGE_FORMATS[from].label} images · batch supported`
          : 'PNG, JPG or WebP · batch supported'
      }
      process={process}
      settingsKey={`${target}|${lossy ? quality : ''}|${target === 'jpg' ? background : ''}`}
      sample={() => makeSampleImage(sampleFormat)}
      zipName={`converted-to-${IMAGE_FORMATS[target].ext}.zip`}
      verb="converted"
      options={
        <>
          {to ? null : (
            <Select
              label="Convert to"
              value={chosen}
              onChange={setChosen}
              options={(Object.keys(IMAGE_FORMATS) as ImageFormatKey[]).map((k) => ({
                value: k,
                label: IMAGE_FORMATS[k].label,
              }))}
            />
          )}
          {lossy ? (
            <Slider
              label={`${IMAGE_FORMATS[target].label} quality`}
              value={quality}
              onChange={setQuality}
              min={10}
              max={100}
              suffix="%"
            />
          ) : null}
          {target === 'jpg' ? (
            <ColorInput
              label="Background for transparent areas"
              value={background}
              onChange={setBackground}
            />
          ) : null}
        </>
      }
      notes={
        target === 'webp' ? (
          <InfoNote>
            WebP files can be created in Chrome, Edge and Firefox. Safari can open WebP images but
            cannot create them.
          </InfoNote>
        ) : target === 'jpg' ? (
          <InfoNote>
            JPG has no transparency: transparent areas are filled with the background colour you
            choose.
          </InfoNote>
        ) : null
      }
    />
  );
}

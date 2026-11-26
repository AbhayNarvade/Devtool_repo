import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jpgToPng: Tool = {
  slug: 'jpg-to-png',
  category: 'image-tools',
  name: 'JPG to PNG Converter',
  h1: 'JPG to PNG Converter',
  metaTitle: brandTitle('JPG to PNG Converter: Lossless, Batch, Free'),
  metaDescription:
    'Convert JPG to PNG online for lossless editing or when a site requires PNG. Batch convert photos and download a ZIP. Free and private: nothing is uploaded.',
  primaryKeyword: 'JPG to PNG',
  secondaryKeywords: [
    'convert jpg to png',
    'jpeg to png',
    'jpg to png converter',
    'change jpg to png',
  ],
  intro:
    'Convert JPG photos into lossless PNG files, ready for editing without further quality loss or for websites and apps that ask for PNG. Works for single images and batches.',
  cardDescription: 'Convert JPG photos to lossless PNG files.',
  icon: 'convert',
  handlesFiles: true,
  howToSteps: [
    'Choose, drop or paste one or more JPG or JPEG images.',
    'The conversion starts automatically; there is no quality setting because PNG is lossless.',
    'Check the converted files and their new sizes in the list.',
    'Download each PNG, or all of them together as a ZIP.',
  ],
  contentSections: [
    {
      heading: 'When converting JPG to PNG makes sense',
      kind: 'concept',
      body: `JPG is a lossy format: each time a JPG is opened, edited and saved again, it is compressed again and loses a little more detail. PNG is lossless, so saving it any number of times never changes a single pixel. Converting JPG to PNG is therefore useful when:

- **You will edit the image several times**, for example adding annotations, then cropping, then adding a watermark. Working in PNG prevents the slow build-up of compression artifacts that repeated JPG saves cause.
- **A website, template or app requires PNG.** Some design tools, icon generators, game engines and upload forms only accept PNG.
- **You plan to add transparency later.** PNG supports transparent pixels, so a background-removal step or an editor can make parts of the picture see-through. (Conversion alone does not make anything transparent.)
- **You want an exact archival copy** of how the image looks right now, with no further loss in future edits.

### What conversion cannot do

Converting does not undo the compression that already happened when the JPG was created. Blockiness, colour banding and smudges in a low-quality JPG are copied into the PNG pixel for pixel. The PNG simply stops them from getting worse.`,
    },
    {
      heading: 'JPG to PNG: what to expect',
      kind: 'examples',
      body: `| Before | After | Why |
| --- | --- | --- |
| Phone photo (JPG) | Usually several times larger (PNG) | Lossless storage of a detailed photo needs far more data |
| Screenshot that was saved as JPG | Larger PNG | Existing JPG artifacts are preserved exactly |
| JPG of a logo on white | PNG with a white background | Transparency must be added separately |

The size increase is expected and is the price of lossless storage. If you need a small file for the web after editing, convert the final PNG to JPG or WebP once, at the end of your workflow.`,
    },
    {
      heading: 'A lossless editing workflow',
      kind: 'examples',
      body: `A typical workflow that avoids generation loss looks like this:

1. Convert the original JPG to PNG once.
2. Do all edits on the PNG: crop, annotate, combine with other images, save as often as you like.
3. When the image is finished, export a single JPG or WebP for sharing or publishing, at the quality you need.

The final image has been compressed only twice, once by the camera and once at the end, no matter how many editing sessions it went through.`,
    },
    {
      heading: 'Tips for converting JPG to PNG',
      kind: 'tips',
      body: `- **Edit in PNG, publish in JPG or WebP.** Keep the PNG as your working copy and export a compressed version only when you are done.
- **Huge files?** A 24-megapixel photo can become tens of megabytes as PNG. Use the [image resizer](/image-tools/resize-image) first if you do not need the full resolution.
- **Rotation is preserved.** Phone photos are turned upright according to their EXIF orientation before conversion, so the PNG displays the same way everywhere.
- **Metadata** such as camera details and GPS location is not copied into the PNG.
- **Need the opposite?** Use the [PNG to JPG converter](/image-tools/png-to-jpg).`,
    },
  ],
  features: [
    'Converts JPG and JPEG images to lossless PNG.',
    'Batch conversion with ZIP download.',
    'EXIF orientation applied so photos stay upright.',
    'Original file names kept with a .png extension.',
    'Processing in a background thread for large photos.',
    'Removes EXIF metadata such as GPS location.',
    'Your files never leave your device: conversion happens in your browser.',
  ],
  faqs: [
    {
      question: 'Does converting JPG to PNG improve quality?',
      answer:
        'No. It keeps the current quality exactly and prevents further loss when you edit and save again, but it cannot restore detail that JPG compression already removed.',
    },
    {
      question: 'Why is the PNG file bigger than the JPG?',
      answer:
        'PNG stores every pixel without loss, which takes much more space for photos than JPG’s lossy compression. This is expected.',
    },
    {
      question: 'Will the PNG have a transparent background?',
      answer:
        'No. A JPG has no transparency, so the PNG has the same solid background. You can remove the background in an image editor afterwards, which PNG supports.',
    },
    {
      question: 'Can I convert several JPG files at once?',
      answer: 'Yes. Add as many images as you like and download all the PNG files in one ZIP.',
    },
    {
      question: 'Do JPEG files work too?',
      answer: 'Yes. JPEG and JPG are the same format, and both .jpeg and .jpg files are accepted.',
    },
    {
      question: 'Are my photos uploaded to a server?',
      answer: 'No. Your photos are converted in your browser and never leave your device.',
    },
  ],
  relatedSlugs: ['png-to-jpg', 'jpg-to-webp', 'resize-image', 'image-converter'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

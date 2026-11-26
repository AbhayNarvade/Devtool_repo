import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const pngToJpg: Tool = {
  slug: 'png-to-jpg',
  category: 'image-tools',
  name: 'PNG to JPG Converter',
  h1: 'PNG to JPG Converter',
  metaTitle: brandTitle('PNG to JPG Converter: Batch, Free, Private'),
  metaDescription:
    'Convert PNG to JPG online to make large images much smaller. Choose a background color for transparency and set the quality. Free batch conversion, no upload.',
  primaryKeyword: 'PNG to JPG',
  secondaryKeywords: [
    'convert png to jpg',
    'png to jpeg',
    'png to jpg converter',
    'change png to jpg',
  ],
  intro:
    'Convert PNG to JPG files that are far smaller and accepted everywhere. Transparent areas are filled with a color you choose, and you control the JPG quality.',
  cardDescription: 'Convert PNG to smaller JPG files with a background color.',
  icon: 'convert',
  handlesFiles: true,
  popular: true,
  howToSteps: [
    'Choose, drop or paste one or more PNG images.',
    'Pick the background color that should replace transparent areas (white by default).',
    'Set the JPG quality; 85–90% keeps photos looking identical.',
    'Check the new file sizes in the list.',
    'Download the JPG files one by one or as a ZIP.',
  ],
  contentSections: [
    {
      heading: 'Why convert PNG to JPG?',
      kind: 'concept',
      body: `PNG stores every pixel exactly. That is perfect for logos and interface screenshots, but it makes **photographs** huge: a photo saved as PNG is often three to ten times larger than the same photo as a good-quality JPG. Converting PNG to JPG is the quickest way to:

- get a photo under an upload or email size limit;
- make pictures load faster on a website or in a document;
- satisfy forms, printers and older programs that only accept JPG (JPEG).

JPG achieves its small size with lossy compression: it stores fine detail approximately, which the eye does not notice in natural photos. The quality slider sets how much detail is kept.

### What happens to transparency

PNG supports transparent and semi-transparent pixels; JPG does not. During conversion every pixel is placed on top of a solid **background color**. Fully transparent areas become that color, and soft edges such as anti-aliased text or shadows blend into it smoothly. Choose white for documents and most websites, black for dark slides, or the exact color of the page the image will sit on, so the edges look clean.`,
    },
    {
      heading: 'PNG to JPG examples',
      kind: 'examples',
      body: `| PNG content | Convert to JPG? | Notes |
| --- | --- | --- |
| Photo exported from an editor | Yes | Large size reduction, no visible change at 85–90% |
| Screenshot of a web page with photos | Usually | Text edges may soften slightly; use 90%+ |
| Logo with transparent background | Only if needed | Transparency becomes the background color |
| Diagram, chart or UI with sharp text | Usually not | JPG artifacts appear around lines and letters |

If a site requires JPG but your image is a logo, pick the background color that matches the site, convert at quality 95% or higher, and check the edges at full size.`,
    },
    {
      heading: 'Choosing the background color',
      kind: 'examples',
      body: `The background color only matters for pixels that are fully or partly transparent. Some common choices:

- \`#ffffff\` (white) for Word and Google Docs files, emails and most websites.
- \`#000000\` (black) for dark presentation slides and video overlays.
- The exact hex code of a colored page or brand panel, so the image blends in without a visible box around it.

You can pick the color with the color picker; changing it re-converts all images in the list straight away.`,
    },
    {
      heading: 'Tips for converting PNG to JPG',
      kind: 'tips',
      body: `- **Keep the PNG.** JPG is lossy; if you need to edit the image again, edit the PNG and convert again rather than editing the JPG.
- **Check text and thin lines** at 100% zoom after converting. If you see fuzzy halos, raise the quality or keep the image as PNG.
- **Semi-transparent shadows** blend into the background color, so a shadow made for a white page looks wrong on a dark one.
- **Large batches** are processed in a background thread, one image at a time, and you can download them together as a ZIP.
- **Going the other way?** See the [JPG to PNG converter](/image-tools/jpg-to-png). To shrink files further, try [PNG to WebP](/image-tools/png-to-webp), which also keeps transparency.`,
    },
  ],
  features: [
    'Converts PNG images to JPG (JPEG) in batches.',
    'Background color picker for transparent and semi-transparent pixels.',
    'Adjustable JPG quality from 10% to 100%.',
    'Shows the size of every converted file.',
    'Background-thread processing with ZIP download.',
    'Original file names kept with a .jpg extension.',
    'Your files never leave your device: conversion happens in your browser.',
  ],
  faqs: [
    {
      question: 'Why is my JPG so much smaller than the PNG?',
      answer:
        'PNG stores every pixel losslessly, while JPG uses lossy compression designed for photos. For photographs the JPG is often several times smaller with no visible difference.',
    },
    {
      question: 'What happens to the transparent background?',
      answer:
        'JPG cannot store transparency, so transparent areas are filled with the background color you choose. White is the default.',
    },
    {
      question: 'Which JPG quality should I choose?',
      answer:
        '85–90% is a good default for photos. Use 95% or more for images with text or sharp edges, or lower values if file size matters most.',
    },
    {
      question: 'Is JPEG the same as JPG?',
      answer:
        'Yes. They are the same format; .jpg became common because older Windows systems limited file extensions to three letters.',
    },
    {
      question: 'Can I convert many PNG files at once?',
      answer:
        'Yes. Add as many PNG images as you like and download all the JPG files as a single ZIP.',
    },
    {
      question: 'Are my images uploaded?',
      answer: 'No. The conversion happens in your browser and your images never leave your device.',
    },
  ],
  relatedSlugs: ['jpg-to-png', 'png-to-webp', 'compress-image', 'image-converter'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

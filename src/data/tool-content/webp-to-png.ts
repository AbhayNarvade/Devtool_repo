import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const webpToPng: Tool = {
  slug: 'webp-to-png',
  category: 'image-tools',
  name: 'WebP to PNG Converter',
  h1: 'WebP to PNG Converter',
  metaTitle: brandTitle('WebP to PNG Converter: Lossless, Batch, Free'),
  metaDescription:
    'Convert WebP to PNG online when an app or site does not accept WebP. Keeps transparency, converts in batches and downloads a ZIP. Free, private, no upload.',
  primaryKeyword: 'WebP to PNG',
  secondaryKeywords: [
    'convert webp to png',
    'webp to png converter',
    'open webp file',
    'save webp as png',
  ],
  intro:
    'Saved an image from the web and got a .webp file your software will not open? Convert WebP to PNG, the lossless format every editor, office suite and upload form understands.',
  cardDescription: 'Convert WebP images to widely supported PNG.',
  icon: 'convert',
  handlesFiles: true,
  howToSteps: [
    'Choose, drop or paste one or more WebP images.',
    'Conversion starts automatically; PNG is lossless, so there is no quality setting.',
    'Check the converted files in the list.',
    'Download each PNG or all of them as a ZIP.',
  ],
  contentSections: [
    {
      heading: 'Why convert WebP to PNG?',
      kind: 'concept',
      body: `Many websites now serve images as WebP because it makes pages faster. When you right-click and save such an image, you get a \`.webp\` file. Browsers display it without problems, but plenty of other software is less accommodating:

- older versions of image editors, office suites and presentation software;
- some email clients, messaging apps and print services;
- upload forms that only list JPG and PNG as allowed types;
- scripts and tools in build pipelines that expect PNG input.

Converting WebP to PNG solves all of these. PNG is supported practically everywhere and is **lossless**, so the conversion adds no further quality loss: every pixel of the decoded WebP is stored exactly.

### Transparency is preserved

WebP and PNG both support an alpha channel. Logos, stickers and product cut-outs with transparent backgrounds stay transparent after conversion, which is the main reason to choose PNG over JPG here. If you do not need transparency and want a smaller file, use [WebP to JPG](/image-tools/webp-to-jpg) instead.`,
    },
    {
      heading: 'WebP to PNG: what to expect',
      kind: 'examples',
      body: `| WebP image | Resulting PNG |
| --- | --- |
| Logo with a transparent background | PNG with the same transparency |
| Photo from a news or shopping site | PNG of identical appearance, usually much larger |
| Animated WebP (like a GIF) | Still PNG of the first frame |
| Lossless WebP screenshot | Pixel-identical PNG |

The PNG is often larger than the WebP: WebP compresses more efficiently, and lossy WebP data has to be stored without loss in the PNG. That is normal and does not mean anything went wrong.`,
    },
    {
      heading: 'Why websites send you WebP files',
      kind: 'concept',
      body: `When your browser requests an image, it tells the server which formats it understands, using the \`Accept\` HTTP header (for example \`image/avif,image/webp,*/*\`). Many websites and image CDNs use that information to send WebP or AVIF to browsers that support them and JPG or PNG to others. The address of the image may even end in \`.jpg\` while the file you receive is actually WebP.

That is why "Save image as" often produces a WebP file even on pages where you expected a JPG or PNG. Converting the saved file to PNG gives you a format that works in any program, with the same appearance and transparency as the image you saw in the browser.`,
    },
    {
      heading: 'Tips for converting WebP to PNG',
      kind: 'tips',
      body: `- **Animated WebP files** are converted as a single still image (the first frame), because PNG output from the canvas is not animated.
- **Batch conversion**: drop several WebP files at once; the ZIP keeps their original names with a .png extension, numbered if two names clash.
- **Respect image rights.** Converting an image you downloaded does not change who owns it; check the license before reusing it.
- **Quality cannot improve.** If the WebP was heavily compressed, the PNG keeps those artifacts exactly.
- **Large PNGs?** Shrink them with the [image resizer](/image-tools/resize-image) if you do not need the full resolution.
- **Making WebP files** from PNG is the reverse job: see [PNG to WebP](/image-tools/png-to-webp).`,
    },
  ],
  features: [
    'Converts WebP images to lossless PNG.',
    'Keeps transparent and semi-transparent pixels.',
    'Batch conversion with ZIP download.',
    'Works in every current browser, including Safari, because PNG can always be created.',
    'Background-thread processing for large images.',
    'Original file names kept with a .png extension.',
    'Your files never leave your device: conversion happens in your browser.',
  ],
  faqs: [
    {
      question: 'Why can’t I open my WebP file?',
      answer:
        'Some older programs and services do not support WebP yet. Converting the file to PNG makes it readable by practically any software.',
    },
    {
      question: 'Is any quality lost when converting WebP to PNG?',
      answer:
        'No additional quality is lost, because PNG is lossless. The PNG shows exactly what the WebP showed.',
    },
    {
      question: 'Does the PNG keep the transparent background?',
      answer: 'Yes. Transparency in the WebP is preserved in the PNG.',
    },
    {
      question: 'Why is the PNG larger than the WebP?',
      answer:
        'WebP is a more efficient format, and lossy WebP data must be stored pixel by pixel in a PNG. A larger file is expected.',
    },
    {
      question: 'Can I convert animated WebP files?',
      answer: 'Only the first frame is converted, producing a still PNG image.',
    },
    {
      question: 'Is my image uploaded anywhere?',
      answer: 'No. The conversion runs in your browser and your image stays on your device.',
    },
  ],
  relatedSlugs: ['webp-to-jpg', 'png-to-webp', 'image-converter', 'resize-image'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

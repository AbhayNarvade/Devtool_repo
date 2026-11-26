import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const pngToWebp: Tool = {
  slug: 'png-to-webp',
  category: 'image-tools',
  name: 'PNG to WebP Converter',
  h1: 'PNG to WebP Converter',
  metaTitle: brandTitle('PNG to WebP Converter: Keep Transparency'),
  metaDescription:
    'Convert PNG to WebP online for faster websites. Keeps transparency, lets you set the quality and converts whole batches. Free and private, with no uploads.',
  primaryKeyword: 'PNG to WebP',
  secondaryKeywords: [
    'convert png to webp',
    'png to webp converter',
    'webp with transparency',
    'optimize png for web',
  ],
  intro:
    'Convert PNG to WebP to make images much lighter for the web while keeping transparent backgrounds. Set the quality and convert one image or a whole folder’s worth.',
  cardDescription: 'Convert PNG to lighter WebP and keep transparency.',
  icon: 'convert',
  handlesFiles: true,
  howToSteps: [
    'Choose, drop or paste your PNG images.',
    'Set the WebP quality: 80–90% suits photos, 90%+ suits graphics with sharp edges.',
    'Compare the new file sizes in the list.',
    'Download the WebP images individually or as a ZIP file.',
  ],
  contentSections: [
    {
      heading: 'Why convert PNG to WebP for the web?',
      kind: 'concept',
      body: `Images are usually the heaviest part of a web page, and large PNGs are a common cause of slow loading and poor Core Web Vitals scores. WebP was designed by Google specifically for the web. It supports everything PNG offers for websites, including a full **alpha channel for transparency**, while producing much smaller files.

That combination makes PNG to WebP the go-to conversion for:

- product photos and cut-outs on transparent backgrounds in online shops;
- hero images and illustrations that were exported as PNG;
- icons and UI artwork that need transparency but do not need to be pixel-perfect.

WebP is supported by all current versions of Chrome, Edge, Firefox, Opera and Safari (Safari 14 and later), so it can be used directly in \`<img>\` tags today.

### Lossy WebP with transparency

This converter writes **lossy WebP** at the quality you choose, while keeping the transparency information of the PNG. Lossy compression is what produces the big savings on photographic content. For flat graphics, high quality settings keep edges crisp; very low settings can soften fine lines.`,
    },
    {
      heading: 'Using converted WebP images on a website',
      kind: 'examples',
      body: `A plain image tag works in every current browser:

\`\`\`html
<img src="/images/product.webp" alt="Blue ceramic mug" width="800" height="800" loading="lazy">
\`\`\`

If you must support very old browsers, serve the PNG as a fallback with the \`<picture>\` element. The browser downloads only the first format it supports:

\`\`\`html
<picture>
  <source srcset="/images/product.webp" type="image/webp">
  <img src="/images/product.png" alt="Blue ceramic mug" width="800" height="800">
</picture>
\`\`\`

Always set \`width\` and \`height\` so the browser reserves space and the layout does not jump while images load.`,
    },
    {
      heading: 'When to keep PNG instead of WebP',
      kind: 'concept',
      body: `WebP is the better web format for most images, but there are cases where PNG is still the right choice:

- **Pixel-exact graphics**: pixel art, QR codes and technical diagrams where every pixel must stay exactly as drawn. Lossy WebP can blur single-pixel lines.
- **Files for other software**: design tools, game engines and some content management systems still expect PNG.
- **Source files**: keep PNG masters for editing and generate WebP only for publishing.

A practical approach is to convert, then look at the result at 100% zoom next to the original. If you cannot see a difference, use the WebP.`,
    },
    {
      heading: 'Tips for PNG to WebP conversion',
      kind: 'tips',
      body: `- **Keep the PNG originals** for future editing; WebP at less than 100% quality is lossy.
- **Screenshots of text and code** sometimes look better as PNG. Compare the result at 100% zoom before replacing them.
- **Creating WebP requires Chrome, Edge or Firefox.** Safari can display WebP images but cannot create them, so the converter shows a message there.
- **Resize as well** if the PNG is larger than it is displayed; see the [image resizer](/image-tools/resize-image).
- **Need to go back?** The [WebP to PNG converter](/image-tools/webp-to-png) restores a PNG for tools that do not support WebP.`,
    },
  ],
  features: [
    'Converts PNG to WebP while preserving transparency.',
    'Adjustable WebP quality for the right balance of size and sharpness.',
    'Batch conversion with ZIP download.',
    'File size of each converted image shown in the list.',
    'Background-thread processing keeps the page responsive.',
    'Clear message if your browser cannot create WebP.',
    'Your files never leave your device: conversion happens in your browser.',
  ],
  faqs: [
    {
      question: 'Does WebP keep the transparent background of my PNG?',
      answer:
        'Yes. WebP supports an alpha channel, so transparent and semi-transparent pixels are preserved.',
    },
    {
      question: 'How much smaller will my images be?',
      answer:
        'It depends on the image. Photographic PNGs usually shrink dramatically; simple graphics with few colors shrink less. The list shows the actual size of every converted file.',
    },
    {
      question: 'Can all browsers show WebP images?',
      answer:
        'All current major browsers can, including Safari 14 and later. Use a picture element with a PNG fallback only if you must support very old browsers.',
    },
    {
      question: 'Why does the converter not work in Safari?',
      answer:
        'Safari can display WebP but its canvas cannot encode WebP files. Use Chrome, Edge or Firefox to convert.',
    },
    {
      question: 'What quality should I use?',
      answer:
        'Around 80–90% for photos and 90% or more for graphics with text or thin lines. Check the result at full size if sharp edges matter.',
    },
    {
      question: 'Are my images uploaded?',
      answer: 'No. Conversion happens entirely in your browser.',
    },
  ],
  relatedSlugs: ['webp-to-png', 'png-to-jpg', 'jpg-to-webp', 'compress-image'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

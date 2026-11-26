import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const imageConverter: Tool = {
  slug: 'image-converter',
  category: 'image-tools',
  name: 'Image Converter',
  h1: 'Image Converter: PNG, JPG and WebP',
  metaTitle: brandTitle('Image Converter: PNG, JPG and WebP Online'),
  metaDescription:
    'Free image converter for PNG, JPG and WebP: convert one picture or a whole batch, set quality and background colour, and download a ZIP. Runs in your browser.',
  primaryKeyword: 'image converter',
  secondaryKeywords: [
    'convert image format',
    'png jpg webp converter',
    'change image format',
    'batch image converter',
  ],
  intro:
    'Convert images between PNG, JPG and WebP in any direction, one at a time or in batches. Choose the target format, adjust quality and pick a background for transparent areas.',
  cardDescription: 'Convert between PNG, JPG and WebP in any direction.',
  icon: 'image',
  handlesFiles: true,
  howToSteps: [
    'Add PNG, JPG or WebP images by choosing, dropping or pasting them. Mixed formats are fine.',
    'Choose the format to convert to.',
    'For JPG and WebP, set the quality. For JPG, choose the colour that replaces transparency.',
    'Check the converted sizes in the list.',
    'Download each image or all of them as a ZIP file.',
  ],
  contentSections: [
    {
      heading: 'Choosing the right format with an image converter',
      kind: 'concept',
      body: `PNG, JPG and WebP are the three image formats every browser can display, and each has a job it does best. An image converter lets you move a picture into the format that suits where it is going.

| | JPG (JPEG) | PNG | WebP |
| --- | --- | --- | --- |
| Compression | Lossy | Lossless | Lossy or lossless |
| Transparency | No | Yes | Yes |
| Best for | Photos | Screenshots, logos, graphics, text | Websites: photos and graphics |
| File size | Small | Large for photos | Smallest |
| Compatibility | Universal | Universal | All modern browsers; some older apps lack support |

**JPG** has been the standard for photos since the early 1990s. It achieves small files by discarding fine detail, which is invisible in photos but causes smudges around sharp edges and text. **PNG** keeps every pixel exactly, supports transparency and is ideal for interface screenshots, diagrams and logos, but photos in PNG are large. **WebP**, developed by Google, supports both modes plus transparency and typically produces smaller files than either.

All conversions run in your browser with the HTML canvas, in a background thread, so even large batches do not freeze the page.

### One-direction converters

If you always convert in the same direction, the dedicated pages explain the details of that specific conversion:

- [PNG to JPG](/image-tools/png-to-jpg) and [JPG to PNG](/image-tools/jpg-to-png)
- [PNG to WebP](/image-tools/png-to-webp) and [WebP to PNG](/image-tools/webp-to-png)
- [JPG to WebP](/image-tools/jpg-to-webp) and [WebP to JPG](/image-tools/webp-to-jpg)`,
    },
    {
      heading: 'Which conversion should I use?',
      kind: 'examples',
      body: `| Situation | Convert to | Why |
| --- | --- | --- |
| Photo too large for an email or upload form | JPG or WebP | Lossy compression shrinks photos dramatically |
| Website images | WebP | Smallest files, keeps transparency |
| Logo or screenshot with sharp text | PNG | No compression artifacts around edges |
| Image needs a transparent background | PNG or WebP | JPG cannot store transparency |
| An app or website rejects WebP | JPG or PNG | Universal compatibility |
| Further editing in several sessions | PNG | No quality loss from repeated saving |

Converting never improves quality: turning a small, heavily compressed JPG into PNG makes the file larger but cannot restore the detail that JPG discarded.`,
    },
    {
      heading: 'Batch conversion and file names',
      kind: 'examples',
      body: `You can drop a whole folder's worth of images at once, even in mixed formats. Each file keeps its original name with the new extension, so \`team-photo.png\` becomes \`team-photo.webp\`. When several files would end up with the same name, the ZIP download numbers them (\`logo.jpg\`, \`logo (2).jpg\`) so nothing is overwritten. Changing the target format or quality re-converts every image in the list automatically, which makes it easy to compare the sizes different settings produce before downloading.`,
    },
    {
      heading: 'Conversion tips',
      kind: 'tips',
      body: `- **Quality 85–90%** is a good default for JPG and WebP photos; lower it if you need smaller files.
- **Transparency and JPG**: transparent pixels are filled with the background colour you choose. Pick a colour that matches the page or document where the image will appear.
- **Animated images**: only the first frame of an animated WebP is converted, because the canvas works with still images.
- **Safari** can display WebP but cannot create WebP files. Convert to WebP in Chrome, Edge or Firefox.
- **Metadata** such as EXIF and GPS location is removed during conversion.
- To make files smaller without changing format, use the [image compressor](/image-tools/compress-image).`,
    },
  ],
  features: [
    'Convert between PNG, JPG and WebP in every direction.',
    'Batch conversion with mixed input formats.',
    'Adjustable quality for JPG and WebP output.',
    'Background colour for transparent areas when converting to JPG.',
    'Runs in a background thread; ZIP download for batches.',
    'Clear message when a browser cannot create a format.',
    'Your files never leave your device: conversion happens in your browser.',
  ],
  faqs: [
    {
      question: 'Which image formats can I convert?',
      answer:
        'PNG, JPG (JPEG) and WebP, in any direction. You can add files in different formats to the same batch.',
    },
    {
      question: 'Is converting images free and unlimited?',
      answer: 'Yes. There is no sign-up, no watermark and no limit on the number of images.',
    },
    {
      question: 'Will converting change the image quality?',
      answer:
        'Converting to PNG is lossless. Converting to JPG or WebP applies lossy compression at the quality you choose; at 85–90% the difference is usually invisible.',
    },
    {
      question: 'What happens to transparent backgrounds?',
      answer:
        'PNG and WebP keep transparency. JPG cannot store it, so transparent areas are filled with the background colour you select.',
    },
    {
      question: 'Why can’t I create WebP files in Safari?',
      answer:
        'Safari’s canvas can read WebP but cannot encode it. Use Chrome, Edge or Firefox to create WebP images, or choose JPG or PNG.',
    },
    {
      question: 'Are my images uploaded to a server?',
      answer:
        'No. All conversions run locally in your browser, and your images never leave your device.',
    },
  ],
  relatedSlugs: ['png-to-jpg', 'jpg-to-webp', 'webp-to-png', 'compress-image', 'resize-image'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

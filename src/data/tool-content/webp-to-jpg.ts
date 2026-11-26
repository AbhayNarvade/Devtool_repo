import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const webpToJpg: Tool = {
  slug: 'webp-to-jpg',
  category: 'image-tools',
  name: 'WebP to JPG Converter',
  h1: 'WebP to JPG Converter',
  metaTitle: brandTitle('WebP to JPG Converter: Batch, Free, Private'),
  metaDescription:
    'Convert WebP to JPG online for maximum compatibility with apps, email and printing. Set the quality and background color, convert in batches. Free and private.',
  primaryKeyword: 'WebP to JPG',
  secondaryKeywords: [
    'convert webp to jpg',
    'webp to jpeg',
    'webp to jpg converter',
    'save webp as jpg',
  ],
  intro:
    'Convert WebP to JPG files that work in every app, email client, photo printer and upload form. Choose the JPG quality and the color for any transparent areas.',
  cardDescription: 'Convert WebP images to universally supported JPG.',
  icon: 'convert',
  handlesFiles: true,
  howToSteps: [
    'Choose, drop or paste one or more WebP images.',
    'Set the JPG quality; 85–90% keeps the image looking the same.',
    'If the WebP has transparency, pick the background color (white by default).',
    'Download the JPG files one by one or as a ZIP.',
  ],
  contentSections: [
    {
      heading: 'Why convert WebP to JPG?',
      kind: 'concept',
      body: `WebP is excellent for websites, but JPG remains the most widely accepted image format in the world. Converting WebP to JPG is the safest choice when an image is leaving the browser:

- **Photo printing** services and kiosks commonly require JPG.
- **Email attachments** in JPG display inline in virtually every email client.
- **Office documents and older software** open JPG without plug-ins.
- **Upload forms**, from job portals to government websites, often list only JPG and PNG.

Compared with [WebP to PNG](/image-tools/webp-to-png), converting to JPG gives a much smaller file for photos, because JPG is lossy like most WebP images. The trade-off is that JPG has no transparency.

### Transparent WebP images

WebP supports transparent backgrounds; JPG does not. Before encoding, every pixel is placed on a solid **background color** that you choose. Pick white for documents and printing, or match the color of the page or slide where the picture will appear so soft edges blend in naturally.`,
    },
    {
      heading: 'WebP to JPG examples',
      kind: 'examples',
      body: `| WebP image | JPG result |
| --- | --- |
| Product photo from an online shop | JPG of similar size, ready to print or email |
| Sticker or logo with transparency | JPG with your chosen background color |
| Animated WebP | JPG of the first frame |

For printing, use quality 90% or more. For sharing on chat apps or by email, 80–85% keeps files small while still looking sharp on phones.`,
    },
    {
      heading: 'Saving WebP images as JPG on any device',
      kind: 'examples',
      body: `Browsers save web images in the format the server sent, which is often WebP. To end up with a JPG:

1. Save the image as usual (right-click or long-press, then "Save image as" or "Download image").
2. Open this page, choose or drop the saved \`.webp\` file, or paste an image you copied to the clipboard.
3. Adjust the quality if needed and download the JPG.

This works the same on Windows, macOS, Linux, Android and iOS, because the conversion happens inside the browser rather than in an installed program. On phones, the downloaded JPG appears in your Downloads folder or Files app, from where you can add it to your photo library.

Renaming a \`.webp\` file to \`.jpg\` does **not** convert it: the data inside is still WebP, and programs that do not support WebP will still refuse to open it, sometimes with a confusing "corrupt file" message.`,
    },
    {
      heading: 'Tips for converting WebP to JPG',
      kind: 'tips',
      body: `- **Use high quality for printing.** Printed images show compression artifacts more than screens do; 90–95% is a safe range.
- **Animated WebP files** become a still image of the first frame.
- **Check soft edges** on transparent images after choosing the background color; shadows designed for a light background look odd on a dark one.
- **No quality is gained** by converting: if the WebP was heavily compressed, the JPG will not be sharper.
- **Works in Safari too**, because every browser can create JPG files.
- **Several images from one page?** Drop them all at once and download a single ZIP with every JPG, named after the original files.
- For a lossless copy instead, use [WebP to PNG](/image-tools/webp-to-png).`,
    },
  ],
  features: [
    'Converts WebP images to JPG (JPEG).',
    'Adjustable JPG quality from 10% to 100%.',
    'Background color for transparent areas.',
    'Batch conversion with ZIP download.',
    'Works in all current browsers, including Safari.',
    'Background-thread processing for large batches.',
    'Your files never leave your device: conversion happens in your browser.',
  ],
  faqs: [
    {
      question: 'Why convert WebP to JPG?',
      answer:
        'JPG is accepted by practically every app, printer, email client and upload form, while WebP support outside browsers is still incomplete.',
    },
    {
      question: 'What happens to transparency?',
      answer:
        'JPG cannot store transparency, so transparent areas are filled with the background color you choose.',
    },
    {
      question: 'Which quality should I use?',
      answer:
        '85–90% for general use and 90–95% for printing. Lower values make smaller files with more visible artifacts.',
    },
    {
      question: 'Should I choose JPG or PNG?',
      answer:
        'Choose JPG for photos where small size and compatibility matter. Choose PNG if you need transparency or an exact, lossless copy.',
    },
    {
      question: 'Can I convert several WebP files at once?',
      answer: 'Yes. Add as many images as you like and download them all as a ZIP.',
    },
    {
      question: 'Are my images uploaded?',
      answer: 'No. They are converted in your browser and never leave your device.',
    },
  ],
  relatedSlugs: ['webp-to-png', 'jpg-to-webp', 'png-to-jpg', 'image-converter'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

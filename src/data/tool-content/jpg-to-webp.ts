import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jpgToWebp: Tool = {
  slug: 'jpg-to-webp',
  category: 'image-tools',
  name: 'JPG to WebP Converter',
  h1: 'JPG to WebP Converter',
  metaTitle: brandTitle('JPG to WebP Converter: Smaller Web Photos'),
  metaDescription:
    'Convert JPG to WebP online to make photos smaller and websites faster. Adjust the quality, convert in batches and download a ZIP. Free, private, no upload.',
  primaryKeyword: 'JPG to WebP',
  secondaryKeywords: [
    'convert jpg to webp',
    'jpeg to webp',
    'jpg to webp converter',
    'webp for website',
  ],
  intro:
    'Convert JPG to WebP to cut the file size of your photos without visible loss, so web pages, shops and blogs load faster. Set the quality and convert whole batches at once.',
  cardDescription: 'Convert JPG photos to smaller WebP files.',
  icon: 'convert',
  handlesFiles: true,
  howToSteps: [
    'Choose, drop or paste your JPG or JPEG photos.',
    'Set the WebP quality; 75–85% is a good range for web photos.',
    'Compare each new file size with the original in the list.',
    'Download the WebP images individually or as a ZIP file.',
  ],
  contentSections: [
    {
      heading: 'Why convert JPG to WebP?',
      kind: 'concept',
      body: `JPG has been the standard photo format for decades, but its compression method dates from the early 1990s. WebP uses newer compression techniques derived from video coding and, according to Google’s published comparison, produces files 25–34% smaller than JPG at equivalent visual quality. For a page with a dozen photos, that difference translates directly into faster loading, lower bandwidth costs and better Largest Contentful Paint scores, one of Google’s Core Web Vitals.

Typical reasons to convert JPG to WebP:

- speeding up product galleries, blog posts and landing pages;
- reducing storage and CDN bandwidth for image-heavy sites;
- meeting performance budgets flagged by tools such as Lighthouse and PageSpeed Insights ("serve images in modern formats").

### Avoiding double compression

Your JPG is already lossy, and converting to lossy WebP compresses it a second time. At sensible quality settings the extra loss is not visible, but very low settings make existing JPG artifacts worse. Two habits keep quality high: convert from the **highest-quality JPG you have** (ideally the camera original, not a copy that was already compressed for the web), and keep the WebP quality at 75% or above for photos.`,
    },
    {
      heading: 'JPG to WebP quality guide',
      kind: 'examples',
      body: `| WebP quality | Typical use |
| --- | --- |
| 90–100% | Photography portfolios, zoomable product images |
| 75–85% | Blog and article images, shop listings (recommended default) |
| 60–70% | Thumbnails and small previews |
| Below 60% | Only when size matters more than appearance |

After converting, reference the WebP in your HTML like any other image. Include \`width\` and \`height\` to avoid layout shifts:

\`\`\`html
<img src="/photos/beach.webp" alt="Sunset over a sandy beach" width="1600" height="1067" loading="lazy">
\`\`\``,
    },
    {
      heading: 'Measuring the improvement on your site',
      kind: 'examples',
      body: `To see what the conversion gains in practice, compare the page before and after replacing the images:

1. Open the page in Chrome, press F12 and choose the **Network** tab, then filter by **Img** and reload. The "transferred" total shows how much image data the page downloads.
2. Run **Lighthouse** (in the same developer tools) and look at Largest Contentful Paint and the "Serve images in modern formats" audit.
3. Replace the JPGs with the converted WebP files and measure again.

Most content management systems accept WebP uploads today; WordPress, for example, has supported WebP since version 5.8. If your CMS or image CDN can convert images automatically, let it do so, and use this converter for one-off images, static sites and email-free web assets.`,
    },
    {
      heading: 'Tips for JPG to WebP conversion',
      kind: 'tips',
      body: `- **Resize too.** A 4000-pixel camera photo displayed 1200 pixels wide still wastes most of its data, even as WebP. Use the [image resizer](/image-tools/resize-image) first.
- **Keep your JPG originals**; do not delete them after converting.
- **WebP files are created in Chrome, Edge and Firefox.** Safari can show WebP but cannot create it.
- **Email and offline sharing**: some email clients and older apps still prefer JPG, so keep JPG for attachments.
- **Need JPG back?** Use the [WebP to JPG converter](/image-tools/webp-to-jpg).`,
    },
  ],
  features: [
    'Converts JPG and JPEG photos to WebP.',
    'Adjustable quality to balance size and appearance.',
    'Shows the new size of every converted photo.',
    'Batch conversion with ZIP download.',
    'Background-thread processing for large photo sets.',
    'EXIF orientation applied so photos stay upright.',
    'Your files never leave your device: conversion happens in your browser.',
  ],
  faqs: [
    {
      question: 'Is WebP better than JPG?',
      answer:
        'For websites, usually yes: WebP files are smaller at similar visual quality and also support transparency. JPG remains more compatible with older software and email clients.',
    },
    {
      question: 'Will converting JPG to WebP lose quality?',
      answer:
        'WebP is lossy at the quality you choose, so there is a second round of compression. At 75% or higher the difference is normally not visible.',
    },
    {
      question: 'Do all browsers support WebP images?',
      answer: 'Yes, all current major browsers display WebP, including Safari 14 and later.',
    },
    {
      question: 'Why does conversion fail in Safari?',
      answer:
        'Safari cannot encode WebP files in the browser. Use Chrome, Edge or Firefox to create WebP images.',
    },
    {
      question: 'Can I convert many photos at once?',
      answer: 'Yes. Add as many photos as you like and download all the WebP files as one ZIP.',
    },
    {
      question: 'Are my photos uploaded?',
      answer: 'No. Your photos are converted on your device and never sent anywhere.',
    },
  ],
  relatedSlugs: ['webp-to-jpg', 'png-to-webp', 'compress-image', 'resize-image'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

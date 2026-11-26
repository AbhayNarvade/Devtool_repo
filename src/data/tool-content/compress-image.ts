import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const compressImage: Tool = {
  slug: 'compress-image',
  category: 'image-tools',
  name: 'Image Compressor',
  h1: 'Compress Images: Reduce JPG, PNG and WebP File Size',
  metaTitle: brandTitle('Compress Image Online: JPG, PNG and WebP Files'),
  metaDescription:
    'Compress images online for free: shrink JPG, PNG and WebP files with a quality slider, see the size saved, batch process and download a ZIP. No upload needed.',
  primaryKeyword: 'compress image',
  secondaryKeywords: [
    'image compressor',
    'reduce image size',
    'compress jpg',
    'compress png',
    'shrink photo',
  ],
  intro:
    'Make photos and graphics smaller for email, websites and upload limits. Choose a quality level, compare the size before and after, and download one image or a whole batch as a ZIP.',
  cardDescription: 'Shrink JPG, PNG and WebP files with a quality slider.',
  icon: 'compress',
  handlesFiles: true,
  popular: true,
  howToSteps: [
    'Choose images, drag them onto the drop area, or paste a screenshot. You can add as many as you like.',
    'Set the quality: around 70–80% gives a large saving with little visible difference for photos.',
    'Optionally pick an output format (WebP is usually smallest) and a maximum width or height.',
    'Check the before and after sizes and the percentage saved for each image.',
    'Download images one by one, or all of them as a ZIP file.',
  ],
  contentSections: [
    {
      heading: 'How to compress image files without visible quality loss',
      kind: 'concept',
      body: `Digital photos are much larger than they need to be for most uses. A 12-megapixel phone photo is often 3–5 MB, while a sharp image on a web page or in an email rarely needs more than a few hundred kilobytes. Image compression closes that gap.

There are three levers, and this tool gives you all of them:

1. **Quality (lossy re-encoding).** JPG and WebP throw away detail that the eye barely notices, mostly fine texture and subtle colour variation. The quality setting controls how much is discarded. Between 70% and 85%, most photos look identical to the original at normal viewing size, yet the file can be several times smaller.
2. **Format.** WebP usually produces smaller files than JPG at similar visual quality, and it supports transparency. Converting a large PNG photo to WebP or JPG can cut its size by 80% or more.
3. **Dimensions.** A 6000-pixel-wide image displayed in an 800-pixel column wastes most of its pixels. Setting a maximum width or height removes them, which is often the biggest saving of all.

Compression runs in a background thread using the browser-image-compression library, so the page stays responsive even with dozens of large photos. If re-encoding would make an image bigger in its original format, which happens with files that are already well optimised, the tool keeps the original instead.

### What about PNG?

PNG is **lossless**: it never discards detail, so a quality slider has nothing to adjust. A PNG gets smaller here only if you reduce its dimensions or convert it to WebP or JPG. For screenshots, logos and graphics with sharp edges and few colours, PNG is often already compact and the right format to keep.`,
    },
    {
      heading: 'Image compression examples',
      kind: 'examples',
      body: `The three levers work together. Take a typical 12-megapixel phone photo of 4032 × 3024 pixels:

| Change | Effect on the data |
| --- | --- |
| Quality 100% → 80% (JPG or WebP) | Fine texture is simplified; for most photos this alone shrinks the file several times over |
| JPG → WebP at similar quality | Google's published comparison found WebP files 25–34% smaller than JPG at equivalent visual quality |
| Max size 1920 px (1920 × 1440) | 2.8 million instead of 12.2 million pixels: 77% fewer pixels to store |

The exact result depends on the picture itself, which is why the tool shows the real before and after size of every file. A busy photo with foliage, gravel or noise compresses less than a clear sky or a studio product shot, because there is more detail to describe. Screenshots of text compress best as PNG; heavy JPG compression creates visible smudges ("artifacts") around letters.

### Choosing settings for common targets

- **Email attachments** (often limited to 20–25 MB per message): WebP or JPG at 75%, maximum 1920 px.
- **Website photos**: WebP at 70–80%, sized to the largest width the page displays them at, times two for high-DPI screens.
- **Upload forms with a size limit** (for example "max 1 MB"): lower the maximum dimension first, then the quality, until the new size fits.`,
    },
    {
      heading: 'Tips for the best compression results',
      kind: 'tips',
      body: `- **Start at 75–80% quality** and lower it only if the file is still too big. Below about 50%, blockiness and colour banding become visible.
- **Resize first, then compress.** Halving the width and height removes three quarters of the pixels; no quality setting comes close to that saving.
- **Keep your originals.** Every lossy re-save loses a little more detail, so compress copies, not the master files.
- **Metadata is removed.** Re-encoding drops EXIF data such as camera model and GPS location, which also protects your privacy when sharing photos.
- **Colour profiles**: images are converted to the standard sRGB colour space. Photos taken in wide-gamut Display P3 may look very slightly less saturated on high-end screens.
- **Safari cannot create WebP files.** Safari opens WebP images but cannot encode them; choose JPG output there, or use Chrome, Edge or Firefox.
- To change dimensions precisely, use the [image resizer](/image-tools/resize-image).`,
    },
  ],
  features: [
    'Compress JPG, PNG and WebP images with an adjustable quality slider.',
    'Before and after file sizes with the percentage saved for each image and for the batch.',
    'Optional conversion to WebP or JPG for much smaller files.',
    'Optional maximum width or height to shrink oversized photos.',
    'Batch processing in a background thread and one-click ZIP download.',
    'Keeps the original automatically when it is already smaller.',
    'Your files never leave your device: compression happens in your browser.',
  ],
  faqs: [
    {
      question: 'Are my images uploaded to compress them?',
      answer:
        'No. The images are compressed by your browser on your own device and are never uploaded, so private photos stay private.',
    },
    {
      question: 'What quality setting should I use?',
      answer:
        'For photos, 70–85% is usually indistinguishable from the original at normal size while saving most of the space. Use higher values for images with fine text or sharp edges.',
    },
    {
      question: 'Why did my PNG barely get smaller?',
      answer:
        'PNG is a lossless format, so there is no quality to reduce. Shrink its dimensions, or convert it to WebP or JPG, to make it substantially smaller.',
    },
    {
      question: 'How many images can I compress at once?',
      answer:
        'There is no fixed limit. Images are processed one after another in the background; very large batches mainly depend on your device memory.',
    },
    {
      question: 'Does compression remove EXIF and location data?',
      answer:
        'Yes. Re-encoded images do not keep EXIF metadata, so camera details and GPS coordinates are removed.',
    },
    {
      question: 'Is WebP supported everywhere?',
      answer:
        'All current major browsers display WebP, including Safari. Some older desktop apps and upload forms still expect JPG or PNG, so choose those formats when compatibility matters.',
    },
  ],
  relatedSlugs: ['resize-image', 'image-converter', 'crop-image', 'jpg-to-webp', 'png-to-jpg'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

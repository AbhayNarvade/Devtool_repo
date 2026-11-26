import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const resizeImage: Tool = {
  slug: 'resize-image',
  category: 'image-tools',
  name: 'Image Resizer',
  h1: 'Resize Image: Change Dimensions in Pixels or Percent',
  metaTitle: brandTitle('Resize Image Online: Pixels or Percentage'),
  metaDescription:
    'Resize images online by exact pixels or percentage, keep the aspect ratio and process whole batches. Works with JPG, PNG and WebP. Free, private, no upload.',
  primaryKeyword: 'resize image',
  secondaryKeywords: [
    'image resizer',
    'change image size',
    'resize photo',
    'resize png',
    'batch resize images',
  ],
  intro:
    'Resize image files by exact pixels or by percentage. Keep the original proportions or set an exact size, for one picture or a whole batch.',
  cardDescription: 'Resize images by pixels or percent, in batches.',
  icon: 'resize',
  handlesFiles: true,
  popular: true,
  howToSteps: [
    'Add one or more images by choosing, dropping or pasting them.',
    'Choose Pixels to enter a width and/or height, or Percentage to scale everything by the same amount.',
    'Keep "Keep aspect ratio" on to avoid stretching. Leave one dimension empty to scale by the other.',
    'Optionally change the output format and quality.',
    'Download the resized images individually or as a ZIP file.',
  ],
  contentSections: [
    {
      heading: 'What happens when you resize image files?',
      kind: 'concept',
      body: `A digital image is a grid of pixels. Resizing creates a new grid of a different size and calculates the color of each new pixel from the pixels around it in the original, a process called **resampling**.

**Downscaling** (making an image smaller) combines several original pixels into one. Done carefully, it keeps the picture sharp while removing detail the target size cannot show anyway. This resizer reduces large images in halving steps with high-quality smoothing, which avoids the jagged edges and shimmering patterns ("aliasing") that a single big reduction can cause.

**Upscaling** (making an image larger) has to invent pixels that were never captured. The result is softer, not more detailed. Upscaling is fine for small adjustments; for large enlargements, start from a higher-resolution original if you have one.

### Pixels, percentages and aspect ratio

- **Pixels** set an exact target, such as 1200 pixels wide for a blog or 1080 × 1080 for a square post.
- **Percentage** scales every image by the same factor, which is handy for batches of photos of different sizes.
- **Aspect ratio** is the proportion of width to height. With **Keep aspect ratio** on, entering both a width and a height fits the image *inside* that box, so it is never distorted. Turn it off only when you need an exact size and accept stretching; to change the shape without distortion, [crop the image](/image-tools/crop-image) instead.

### Pixels vs DPI

DPI (dots per inch) only matters for printing. On screens, only the pixel dimensions count. For print, divide the pixel width by the desired DPI to get the printed size: a 3000-pixel-wide image prints 10 inches wide at 300 DPI.`,
    },
    {
      heading: 'Common image sizes',
      kind: 'examples',
      body: `| Use | Size (pixels) | Aspect ratio |
| --- | --- | --- |
| Full HD wallpaper / slide | 1920 × 1080 | 16:9 |
| YouTube thumbnail | 1280 × 720 | 16:9 |
| Instagram square post | 1080 × 1080 | 1:1 |
| Instagram portrait post | 1080 × 1350 | 4:5 |
| Stories and reels | 1080 × 1920 | 9:16 |
| Blog content image | 1200 wide | any |
| Email newsletter image | 600 wide (1200 for sharp high-DPI screens) | any |

For a batch of holiday photos of mixed orientations, enter **1600** as both width and height with Keep aspect ratio on: landscape photos become 1600 pixels wide and portrait photos 1600 pixels tall, and none is distorted.`,
    },
    {
      heading: 'Resizing tips',
      kind: 'tips',
      body: `- **Resize before you compress.** Fewer pixels means a much smaller file; then use the [image compressor](/image-tools/compress-image) for the final squeeze.
- **Prepare images for high-DPI screens.** Phones and modern laptops show two or three device pixels per CSS pixel, so an image displayed 600 pixels wide looks sharpest at 1200 pixels.
- **Very large outputs** can fail on phones because of memory limits. Browsers allow at most 16,384 pixels per side.
- **Output format**: by default the resized image keeps its original format. PNG stays lossless; JPG and WebP use the quality setting.
- **Metadata** such as EXIF and GPS location is not copied to the resized image.
- **File names** get the new dimensions appended, for example \`photo-1600x1200.jpg\`, so originals are never overwritten.`,
    },
  ],
  features: [
    'Resize by exact pixels or by percentage (1–200%).',
    'Keep the aspect ratio, fit inside a box, or stretch to an exact size.',
    'High-quality multi-step downscaling for sharp results.',
    'Batch resize images of different sizes and orientations at once.',
    'Keep the original format or save as JPG, PNG or WebP.',
    'Processing in a background thread with ZIP download for batches.',
    'Your files never leave your device: resizing happens in your browser.',
  ],
  faqs: [
    {
      question: 'How do I resize an image without distorting it?',
      answer:
        'Keep "Keep aspect ratio" switched on. Enter only a width or only a height, or both to fit the image inside that box; the other dimension is calculated automatically.',
    },
    {
      question: 'Can I resize several images at once?',
      answer:
        'Yes. Add as many images as you like; each is resized with the same settings and you can download them together as a ZIP file.',
    },
    {
      question: 'Does resizing reduce image quality?',
      answer:
        'Making an image smaller keeps it sharp at its new size. Making it larger cannot add real detail, so enlarged images look softer. Saving as JPG or WebP also applies the chosen quality.',
    },
    {
      question: 'What is the difference between resizing and cropping?',
      answer:
        'Resizing scales the whole picture to new dimensions. Cropping cuts away parts of the picture and keeps the remaining pixels at their original scale.',
    },
    {
      question: 'Are my photos uploaded?',
      answer: 'No. Images are resized in your browser and never leave your device.',
    },
    {
      question: 'What is the maximum size?',
      answer:
        'Browsers allow up to 16,384 pixels per side. In practice, phones with little memory may struggle with images above about 50 megapixels.',
    },
  ],
  relatedSlugs: ['compress-image', 'crop-image', 'image-converter', 'png-to-jpg'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

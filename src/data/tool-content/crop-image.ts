import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const cropImage: Tool = {
  slug: 'crop-image',
  category: 'image-tools',
  name: 'Image Cropper',
  h1: 'Crop Image Online: Free Crop, Rotate and Flip',
  metaTitle: brandTitle('Crop Image Online: Free, 1:1, 16:9, 9:16'),
  metaDescription:
    'Crop image files online with a free selection or preset ratios like 1:1, 16:9, 4:3 and 9:16, then rotate or flip. Save as JPG, PNG or WebP. Free, no upload.',
  primaryKeyword: 'crop image',
  secondaryKeywords: [
    'image cropper',
    'crop photo',
    'crop to square',
    'rotate image',
    'flip image',
  ],
  intro:
    'Cut away unwanted edges, crop to a square or a widescreen ratio, and rotate or mirror the picture. Drag the crop box freely or enter exact pixel values.',
  cardDescription: 'Crop freely or to 1:1, 16:9, 4:3 or 9:16; rotate and flip.',
  icon: 'crop',
  handlesFiles: true,
  howToSteps: [
    'Choose, drop or paste an image.',
    'Pick Free or an aspect ratio such as 1:1 for profile pictures or 9:16 for stories.',
    'Drag the crop box and its handles, or type exact X, Y, width and height values in pixels.',
    'Rotate in 90° steps or flip horizontally or vertically if needed.',
    'Choose the output format and click "Crop and download".',
  ],
  contentSections: [
    {
      heading: 'Crop image files to the right shape',
      kind: 'concept',
      body: `Cropping removes the outer parts of a picture. Unlike resizing, it does not scale anything: the pixels you keep stay exactly as sharp as they were. That makes cropping the right tool for three jobs:

- **Improving composition**: removing distracting edges, straightening the focus onto the subject, or placing it on a third of the frame.
- **Fitting a required shape**: profile pictures are square, video thumbnails are 16:9 and stories are 9:16. Platforms that receive a different shape crop the image themselves, often cutting off heads or text.
- **Removing private details**: a house number, a notification on a screenshot or a person in the background.

With **Free** the box can take any shape. With a preset ratio the box keeps its proportions while you move and resize it, so the result always has exactly that shape. The grid lines inside the box divide it into thirds, a classic composition guide: placing the horizon or the subject's eyes on a line usually looks more natural than centring them.

### Rotate and flip

Rotation turns the image in 90° steps, which fixes photos that were taken sideways. **Flip horizontal** mirrors the image left to right, useful for selfies taken with a front camera that mirrors text. **Flip vertical** turns it upside down as in a reflection. Phone photos are automatically shown upright according to their EXIF orientation before you start.`,
    },
    {
      heading: 'Aspect ratios for common platforms',
      kind: 'examples',
      body: `| Ratio | Typical use | Example size |
| --- | --- | --- |
| 1:1 | Profile pictures, square posts, product photos | 1080 × 1080 |
| 16:9 | YouTube thumbnails, presentations, laptop wallpapers | 1280 × 720 |
| 4:3 | Classic photo prints, many compact cameras, tablets | 1600 × 1200 |
| 9:16 | Stories, reels, short vertical video covers, phone wallpapers | 1080 × 1920 |

A typical workflow for a profile picture: choose **1:1**, drag the box over the face with a little space above the head, crop, then use the [image resizer](/image-tools/resize-image) to bring it down to the size the platform recommends. Cropping first and resizing second gives the sharpest result.`,
    },
    {
      heading: 'Cropping tips',
      kind: 'tips',
      body: `- **Use exact numbers when it matters.** The pixel fields let you set the crop precisely, for example a 1200 × 630 area for a link preview image. With a fixed ratio, changing the width adjusts the height automatically.
- **Keyboard use**: every control, including rotate and flip, works with the keyboard, and the pixel fields allow precise positioning without a mouse.
- **Watch the resolution.** A tight crop of a small area may leave too few pixels for a large display; the size of the selection is shown below the image.
- **Transparent PNGs stay transparent** when saved as PNG or WebP. Saving as JPG fills transparent areas with white.
- **Quality**: PNG output is lossless. For JPG and WebP, 90% or higher keeps the crop practically identical to the original.
- **Metadata** such as EXIF and GPS location is not copied to the cropped image.`,
    },
  ],
  features: [
    'Free-form crop box with drag handles.',
    'Preset aspect ratios: 1:1, 16:9, 4:3 and 9:16.',
    'Exact crop position and size in pixels.',
    'Rotate left or right in 90° steps and flip horizontally or vertically.',
    'Rule-of-thirds grid for better composition.',
    'Save as the original format, PNG, JPG or WebP with adjustable quality.',
    'Your files never leave your device: cropping happens in your browser.',
  ],
  faqs: [
    {
      question: 'How do I crop an image to a square?',
      answer:
        'Choose the 1:1 aspect ratio, drag the square over the area you want to keep, and click "Crop and download".',
    },
    {
      question: 'Does cropping reduce image quality?',
      answer:
        'No. Cropping keeps the remaining pixels unchanged. Saving as JPG or WebP applies the selected quality, so use a high value or PNG if you need an exact copy.',
    },
    {
      question: 'Can I crop to an exact size in pixels?',
      answer:
        'Yes. Type the left, top, width and height values into the pixel fields below the image. The crop box updates to match.',
    },
    {
      question: 'Can I rotate a sideways photo?',
      answer:
        'Yes. Use the Left and Right buttons to rotate the image in 90° steps before cropping.',
    },
    {
      question: 'Will a transparent PNG keep its transparency?',
      answer:
        'Yes, if you save it as PNG or WebP. JPG does not support transparency, so transparent areas become white.',
    },
    {
      question: 'Is my image uploaded?',
      answer:
        'No. The image is cropped by your browser on your device and is never sent to a server.',
    },
  ],
  relatedSlugs: ['resize-image', 'compress-image', 'image-converter', 'jpg-to-png'],
  schemaCategory: 'MultimediaApplication',
  lastUpdated: '2026-11-26',
};

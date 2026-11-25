import { SITE_NAME } from '@/config/site';
import type { Category, CategorySlug } from './types';

export const categories: Category[] = [
  {
    slug: 'developer-tools',
    name: 'Developer Tools',
    navName: 'Developer',
    h1: 'Free Online Developer Tools',
    metaTitle: `Free Developer Tools Online: JSON, Regex, JWT | ${SITE_NAME}`,
    metaDescription:
      'Free online developer tools: format JSON, convert YAML and CSV, decode JWTs, test regex, build cron expressions and more. Runs in your browser, no upload.',
    intro:
      'Formatters, converters, encoders and calculators for everyday programming work. Every tool runs locally in your browser, so the data you paste is never sent to a server.',
    icon: 'code',
    lastUpdated: '2026-11-25',
    contentSections: [
      {
        heading: 'Why use browser-based developer tools?',
        body: `Most developer utilities do one small job: pretty-print a JSON response, decode a token, turn a timestamp into a date. Installing a package or writing a throwaway script for each of these breaks your concentration, and pasting production data into a random website can leak secrets. The tools in this category are built so the work happens on your own machine. The page downloads once, and after that your input is processed by JavaScript inside the tab. Nothing is logged, stored or uploaded.

That matters most for the data developers handle every day: API responses that contain customer records, JSON Web Tokens that grant access to an account, configuration files with internal hostnames, and SQL queries that reveal your schema. Because the processing is local, you can use these tools on sensitive material with the same confidence as a command-line utility.`,
      },
      {
        heading: 'What you can do here',
        body: `The collection covers the tasks that come up again and again during development and debugging:

- **Data formats**: format, validate and minify JSON; convert between JSON, YAML and CSV; generate TypeScript interfaces from a JSON sample.
- **Encoding**: Base64 and URL encoding and decoding that handle Unicode correctly, plus a JWT decoder that shows the header, payload and expiry in readable form.
- **Identifiers and hashes**: generate UUID v4 and v7 values in bulk and calculate MD5 and SHA checksums for text or files.
- **Time and scheduling**: convert Unix timestamps to dates in UTC and your local time zone, and build or explain cron expressions with a preview of the next run times.
- **Queries and patterns**: format SQL for several dialects and test regular expressions with live highlighting and capture groups.
- **Systems and networking**: work out Linux file permissions with the chmod calculator and plan IPv4 networks with the subnet calculator.`,
      },
      {
        heading: 'Accuracy you can rely on',
        body: `Each converter is backed by well-known, maintained libraries or by small, focused code that is covered by automated tests with known input and output pairs. Where a tool has a limitation, the page says so plainly. For example, the JWT decoder reads tokens but does not verify signatures, because verification needs the secret or public key, which should never be pasted into a website.`,
      },
    ],
    faqs: [
      {
        question: 'Are these developer tools really free?',
        answer:
          'Yes. Every tool is free to use without an account, a trial period or a usage limit. The site is supported by advertising.',
      },
      {
        question: 'Is my data sent to a server?',
        answer:
          'No. The tools run in your browser using JavaScript. The text and files you work with stay on your device and are never uploaded.',
      },
      {
        question: 'Do the tools work offline?',
        answer:
          'Once a tool page has fully loaded, the processing itself does not need a network connection. You still need to be online to open a page for the first time.',
      },
      {
        question: 'Which browsers are supported?',
        answer:
          'Current versions of Chrome, Edge, Firefox and Safari on desktop and mobile. Some features, such as file hashing with the Web Crypto API, need a modern browser and a secure (HTTPS) connection.',
      },
    ],
  },
  {
    slug: 'image-tools',
    name: 'Image Tools',
    navName: 'Image',
    h1: 'Free Online Image Tools',
    metaTitle: `Free Image Tools Online: Compress, Resize, Convert | ${SITE_NAME}`,
    metaDescription:
      'Free online image tools to compress, resize, crop and convert JPG, PNG and WebP. Batch processing in your browser, no upload, no sign-up and no watermark.',
    intro:
      'Compress, resize, crop and convert JPG, PNG and WebP images. Your photos are processed by your own browser and never leave your device.',
    icon: 'image',
    lastUpdated: '2026-11-25',
    contentSections: [
      {
        heading: 'Edit images without uploading them',
        body: `Most online image editors upload your photo to a server, process it there and send back the result. That costs time, uses mobile data twice and means a copy of your image exists on someone else's computer. The image tools on this site work differently: the browser decodes the image, draws it onto an HTML canvas, applies the change and encodes a new file, all inside the tab you are looking at. Personal photos, screenshots with private information and client artwork stay on your device.

Local processing is also fast. There is no upload queue, so even a batch of large photos is limited only by the speed of your computer.`,
      },
      {
        heading: 'Choosing the right tool',
        body: `- Use **Compress Image** when a file is too large for an email attachment, a CMS upload limit or a fast-loading web page. A quality slider lets you balance size against visual quality.
- Use **Resize Image** when the dimensions are the problem, for example a 6000-pixel camera photo that only needs to be 1600 pixels wide on a website.
- Use **Crop Image** to remove unwanted edges or fit a fixed aspect ratio such as 1:1 for profile pictures or 16:9 for video thumbnails.
- Use the **format converters** when a platform only accepts a specific type, or when you want the smaller file sizes of WebP.

### A quick guide to JPG, PNG and WebP

JPG (JPEG) uses lossy compression and is ideal for photographs, but it has no transparency. PNG is lossless and supports transparency, which makes it the right choice for logos, icons and screenshots with sharp text, at the cost of larger files for photos. WebP supports both lossy and lossless compression as well as transparency, and usually produces smaller files than either format at similar visual quality. All current major browsers can display WebP.`,
      },
    ],
    faqs: [
      {
        question: 'Are my images uploaded to a server?',
        answer:
          'No. Every image tool runs in your browser. The files are read, processed and saved on your device, and nothing is sent over the network.',
      },
      {
        question: 'Is there a file size or file count limit?',
        answer:
          'There is no artificial limit. The practical limit is your device memory: very large images (for example over 50 megapixels) can be slow or fail on phones with little RAM.',
      },
      {
        question: 'Do the tools add a watermark?',
        answer: 'No. The images you download contain only your content.',
      },
      {
        question: 'Is photo metadata (EXIF) kept?',
        answer:
          'No. Re-encoding an image through the canvas removes EXIF data such as camera details and GPS location, which is often useful for privacy.',
      },
    ],
  },
  {
    slug: 'pdf-tools',
    name: 'PDF Tools',
    navName: 'PDF',
    h1: 'Free Online PDF Tools',
    metaTitle: `Free PDF Tools Online: Merge, Split, Compress PDF | ${SITE_NAME}`,
    metaDescription:
      'Free online PDF tools to merge, split, compress and organize PDF files or turn images into a PDF. Works in your browser, no upload, no sign-up, no watermark.',
    intro:
      'Merge, split, organize and compress PDF files, or turn images into a PDF. Documents are processed locally in your browser and are never uploaded.',
    icon: 'file',
    lastUpdated: '2026-11-25',
    contentSections: [
      {
        heading: 'Private PDF editing in your browser',
        body: `PDFs often contain the most sensitive documents people handle: contracts, bank statements, medical letters, invoices and identity documents. Uploading them to an online service to merge two files or remove a page is a real privacy risk. The PDF tools on this site read your files with JavaScript and build the new document inside your browser tab, so the content never travels over the internet.

The tools use pdf-lib to create and modify documents and Mozilla's PDF.js to render page previews. Heavy work runs in the background so the page stays responsive while large files are processed.`,
      },
      {
        heading: 'What each PDF tool does',
        body: `- **Merge PDF** combines several files into one, in the order you choose.
- **Split PDF** extracts page ranges, splits a document every N pages, or saves selected pages as separate files in a ZIP archive.
- **Organize PDF** shows page thumbnails so you can rotate, reorder and delete pages before saving.
- **JPG to PDF** turns photos and scans (JPG, PNG or WebP) into a PDF with the page size, orientation and margins you choose.
- **Compress PDF** reduces file size by re-rendering each page as an image at a quality you pick.

### An honest note about PDF compression

Real PDF compression is hard to do well inside a browser. Our compressor works by turning each page into a compressed image. That can shrink scanned documents and image-heavy files a lot, but the text in the result is no longer selectable or searchable, and a PDF that contains only text may barely shrink at all, or even grow. The tool shows the before and after sizes so you can decide whether the result is worth keeping.`,
      },
    ],
    faqs: [
      {
        question: 'Are my PDF files uploaded anywhere?',
        answer:
          'No. All PDF processing happens in your browser. Your documents are never sent to a server, and closing the tab discards everything.',
      },
      {
        question: 'Can I edit password-protected PDFs?',
        answer:
          'Encrypted PDFs that require a password to open are not supported. Remove the password in a PDF reader you trust first, then use the tools here.',
      },
      {
        question: 'Will the tools change the quality of my PDF?',
        answer:
          'Merge, split, organize and JPG to PDF copy pages without re-rendering them, so quality is unchanged. Only Compress PDF converts pages to images, which is explained on that tool page.',
      },
      {
        question: 'Is there a page or size limit?',
        answer:
          'There is no fixed limit. Very large documents with hundreds of pages need more memory and may be slow on phones.',
      },
    ],
  },
  {
    slug: 'css-tools',
    name: 'CSS & Design Tools',
    navName: 'CSS & Design',
    h1: 'Free CSS and Design Tools',
    metaTitle: `Free CSS Tools: Gradients, Shadows, Colors, QR | ${SITE_NAME}`,
    metaDescription:
      'Free CSS and design tools: gradient and box-shadow generators, color picker with contrast checker, palette generator and QR codes. Copy-ready CSS and Tailwind.',
    intro:
      'Visual generators for CSS gradients and shadows, color tools with WCAG contrast checks, palette building and QR codes. Every result is copy-ready code.',
    icon: 'palette',
    lastUpdated: '2026-11-25',
    contentSections: [
      {
        heading: 'Design visually, ship real code',
        body: `Writing a multi-stop gradient or a layered box shadow by hand means guessing numbers, saving, reloading and adjusting again. The generators in this category show a live preview while you change angles, colours, offsets and blur, then give you the exact CSS to paste into your stylesheet. Where it is useful, they also produce Tailwind CSS classes using arbitrary values, so the output works in utility-first projects without editing your Tailwind configuration.

### Colour that is accessible as well as attractive

Good colour choices are not only a matter of taste. The Web Content Accessibility Guidelines (WCAG) define minimum contrast ratios between text and its background: 4.5:1 for normal text and 3:1 for large text at level AA. The colour picker calculates this ratio for any pair of colours, so you can check readability before a design reaches users. It also converts between HEX, RGB, HSL and OKLCH, the perceptually uniform colour space that modern CSS supports.`,
      },
      {
        heading: 'Tools in this category',
        body: `- **CSS Gradient Generator** for linear, radial and conic gradients with any number of colour stops.
- **CSS Box Shadow Generator** for single or layered shadows, including inset shadows.
- **Color Picker** with format conversion and a WCAG contrast checker.
- **Color Palette Generator** for complementary, analogous and triadic schemes plus tints and shades, with export as CSS variables, a Tailwind config snippet or a PNG swatch image.
- **QR Code Generator** for links, text, Wi-Fi credentials, email and phone numbers, downloadable as PNG or SVG.

All of them run in the browser, are free and need no sign-up.`,
      },
    ],
    faqs: [
      {
        question: 'Can I use the generated CSS in commercial projects?',
        answer:
          'Yes. The CSS, Tailwind classes, palettes and QR codes you create are yours to use in any personal or commercial project without attribution.',
      },
      {
        question: 'Does the Tailwind output need a custom config?',
        answer:
          'No. The Tailwind output uses arbitrary values in square brackets, which work in Tailwind CSS v3 and v4 without changing your configuration.',
      },
      {
        question: 'Do QR codes from this site expire?',
        answer:
          'No. The QR codes are static: the data is encoded directly in the image and does not pass through a redirect service, so they work as long as the content they point to exists.',
      },
      {
        question: 'Which browsers support OKLCH colors?',
        answer:
          'The oklch() CSS function is supported in current versions of Chrome, Edge, Firefox and Safari. For older browsers, use the HEX or RGB value the color picker also provides.',
      },
    ],
  },
  {
    slug: 'text-tools',
    name: 'Text Tools',
    navName: 'Text',
    h1: 'Free Online Text Tools',
    metaTitle: `Free Text Tools: Word Counter, Password Generator | ${SITE_NAME}`,
    metaDescription:
      'Free online text tools: count words, characters and reading time, check keyword density, and generate strong random passwords. Private, runs in your browser.',
    intro:
      'Count words and characters, estimate reading time and generate strong passwords. Your text is processed in your browser and never leaves your device.',
    icon: 'text',
    lastUpdated: '2026-11-25',
    contentSections: [
      {
        heading: 'Everyday text utilities that respect your privacy',
        body: `Writers, students, marketers and developers all need quick answers about text: how many words an essay has, whether a meta description fits in search results, or how long an article takes to read. The word counter answers these instantly as you type, and it also shows sentence and paragraph counts and the keywords you use most often.

The password generator creates random passwords with the Web Crypto API, the same cryptographically secure random number source browsers use for encryption keys. It never uses the predictable Math.random function. Generated passwords exist only in your browser tab and are not stored or transmitted.

### Why local processing matters for text

Drafts, unpublished articles, essays and passwords are exactly the kind of text you should not paste into a service that stores it. Because these tools run entirely in the browser, the text stays on your device and disappears when you close the tab.`,
      },
      {
        heading: 'Tools in this category',
        body: `- **Word Counter**: words, characters with and without spaces, sentences, paragraphs, reading time and keyword density.
- **Password Generator**: length from 4 to 128 characters, choice of character sets, an option to exclude look-alike characters, bulk generation and a strength estimate based on entropy.`,
      },
    ],
    faqs: [
      {
        question: 'Is the text I paste stored anywhere?',
        answer:
          'No. The text tools process everything in your browser. Nothing is sent to a server or saved after you close the page.',
      },
      {
        question: 'How is reading time calculated?',
        answer:
          'Reading time is the word count divided by an average silent reading speed of 238 words per minute, a widely cited average for adult readers of non-fiction.',
      },
      {
        question: 'Are the generated passwords truly random?',
        answer:
          'They are generated with crypto.getRandomValues, a cryptographically secure random number generator built into the browser, using rejection sampling so every character is equally likely.',
      },
      {
        question: 'Can I use the tools on my phone?',
        answer: 'Yes. Both tools are designed to work on phones, tablets and desktops.',
      },
    ],
  },
];

export const categoryOrder: CategorySlug[] = categories.map((c) => c.slug);

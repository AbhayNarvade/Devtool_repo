import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const base64Encode: Tool = {
  slug: 'base64-encode',
  category: 'developer-tools',
  name: 'Base64 Encoder',
  h1: 'Base64 Encode: Text and Files to Base64',
  metaTitle: brandTitle('Base64 Encode Online: Text & File to Base64'),
  metaDescription:
    'Base64 encode text or any file online. UTF-8 safe, with URL-safe and data URL output for HTML and CSS. Free and private: files are never uploaded.',
  primaryKeyword: 'Base64 encode',
  secondaryKeywords: [
    'base64 encoder',
    'text to base64',
    'file to base64',
    'image to base64',
    'data url generator',
  ],
  intro:
    'Encode text or any file to Base64. Text is encoded as UTF-8, so accents and emoji work correctly, and files can be output as a data URL ready for HTML or CSS.',
  cardDescription: 'Encode text or files to Base64 or data URLs.',
  icon: 'binary',
  handlesFiles: true,
  popular: true,
  howToSteps: [
    'Choose Text or File at the top of the tool.',
    'For text, type or paste it, or click "Load sample". The Base64 appears as you type.',
    'For a file, choose it, drag it onto the drop area, or paste it from the clipboard.',
    'Optionally enable URL-safe output, 76-character line wrapping, or data URL output for files.',
    'Copy the Base64 or download it as a text file.',
  ],
  contentSections: [
    {
      heading: 'What does it mean to Base64 encode data?',
      kind: 'concept',
      body: `Base64 is a way of writing binary data using only 64 safe text characters: \`A–Z\`, \`a–z\`, \`0–9\`, \`+\` and \`/\`, with \`=\` used as padding at the end. It is defined in RFC 4648. The encoder takes the input three bytes at a time (24 bits) and splits them into four groups of six bits, each of which maps to one character. That is why Base64 output is always about **33% larger** than the input: every 3 bytes become 4 characters.

Base64 exists because many systems were built to carry text, not arbitrary bytes. Email (MIME attachments), JSON and XML documents, HTTP headers, URLs and source code can all break when raw binary data contains control characters or bytes that are not valid text. Encoding the data as Base64 makes it safe to embed anywhere text is allowed.

**Base64 is not encryption.** Anyone can decode it instantly, so never use it to hide passwords or secrets.

### Text must be turned into bytes first

Base64 works on bytes, but text is made of characters. This tool converts your text to bytes using **UTF-8**, the encoding used by the web, before encoding it. The browser's built-in \`btoa\` function, by contrast, fails on characters such as \`é\` or emoji. Encoding \`é\` here produces \`w6k=\`, the Base64 of its two UTF-8 bytes.`,
    },
    {
      heading: 'Base64 encoding examples',
      kind: 'examples',
      body: `| Input | Base64 | URL-safe Base64 |
| --- | --- | --- |
| \`Hello\` | \`SGVsbG8=\` | \`SGVsbG8\` |
| \`hi?\` | \`aGk/\` | \`aGk_\` |
| \`Café\` | \`Q2Fmw6k=\` | \`Q2Fmw6k\` |

**URL-safe Base64** (RFC 4648 §5) replaces \`+\` with \`-\` and \`/\` with \`_\`, and usually drops the \`=\` padding, so the value can be used in URLs and file names without escaping. JSON Web Tokens use this variant.

### Files and data URLs

Choose **File** to encode an image, font, PDF or any other file. With **Output as data URL** enabled, the result looks like this:

\`\`\`html
<img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..." alt="Logo" width="32" height="32">
\`\`\`

The same value works in CSS, for example \`background-image: url("data:image/svg+xml;base64,...")\`.`,
    },
    {
      heading: 'When to use Base64 and when to avoid it',
      kind: 'tips',
      body: `- **Good uses**: small icons inlined into CSS to save a request, embedding binary data in JSON APIs, Basic authentication headers, email attachments, and storing short binary values in text-only configuration.
- **Avoid it for large images on web pages.** A Base64 image is about a third larger than the file, cannot be cached separately from the page, and must be decoded before it is shown. For anything over a few kilobytes, a normal image file is usually faster.
- **Line wrapping** at 76 characters is required by MIME (email) but not by most other systems. Leave it off unless the receiving system needs it.
- **Padding**: some systems require the trailing \`=\` characters, others reject them. Standard output keeps padding; URL-safe output removes it.
- To reverse the process, use the [Base64 decoder](/developer-tools/base64-decode).`,
    },
  ],
  features: [
    'Encodes text as UTF-8 before Base64, so all languages and emoji work.',
    'Encodes any file type: images, PDFs, fonts, archives and more.',
    'Data URL output (data:<type>;base64,…) for HTML and CSS.',
    'URL-safe Base64 (RFC 4648 §5) without padding.',
    'Optional 76-character line wrapping for MIME.',
    'Drag and drop, file picker or paste a file; copy or download the result.',
    'Your files never leave your device: encoding happens in your browser.',
  ],
  faqs: [
    {
      question: 'Is Base64 a form of encryption?',
      answer:
        'No. Base64 is an encoding, not encryption. It has no key and anyone can decode it, so it provides no secrecy at all.',
    },
    {
      question: 'Why is the Base64 output longer than my input?',
      answer:
        'Base64 represents every 3 bytes with 4 characters, so the output is about 33% larger than the original data, plus up to two padding characters.',
    },
    {
      question: 'What does the = at the end mean?',
      answer:
        'It is padding. When the input length is not a multiple of 3 bytes, one or two = characters are added so the output length is a multiple of 4.',
    },
    {
      question: 'What is the difference between Base64 and URL-safe Base64?',
      answer:
        'URL-safe Base64 replaces + with - and / with _ so the result can be used in URLs and file names without escaping. Padding is usually removed as well.',
    },
    {
      question: 'How do I convert an image to Base64?',
      answer:
        'Switch to File, choose or drop the image, and enable "Output as data URL" if you want a value you can paste directly into an img src attribute or a CSS url().',
    },
    {
      question: 'Are my files uploaded to encode them?',
      answer:
        'No. The browser reads the file and encodes it locally. Nothing is uploaded, so it is safe to use with private files.',
    },
  ],
  relatedSlugs: ['base64-decode', 'url-encode', 'json-formatter', 'url-decode'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

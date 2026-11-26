import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const base64Decode: Tool = {
  slug: 'base64-decode',
  category: 'developer-tools',
  name: 'Base64 Decoder',
  h1: 'Base64 Decode: Convert Base64 to Text or File',
  metaTitle: brandTitle('Base64 Decode Online: Base64 to Text or File'),
  metaDescription:
    'Base64 decode to readable UTF-8 text, or download the bytes as a file. Detects images, PDFs and URL-safe Base64 automatically. Free and private, no upload.',
  primaryKeyword: 'Base64 decode',
  secondaryKeywords: [
    'base64 decoder',
    'base64 to text',
    'base64 to file',
    'base64 to image',
    'decode data url',
  ],
  intro:
    'Decode Base64 back into readable text, or into the original file when the data is an image, PDF or other binary. Standard, URL-safe and data URL input all work without changes.',
  cardDescription: 'Decode Base64 to text, or download it as a file.',
  icon: 'binary',
  handlesFiles: true,
  howToSteps: [
    'Paste the Base64 string or data URL into the input box, or open a text file that contains it.',
    'The decoded result appears immediately on the right.',
    'If the data is text, read it, copy it, or download it as a .txt file.',
    'If it is a file such as an image or PDF, check the detected type and preview, then click "Download file".',
    'If the input is invalid, the message explains which character or length is wrong.',
  ],
  contentSections: [
    {
      heading: 'What happens when you Base64 decode data?',
      kind: 'concept',
      body: `Base64 encodes binary data as text using 64 characters (\`A–Z\`, \`a–z\`, \`0–9\`, \`+\`, \`/\`) plus \`=\` padding. To decode Base64, each character is mapped back to its 6-bit value, every group of four characters is joined into 24 bits, and those bits are split into the original three bytes.

The result of decoding is always a sequence of **bytes**. Whether those bytes are readable depends on what was encoded in the first place:

- If the original was **text**, the bytes are usually UTF-8, and this tool decodes them into characters. It checks that they are valid UTF-8, so accented letters and emoji appear correctly rather than as garbled symbols.
- If the original was a **file**, the bytes are not text. The tool recognises common formats from their first bytes (the "magic number"), for example PNG images start with \`89 50 4E 47\` and PDFs with \`%PDF\`, and offers the right file extension for the download. Images are previewed directly on the page.

### Input the decoder accepts

The decoder is deliberately forgiving about formatting, because Base64 is copied from many places:

- whitespace and line breaks (as in email or PEM files) are ignored;
- URL-safe characters \`-\` and \`_\` are converted automatically;
- missing \`=\` padding is added back;
- a \`data:\` URL prefix such as \`data:image/png;base64,\` is removed and its MIME type is used for the download.`,
    },
    {
      heading: 'Base64 decoding examples',
      kind: 'examples',
      body: `| Base64 input | Decoded result |
| --- | --- |
| \`SGVsbG8gd29ybGQ=\` | \`Hello world\` |
| \`Q2Fmw6kg4piV\` | \`Café ☕\` |
| \`eyJhbGciOiJIUzI1NiJ9\` | \`{"alg":"HS256"}\` (a JWT header, URL-safe) |
| \`data:text/plain;base64,T0s=\` | \`OK\` |

A typical use is inspecting the payload of an API response, an email attachment header or an environment variable that stores a certificate. For example, a Kubernetes Secret stores its values in Base64:

\`\`\`yaml
data:
  DB_USER: YXBwX3VzZXI=
\`\`\`

Decoding \`YXBwX3VzZXI=\` gives \`app_user\`. Remember that anyone with access to the manifest can do the same, which is why Kubernetes recommends encrypting Secrets at rest rather than relying on Base64. If the value you are decoding is a token with three dot-separated parts, use the [JWT decoder](/developer-tools/jwt-decoder), which decodes the header and payload and shows the expiry.`,
    },
    {
      heading: 'Fixing "invalid Base64" errors',
      kind: 'tips',
      body: `- **Invalid character**: the message shows the character and its position. Common culprits are quotes copied along with the value, a \`%\` from URL encoding (decode it first with the [URL decoder](/developer-tools/url-decode)), or a stray dot.
- **Length looks truncated**: valid Base64 never leaves a single character in the last group of four. The value was probably cut off when it was copied.
- **"=" in the middle**: padding only belongs at the very end. Two Base64 values may have been joined together; decode them separately.
- **Text looks garbled**: the original text was probably not UTF-8 (for example Windows-1252 or UTF-16). The tool then treats the data as binary so you can download the exact bytes.
- **Decoding is not decryption.** If the decoded output is still unreadable random bytes, the data may be encrypted or compressed before it was encoded.`,
    },
  ],
  features: [
    'Decodes standard Base64, URL-safe Base64 and data URLs.',
    'Ignores whitespace and line breaks, and restores missing padding.',
    'Validates UTF-8 so decoded text displays accented characters and emoji correctly.',
    'Detects PNG, JPEG, GIF, WebP, PDF, ZIP, GZIP, MP4, MP3 and WOFF2 data.',
    'Image preview and one-click download of decoded files with the right extension.',
    'Precise error messages for invalid characters, padding and length.',
    'Private: decoding happens in your browser and nothing is uploaded.',
  ],
  faqs: [
    {
      question: 'Why does the decoded text look like random symbols?',
      answer:
        'The Base64 data probably represents a binary file, compressed data or text in an encoding other than UTF-8. The tool detects this and lets you download the raw bytes instead of showing broken text.',
    },
    {
      question: 'Can I convert Base64 to an image?',
      answer:
        'Yes. Paste the Base64 or data URL of the image; the decoder recognises the format, shows a preview and lets you download it as a PNG, JPEG, GIF or WebP file.',
    },
    {
      question: 'Do I need to remove the data:image/png;base64, prefix?',
      answer:
        'No. The prefix is detected and removed automatically, and its MIME type is used to name the downloaded file.',
    },
    {
      question: 'Does it work with URL-safe Base64 and missing padding?',
      answer:
        'Yes. Characters - and _ are converted to + and /, and missing = padding is added before decoding.',
    },
    {
      question: 'Is Base64 decoding safe to do online?',
      answer:
        'With this tool, yes: decoding happens in your browser and the data is never sent to a server. Avoid tools that upload your data when it contains secrets such as tokens or certificates.',
    },
    {
      question: 'Is there a size limit?',
      answer:
        'There is no fixed limit. Several megabytes decode instantly; very large inputs depend on your device memory.',
    },
  ],
  relatedSlugs: ['base64-encode', 'url-decode', 'json-formatter', 'url-encode'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

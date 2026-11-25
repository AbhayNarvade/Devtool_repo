import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const urlDecode: Tool = {
  slug: 'url-decode',
  category: 'developer-tools',
  name: 'URL Decoder',
  h1: 'URL Decode: Convert Percent-Encoded Text',
  metaTitle: brandTitle('URL Decode Online: Decode %20 and Query Strings'),
  metaDescription:
    'URL decode percent-encoded links and query strings into readable text. Handles + as space, UTF-8 and double-encoded values with clear errors. Free, private.',
  primaryKeyword: 'URL decode',
  secondaryKeywords: [
    'url decoder',
    'percent decoding',
    'decodeURIComponent online',
    'decode query string',
    'urldecode',
  ],
  intro:
    'Turn percent-encoded URLs and query strings such as caf%C3%A9 back into readable text. Plus signs, UTF-8 characters and double-encoded values are handled for you.',
  cardDescription: 'Decode %XX escapes in URLs and query strings.',
  icon: 'link',
  howToSteps: [
    'Paste the encoded URL, query string or value, or click "Load sample".',
    'Keep "Treat + as a space" on for query strings and form data; turn it off for URL paths.',
    'If the result still contains sequences like %20, turn on "Decode repeatedly".',
    'Read any error message; it points to the exact invalid escape.',
    'Copy or download the decoded text.',
  ],
  contentSections: [
    {
      heading: 'What happens when you URL decode a link?',
      kind: 'concept',
      body: `Browsers, servers and APIs percent-encode characters that are not allowed in URLs: a space becomes \`%20\`, an ampersand \`%26\`, and non-English characters become one escape per UTF-8 byte, so \`ü\` turns into \`%C3%BC\`. That keeps URLs valid, but makes them hard to read when you are debugging a redirect, reading server logs or inspecting tracking parameters.

**URL decoding** reverses the process. Each \`%XX\` sequence is turned back into the byte it represents, and the bytes are read as UTF-8 text. This tool uses the browser's \`decodeURIComponent\`, so the result is exactly what a JavaScript application would see.

### The plus sign

In the query part of a URL and in HTML form submissions (\`application/x-www-form-urlencoded\`), a \`+\` stands for a space. Everywhere else, for example in a path such as \`/c++/guide\`, it is just a plus sign. Keep **Treat + as a space** on when decoding query strings, and turn it off for paths. A real plus sign in a query value is always encoded as \`%2B\`, so it is decoded correctly either way.

### Double encoding

When an already-encoded value is encoded a second time, every \`%\` becomes \`%25\`. You will see sequences such as \`%2520\` (an encoded \`%20\`). After one round of decoding the text still contains escapes, and the tool warns you. **Decode repeatedly** keeps decoding until no escapes remain, up to ten layers.`,
    },
    {
      heading: 'URL decoding examples',
      kind: 'examples',
      body: `| Encoded | Decoded |
| --- | --- |
| \`hello%20world\` | \`hello world\` |
| \`q=caf%C3%A9+au+lait\` | \`q=café au lait\` (with + as space) |
| \`price%3C20%26sort%3Ddesc\` | \`price<20&sort=desc\` |
| \`%F0%9F%9A%80\` | \`🚀\` |
| \`%252Faccount\` | \`%2Faccount\`, then \`/account\` when decoding repeatedly |

A realistic case is a redirect parameter in a login link:

\`\`\`text
https://example.com/login?next=%2Fcheckout%3Fstep%3D2%26coupon%3DSAVE10
\`\`\`

Decoding shows that the user will be sent to \`/checkout?step=2&coupon=SAVE10\` after signing in.`,
    },
    {
      heading: 'Why URL decoding fails',
      kind: 'tips',
      body: `- **A lone percent sign**: in \`100% free\`, the \`%\` is not followed by two hexadecimal digits, so the text is not valid percent-encoding. Encoded properly, it would be \`100%25%20free\`. The error message shows the position of the problem.
- **Broken UTF-8**: \`%E2%82\` is the start of a three-byte character with the last byte missing, usually because a URL was cut off. The tool reports which sequence is invalid.
- **Text in a legacy encoding**: some old systems encoded \`é\` as \`%E9\` (Latin-1) instead of \`%C3%A9\` (UTF-8). That cannot be decoded as UTF-8; the value needs to be re-encoded at the source.
- **Decoding too early**: decode a URL only for reading. If you decode it and then use it as a link, characters such as \`&\` and \`#\` change the meaning of the URL.
- To encode text, use the [URL encoder](/developer-tools/url-encode).`,
    },
  ],
  features: [
    'Decodes percent-encoded URLs, query strings and form data with decodeURIComponent.',
    'Full UTF-8 support, including emoji and non-Latin scripts.',
    'Optional + to space conversion for query strings.',
    'Detects double-encoded input and can decode every layer.',
    'Pinpoints malformed escapes such as a lone % or broken UTF-8 sequences.',
    'Copy or download the decoded text.',
    'Private: everything runs in your browser.',
  ],
  faqs: [
    {
      question: 'What does %20 mean in a URL?',
      answer:
        '%20 is the percent-encoded form of a space character. 20 is the hexadecimal code of the space in ASCII and UTF-8.',
    },
    {
      question: 'Why do I get a "malformed URL encoding" error?',
      answer:
        'The text contains a % that is not followed by two hexadecimal digits, or a sequence of escapes that is not valid UTF-8. The error shows the position so you can fix or remove it.',
    },
    {
      question: 'Should + be decoded as a space?',
      answer:
        'In query strings and form data, yes. In URL paths, no: there a plus sign is a literal plus. Use the "Treat + as a space" option to match your input.',
    },
    {
      question: 'What is double URL encoding?',
      answer:
        'It happens when encoded text is encoded again, so %20 becomes %2520. Turn on "Decode repeatedly" to decode all layers at once.',
    },
    {
      question: 'Can I decode a whole URL at once?',
      answer:
        'Yes. Paste the complete URL; every escape in the path, query and fragment is decoded. Keep in mind that the decoded text is for reading, not for using as a link.',
    },
    {
      question: 'Is the URL I paste stored or sent anywhere?',
      answer: 'No. Decoding happens locally in your browser and nothing is transmitted or saved.',
    },
  ],
  relatedSlugs: ['url-encode', 'base64-decode', 'base64-encode', 'json-formatter'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

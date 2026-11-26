import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const urlEncode: Tool = {
  slug: 'url-encode',
  category: 'developer-tools',
  name: 'URL Encoder',
  h1: 'URL Encode: Percent-Encode Text and URLs',
  metaTitle: brandTitle('URL Encode Online: Percent-Encoding Tool'),
  metaDescription:
    'URL encode text for query strings or whole URLs. Choose component or full-URL encoding, spaces as %20 or +, line by line. Free, private, in your browser.',
  primaryKeyword: 'URL encode',
  secondaryKeywords: [
    'url encoder',
    'percent encoding',
    'encodeURIComponent online',
    'query string encoder',
    'urlencode',
  ],
  intro:
    'URL encode text so it can travel safely inside a link. Percent-encode a single query parameter value, or a whole URL while keeping its structure intact.',
  cardDescription: 'Percent-encode text for safe use in URLs.',
  icon: 'link',
  popular: true,
  howToSteps: [
    'Type or paste the text, or click "Load sample".',
    'Choose "URL component" to encode a value (such as a search term) or "Full URL" to encode a complete address.',
    'For form-style query strings, enable "Encode spaces as +".',
    'Enable "Encode each line separately" to encode a list of values at once.',
    'Copy the encoded result or download it.',
  ],
  contentSections: [
    {
      heading: 'What does it mean to URL encode text?',
      kind: 'concept',
      body: `URLs may only contain a limited set of characters: letters, digits and a few symbols such as \`-\`, \`.\`, \`_\` and \`~\`. Other characters either have a special meaning in a URL (\`?\` starts the query, \`&\` separates parameters, \`#\` starts the fragment, \`/\` separates path segments) or are not allowed at all, like spaces and non-English letters.

**URL encoding**, formally called **percent-encoding** (RFC 3986), represents any other character as a \`%\` followed by two hexadecimal digits for each of its bytes. Text is first converted to UTF-8, so a character that takes several bytes produces several escapes:

| Character | Encoded |
| --- | --- |
| space | \`%20\` |
| \`&\` | \`%26\` |
| \`/\` | \`%2F\` |
| \`é\` | \`%C3%A9\` |
| \`😀\` | \`%F0%9F%98%80\` |

### Component vs full URL encoding

The two modes correspond to JavaScript’s two built-in functions:

- **URL component** (\`encodeURIComponent\`) encodes everything except \`A–Z a–z 0–9 - _ . ! ~ * ' ( )\`. Use it for a single piece of a URL, such as a query parameter value, a path segment or a redirect target. This is the mode you need most of the time.
- **Full URL** (\`encodeURI\`) leaves the characters that give a URL its structure (\`: / ? # & = +\` and others) untouched and only encodes spaces, non-ASCII characters and other unsafe characters. Use it to clean up a complete address that contains spaces or accented letters.`,
    },
    {
      heading: 'URL encoding examples',
      kind: 'examples',
      body: `Building a search link where the user typed \`rock & roll\`:

\`\`\`text
https://example.com/search?q=rock%20%26%20roll
\`\`\`

Encoding the value as a component turns \`&\` into \`%26\`. Without that, the server would see a parameter \`q=rock \` followed by a second, nameless parameter \` roll\`.

With **Encode spaces as +**, the same value becomes \`rock+%26+roll\`. This is the \`application/x-www-form-urlencoded\` format that HTML forms submit, and most servers accept both forms in query strings.

Encoding a whole address in **Full URL** mode:

\`\`\`text
Input:  https://example.com/files/annual report é.pdf?v=2
Output: https://example.com/files/annual%20report%20%C3%A9.pdf?v=2
\`\`\`

The \`:\`, \`/\`, \`?\` and \`=\` stay as they are, so the link still works.`,
    },
    {
      heading: 'Common URL encoding mistakes',
      kind: 'tips',
      body: `- **Encoding a full URL as a component** turns \`https://\` into \`https%3A%2F%2F\`, which is only correct when the whole URL is itself a parameter value, such as \`?redirect=https%3A%2F%2Fexample.com\`.
- **Double encoding**: encoding text that is already encoded turns \`%20\` into \`%2520\`. Encode raw values exactly once, ideally right before building the URL.
- **Spaces as + in paths**: \`+\` means a space only in query strings and form data. In a path segment, a literal \`+\` stays a plus sign, so always use \`%20\` there.
- **Reserved characters in values**: always encode values that may contain \`&\`, \`=\`, \`#\`, \`?\` or \`/\`, including email addresses and redirect URLs.
- **Let your platform do it when possible.** In JavaScript, \`new URLSearchParams({ q: 'rock & roll' }).toString()\` builds a correctly encoded query string (using \`+\` for spaces). Most HTTP libraries in other languages offer the same, which avoids manual mistakes. Use this tool to check values, debug links and prepare one-off URLs.
- To reverse the process, use the [URL decoder](/developer-tools/url-decode).`,
    },
  ],
  features: [
    'URL component encoding (encodeURIComponent) for query values and path segments.',
    'Full URL encoding (encodeURI) that keeps the URL structure intact.',
    'UTF-8 percent-encoding for all languages and emoji.',
    'Optional + for spaces (application/x-www-form-urlencoded).',
    'Line-by-line mode for encoding lists of values.',
    'Live output with copy and download buttons.',
    'Runs locally in your browser; nothing is sent to a server.',
  ],
  faqs: [
    {
      question: 'What is the difference between %20 and + for spaces?',
      answer:
        'Both can represent a space in a query string. %20 is the standard percent-encoding and works everywhere in a URL; + means a space only in query strings and HTML form data.',
    },
    {
      question: 'When should I use encodeURIComponent instead of encodeURI?',
      answer:
        'Use encodeURIComponent (the "URL component" mode) for individual values such as query parameters. Use encodeURI (the "Full URL" mode) only when you have a complete URL and want to keep its slashes, question mark and ampersands.',
    },
    {
      question: 'Which characters are not encoded?',
      answer:
        "In component mode, letters, digits and - _ . ! ~ * ' ( ) are left as they are. Full URL mode additionally keeps the reserved characters ; , / ? : @ & = + $ and #.",
    },
    {
      question: 'Why does é become %C3%A9?',
      answer:
        'Text is converted to UTF-8 before encoding. The letter é is stored as the two bytes C3 and A9 in UTF-8, and each byte becomes one percent-escape.',
    },
    {
      question: 'Is URL encoding the same as Base64?',
      answer:
        'No. URL encoding only replaces unsafe characters and leaves the rest readable. Base64 converts all data into a different 64-character alphabet.',
    },
    {
      question: 'Is my text sent anywhere?',
      answer:
        'No. Encoding runs in your browser with JavaScript, and nothing you type leaves your device.',
    },
  ],
  relatedSlugs: ['url-decode', 'base64-encode', 'base64-decode', 'json-formatter'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

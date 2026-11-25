import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jsonFormatter: Tool = {
  slug: 'json-formatter',
  category: 'developer-tools',
  name: 'JSON Formatter',
  h1: 'JSON Formatter, Validator and Minifier',
  metaTitle: brandTitle('JSON Formatter & Validator Online (Free)'),
  metaDescription:
    'Free JSON formatter and validator: beautify or minify JSON, sort keys and find errors by line and column. Runs in your browser, so your data is never uploaded.',
  primaryKeyword: 'JSON formatter',
  secondaryKeywords: [
    'json validator',
    'json beautifier',
    'json minifier',
    'pretty print json',
    'json lint',
  ],
  intro:
    'Paste JSON to pretty-print it with 2 spaces, 4 spaces or tabs, minify it to a single line, or sort its keys. Invalid JSON is flagged with the exact line, column and reason.',
  cardDescription: 'Beautify, validate and minify JSON with exact error positions.',
  icon: 'braces',
  popular: true,
  howToSteps: [
    'Paste your JSON into the input box, open a .json file, or click "Load sample" to try it.',
    'Choose Beautify for readable, indented output or Minify for the most compact single line.',
    'Pick the indentation (2 spaces, 4 spaces or tabs) and optionally sort keys alphabetically.',
    'If the JSON is invalid, read the error under the editor: it shows the line, column and what is wrong.',
    'Copy the result to your clipboard or download it as a .json file.',
  ],
  contentSections: [
    {
      heading: 'What is a JSON formatter?',
      kind: 'concept',
      body: `JSON (JavaScript Object Notation) is a plain-text format for structured data, defined in RFC 8259 and ECMA-404. APIs, configuration files, log pipelines and NoSQL databases all use it. To save bandwidth, servers usually send JSON with no spaces or line breaks at all, which is efficient for machines but almost impossible for people to read.

A JSON formatter (also called a JSON beautifier or pretty printer) parses that text and prints it again with consistent indentation, one property per line and nested objects indented under their parents. The data does not change, only the whitespace around it. A minifier does the opposite: it removes every space and line break that is not inside a string, producing the smallest valid representation.

Because the text has to be parsed before it can be re-printed, a formatter is also a **JSON validator**. If parsing fails, the document is not valid JSON, and this tool reports exactly where and why. The error checker is written to follow the JSON grammar precisely, so the message is the same in every browser rather than depending on the browser's built-in error text.

### JSON syntax rules in brief

- Data is made of objects \`{ }\`, arrays \`[ ]\`, strings, numbers, \`true\`, \`false\` and \`null\`.
- Object keys and string values must use **double quotes**.
- Items are separated by commas, and a comma after the last item is not allowed.
- Comments, \`undefined\`, \`NaN\`, \`Infinity\` and hexadecimal numbers are not part of JSON.`,
    },
    {
      heading: 'Examples: beautify, minify and sort keys',
      kind: 'examples',
      body: `A compact API response like this:

\`\`\`json
{"id":7,"name":"Desk lamp","tags":["home","lighting"],"stock":{"warehouse":12,"store":3}}
\`\`\`

becomes this with **Beautify** and 2-space indentation:

\`\`\`json
{
  "id": 7,
  "name": "Desk lamp",
  "tags": [
    "home",
    "lighting"
  ],
  "stock": {
    "warehouse": 12,
    "store": 3
  }
}
\`\`\`

With **Sort keys A–Z** turned on, every object's keys are ordered alphabetically at every level (array order is never changed). This is useful before comparing two JSON files with a diff tool, because the same data then always produces the same text.

**Minify** turns any of the above back into the first, single-line form. Minified JSON is what you want to paste into an environment variable, a cURL command or a test fixture.`,
    },
    {
      heading: 'Common JSON errors and how to fix them',
      kind: 'tips',
      body: `These are the mistakes the validator finds most often:

| Error message | Typical cause | Fix |
| --- | --- | --- |
| Trailing comma before "}" | A comma after the last property, common when copying from JavaScript | Delete the last comma |
| Property names must use double quotes | Keys written as \`{name: 1}\` or \`{'name': 1}\` | Write \`{"name": 1}\` |
| Unescaped control character in string | A real line break or tab inside a string | Use \`\\n\` or \`\\t\` instead |
| Unexpected undefined / NaN | Output of \`JSON.stringify\` workarounds or Python \`None\` | Use \`null\` |
| Invalid number | Leading zeros (\`012\`), a trailing dot (\`1.\`) or hex (\`0x1F\`) | Write \`12\`, \`1.0\` or \`31\` |

### Watch out for large numbers

JavaScript stores numbers as 64-bit floating point values, so integers above 9,007,199,254,740,991 (2^53 − 1) cannot be represented exactly. If your JSON contains IDs such as \`12345678901234567890\`, any JavaScript-based tool, including this one and your browser, will round them when re-printing. The formatter warns you when it detects such numbers. The usual solution is to send large IDs as strings.`,
    },
  ],
  features: [
    'Beautify JSON with 2 spaces, 4 spaces or tab indentation.',
    'Minify JSON to a single line by removing all insignificant whitespace.',
    'Validate JSON and see the exact line, column and a plain-English reason for any error.',
    'Sort object keys alphabetically at every level for stable diffs.',
    'Warns when integers are too large to keep their exact value in JavaScript.',
    'Open .json files, copy the result or download it as a file.',
    'Private: your JSON is processed in your browser and never uploaded.',
  ],
  faqs: [
    {
      question: 'Is it safe to paste confidential JSON into this formatter?',
      answer:
        'Yes. The formatter runs entirely in your browser with JavaScript. The JSON you paste is not sent to a server, stored or logged, and it disappears when you close the tab.',
    },
    {
      question: 'What is the difference between formatting and validating JSON?',
      answer:
        'Validating checks whether the text follows the JSON syntax rules. Formatting re-prints valid JSON with consistent indentation. This tool always does both: if the input is invalid, it shows the error instead of formatted output.',
    },
    {
      question: 'Why does my JSON with comments show an error?',
      answer:
        'Standard JSON does not allow comments. Formats such as JSONC (used by VS Code settings) and JSON5 add comments, but most parsers, including JSON.parse, reject them. Remove the comments to get valid JSON.',
    },
    {
      question: 'Does sorting keys change my data?',
      answer:
        'No. In JSON the order of keys inside an object has no meaning, so sorting them produces equivalent data. Arrays are ordered lists, so their order is always kept.',
    },
    {
      question: 'Should I use 2 spaces, 4 spaces or tabs?',
      answer:
        'All three are valid. Two spaces is the most common choice for JSON in web projects and keeps deeply nested data narrow. Use whatever your project style guide or editor config specifies.',
    },
    {
      question: 'How large a JSON file can I format?',
      answer:
        'Files of several megabytes format almost instantly on a modern computer. Very large files of 100 MB or more depend on your device memory and may be slow, especially on phones.',
    },
  ],
  relatedSlugs: [
    'json-to-yaml',
    'json-to-csv',
    'json-to-typescript',
    'yaml-to-json',
    'base64-decode',
  ],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

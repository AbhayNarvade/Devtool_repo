import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jsonCompare: Tool = {
  slug: 'json-compare',
  category: 'developer-tools',
  name: 'JSON Compare Tool',
  h1: 'JSON Compare: Find Differences Between Two JSON Files',
  metaTitle: brandTitle('JSON Compare: Diff Two JSON Documents Online'),
  metaDescription:
    'JSON compare tool: diff two JSON documents and list every added, removed and changed value by path, ignoring key order and whitespace. Free, private, no upload.',
  primaryKeyword: 'JSON compare',
  secondaryKeywords: [
    'json diff',
    'compare json online',
    'json difference',
    'json diff checker',
    'compare two json',
  ],
  intro:
    'Paste two documents into this JSON compare tool to see exactly what changed: added, removed and modified values are listed with their paths. Key order and formatting are ignored, so only real data differences show up.',
  cardDescription: 'Diff two JSON documents and see every change by path.',
  icon: 'braces',
  popular: true,
  howToSteps: [
    'Paste the original JSON on the left and the modified JSON on the right, or click "Load sample".',
    'Turn on "Ignore array order" if the order of list items does not matter for your data.',
    'Read the summary of added, removed and changed values.',
    'Use the table to see each difference with its path and the old and new values.',
    'Copy or download the difference report.',
  ],
  contentSections: [
    {
      heading: 'Why use a JSON compare tool instead of a text diff?',
      kind: 'concept',
      body: `A normal text diff compares lines. With JSON that produces a lot of noise: re-indenting a file, sorting its keys or putting it on one line changes every line, even though the data is identical. A JSON compare tool parses both documents first and compares the **data**, not the text.

That means:

- **Key order is ignored.** \`{"a":1,"b":2}\` and \`{"b":2,"a":1}\` are equal, because JSON objects are unordered.
- **Whitespace and formatting are ignored.** Minified and pretty-printed versions compare as equal.
- **Types matter.** \`42\` and \`"42"\` are different values, and the tool reports this as a type change, a common source of API bugs.

Each difference is reported with a **path** that shows where it is, using JSONPath-style notation: \`$.user.address.city\` for nested keys and \`$.items[2]\` for array positions. Keys that are not simple identifiers are quoted, for example \`$["content-type"]\`.

### Arrays: ordered or not

By default, arrays are compared position by position, because order is meaningful in most JSON (a list of steps, ranked results). If your arrays are really sets, such as tags or permission lists, enable **Ignore array order**: the tool then reports only items that exist on one side and not the other, and it still counts duplicates correctly.

Typical uses are comparing API responses before and after a deployment, checking configuration files across environments, reviewing changes to fixtures and translation files, and debugging why two "identical" payloads behave differently.`,
    },
    {
      heading: 'JSON compare example',
      kind: 'examples',
      body: `Original:

\`\`\`json
{ "id": 7, "plan": "pro", "seats": 5, "tags": ["beta"], "trial": true }
\`\`\`

Modified:

\`\`\`json
{ "plan": "pro", "id": 7, "seats": "10", "tags": ["beta", "eu"] }
\`\`\`

Differences reported:

\`\`\`text
! $.seats: number 5 -> string "10"
+ $.tags[1]: "eu"
- $.trial: true
\`\`\`

The reordered keys \`id\` and \`plan\` are not reported because nothing changed. \`seats\` changed both its value and its type, \`"eu"\` was added to the array, and \`trial\` was removed. The downloadable report uses the same format: \`+\` added, \`-\` removed, \`~\` changed and \`!\` type changed.`,
    },
    {
      heading: 'Tips for comparing JSON',
      kind: 'tips',
      body: `- **Fix syntax errors first.** If either side is not valid JSON, the tool tells you which side and where the error is. The [JSON formatter](/developer-tools/json-formatter) gives a more detailed view.
- **Watch for type changes.** Numbers turning into strings (\`5\` to \`"5"\`) and \`null\` replacing an empty string are frequent causes of client errors after an API change.
- **Remove volatile fields** such as timestamps, request IDs or tokens before comparing API responses, or every comparison will report them.
- **Large arrays of objects** compared by position report every following item as changed when one item is inserted near the start. If order does not matter, use **Ignore array order**.
- **Big numbers**: JSON numbers above 9,007,199,254,740,991 lose precision in JavaScript, so two different 19-digit IDs could compare as equal. Compare such IDs as strings.`,
    },
  ],
  features: [
    'Semantic JSON diff that ignores key order, whitespace and formatting.',
    'Lists every added, removed, changed and type-changed value with its path.',
    'Optional unordered comparison of arrays, with correct handling of duplicates.',
    'Summary counts and a color-coded difference table.',
    'Copy or download a plain-text difference report.',
    'Clear syntax errors that say which side is invalid, with line and column.',
    'Private: both documents are compared in your browser and never uploaded.',
  ],
  faqs: [
    {
      question: 'Does the order of keys matter when comparing JSON?',
      answer:
        'No. JSON objects are unordered, so the same keys and values in a different order are reported as equivalent.',
    },
    {
      question: 'How are arrays compared?',
      answer:
        'By position by default, so item 0 is compared with item 0 and so on. With "Ignore array order" enabled, arrays are treated as unordered collections and only items missing from one side are reported.',
    },
    {
      question: 'What does a type change mean?',
      answer:
        'The value at that path has a different JSON type on each side, for example the number 5 on the left and the string "5" on the right. These are reported separately because they often break code.',
    },
    {
      question: 'What do the paths like $.items[2].name mean?',
      answer:
        'They show where the difference is: $ is the root, .items is a key, [2] is the third array element (counting from 0), and .name is a key inside it.',
    },
    {
      question: 'Can I compare large JSON files?',
      answer:
        'Yes. Files of several megabytes compare quickly on a typical computer. The table shows the first 500 differences and the downloadable report contains all of them.',
    },
    {
      question: 'Is my JSON uploaded to compare it?',
      answer:
        'No. Both documents are parsed and compared in your browser and never leave your device.',
    },
  ],
  relatedSlugs: [
    'json-formatter',
    'json-to-yaml',
    'json-to-typescript',
    'yaml-to-json',
    'json-to-csv',
  ],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

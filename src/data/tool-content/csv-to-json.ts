import { SITE_NAME } from '@/config/site';
import type { Tool } from '../types';

export const csvToJson: Tool = {
  slug: 'csv-to-json',
  category: 'developer-tools',
  name: 'CSV to JSON Converter',
  h1: 'CSV to JSON Converter',
  metaTitle: `CSV to JSON Converter: Auto-Detect Delimiter | ${SITE_NAME}`,
  metaDescription:
    'Convert CSV to JSON with header rows, automatic delimiter detection and smart number typing that keeps leading zeros. Free, no upload, runs in your browser.',
  primaryKeyword: 'CSV to JSON',
  secondaryKeywords: [
    'convert csv to json',
    'csv parser',
    'excel to json',
    'tsv to json',
    'spreadsheet to json',
  ],
  intro:
    'Convert spreadsheet data exported as CSV or TSV into a JSON array. The delimiter is detected automatically, the header row becomes object keys, and numbers and booleans are typed for you.',
  cardDescription: 'Parse CSV or TSV into a JSON array of objects.',
  icon: 'table',
  howToSteps: [
    'Paste CSV, open a .csv or .tsv file, or click "Load sample".',
    'Leave the delimiter on Auto-detect, or pick comma, semicolon, tab or pipe.',
    'Keep "First row is a header" on to get objects; turn it off to get arrays of values.',
    'Choose whether to convert numbers and booleans, and whether to minify the JSON.',
    'Copy the JSON or download it as data.json.',
  ],
  contentSections: [
    {
      heading: 'What does a CSV to JSON converter do?',
      kind: 'concept',
      body: `CSV files are the lowest common denominator for tabular data: every spreadsheet, database and analytics tool can export them. But web applications, APIs and JavaScript code usually want JSON. A CSV to JSON converter reads the table and turns each row into a JSON value.

With a header row, each row becomes an **object** whose keys are the column names: the CSV line \`42,Ana,true\` under the header \`id,name,active\` becomes \`{"id": 42, "name": "Ana", "active": true}\`. Without a header row, each row becomes an **array** of values.

Parsing CSV correctly is harder than splitting lines on commas. Values can contain commas, quotes and even line breaks when they are wrapped in double quotes, and different programs use different delimiters. This tool uses Papa Parse, a robust CSV parser that follows RFC 4180, and detects whether your file uses commas, semicolons, tabs or pipes.

### Smart typing that keeps your data intact

CSV has no types: everything is text. When **Detect numbers and booleans** is on, the converter turns \`42\` and \`3.5\` into numbers, \`true\` and \`false\` into booleans, and empty cells into \`null\`. It deliberately keeps some values as strings:

- values with leading zeros, such as ZIP codes (\`02139\`), phone numbers and product codes;
- integers longer than JavaScript can represent exactly, such as 19-digit order IDs.

Turn typing off to keep every value as a string, exactly as written in the file.`,
    },
    {
      heading: 'CSV to JSON example',
      kind: 'examples',
      body: `Input (semicolon-separated, as exported by Excel in many European locales):

\`\`\`csv
sku;name;price;in_stock;zip
A1;"Desk; oak";129.00;true;01234
B2;Chair;45.5;false;
\`\`\`

Output:

\`\`\`json
[
  { "sku": "A1", "name": "Desk; oak", "price": 129, "in_stock": true, "zip": "01234" },
  { "sku": "B2", "name": "Chair", "price": 45.5, "in_stock": false, "zip": null }
]
\`\`\`

(Objects shown on one line for brevity.) The quoted \`"Desk; oak"\` keeps its semicolon, the ZIP code keeps its leading zero, and the empty cell becomes \`null\`.`,
    },
    {
      heading: 'Troubleshooting CSV files',
      kind: 'tips',
      body: `- **"Row 5: Too few fields"** means that row has fewer values than the header. The JSON is still produced, with missing fields omitted, but check the source for a missing delimiter or a stray line break.
- **Everything ends up in one key**: the delimiter was not detected. Choose it manually; tab-separated files sometimes look like they use spaces.
- **Unclosed quotes**: a value that opens a double quote without closing it swallows the rest of the file. The error message tells you on which row the quote started.
- **Odd characters at the start of the first key** usually come from a byte order mark (BOM) added by Excel. The converter removes it automatically.
- **Duplicate column names** cannot both exist in one JSON object, so the second one is renamed with a suffix (\`name\`, \`name_1\`). Rename the columns in the source if you need specific keys.
- To go the other way, use the [JSON to CSV converter](/developer-tools/json-to-csv).`,
    },
  ],
  features: [
    'Converts CSV and TSV to a JSON array of objects or arrays.',
    'Automatic detection of comma, semicolon, tab and pipe delimiters.',
    'Handles quoted values containing delimiters, quotes and line breaks (RFC 4180).',
    'Optional typing of numbers, booleans and empty cells that keeps leading zeros and long IDs as text.',
    'Warnings for rows with too few or too many fields.',
    'Pretty-printed or minified JSON; copy or download as a file.',
    'Private: your spreadsheet data stays in your browser.',
  ],
  faqs: [
    {
      question: 'How do I convert an Excel file to JSON?',
      answer:
        'In Excel or Google Sheets, export or download the sheet as CSV (File > Save As or File > Download), then open that CSV file here. The converter turns each row into a JSON object.',
    },
    {
      question: 'Does the converter detect the delimiter automatically?',
      answer:
        'Yes. With Auto-detect selected it checks for commas, semicolons, tabs and pipes and reports which one it used. You can also choose the delimiter yourself.',
    },
    {
      question: 'Why are some numbers kept as strings?',
      answer:
        'Values with leading zeros, like ZIP codes or product codes, would lose those zeros as numbers, and very long integers would be rounded by JavaScript. Keeping them as strings preserves them exactly.',
    },
    {
      question: 'What happens to empty cells?',
      answer:
        'With typing on, empty cells become null. With typing off, they become empty strings.',
    },
    {
      question: 'Can I convert CSV without a header row?',
      answer:
        'Yes. Turn off "First row is a header" and each row becomes a JSON array of values instead of an object.',
    },
    {
      question: 'Is my CSV file uploaded?',
      answer:
        'No. The file is read and parsed in your browser. Its contents never leave your device.',
    },
  ],
  relatedSlugs: ['json-to-csv', 'json-formatter', 'yaml-to-json', 'json-to-typescript'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

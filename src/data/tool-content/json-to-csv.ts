import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jsonToCsv: Tool = {
  slug: 'json-to-csv',
  category: 'developer-tools',
  name: 'JSON to CSV Converter',
  h1: 'JSON to CSV Converter',
  metaTitle: brandTitle('JSON to CSV Converter: Flatten Nested JSON'),
  metaDescription:
    'Convert JSON to CSV for Excel or Google Sheets. Flattens nested objects, merges columns and lets you pick the delimiter. Free and private, with no upload.',
  primaryKeyword: 'JSON to CSV',
  secondaryKeywords: [
    'convert json to csv',
    'json to excel',
    'flatten json',
    'json array to csv',
    'json to tsv',
  ],
  intro:
    'Turn a JSON array into a CSV table you can open in Excel, Google Sheets or LibreOffice. Nested objects are flattened into dot-notation columns and every field gets its own column.',
  cardDescription: 'Turn JSON arrays into spreadsheet-ready CSV.',
  icon: 'table',
  popular: true,
  howToSteps: [
    'Paste a JSON array of objects, open a .json file, or click "Load sample".',
    'Choose the delimiter: comma, semicolon, tab or pipe.',
    'Keep "Flatten nested objects" on to get one column per nested field, or turn it off to keep nested values as JSON text.',
    'Review the CSV and the row and column count shown below it.',
    'Download the .csv file and open it in your spreadsheet app, or copy it.',
  ],
  contentSections: [
    {
      heading: 'How JSON to CSV conversion works',
      kind: 'concept',
      body: `CSV (comma-separated values) is a flat table: one header row followed by data rows, with the same columns in every row. JSON is a tree: objects can contain other objects and arrays, and different records can have different fields. Converting JSON to CSV therefore needs two decisions, and this converter makes them predictably:

1. **Which columns?** The converter scans every record and builds the union of all keys, in the order they first appear. A record that lacks a key simply gets an empty cell in that column.
2. **What about nested data?** With flattening on, nested objects become dotted column names (\`customer.name\`, \`customer.address.city\`) and arrays get numbered columns (\`items.0\`, \`items.1\`). With flattening off, each nested value is written into a single cell as JSON text, which is easy to turn back into JSON later.

Values are quoted only when necessary, following RFC 4180: if a value contains the delimiter, a double quote or a line break, it is wrapped in double quotes and any quotes inside it are doubled. The CSV is generated with Papa Parse, a widely used and well-tested CSV library.`,
    },
    {
      heading: 'Example: nested JSON to CSV',
      kind: 'examples',
      body: `Input:

\`\`\`json
[
  { "id": 1, "name": "Ana", "address": { "city": "Lisbon" }, "tags": ["vip"] },
  { "id": 2, "name": "Ben", "email": "ben@example.com" }
]
\`\`\`

Output with flattening on and a comma delimiter:

\`\`\`csv
id,name,address.city,tags.0,email
1,Ana,Lisbon,vip,
2,Ben,,,ben@example.com
\`\`\`

The second record has no address or tags, so those cells are empty, and its \`email\` field adds a new column at the end. Accepted inputs are an array of objects (the usual case), a single object (one row), or an array of plain values (one column named \`value\`).`,
    },
    {
      heading: 'Tips for opening CSV in Excel and Google Sheets',
      kind: 'tips',
      body: `- **Choose the right delimiter for your region.** Excel in many European locales expects semicolons, because the comma is the decimal separator there. If all your data lands in column A, export again with **Semicolon**.
- **Tab-separated (TSV)** is the safest choice when values contain many commas, and pastes cleanly into spreadsheets.
- **Leading zeros and long numbers.** Excel may display \`00123\` as \`123\` and long IDs in scientific notation when it opens a CSV. Use Data → From Text/CSV and set those columns to Text to keep them exactly.
- **Special characters.** The file is saved as UTF-8. Recent versions of Excel and Google Sheets detect it automatically; in older Excel versions, use the import wizard and choose UTF-8 if accented letters look wrong.
- **Very wide output.** Flattening a JSON array that contains long arrays creates one column per array index. If that produces too many columns, turn flattening off and keep those arrays as JSON text.
- **Untrusted data and formulas.** Excel, LibreOffice and Google Sheets run any cell that starts with \`=\`, \`+\`, \`-\` or \`@\` as a formula, which attackers can abuse ("CSV injection"). If the JSON comes from users or another system you do not control, turn on **Escape spreadsheet formulas**: such cells get a leading apostrophe so they are shown as plain text. Real numbers like \`-5\` are not changed.
- Need the reverse? Use the [CSV to JSON converter](/developer-tools/csv-to-json).`,
    },
  ],
  features: [
    'Converts JSON arrays, single objects and arrays of values to CSV.',
    'Builds the union of all keys so no field is lost, even when records differ.',
    'Flattens nested objects and arrays into dot-notation columns, or keeps them as JSON text.',
    'Comma, semicolon, tab or pipe delimiter.',
    'RFC 4180 quoting for values that contain delimiters, quotes or line breaks.',
    'Optional protection against spreadsheet formula (CSV) injection.',
    'Shows the number of rows and columns; download as .csv or .tsv.',
    'Private: data is converted in your browser and never uploaded.',
  ],
  faqs: [
    {
      question: 'What JSON structure can be converted to CSV?',
      answer:
        'An array of objects works best, with each object becoming one row. A single object becomes one row, and an array of plain values becomes a single column called value.',
    },
    {
      question: 'How are nested objects handled?',
      answer:
        'With "Flatten nested objects" on, nested fields become columns named with dots, such as address.city, and array items become numbered columns such as tags.0. With it off, nested values are stored in one cell as JSON text.',
    },
    {
      question: 'What if my objects have different keys?',
      answer:
        'The converter collects every key from every object and creates a column for each. Records without a value for a column get an empty cell.',
    },
    {
      question: 'Why does Excel show all my data in one column?',
      answer:
        'Your Excel locale probably uses a different list separator. Convert again with the semicolon delimiter, or use the Text to Columns or From Text/CSV import feature in Excel.',
    },
    {
      question: 'Is there a limit on the size of the JSON?',
      answer:
        'There is no fixed limit. Tens of thousands of rows convert in a moment on a typical computer; extremely large files depend on your device memory.',
    },
    {
      question: 'Is my data uploaded?',
      answer:
        'No. The JSON is parsed and converted to CSV in your browser, and nothing is sent to a server.',
    },
  ],
  relatedSlugs: ['csv-to-json', 'json-formatter', 'json-to-yaml', 'json-to-typescript'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

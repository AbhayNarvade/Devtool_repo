import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jsonToTypescript: Tool = {
  slug: 'json-to-typescript',
  category: 'developer-tools',
  name: 'JSON to TypeScript Converter',
  h1: 'JSON to TypeScript Interface Generator',
  metaTitle: brandTitle('JSON to TypeScript: Generate Interfaces Online'),
  metaDescription:
    'Convert JSON to TypeScript interfaces or types instantly. Detects optional fields, nested objects and union types. Free, private, no upload needed.',
  primaryKeyword: 'JSON to TypeScript',
  secondaryKeywords: [
    'json to typescript interface',
    'generate typescript types from json',
    'json to ts',
    'typescript type generator',
  ],
  intro:
    'Convert JSON to TypeScript interfaces: paste a sample API response or JSON file and get ready-to-use types. Nested objects get their own named types, and fields missing from some array items are marked optional.',
  cardDescription: 'Generate TypeScript interfaces from a JSON sample.',
  icon: 'code',
  howToSteps: [
    'Paste a representative JSON sample, open a .json file, or click "Load sample".',
    'Set the root type name, for example User or ApiResponse.',
    'Choose whether to mark all fields optional, add the export keyword, and use type aliases instead of interfaces.',
    'Review the generated declarations; nested types are listed after the root type.',
    'Copy the code into your project or download it as types.ts.',
  ],
  contentSections: [
    {
      heading: 'Why generate TypeScript types from JSON?',
      kind: 'concept',
      body: `TypeScript catches mistakes before your code runs, but only if it knows the shape of your data. When you call an API, read a configuration file or load fixtures, the data arrives as JSON with no type information. Writing the matching interfaces by hand is slow and error-prone for large payloads: it is easy to misspell a field, forget that a value can be \`null\` or miss a nested object.

A JSON to TypeScript converter reads a real example and writes the interfaces for you. You get autocompletion in your editor, compile-time checks when you access fields, and a clear record of what the API returns. The generator on this page is written specifically for this site, with unit tests for its naming and type-merging rules.

### How types are inferred

- **Primitives**: strings, numbers and booleans map to \`string\`, \`number\` and \`boolean\`; \`null\` stays \`null\`.
- **Objects** become named interfaces. The name comes from the property key in PascalCase, so \`billing_address\` produces \`BillingAddress\`.
- **Arrays** become \`Type[]\`. If an array holds objects, all of them are merged into one interface, and a key that appears in only some items is marked **optional** with \`?\`.
- **Mixed values** produce union types, for example \`(string | number)[]\` or \`string | null\`.
- **Identical shapes** are reused instead of duplicated, so \`from\` and \`to\` objects with the same fields share one interface.
- Keys that are not valid identifiers, such as \`content-type\`, are quoted.`,
    },
    {
      heading: 'JSON to TypeScript example',
      kind: 'examples',
      body: `Input:

\`\`\`json
{
  "id": 42,
  "title": "Launch plan",
  "owner": { "name": "Mia", "email": null },
  "tasks": [
    { "id": 1, "done": true },
    { "id": 2, "done": false, "due": "2026-12-01" }
  ]
}
\`\`\`

Output with the root name \`Project\`:

\`\`\`ts
export interface Project {
  id: number;
  title: string;
  owner: Owner;
  tasks: Task[];
}

export interface Owner {
  name: string;
  email: null;
}

export interface Task {
  id: number;
  done: boolean;
  due?: string;
}
\`\`\`

\`due\` is optional because only one task has it. \`email\` is typed as \`null\` because that is the only value in the sample; see the tips below.`,
    },
    {
      heading: 'Tips for accurate generated types',
      kind: 'tips',
      body: `- **Use a rich sample.** The generator can only see the values you give it. If a field is \`null\` in your sample but a string in real responses, edit the result to \`string | null\`. Combining several records in an array gives better results than one record.
- **Empty arrays become \`unknown[]\`** because there is nothing to infer from. Replace \`unknown\` with the real item type.
- **Empty objects become \`Record<string, unknown>\`**, which is a safe placeholder for dictionaries with dynamic keys.
- **Dates are strings in JSON.** A value like \`"2026-12-01"\` is typed as \`string\`; convert it to a \`Date\` in your code if needed.
- **Interface or type?** Both work for object shapes. Interfaces can be extended and merged; type aliases can also express unions. Pick the style your codebase uses.
- **Types are not runtime validation.** TypeScript types disappear when compiled. To check untrusted data at runtime, pair these types with a schema validation library.
- Tidy messy input first with the [JSON formatter](/developer-tools/json-formatter).`,
    },
  ],
  features: [
    'Generates TypeScript interfaces or type aliases from any JSON value.',
    'Creates named interfaces for nested objects, using PascalCase names from the keys.',
    'Merges arrays of objects and marks fields optional when they are missing from some items.',
    'Union types for mixed values and nullable fields.',
    'Reuses identical shapes and avoids name collisions automatically.',
    'Custom root name, optional export keyword and "all fields optional" mode.',
    'Runs in your browser: API responses are never uploaded.',
  ],
  faqs: [
    {
      question: 'How does the tool decide which fields are optional?',
      answer:
        'When an array contains several objects, any key that is missing from at least one of them is marked optional with a question mark. You can also mark every field optional with the checkbox.',
    },
    {
      question: 'Should I use interface or type?',
      answer:
        'For describing JSON objects both are equivalent in practice. Interfaces support declaration merging and extends, while type aliases can describe unions and other compositions. Follow the convention in your project.',
    },
    {
      question: 'Why is a field typed as null?',
      answer:
        'Because null was its only value in your sample. If the field can also hold other values, change the type to a union such as string | null, or use a sample where the field is filled in.',
    },
    {
      question: 'Can it handle JSON arrays at the top level?',
      answer:
        'Yes. A top-level array produces a type alias such as type Root = RootItem[] together with an interface for the items.',
    },
    {
      question: 'Do the generated types validate data at runtime?',
      answer:
        'No. TypeScript types only exist at compile time. They help your editor and compiler, but they do not check data that arrives while the program runs.',
    },
    {
      question: 'Is my JSON sent anywhere?',
      answer:
        'No. Types are generated by code running in your browser, and your JSON never leaves your device.',
    },
  ],
  relatedSlugs: ['json-formatter', 'json-to-yaml', 'json-to-csv', 'yaml-to-json'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const yamlToJson: Tool = {
  slug: 'yaml-to-json',
  category: 'developer-tools',
  name: 'YAML to JSON Converter',
  h1: 'YAML to JSON Converter',
  metaTitle: brandTitle('YAML to JSON Converter: Validate & Convert YAML'),
  metaDescription:
    'Convert YAML to JSON online with anchors, merge keys and multi-document support. Find YAML syntax errors by line. Free, no upload, runs in your browser.',
  primaryKeyword: 'YAML to JSON',
  secondaryKeywords: [
    'convert yaml to json',
    'yml to json',
    'yaml validator',
    'yaml parser online',
  ],
  intro:
    'Convert YAML to JSON and find YAML syntax errors by line and column along the way. Anchors, aliases, merge keys and multi-document files are supported.',
  cardDescription: 'Parse YAML into JSON and catch indentation errors.',
  icon: 'convert',
  howToSteps: [
    'Paste YAML into the left box, open a .yaml or .yml file, or click "Load sample".',
    'Pick the JSON style: indented with 2 or 4 spaces, tabs, or minified.',
    'If your file has several documents separated by ---, turn on "Multiple documents".',
    'Fix any YAML error shown below the editor; it includes the line and column.',
    'Copy the JSON or download it as converted.json.',
  ],
  contentSections: [
    {
      heading: 'What is YAML, and why convert YAML to JSON?',
      kind: 'concept',
      body: `YAML ("YAML Ain’t Markup Language") is a human-friendly data format that uses indentation instead of brackets. It is the standard for configuration in Kubernetes, Docker Compose, GitHub Actions, Ansible, Home Assistant and many static site generators. YAML is pleasant to write, but its flexibility makes mistakes easy: a single wrong indent can move a key into a different section without any error.

Converting YAML to JSON is the quickest way to see what a parser actually understands from your file. JSON has no ambiguity: every object is wrapped in braces and every string in quotes, so the structure is obvious at a glance. Developers also convert YAML to JSON to feed configuration into tools and APIs that only accept JSON, to validate a file before committing it, or to compare two configuration files.

### YAML 1.2 rules used by this converter

The converter uses the YAML 1.2 core schema via the js-yaml library, which is what modern tools expect:

- \`yes\`, \`no\`, \`on\` and \`off\` stay **strings**. Only \`true\` and \`false\` are booleans. (YAML 1.1 treated them as booleans, which caused the famous "Norway problem", where the country code \`NO\` became \`false\`.)
- \`~\`, \`null\` and empty values become JSON \`null\`.
- Anchors (\`&name\`), aliases (\`*name\`) and the \`<<\` merge key are expanded into full copies of the data.
- Dates like \`2026-01-15\` stay strings, because JSON has no date type.`,
    },
    {
      heading: 'YAML to JSON example with anchors and lists',
      kind: 'examples',
      body: `This YAML uses an anchor to share defaults:

\`\`\`yaml
defaults: &defaults
  timeout: 30
  retries: 2
api:
  <<: *defaults
  retries: 5
  hosts:
    - api-1.internal
    - api-2.internal
\`\`\`

The converter expands the merge key, and keys written directly in \`api\` win over merged ones:

\`\`\`json
{
  "defaults": { "timeout": 30, "retries": 2 },
  "api": {
    "timeout": 30,
    "retries": 5,
    "hosts": ["api-1.internal", "api-2.internal"]
  }
}
\`\`\`

(Shown with arrays and small objects on one line for brevity; the tool prints every item on its own line.)

### Multiple documents

A file such as a Kubernetes bundle can hold several documents separated by \`---\`. With **Multiple documents** enabled, the converter returns a JSON array with one element per document.`,
    },
    {
      heading: 'Common YAML errors',
      kind: 'tips',
      body: `- **Bad indentation**: a child key must be indented more than its parent, and siblings must line up exactly. Mixing two and four spaces in the same block is a frequent cause of "bad indentation of a mapping entry".
- **Tabs**: YAML forbids tab characters for indentation. Replace them with spaces.
- **A colon inside a value**: \`title: Note: read me\` is ambiguous. Quote the value: \`title: "Note: read me"\`.
- **Unclosed quotes or brackets** in flow style such as \`[1, 2\` produce an error on the following line, where the parser notices the problem.
- **Duplicate keys** in the same mapping are an error, because JSON objects cannot represent them reliably.
- **Special numbers**: \`.inf\` and \`.nan\` are valid YAML but have no JSON equivalent, so the converter reports them instead of producing invalid JSON.

Remember that the line number in an error points to where the parser **noticed** the problem, which is sometimes one line after the actual mistake.`,
    },
  ],
  features: [
    'Converts YAML 1.2 to JSON using the well-tested js-yaml parser.',
    'Expands anchors, aliases and << merge keys.',
    'Optional multi-document mode turns --- separated documents into a JSON array.',
    'YAML syntax errors shown with line, column and reason.',
    'Indented (2, 4 spaces or tabs) or minified JSON output.',
    'Open .yaml/.yml files, copy the result or download a .json file.',
    'Private: configuration files are processed locally and never uploaded.',
  ],
  faqs: [
    {
      question: 'Why does "yes" stay a string instead of becoming true?',
      answer:
        'The converter follows YAML 1.2, where only true and false are booleans. Older YAML 1.1 parsers treated yes, no, on and off as booleans, which often caused bugs, so modern tools use the 1.2 behavior.',
    },
    {
      question: 'Are comments kept in the JSON output?',
      answer:
        'No. JSON has no syntax for comments, so YAML comments are dropped during conversion. The data itself is converted completely.',
    },
    {
      question: 'How are YAML anchors and aliases converted?',
      answer:
        'Each alias is replaced by a full copy of the anchored data, and << merge keys are expanded, so the JSON contains the final, resolved values.',
    },
    {
      question: 'Can I convert a file with several YAML documents?',
      answer:
        'Yes. Turn on "Multiple documents" and every document separated by --- becomes one element of a JSON array.',
    },
    {
      question: 'What happens to dates and timestamps?',
      answer:
        'They are kept as strings exactly as written, because JSON has no date type. Your application can parse them as dates when it reads the JSON.',
    },
    {
      question: 'Is this a YAML validator as well?',
      answer:
        'Yes. If the YAML cannot be parsed, the tool shows the error and its position instead of JSON, so you can use it to check files before deploying them.',
    },
  ],
  relatedSlugs: ['json-to-yaml', 'json-formatter', 'csv-to-json', 'json-to-typescript'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

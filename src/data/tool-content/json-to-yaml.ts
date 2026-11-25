import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jsonToYaml: Tool = {
  slug: 'json-to-yaml',
  category: 'developer-tools',
  name: 'JSON to YAML Converter',
  h1: 'JSON to YAML Converter',
  metaTitle: brandTitle('JSON to YAML Converter Online, Free & Private'),
  metaDescription:
    'Convert JSON to YAML instantly for Kubernetes, Docker Compose or CI configs. Choose indentation, sort keys and download the file. Free, private, no upload.',
  primaryKeyword: 'JSON to YAML',
  secondaryKeywords: [
    'convert json to yaml',
    'json to yml',
    'json yaml converter',
    'kubernetes yaml from json',
  ],
  intro:
    'Turn JSON into clean, readable YAML for configuration files. Strings that YAML would misread, such as "yes" or "1.10", are quoted automatically so the data keeps its meaning.',
  cardDescription: 'Convert JSON into clean YAML for config files.',
  icon: 'convert',
  howToSteps: [
    'Paste JSON into the left box, open a .json file, or click "Load sample".',
    'Choose 2-space or 4-space indentation for the YAML output.',
    'Optionally sort keys alphabetically to get a predictable order.',
    'Check the YAML on the right; any JSON syntax error is shown with its line and column.',
    'Copy the YAML or download it as converted.yaml.',
  ],
  contentSections: [
    {
      heading: 'Why convert JSON to YAML?',
      kind: 'concept',
      body: `JSON and YAML can describe exactly the same data: maps of keys to values, lists, strings, numbers, booleans and null. In fact, YAML 1.2 was designed so that every JSON document is also valid YAML. The difference is in how they read. JSON uses braces, brackets and quotes everywhere; YAML uses indentation and dashes, which makes long configuration files much easier for people to scan and edit.

That is why many tools prefer YAML for configuration: Kubernetes manifests, Docker Compose files, GitHub Actions and GitLab CI pipelines, Ansible playbooks and OpenAPI specifications are usually written in YAML. Meanwhile, the data you start from often comes as JSON, for example from \`kubectl get -o json\`, an API response, or a settings export. Converting JSON to YAML gives you a starting file that you can then comment and maintain by hand.

### How the conversion works

The converter first validates and parses your JSON, then writes it out as block-style YAML with the js-yaml library. Objects become indented key–value pairs, arrays become lists of items that start with \`- \`, and multi-line strings become literal blocks introduced by \`|\`. Long lines are never folded, so values are copied exactly.`,
    },
    {
      heading: 'JSON to YAML example',
      kind: 'examples',
      body: `This JSON:

\`\`\`json
{
  "name": "web",
  "image": "nginx:1.27",
  "ports": [80, 443],
  "env": { "DEBUG": "false", "REGION": "eu" },
  "enabled": true
}
\`\`\`

converts to this YAML:

\`\`\`yaml
name: web
image: nginx:1.27
ports:
  - 80
  - 443
env:
  DEBUG: 'false'
  REGION: eu
enabled: true
\`\`\`

Notice that \`"false"\` in the JSON was a **string**, so the YAML keeps it in quotes. Without the quotes, a YAML parser would read it as the boolean \`false\`, and your application would receive a different type. The real boolean \`true\` stays unquoted.`,
    },
    {
      heading: 'Tips for YAML output that behaves as expected',
      kind: 'tips',
      body: `- **Quoted values are intentional.** Strings like \`yes\`, \`no\`, \`on\`, \`off\`, \`y\`, numbers in quotes (\`"8080"\`), dates (\`"2026-01-15"\`) and version numbers (\`"1.10"\`) are quoted because some YAML parsers would otherwise change their type. \`1.10\` unquoted, for example, becomes the number 1.1.
- **Indentation matters in YAML.** Always indent with spaces, never tabs. If you edit the output by hand, keep the same number of spaces for every level.
- **Comments are not carried over.** JSON has no comments, so there are none to convert. You can add \`# comments\` to the YAML afterwards.
- **Key order is preserved** unless you choose to sort keys. Kubernetes and most tools do not care about order, but people reading the file do, so leave it unsorted if the original order is meaningful.
- **Converting back** is lossless for JSON-compatible data: use the [YAML to JSON converter](/developer-tools/yaml-to-json) to check a round trip.`,
    },
  ],
  features: [
    'Converts any valid JSON document to block-style YAML.',
    'Automatically quotes strings that YAML would misinterpret as booleans, numbers or dates.',
    'Literal block style for multi-line strings, with no line folding.',
    'Choice of 2-space or 4-space indentation and optional alphabetical key sorting.',
    'Clear JSON error messages with line and column numbers.',
    'Copy to clipboard or download a .yaml file.',
    'Runs in your browser: configuration secrets are never uploaded.',
  ],
  faqs: [
    {
      question: 'Is JSON valid YAML?',
      answer:
        'Yes, for YAML 1.2. Every valid JSON document is also a valid YAML 1.2 document, so YAML parsers can read JSON directly. Converting to block-style YAML simply makes it easier for people to read and edit.',
    },
    {
      question: 'Why are some values wrapped in single quotes in the YAML?',
      answer:
        'They are strings that would change type if left unquoted, such as "yes", "true", "123" or "2026-01-15". Quoting them keeps them as strings, exactly as they were in your JSON.',
    },
    {
      question: 'Can I use the output for Kubernetes or Docker Compose?',
      answer:
        'Yes. The output is standard YAML that kubectl, Docker Compose, Helm and CI systems accept. Converting the JSON from kubectl get -o json, for example, produces a manifest you can edit and apply.',
    },
    {
      question: 'Does the converter keep the order of my keys?',
      answer:
        'Yes, keys appear in the same order as in the JSON unless you turn on "Sort keys A–Z".',
    },
    {
      question: 'What happens to null values?',
      answer:
        'JSON null becomes YAML null, written as the word null, which every YAML parser reads back as null.',
    },
    {
      question: 'Is my JSON uploaded to a server?',
      answer:
        'No. The conversion happens in your browser with JavaScript, so configuration values and secrets in your JSON never leave your device.',
    },
  ],
  relatedSlugs: ['yaml-to-json', 'json-formatter', 'json-to-csv', 'json-to-typescript'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const regexTester: Tool = {
  slug: 'regex-tester',
  category: 'developer-tools',
  name: 'Regex Tester',
  h1: 'Regex Tester: Test JavaScript Regular Expressions',
  metaTitle: brandTitle('Regex Tester: Live JavaScript Regex Online'),
  metaDescription:
    'Free regex tester with live match highlighting, capture groups, replace preview and a cheat sheet. Safe against catastrophic backtracking. Runs in your browser.',
  primaryKeyword: 'regex tester',
  secondaryKeywords: [
    'regular expression tester',
    'javascript regex',
    'regex online',
    'regex replace',
    'test regex',
  ],
  intro:
    'Write a regular expression and see every match highlighted as you type, with capture groups in a table and a live replace preview. Slow patterns are stopped automatically instead of freezing the page.',
  cardDescription: 'Test regular expressions with live highlighting.',
  icon: 'regex',
  popular: true,
  howToSteps: [
    'Type your pattern into the regular expression box (without the surrounding slashes).',
    'Tick the flags you need, such as g for all matches or i to ignore case.',
    'Paste the text to test. Matches are highlighted immediately.',
    'Check the table for the position and capture groups of each match.',
    'Optionally type a replacement such as $2, $1 to preview the result of a replace.',
  ],
  contentSections: [
    {
      heading: 'What is a regex tester?',
      kind: 'concept',
      body: `A regular expression (regex) is a compact pattern that describes text: "three digits, a hyphen, four digits" is \`\\d{3}-\\d{4}\`. Regexes are used to validate input, search logs, extract data and rewrite text in editors, command-line tools and almost every programming language.

They are also easy to get subtly wrong. A regex tester lets you try a pattern against real sample text and see exactly what it matches before you put it in code. This tester uses your browser's own JavaScript engine (\`RegExp\`), so results are identical to what \`String.prototype.match\`, \`matchAll\` and \`replace\` do in JavaScript and TypeScript. Most syntax is shared with Python, Java, .NET and PCRE, but details such as lookbehind support and named-group syntax can differ between engines.

### Flags

| Flag | Effect |
| --- | --- |
| \`g\` | Global: find all matches, not just the first |
| \`i\` | Ignore case |
| \`m\` | Multiline: \`^\` and \`$\` match at line breaks |
| \`s\` | Dot-all: \`.\` also matches line breaks |
| \`u\` | Unicode: treat surrogate pairs (emoji) as one character, enable \`\\p{…}\` |
| \`y\` | Sticky: match only at the current position |

### Protection against catastrophic backtracking

Some patterns, such as \`(a+)+$\`, take exponential time on certain inputs. In most online testers that freezes the browser tab. Here, matching runs in a separate Web Worker; if it takes longer than two seconds the worker is stopped and you get a clear explanation instead of a hung page.`,
    },
    {
      heading: 'Regex examples',
      kind: 'examples',
      body: `| Goal | Pattern | Matches |
| --- | --- | --- |
| ISO date | \`\\d{4}-\\d{2}-\\d{2}\` | \`2026-11-25\` |
| Hex colour | \`#(?:[0-9a-fA-F]{3}){1,2}\\b\` | \`#fff\`, \`#4f46e5\` |
| Whole word "cat" | \`\\bcat\\b\` | "cat" but not "concatenate" |
| Trailing spaces | \`\\s+$\` | spaces at the end of the text |
| Quoted text | \`"([^"]*)"\` | the text inside double quotes |

### Capture groups and replacing

Parentheses capture parts of a match, which you can reuse in the replacement. To swap "Last, First" into "First Last":

\`\`\`text
Pattern:      (\\w+), (\\w+)
Replacement:  $2 $1
Input:        Lovelace, Ada
Result:       Ada Lovelace
\`\`\`

Named groups make longer patterns readable: \`(?<year>\\d{4})-(?<month>\\d{2})\` with the replacement \`$<month>/$<year>\`.`,
    },
    {
      heading: 'Tips for writing better regular expressions',
      kind: 'tips',
      body: `- **Anchor validation patterns.** \`\\d{5}\` finds five digits anywhere, including inside "123456". Use \`^\\d{5}$\` to require the whole input to be five digits.
- **Prefer specific classes over \`.*\`.** \`"[^"]*"\` is faster and more predictable than \`".*"\`, which is greedy and can run past the closing quote.
- **Use lazy quantifiers when you need the shortest match**: \`<.+?>\` stops at the first \`>\`.
- **Escape special characters** \`. * + ? ^ $ { } ( ) | [ ] \\ /\` when you mean them literally, for example \`\\.\` for a dot.
- **Avoid nested quantifiers** like \`(a+)+\` or \`(\\w*)*\`; they are the usual cause of catastrophic backtracking.
- **Remember the g flag in code.** Without it, \`replace\` changes only the first match.
- **Regex is not a parser.** For HTML, JSON or email addresses with all their edge cases, use a proper parser or library and keep the regex for simple checks.`,
    },
  ],
  features: [
    'Live match highlighting as you type.',
    'Table of every match with its index and all capture groups, including named groups.',
    'Replace preview with $1, $<name> and $& references.',
    'All JavaScript flags: g, i, m, s, u and y.',
    'Runs in a Web Worker with a 2-second timeout, so catastrophic backtracking cannot freeze the page.',
    'Built-in regex cheat sheet.',
    'Private: your patterns and text stay in your browser.',
  ],
  faqs: [
    {
      question: 'Which regex flavour does this tester use?',
      answer:
        'It uses JavaScript regular expressions (ECMAScript) as implemented by your browser. Results match what JavaScript and TypeScript code will do.',
    },
    {
      question: 'Why does my pattern only find one match?',
      answer:
        'Turn on the g (global) flag. Without it, a regular expression stops after the first match.',
    },
    {
      question: 'What is catastrophic backtracking?',
      answer:
        'Some patterns with nested or overlapping quantifiers, such as (a+)+, make the engine try an exponential number of combinations on input that almost matches. This tester stops such runs after two seconds instead of freezing.',
    },
    {
      question: 'How do I use capture groups in the replacement?',
      answer:
        'Use $1, $2 and so on for numbered groups, $<name> for named groups and $& for the whole match. The replace preview updates as you type.',
    },
    {
      question: 'Does the tester support lookbehind?',
      answer:
        'Yes. Modern browsers support lookbehind such as (?<=\\$)\\d+ and negative lookbehind (?<!x). Very old browsers may not.',
    },
    {
      question: 'Is my test text sent to a server?',
      answer:
        'No. Matching runs locally in your browser, so logs and other sensitive text stay on your device.',
    },
  ],
  relatedSlugs: ['json-formatter', 'url-decode', 'sql-formatter', 'json-compare'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

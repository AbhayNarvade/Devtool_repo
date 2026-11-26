import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const uuidGenerator: Tool = {
  slug: 'uuid-generator',
  category: 'developer-tools',
  name: 'UUID Generator',
  h1: 'UUID Generator: Create v4 and v7 UUIDs',
  metaTitle: brandTitle('UUID Generator: Bulk UUID v4 and v7 Online'),
  metaDescription:
    'Free UUID generator for random v4 and time-ordered v7 UUIDs. Create up to 1000 at once, uppercase or lowercase, then copy or download. Secure and private.',
  primaryKeyword: 'UUID generator',
  secondaryKeywords: ['uuid v4', 'uuid v7', 'guid generator', 'bulk uuid', 'random uuid'],
  intro:
    'This UUID generator creates random version 4 or time-ordered version 7 UUIDs, one at a time or up to 1,000 in bulk, using your browser’s cryptographically secure random generator.',
  cardDescription: 'Generate random v4 or time-ordered v7 UUIDs in bulk.',
  icon: 'fingerprint',
  popular: true,
  howToSteps: [
    'Choose UUID v4 for purely random IDs or UUID v7 for IDs that sort by creation time.',
    'Enter how many you need, from 1 to 1,000.',
    'Tick Uppercase if your system expects capital hexadecimal letters.',
    'Click Generate, then copy all UUIDs or download them as a .txt file with one per line.',
  ],
  contentSections: [
    {
      heading: 'What is a UUID generator for?',
      kind: 'concept',
      body: `A UUID (Universally Unique Identifier), also called a GUID in the Microsoft world, is a 128-bit value written as 32 hexadecimal digits in five groups:

\`\`\`text
f47ac10b-58cc-4372-a567-0e02b2c3d479
\`\`\`

UUIDs let different systems create identifiers independently, without asking a central database for the next number, and still be practically certain that no two are the same. They are used as database primary keys, request and correlation IDs in logs, file names, idempotency keys for payment APIs and identifiers in distributed systems.

The current specification is RFC 9562 (2024), which replaced RFC 4122. The digit after the second hyphen is the **version**, and the first digit of the fourth group is the **variant** (8, 9, a or b for standard UUIDs).

### UUID v4: random

Version 4 UUIDs contain 122 random bits. This tool uses \`crypto.randomUUID()\`, the browser’s cryptographically secure generator. The chance of a collision is negligible: you would need to generate about 2.7 quintillion v4 UUIDs before reaching a 50% probability of a single duplicate.

### UUID v7: time-ordered

Version 7 starts with a 48-bit Unix timestamp in milliseconds, followed by random bits. Because the timestamp comes first, v7 UUIDs **sort in creation order** as plain text. That makes them much friendlier as database primary keys: new rows are appended at the end of B-tree indexes instead of being inserted at random positions, which reduces page splits and keeps inserts fast. This generator is monotonic, so even 1,000 v7 UUIDs created in the same millisecond come out in strictly increasing order.`,
    },
    {
      heading: 'UUID v4 and v7 examples',
      kind: 'examples',
      body: `| Version | Example | Notes |
| --- | --- | --- |
| v4 | \`3b241101-e2bb-4255-8caf-4136c566a962\` | Version digit 4, fully random |
| v7 | \`019b76da-a800-7a3e-9f1d-6c2b5e8a01f4\` | Starts with the creation time |

The first 12 hex digits of a v7 UUID are the timestamp. In the example above, \`019b76daa800\` is 1767225600000 milliseconds, which is 2026-01-01T00:00:00Z. The tool shows this time under the list when you generate v7 UUIDs.

Generating UUIDs in code is just as easy:

\`\`\`js
crypto.randomUUID(); // v4, in browsers and Node.js
\`\`\`

\`\`\`sql
SELECT gen_random_uuid(); -- PostgreSQL, v4 (PostgreSQL 18 adds uuidv7())
\`\`\``,
    },
    {
      heading: 'Choosing and storing UUIDs',
      kind: 'tips',
      body: `- **Use v7 for new database keys** when your database or ORM supports it, and v4 when the ID must reveal nothing, because v7 exposes the creation time to anyone who sees it.
- **Store UUIDs in a native UUID or 16-byte binary column** (PostgreSQL \`uuid\`, MySQL \`BINARY(16)\`) rather than as 36-character text. It halves the storage and speeds up indexes.
- **Case does not matter.** RFC 9562 says UUIDs should be generated in lowercase but compared case-insensitively. Use uppercase only if another system requires it.
- **Do not use UUIDs as secrets.** They are hard to guess, but they are not designed as security tokens; use a dedicated random token for password resets or API keys.
- **Avoid v1 for new systems.** It embeds the generating computer’s MAC address; v7 gives the same time ordering without that privacy issue.`,
    },
  ],
  features: [
    'UUID v4 generated with crypto.randomUUID (cryptographically secure).',
    'UUID v7 per RFC 9562 with a millisecond timestamp and monotonic ordering.',
    'Bulk generation of 1 to 1,000 UUIDs in one click.',
    'Uppercase or lowercase output.',
    'Copy all to the clipboard or download a .txt file with one UUID per line.',
    'Shows the timestamp embedded in a v7 UUID.',
    'Runs in your browser: nothing is sent to a server or logged.',
  ],
  faqs: [
    {
      question: 'What is the difference between UUID v4 and v7?',
      answer:
        'A v4 UUID is fully random. A v7 UUID begins with a millisecond timestamp followed by random bits, so v7 UUIDs sort by creation time, which makes them better database keys.',
    },
    {
      question: 'Can two generated UUIDs ever be the same?',
      answer:
        'In theory yes, in practice no. A v4 UUID has 122 random bits, so a duplicate is astronomically unlikely. This tool also guarantees that v7 UUIDs from one session are unique and increasing.',
    },
    {
      question: 'Is a GUID the same as a UUID?',
      answer:
        'Yes. GUID (Globally Unique Identifier) is Microsoft’s name for the same 128-bit format. A GUID from .NET or SQL Server is a UUID.',
    },
    {
      question: 'Are these UUIDs secure and random?',
      answer:
        'They are generated with the Web Crypto API, the same cryptographically secure random source browsers use for encryption keys, never with Math.random.',
    },
    {
      question: 'Should UUIDs be uppercase or lowercase?',
      answer:
        'RFC 9562 recommends generating lowercase and comparing without regard to case. Choose uppercase only when a system you integrate with expects it.',
    },
    {
      question: 'How many UUIDs can I generate at once?',
      answer: 'Up to 1,000 per click. Click Generate again for another batch.',
    },
  ],
  relatedSlugs: ['hash-generator', 'unix-timestamp-converter', 'json-formatter', 'base64-encode'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

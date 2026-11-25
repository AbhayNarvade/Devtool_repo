import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const unixTimestampConverter: Tool = {
  slug: 'unix-timestamp-converter',
  category: 'developer-tools',
  name: 'Unix Timestamp Converter',
  h1: 'Unix Timestamp Converter: Epoch to Date and Back',
  metaTitle: brandTitle('Unix Timestamp Converter: Epoch to Date & Back'),
  metaDescription:
    'Unix timestamp converter for seconds and milliseconds: see UTC, local time and ISO 8601, convert dates back to epoch time and watch the live current timestamp.',
  primaryKeyword: 'Unix timestamp converter',
  secondaryKeywords: [
    'epoch converter',
    'timestamp to date',
    'date to timestamp',
    'epoch time',
    'unix time now',
  ],
  intro:
    'Convert Unix timestamps in seconds or milliseconds to readable dates in UTC and your local time zone, or turn a date back into a timestamp. The current Unix time updates live.',
  cardDescription: 'Convert epoch seconds or milliseconds to dates.',
  icon: 'clock',
  howToSteps: [
    'Type or paste a timestamp, click "Use now", or load the sample.',
    'Leave the unit on Auto to detect seconds or milliseconds, or choose one explicitly.',
    'Read the result in ISO 8601, UTC, your local time zone and relative form ("3 days ago").',
    'To go the other way, pick a date and time, choose whether it is local time or UTC, and copy the seconds or milliseconds.',
  ],
  contentSections: [
    {
      heading: 'What is a Unix timestamp converter for?',
      kind: 'concept',
      body: `A Unix timestamp (also called epoch time or POSIX time) is the number of seconds that have passed since **1 January 1970 at 00:00:00 UTC**, a moment known as the Unix epoch. For example, \`1767225600\` is 2026-01-01T00:00:00Z.

Timestamps are popular in software because they are a single number with no time zone, no daylight saving rules and no date format to argue about. Databases, log files, APIs, JWT tokens and file systems all use them. When the timestamp has to be shown to a person, it is converted into a calendar date in a specific time zone.

### Seconds or milliseconds?

Unix tools, PHP, Python's \`time.time()\` and most APIs use **seconds**. JavaScript (\`Date.now()\`), Java (\`System.currentTimeMillis()\`) and many JSON APIs use **milliseconds**, which makes the number three digits longer. The converter's Auto mode uses a simple rule: values with 12 or more digits are milliseconds. A second-based timestamp only reaches 12 digits in the year 5138, so the rule is safe for real data.

| Value | Unit | Date (UTC) |
| --- | --- | --- |
| \`0\` | seconds | 1970-01-01 00:00:00 |
| \`1000000000\` | seconds | 2001-09-09 01:46:40 |
| \`1767225600\` | seconds | 2026-01-01 00:00:00 |
| \`1767225600000\` | milliseconds | 2026-01-01 00:00:00 |
| \`-86400\` | seconds | 1969-12-31 00:00:00 |`,
    },
    {
      heading: 'Converting timestamps in code',
      kind: 'examples',
      body: `The converter is handy for a quick check, but here is how to do the same in common languages:

\`\`\`js
// JavaScript: milliseconds
new Date(1767225600 * 1000).toISOString(); // "2026-01-01T00:00:00.000Z"
Math.floor(Date.now() / 1000);             // current timestamp in seconds
\`\`\`

\`\`\`python
# Python: seconds
from datetime import datetime, timezone
datetime.fromtimestamp(1767225600, tz=timezone.utc)  # 2026-01-01 00:00:00+00:00
\`\`\`

\`\`\`sql
-- PostgreSQL
SELECT to_timestamp(1767225600);             -- 2026-01-01 00:00:00+00
SELECT extract(epoch FROM now())::bigint;    -- current timestamp
\`\`\`

On Linux and macOS, \`date +%s\` prints the current Unix time, and \`date -u -d @1767225600\` (GNU) or \`date -u -r 1767225600\` (macOS) converts one to a date.`,
    },
    {
      heading: 'Common timestamp mistakes',
      kind: 'tips',
      body: `- **A date in 1970**: you passed seconds to a function that expects milliseconds, such as JavaScript's \`new Date()\`. Multiply by 1000.
- **A date tens of thousands of years in the future**: the opposite mistake, milliseconds used as seconds.
- **Off by a few hours**: the timestamp was created from a local time as if it were UTC, or the other way round. A timestamp is always UTC-based; time zones only apply when displaying it. Use the "Interpret as" switch to see the difference.
- **Daylight saving gaps**: some local times do not exist (clocks jump forward) or exist twice (clocks go back). Converting such a local time is ambiguous; store and exchange times in UTC to avoid the problem.
- **The year 2038 problem**: systems that store timestamps as signed 32-bit integers overflow on 19 January 2038 at 03:14:07 UTC (\`2147483647\`). Use 64-bit integers for new code.
- **Leap seconds** are not counted in Unix time; every day is exactly 86,400 seconds.`,
    },
  ],
  features: [
    'Live current Unix timestamp in seconds and milliseconds.',
    'Automatic detection of seconds vs milliseconds, with manual override.',
    'Results in ISO 8601, UTC, your local time zone and relative time.',
    'Date and time to timestamp, interpreted as local time or UTC.',
    'Supports negative timestamps (dates before 1970) and fractional seconds.',
    'One-click copy for every value.',
    'Runs entirely in your browser using the built-in Intl date APIs.',
  ],
  faqs: [
    {
      question: 'What is the current Unix timestamp?',
      answer:
        'It is shown live at the top of the tool and updates every second. It is the number of seconds since 1970-01-01T00:00:00Z.',
    },
    {
      question: 'How do I know if a timestamp is in seconds or milliseconds?',
      answer:
        'Count the digits. Current timestamps in seconds have 10 digits, while milliseconds have 13. The Auto setting detects this for you.',
    },
    {
      question: 'Is a Unix timestamp in UTC?',
      answer:
        'Yes. A Unix timestamp counts seconds since the epoch in UTC and has no time zone of its own. The same timestamp is displayed as different local times in different time zones.',
    },
    {
      question: 'Can Unix timestamps be negative?',
      answer:
        'Yes. Negative values represent dates before 1 January 1970, for example -86400 is 31 December 1969.',
    },
    {
      question: 'What is the 2038 problem?',
      answer:
        'Systems that store Unix time in a signed 32-bit integer can only count up to 2147483647, which is 19 January 2038 at 03:14:07 UTC. After that the value overflows. Modern systems use 64-bit integers.',
    },
    {
      question: 'What is ISO 8601?',
      answer:
        'ISO 8601 is the international standard date format, such as 2026-01-01T00:00:00Z. The Z means UTC. It sorts correctly as text and is the safest format for exchanging dates between systems.',
    },
  ],
  relatedSlugs: ['cron-expression-generator', 'jwt-decoder', 'uuid-generator', 'json-formatter'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

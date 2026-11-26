import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const cronExpressionGenerator: Tool = {
  slug: 'cron-expression-generator',
  category: 'developer-tools',
  name: 'Cron Expression Generator',
  h1: 'Cron Expression Generator and Explainer',
  metaTitle: brandTitle('Cron Expression Generator, Builder & Explainer'),
  metaDescription:
    'Cron expression generator with a visual builder, plain-English description and the next 10 run times in your time zone or UTC. Common presets included. Free.',
  primaryKeyword: 'cron expression generator',
  secondaryKeywords: [
    'cron builder',
    'crontab generator',
    'cron explainer',
    'cron schedule',
    'crontab guru',
  ],
  intro:
    'This cron expression generator builds schedules with a visual editor and explains existing expressions in plain English. The next 10 run times are listed in your time zone or UTC.',
  cardDescription: 'Build, explain and preview cron schedules.',
  icon: 'calendar',
  howToSteps: [
    'Type or paste a cron expression, or pick one of the common presets.',
    'Use the visual builder to change each field: every, every N, a range or specific values.',
    'Read the plain-English description to confirm the schedule means what you intend.',
    'Check the next 10 run times, switching between your local time zone and UTC.',
    'Copy the expression into your crontab, CI pipeline or scheduler.',
  ],
  contentSections: [
    {
      heading: 'How a cron expression generator helps',
      kind: 'concept',
      body: `Cron is the scheduler built into Unix-like systems, and its five-field syntax is used far beyond Linux: Kubernetes CronJobs, GitHub Actions \`schedule\` triggers, cloud schedulers and many job libraries all accept it. The syntax is compact, which also makes it easy to misread. A cron expression generator lets you build schedules visually and check exactly when they will run.

A standard expression has five fields separated by spaces:

\`\`\`text
┌───────────── minute (0–59)
│ ┌─────────── hour (0–23)
│ │ ┌───────── day of month (1–31)
│ │ │ ┌─────── month (1–12)
│ │ │ │ ┌───── day of week (0–6, Sunday = 0)
│ │ │ │ │
*/15 9-17 * * 1-5
\`\`\`

This example means "every 15 minutes, between 09:00 and 17:59, Monday to Friday".

### Field syntax

| Syntax | Meaning | Example |
| --- | --- | --- |
| \`*\` | Every value | \`*\` in hours = every hour |
| \`*/n\` | Every n-th value | \`*/10\` minutes = 0, 10, 20 … |
| \`a-b\` | Range | \`1-5\` = Monday to Friday |
| \`a,b,c\` | List | \`0,30\` = on the hour and half past |
| \`a-b/n\` | Stepped range | \`0-30/10\` = 0, 10, 20, 30 |

Shortcuts such as \`@hourly\`, \`@daily\`, \`@weekly\`, \`@monthly\` and \`@yearly\` are also accepted and expanded to their five-field form. The description uses cronstrue and the run times are calculated with cron-parser.`,
    },
    {
      heading: 'Cron expression examples',
      kind: 'examples',
      body: `| Expression | Runs |
| --- | --- |
| \`* * * * *\` | Every minute |
| \`*/5 * * * *\` | Every 5 minutes |
| \`0 * * * *\` | At the start of every hour |
| \`30 2 * * *\` | Every day at 02:30 |
| \`0 9 * * 1-5\` | Weekdays at 09:00 |
| \`0 0 * * 0\` | Every Sunday at midnight |
| \`0 0 1 * *\` | Midnight on the first day of every month |
| \`0 6 1 1,4,7,10 *\` | 06:00 on the first day of each quarter |

A Kubernetes CronJob that runs a backup every night at 01:00 looks like this:

\`\`\`yaml
apiVersion: batch/v1
kind: CronJob
metadata:
  name: nightly-backup
spec:
  schedule: "0 1 * * *"
  timeZone: "Europe/Berlin"
\`\`\``,
    },
    {
      heading: 'Cron pitfalls to avoid',
      kind: 'tips',
      body: `- **Time zones.** Cron runs in the time zone of the machine or service that executes it, often UTC on servers and CI runners. GitHub Actions schedules are always UTC. Use the UTC switch to see the real run times.
- **Day of month OR day of week.** When both fields are restricted, standard cron runs the job when **either** matches. \`0 0 13 * 5\` runs on every 13th and on every Friday, not only on Friday the 13th.
- **Daylight saving time.** Jobs scheduled between 01:00 and 03:00 local time may run twice or be skipped on the days clocks change. Schedule critical jobs in UTC.
- **\`*/7\` is not "every 7 days" across months.** Steps restart in every period: \`*/7\` in the day-of-month field gives days 1, 8, 15, 22 and 29, then starts again on the 1st.
- **Seconds are not part of standard cron.** Six-field expressions with a leading seconds field (Quartz, Spring) are a different format and are rejected here.
- **Spread heavy jobs out.** Many systems run jobs at \`0 * * * *\`; choosing an odd minute like \`17\` avoids load spikes on shared infrastructure.`,
    },
  ],
  features: [
    'Visual builder for all five fields: every, every N, range, specific values or custom syntax.',
    'Plain-English description of any expression (24-hour or 12-hour clock).',
    'Next 10 run times in your local time zone or UTC.',
    'Common presets from "every minute" to "once a year".',
    'Supports lists, ranges, steps and @daily-style shortcuts.',
    'Validation with clear messages for wrong field counts or out-of-range values.',
    'Runs in your browser with no sign-up.',
  ],
  faqs: [
    {
      question: 'What does */5 * * * * mean?',
      answer: 'It runs every 5 minutes: at minute 0, 5, 10 and so on, every hour of every day.',
    },
    {
      question: 'Is Sunday 0 or 7 in cron?',
      answer:
        'Sunday is 0 in standard cron. Many implementations also accept 7 for Sunday, but 0 is the portable choice.',
    },
    {
      question: 'Which time zone does cron use?',
      answer:
        'The time zone of the system that runs the job. Servers and CI services often use UTC, so check your platform documentation and use the UTC view in this tool.',
    },
    {
      question: 'Can cron run a job every 30 seconds?',
      answer:
        'Not with standard five-field cron, whose smallest unit is one minute. Use a scheduler that supports seconds, or a loop inside a job that runs every minute.',
    },
    {
      question: 'Why does my job run on more days than expected?',
      answer:
        'If both day-of-month and day-of-week are set, standard cron runs when either one matches. Set one of them to * to restrict by the other.',
    },
    {
      question: 'Does this tool support Quartz or Spring cron with seconds?',
      answer:
        'No. It supports the standard five-field format used by crontab, Kubernetes and GitHub Actions. Six- and seven-field expressions are rejected with an explanation.',
    },
  ],
  relatedSlugs: [
    'unix-timestamp-converter',
    'regex-tester',
    'chmod-calculator',
    'subnet-calculator',
    'json-to-yaml',
  ],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

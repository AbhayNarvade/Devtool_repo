import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const chmodCalculator: Tool = {
  slug: 'chmod-calculator',
  category: 'developer-tools',
  name: 'Chmod Calculator',
  h1: 'Chmod Calculator: Linux File Permissions',
  metaTitle: brandTitle('Chmod Calculator: Octal & Symbolic Permissions'),
  metaDescription:
    'Chmod calculator for Linux and macOS: tick permissions to get the octal (755) and symbolic (rwxr-xr-x) values and the chmod command, with setuid and sticky bit.',
  primaryKeyword: 'chmod calculator',
  secondaryKeywords: [
    'chmod 755',
    'linux file permissions',
    'octal permissions',
    'rwx calculator',
    'unix permissions',
  ],
  intro:
    'Tick read, write and execute for owner, group and others to get the octal value, the symbolic string and a ready-to-run chmod command. Typing a value like 644 or rw-r--r-- updates everything else.',
  cardDescription: 'Convert rwx permissions to octal and chmod commands.',
  icon: 'lock',
  howToSteps: [
    'Tick the permissions you want in the grid, or start from a common preset such as 644 or 755.',
    'Alternatively, type an octal value (755) or a symbolic string (rwxr-xr-x) into the boxes.',
    'Add the setuid, setgid or sticky bit if you need it.',
    'Enter your file or folder name to personalise the command.',
    'Copy the numeric or symbolic chmod command.',
  ],
  contentSections: [
    {
      heading: 'How Linux file permissions and the chmod calculator work',
      kind: 'concept',
      body: `Every file and directory on Linux, macOS and other Unix-like systems has three sets of permissions:

- **Owner (u)**: the user who owns the file;
- **Group (g)**: members of the file's group;
- **Others (o)**: everyone else.

Each set has three permissions: **read (r)**, **write (w)** and **execute (x)**. For files, execute means the file can be run as a program. For directories, read lets you list the contents, write lets you create and delete entries, and execute lets you enter the directory and access files inside it.

### Octal notation

Each permission has a value: read = 4, write = 2, execute = 1. Adding them gives one digit per set, so three digits describe all permissions:

| Digit | Permissions | Symbolic |
| --- | --- | --- |
| 7 | read + write + execute | \`rwx\` |
| 6 | read + write | \`rw-\` |
| 5 | read + execute | \`r-x\` |
| 4 | read only | \`r--\` |
| 0 | none | \`---\` |

So \`755\` means owner \`rwx\` (7), group \`r-x\` (5) and others \`r-x\` (5), shown by \`ls -l\` as \`-rwxr-xr-x\`.

### Special bits

An optional fourth digit at the front sets special modes: **setuid (4)** runs an executable with the owner's privileges, **setgid (2)** runs it with the group's privileges or, on a directory, makes new files inherit the directory's group, and the **sticky bit (1)** on a directory means only a file's owner can delete it (as in \`/tmp\`, which is \`1777\`). In \`ls -l\` they appear as \`s\` or \`t\` in the execute position; a capital \`S\` or \`T\` means the special bit is set without execute.`,
    },
    {
      heading: 'Common chmod examples',
      kind: 'examples',
      body: `| Command | Result | Typical use |
| --- | --- | --- |
| \`chmod 644 file\` | \`rw-r--r--\` | Normal files, web pages |
| \`chmod 755 dir\` | \`rwxr-xr-x\` | Directories, scripts |
| \`chmod 600 ~/.ssh/id_ed25519\` | \`rw-------\` | Private keys |
| \`chmod 700 ~/.ssh\` | \`rwx------\` | Private directories |
| \`chmod 2775 shared/\` | \`rwxrwsr-x\` | Team folder that keeps its group |
| \`chmod 1777 /tmp\` | \`rwxrwxrwt\` | Shared temporary folder |

The symbolic form describes the same thing in words and can also change permissions relative to the current ones:

\`\`\`bash
chmod u=rwx,g=rx,o=rx deploy.sh   # same as chmod 755
chmod +x deploy.sh                # add execute for everyone
chmod -R g+w project/             # add group write, recursively
\`\`\``,
    },
    {
      heading: 'Permission tips and mistakes to avoid',
      kind: 'tips',
      body: `- **Avoid \`chmod 777\`.** It lets every user on the system change or replace the file. If something "only works with 777", the real fix is usually the file's owner or group (\`chown\`), not wider permissions.
- **SSH is strict.** OpenSSH refuses private keys that others can read; use \`600\` for keys and \`700\` for the \`~/.ssh\` directory.
- **Directories need execute.** A directory with \`644\` cannot be entered. Use \`755\` (or \`750\`) for directories and \`644\` (or \`640\`) for files.
- **Be careful with \`-R\`.** \`chmod -R 755\` makes every file executable too. To set directories and files differently, use \`find . -type d -exec chmod 755 {} +\` and \`find . -type f -exec chmod 644 {} +\`.
- **Setuid on scripts is ignored** by Linux for security reasons; it only affects compiled executables. Use it sparingly.
- **umask** decides the default permissions of new files; a umask of \`022\` gives \`644\` files and \`755\` directories.`,
    },
  ],
  features: [
    'Checkbox grid for read, write and execute for owner, group and others.',
    'Two-way conversion between octal (755) and symbolic (rwxr-xr-x) notation.',
    'setuid, setgid and sticky bits with correct s/S and t/T display.',
    'Ready-to-copy numeric and symbolic chmod commands with your file name (safely quoted).',
    'Accepts ls -l output such as -rw-r--r-- or drwxr-xr-x.',
    'Presets for common permissions with explanations.',
    'Runs entirely in your browser.',
  ],
  faqs: [
    {
      question: 'What does chmod 755 mean?',
      answer:
        'The owner can read, write and execute (7), and the group and everyone else can read and execute (5 and 5). It is the usual setting for directories and scripts.',
    },
    {
      question: 'What is the difference between 644 and 755?',
      answer:
        '644 gives the owner read and write and everyone else read-only, with no execute permission. 755 adds execute for everyone, which programs and directories need.',
    },
    {
      question: 'Why is chmod 777 dangerous?',
      answer:
        'It gives every user on the system permission to modify or replace the file, which can let an attacker or a buggy process change your code or data. Use the narrowest permissions that work.',
    },
    {
      question: 'What do s and t mean in ls -l output?',
      answer:
        'An s in the owner or group execute position means setuid or setgid is set; a t in the others position is the sticky bit. Uppercase S or T means the special bit is set but execute is not.',
    },
    {
      question: 'Does chmod work on Windows?',
      answer:
        'Not natively. Windows uses access control lists instead. Inside WSL, Git Bash or on network shares from Linux, chmod values still apply to the Linux side.',
    },
    {
      question: 'What permissions should an SSH private key have?',
      answer:
        'Use 600 (rw-------) so only you can read and write it. The ~/.ssh directory itself should be 700.',
    },
  ],
  relatedSlugs: [
    'subnet-calculator',
    'cron-expression-generator',
    'hash-generator',
    'regex-tester',
  ],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

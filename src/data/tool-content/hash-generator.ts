import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const hashGenerator: Tool = {
  slug: 'hash-generator',
  category: 'developer-tools',
  name: 'Hash Generator',
  h1: 'Hash Generator: MD5, SHA-1, SHA-256 and SHA-512',
  metaTitle: brandTitle('Hash Generator: MD5, SHA-256, SHA-512 Online'),
  metaDescription:
    'Free hash generator for text and files: MD5, SHA-1, SHA-256, SHA-384 and SHA-512, plus checksum verification. Files are hashed locally and never uploaded.',
  primaryKeyword: 'hash generator',
  secondaryKeywords: [
    'sha256 generator',
    'md5 generator',
    'file checksum',
    'sha512 hash',
    'verify checksum',
  ],
  intro:
    'Calculate MD5, SHA-1, SHA-256, SHA-384 and SHA-512 hashes of text or any file, and check a download against its published checksum. Large files are hashed in a background thread.',
  cardDescription: 'MD5 and SHA hashes for text and files, with verification.',
  icon: 'hash',
  handlesFiles: true,
  howToSteps: [
    'Choose Text or File.',
    'Type or paste text (it is hashed as UTF-8), or choose, drop or paste a file.',
    'Select which algorithms you want; all five are on by default.',
    'Copy any hash, optionally in uppercase.',
    'To verify a download, paste the expected checksum into the Verify box and look for the match message.',
  ],
  contentSections: [
    {
      heading: 'What does a hash generator do?',
      kind: 'concept',
      body: `A cryptographic hash function turns any amount of data into a short, fixed-length fingerprint. The same input always produces the same hash, a one-bit change in the input produces a completely different hash, and it is practically impossible to work backwards from the hash to the input.

A hash generator calculates these fingerprints. Typical uses are:

- **Verifying downloads**: software publishers list the SHA-256 checksum of their files. If the hash of your download matches, the file is complete and unmodified.
- **Detecting changes**: comparing hashes is a quick way to see whether two files are identical without comparing them byte by byte.
- **Cache keys and deduplication**: build systems and storage services identify content by its hash.
- **Integrity in APIs**: webhooks and signed URLs often include a hash or HMAC of the payload.

### The algorithms

| Algorithm | Output | Status |
| --- | --- | --- |
| MD5 | 128 bits (32 hex characters) | Broken for security; fine for non-adversarial checksums |
| SHA-1 | 160 bits (40 hex) | Broken (practical collisions since 2017); legacy only |
| SHA-256 | 256 bits (64 hex) | Secure; the most common choice today |
| SHA-384 | 384 bits (96 hex) | Secure (SHA-2 family) |
| SHA-512 | 512 bits (128 hex) | Secure; often faster than SHA-256 on 64-bit CPUs |

SHA hashes are calculated with the browser's Web Crypto API. MD5 is not part of Web Crypto, so it uses the small js-md5 library.`,
    },
    {
      heading: 'Hash examples (test vectors)',
      kind: 'examples',
      body: `Hashes of the text \`abc\` (these are the standard test vectors, useful for checking any implementation):

\`\`\`text
MD5      900150983cd24fb0d6963f7d28e17f72
SHA-1    a9993e364706816aba3e25717850c26c9cd0d89d
SHA-256  ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad
\`\`\`

Changing a single character, for example to \`abd\`, gives an entirely different result. This is called the avalanche effect.

To check a file on the command line instead, use \`sha256sum file.iso\` on Linux, \`shasum -a 256 file.iso\` on macOS, or \`Get-FileHash file.iso -Algorithm SHA256\` in PowerShell. All of them print the same hash this tool shows.`,
    },
    {
      heading: 'Hashing tips and pitfalls',
      kind: 'tips',
      body: `- **Never store passwords with MD5 or SHA alone.** These functions are designed to be fast, which makes guessing passwords fast too. Use a dedicated password hashing function such as Argon2id, scrypt or bcrypt with a unique salt.
- **Text hashes depend on exact bytes.** A trailing newline, Windows line endings (\\r\\n) or a different text encoding all change the hash. This tool hashes exactly what is in the box, encoded as UTF-8.
- **Case does not matter in hex output.** \`A9F0\` and \`a9f0\` are the same hash; the verify box ignores case and surrounding spaces.
- **Checksums prove integrity, not authenticity.** If an attacker can change both the file and the checksum on the same website, the hashes will still match. Prefer checksums published over HTTPS or signed with a key.
- **Very large files**: Web Crypto calculates SHA hashes on the whole file in memory, so files of several gigabytes may fail on devices with little memory. MD5 is calculated in chunks.
- For random identifiers rather than fingerprints, use the [UUID generator](/developer-tools/uuid-generator).`,
    },
  ],
  features: [
    'MD5, SHA-1, SHA-256, SHA-384 and SHA-512 in one view.',
    'Hash text (as UTF-8) or any file type.',
    'Files are hashed in a Web Worker with a progress bar, so the page stays responsive.',
    'Checksum verification: paste an expected hash to see which algorithm matches.',
    'Lowercase or uppercase hexadecimal output and one-click copy.',
    'Verified against the standard test vectors.',
    'Your files never leave your device: hashing happens in your browser.',
  ],
  faqs: [
    {
      question: 'Are my files uploaded to calculate the hash?',
      answer:
        'No. The file is read and hashed by your browser in a background thread. Nothing is uploaded, so you can safely hash private or very large files.',
    },
    {
      question: 'Which hash should I use?',
      answer:
        'Use SHA-256 for checksums and integrity checks. Use MD5 or SHA-1 only when an older system requires them, because both are broken for security purposes.',
    },
    {
      question: 'Can a hash be reversed to get the original text?',
      answer:
        'No. Hash functions are one-way. Short or common inputs can sometimes be found by guessing and comparing hashes, which is why passwords need slow, salted password hashing.',
    },
    {
      question: 'Why is my hash different from another tool?',
      answer:
        'The input bytes differ. Common causes are a trailing newline, different line endings or a different text encoding. For files, make sure both tools hash the exact same file.',
    },
    {
      question: 'How do I verify a downloaded file?',
      answer:
        'Choose File, select the download, and paste the checksum from the publisher into the Verify box. A match message confirms the file is intact.',
    },
    {
      question: 'Is SHA-512 more secure than SHA-256?',
      answer:
        'Both are secure for current use. SHA-512 has a longer output and a larger security margin, while SHA-256 is the most widely used and supported.',
    },
  ],
  relatedSlugs: ['base64-encode', 'uuid-generator', 'jwt-decoder', 'json-compare'],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

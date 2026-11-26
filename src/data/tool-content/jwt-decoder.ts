import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const jwtDecoder: Tool = {
  slug: 'jwt-decoder',
  category: 'developer-tools',
  name: 'JWT Decoder',
  h1: 'JWT Decoder: Read JSON Web Token Claims',
  metaTitle: brandTitle('JWT Decoder: Decode JSON Web Tokens Online'),
  metaDescription:
    'Free JWT decoder: read the header, payload and claims of a JSON Web Token, with exp and iat shown as dates and an expiry badge. Tokens are never uploaded.',
  primaryKeyword: 'JWT decoder',
  secondaryKeywords: [
    'decode jwt',
    'jwt parser',
    'json web token decoder',
    'jwt expiry checker',
    'jwt claims',
  ],
  intro:
    'Use this JWT decoder to read a JSON Web Token’s header, payload and expiry in plain form. Decoding happens in your browser, so the token never leaves your device. Signatures are not verified.',
  cardDescription: 'Inspect JWT headers, claims and expiry dates.',
  icon: 'key',
  popular: true,
  howToSteps: [
    'Paste the token into the input box. A "Bearer " prefix copied from an Authorization header is removed automatically.',
    'Read the status badge to see whether the token has expired, is not valid yet, or has no expiry.',
    'Check the decoded header (algorithm and type) and the payload with all claims.',
    'Use the time claims table to see exp, iat and nbf in UTC and in your own time zone.',
    'Copy the header or payload JSON if you need it elsewhere.',
  ],
  contentSections: [
    {
      heading: 'What does a JWT decoder show?',
      kind: 'concept',
      body: `A JSON Web Token (JWT, defined in RFC 7519) is a compact way to pass claims between systems, most often as an access token in the \`Authorization: Bearer\` header of API requests. A signed JWT has three parts separated by dots:

\`\`\`text
header.payload.signature
\`\`\`

The **header** and **payload** are JSON objects encoded with Base64URL, a URL-safe variant of Base64. They are encoded, not encrypted, so anyone who has the token can read them. The **signature** is created by the issuer with a secret (HS256) or a private key (RS256, ES256) over the first two parts.

A JWT decoder reverses the Base64URL encoding and pretty-prints the JSON. This tool also converts the standard time claims, which are stored as seconds since 1 January 1970 (NumericDate), into readable dates, and compares \`exp\` and \`nbf\` with the current time to show whether the token is still usable.

### Registered claims you will often see

| Claim | Meaning |
| --- | --- |
| \`iss\` | Issuer: who created the token |
| \`sub\` | Subject: usually the user ID |
| \`aud\` | Audience: which API the token is meant for |
| \`exp\` | Expiration time (seconds since 1970) |
| \`nbf\` | Not before: the token is invalid until this time |
| \`iat\` | Issued at |
| \`jti\` | Unique token ID, used to prevent replay |`,
    },
    {
      heading: 'Why this tool does not verify signatures',
      kind: 'concept',
      body: `Verifying a signature proves that the token was issued by someone who holds the key and has not been modified. To verify, you need the HMAC secret or the issuer’s public key. Pasting a production secret into a website, even a private one like this, is a bad habit, and a decoder cannot know which key is the right one anyway.

So this tool deliberately **only decodes**. Treat everything it shows as unverified: anyone can craft a token with \`"role": "admin"\` in the payload. Your server must verify the signature with a maintained JWT library, check \`exp\`, \`nbf\`, \`iss\` and \`aud\`, and only accept the algorithms it expects. The tool warns you when a token uses \`"alg": "none"\`, which means it is unsigned and must be rejected.`,
    },
    {
      heading: 'JWT decoding example',
      kind: 'examples',
      body: `The header of the sample token decodes to:

\`\`\`json
{ "alg": "HS256", "typ": "JWT" }
\`\`\`

and the payload to:

\`\`\`json
{
  "sub": "1234567890",
  "name": "Ada Lovelace",
  "roles": ["admin", "editor"],
  "iat": 1767225600,
  "exp": 1767229200
}
\`\`\`

\`iat\` 1767225600 is 2026-01-01T00:00:00Z, and \`exp\` is exactly one hour later, so the tool shows the token as expired once that time has passed.`,
    },
    {
      heading: 'Troubleshooting tokens',
      kind: 'tips',
      body: `- **"A JWT has three parts"**: the value was cut off when copying, or it is not a JWT (opaque tokens from some providers are random strings that cannot be decoded).
- **Five parts**: the token is a JWE (encrypted JWT). Its payload can only be read with the decryption key.
- **exp looks like the year 57,000**: the issuer wrote milliseconds instead of seconds. The tool warns about this because servers will then treat the token as never expiring.
- **"Expired" but your app still accepts it**: servers often allow a little clock skew (for example 30–60 seconds), or the app may be refreshing tokens automatically.
- **Do not store sensitive data in a JWT payload.** Because it is only Base64URL-encoded, passwords, card numbers or personal data in claims are readable by anyone who sees the token.
- To decode other Base64 values, use the [Base64 decoder](/developer-tools/base64-decode).`,
    },
  ],
  features: [
    'Decodes the JWT header and payload from Base64URL and pretty-prints the JSON.',
    'Shows exp, iat and nbf as ISO 8601 UTC dates and in your local time zone.',
    'Expired, not-yet-valid and valid badges with the time remaining.',
    'Warnings for alg "none", millisecond timestamps and malformed time claims.',
    'Recognizes encrypted JWE tokens and strips a "Bearer " prefix automatically.',
    'Clearly states that signatures are not verified.',
    'Private: tokens are decoded in your browser and never sent anywhere.',
  ],
  faqs: [
    {
      question: 'Is it safe to paste a JWT into this decoder?',
      answer:
        'The token is decoded entirely in your browser and is never uploaded or stored. Still, a valid access token grants access to an account, so avoid sharing live production tokens with anyone and revoke tokens you suspect have leaked.',
    },
    {
      question: 'Does this tool verify the JWT signature?',
      answer:
        'No. It only decodes the header and payload. Verifying requires the secret or public key and must be done by your server with a trusted JWT library.',
    },
    {
      question: 'Can anyone read the contents of a JWT?',
      answer:
        'Yes. The header and payload of a signed JWT are only Base64URL-encoded, not encrypted. The signature prevents tampering, but it does not hide the data.',
    },
    {
      question: 'What format are exp and iat in?',
      answer:
        'They are NumericDate values: the number of seconds since 1970-01-01T00:00:00Z, without milliseconds. The decoder converts them to readable dates.',
    },
    {
      question: 'What is the difference between HS256 and RS256?',
      answer:
        'HS256 signs with a shared secret using HMAC-SHA256, so the same secret signs and verifies. RS256 signs with an RSA private key and is verified with the public key, which lets many services verify tokens without being able to create them.',
    },
    {
      question: 'Why does my token have five parts?',
      answer:
        'It is an encrypted JWT (JWE). Its payload is encrypted and cannot be decoded without the decryption key.',
    },
  ],
  relatedSlugs: [
    'base64-decode',
    'unix-timestamp-converter',
    'json-formatter',
    'hash-generator',
    'url-decode',
  ],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

import Link from 'next/link';
import { Markdown } from '@/components/Markdown';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { CONTACT_EMAIL, OWNER_NAME, SITE_NAME } from '@/config/site';
import { getStaticPage } from '@/data/pages';
import { buildMetadata } from '@/lib/seo';

const page = getStaticPage('/about');

export const metadata = buildMetadata({
  absoluteTitle: page.metaTitle,
  description: page.metaDescription,
  path: page.path,
});

const body = `## Who runs ${SITE_NAME}

${SITE_NAME} is built and maintained by **${OWNER_NAME}**, a software developer who got tired of pasting work data into websites that upload it to unknown servers. Every tool on the site is designed, written and tested by ${OWNER_NAME}, and every page explains what the tool does, how to use it and what its limits are.

## Why this site exists

Small utilities are part of everyday work: formatting a JSON response, decoding a token, shrinking a photo before emailing it, merging two PDFs, checking whether a colour has enough contrast. The web is full of tools for these jobs, but many of them upload your data, hide basic features behind an account, add watermarks or are slow because of heavy pages.

${SITE_NAME} aims to be the opposite:

- **Private**: your files and text are processed on your own device.
- **Free**: no paid tier, no daily limits and no watermarks.
- **Simple**: no sign-up, no installation, no browser extension.
- **Honest**: when a tool has a limitation, the page says so. For example, the PDF compressor explains that it turns pages into images.

## How the tools work

Every tool is a web page that runs JavaScript in your browser. When you paste text or choose a file, the browser itself does the work: JSON is parsed by the browser's JSON engine, images are processed with the HTML canvas, PDFs are rebuilt with open-source PDF libraries that run inside the tab, and hashes are calculated with the Web Crypto API. Heavier jobs run in background threads called Web Workers so the page stays responsive.

Because the processing is local, there is no server receiving your data. You can confirm this yourself: open your browser's developer tools, switch to the Network tab and use any tool. You will see the page and its code load, but your files are never sent anywhere.

## How the site is funded

${SITE_NAME} is free because it shows advertising from Google AdSense. Ads are clearly labelled, kept apart from the tool controls, and never have access to the content you process. The [Privacy Policy](/privacy-policy) explains which cookies are used and how to opt out of personalised ads.

## Get in touch

Suggestions for new tools, bug reports and corrections are always welcome. Use the [contact page](/contact) or email [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}).`;

export default function AboutPage() {
  return (
    <StaticPageLayout
      page={page}
      h1={`About ${SITE_NAME}`}
      schemaType="AboutPage"
      intro={
        <p>
          {SITE_NAME} is a collection of free online tools for developers, designers and everyday
          users. Every tool runs in your browser, so your data stays on your device.{' '}
          <Link href="/" className="text-accent-text underline underline-offset-4">
            Browse all tools
          </Link>
          .
        </p>
      }
    >
      <Markdown source={body} />
    </StaticPageLayout>
  );
}

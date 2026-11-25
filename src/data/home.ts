import { SITE_NAME, brandTitle } from '@/config/site';
import type { Faq } from './types';

export const home = {
  metaTitle: brandTitle('Free Online Tools for Developers, Images & PDFs'),
  metaDescription:
    'Free online tools that run in your browser: JSON formatter, image compressor, PDF merger, CSS generators and more. No sign-up, no upload, fast and private.',
  h1: 'Free online tools that run in your browser',
  intro:
    'Format code, convert data, compress images, merge PDFs and generate CSS with fast, free tools. Everything happens on your device: nothing you paste or upload is sent to a server.',
  whyHeading: `Why use ${SITE_NAME}?`,
  why: [
    {
      title: 'Private by design',
      body: 'Every tool processes your data with JavaScript inside your browser tab. Files, text and tokens are never uploaded, logged or stored, so you can work with confidential material.',
      icon: 'shield',
    },
    {
      title: 'Free, with no limits',
      body: 'There is no paid tier, no daily quota and no watermark. The site is funded by unobtrusive advertising, which never sees the data you process.',
      icon: 'gift',
    },
    {
      title: 'No sign-up',
      body: 'Open a tool and use it. There are no accounts, no email capture and no login walls between you and the result.',
      icon: 'user',
    },
    {
      title: 'Fast on any device',
      body: 'Pages are static and load quickly. Heavy libraries are only downloaded when you actually use a tool, and big jobs run in background workers so the page stays responsive.',
      icon: 'bolt',
    },
  ] as const,
  howHeading: 'How in-browser tools work',
  how: `When you open a tool page, your browser downloads the page and the small amount of code the tool needs. From that moment the work is done locally. A JSON document is parsed by your browser's own JSON engine, an image is decoded and re-encoded with the HTML canvas, and a PDF is rebuilt with a JavaScript PDF library running in the tab. The result is created on your device and saved straight to your downloads folder.

This approach has practical benefits beyond privacy. There is no upload or download wait for large files, the tools keep working on a slow or unreliable connection once the page has loaded, and there is no server-side limit on how many files you can process. The trade-off is that very large jobs depend on the memory and speed of your own device, so a phone may take longer than a laptop.`,
  faqHeading: 'Frequently asked questions',
  faqs: [
    {
      question: `Is ${SITE_NAME} really free?`,
      answer:
        'Yes. All tools are free to use without an account or usage limits. The site is supported by advertising.',
    },
    {
      question: 'Are my files uploaded to your servers?',
      answer:
        'No. Files and text are processed entirely in your browser and never leave your device. There is no server that receives them.',
    },
    {
      question: 'Do I need to install anything?',
      answer:
        'No. The tools run in any modern browser on Windows, macOS, Linux, Android and iOS without extensions or downloads.',
    },
    {
      question: 'Can I use the results commercially?',
      answer:
        'Yes. Anything you create or convert with these tools belongs to you and can be used in personal and commercial work.',
    },
  ] satisfies Faq[],
};

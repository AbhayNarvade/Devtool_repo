import { brandTitle } from '@/config/site';
import type { StaticPage } from './types';

/** Static informational pages linked from the footer and listed in the sitemap. No ads on these. */
export const staticPages: StaticPage[] = [
  {
    path: '/about',
    name: 'About',
    metaTitle: brandTitle('About Us: Private Tools That Run in Your Browser'),
    metaDescription:
      'Who runs this site, why it exists, and how its free online tools process your files and text locally in your browser without ever uploading them anywhere.',
    lastUpdated: '2026-11-25',
  },
  {
    path: '/contact',
    name: 'Contact',
    metaTitle: brandTitle('Contact Us: Feedback, Bug Reports and Ideas'),
    metaDescription:
      'Get in touch to report a bug, suggest a new tool, ask a privacy question or send feedback about these free browser-based tools. Every message is read.',
    lastUpdated: '2026-11-25',
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    metaTitle: brandTitle('Privacy Policy: Local Processing, Cookies and Ads'),
    metaDescription:
      'How this site handles your data: files are processed in your browser and never uploaded, how Google AdSense cookies work and how to opt out of personalized ads.',
    lastUpdated: '2026-11-25',
  },
  {
    path: '/terms',
    name: 'Terms of Use',
    metaTitle: brandTitle('Terms of Use for Free Online Tools'),
    metaDescription:
      'The terms for using these free online tools: provided as is without warranty, your responsibility for your own files, acceptable use and liability limits.',
    lastUpdated: '2026-11-25',
  },
];

export function getStaticPage(path: string): StaticPage {
  const page = staticPages.find((p) => p.path === path);
  if (!page) throw new Error(`Unknown static page ${path}`);
  return page;
}

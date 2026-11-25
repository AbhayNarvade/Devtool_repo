import { SITE_NAME } from '@/config/site';
import type { StaticPage } from './types';

/** Static informational pages linked from the footer and listed in the sitemap. No ads on these. */
export const staticPages: StaticPage[] = [
  {
    path: '/about',
    name: 'About',
    metaTitle: `About ${SITE_NAME}: Free Tools That Run in Your Browser`,
    metaDescription: `Who runs ${SITE_NAME}, why the site exists and how its free online tools process your files and text locally in your browser without uploading them.`,
    lastUpdated: '2026-11-25',
  },
  {
    path: '/contact',
    name: 'Contact',
    metaTitle: `Contact ${SITE_NAME}: Feedback, Bug Reports and Ideas`,
    metaDescription: `Get in touch with ${SITE_NAME} to report a bug, suggest a new tool, ask a question about privacy or send feedback. We read every message we receive.`,
    lastUpdated: '2026-11-25',
  },
  {
    path: '/privacy-policy',
    name: 'Privacy Policy',
    metaTitle: `Privacy Policy: Local Processing, Cookies and Ads | ${SITE_NAME}`,
    metaDescription: `How ${SITE_NAME} handles your data: files are processed in your browser and never uploaded, how Google AdSense cookies work and how to opt out of personalized ads.`,
    lastUpdated: '2026-11-25',
  },
  {
    path: '/terms',
    name: 'Terms of Use',
    metaTitle: `Terms of Use for Free Online Tools | ${SITE_NAME}`,
    metaDescription: `The terms for using ${SITE_NAME}: free tools provided as is without warranty, your responsibility for your own files, acceptable use and limitation of liability.`,
    lastUpdated: '2026-11-25',
  },
];

export function getStaticPage(path: string): StaticPage {
  const page = staticPages.find((p) => p.path === path);
  if (!page) throw new Error(`Unknown static page ${path}`);
  return page;
}

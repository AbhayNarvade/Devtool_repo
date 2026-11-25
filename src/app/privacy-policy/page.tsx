import { Markdown } from '@/components/Markdown';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { CONTACT_EMAIL, DOMAIN, FORMSPREE_ID, GA_ID, OWNER_NAME, SITE_NAME } from '@/config/site';
import { getStaticPage } from '@/data/pages';
import { formatDisplayDate } from '@/lib/date';
import { buildMetadata } from '@/lib/seo';

const page = getStaticPage('/privacy-policy');

export const metadata = buildMetadata({
  absoluteTitle: page.metaTitle,
  description: page.metaDescription,
  path: page.path,
});

const EFFECTIVE = formatDisplayDate(page.lastUpdated);

const intro = `This Privacy Policy explains what information is and is not collected when you use ${SITE_NAME} (${DOMAIN}), which cookies are used, and the choices you have. ${SITE_NAME} is operated by ${OWNER_NAME}.

**Effective date: ${EFFECTIVE}.**

## 1. Your files and text are processed locally

All tools on ${SITE_NAME} run inside your web browser. Files you select and text you paste or type into a tool are processed by JavaScript on your own device. They are **never uploaded** to our servers or to anyone else's, and we cannot see them. When you close or reload the page, the data is gone.

Some tools download additional code (for example a PDF or image library) from our own website when you first use them. That is a download to your browser; nothing about your files travels in the other direction.

## 2. Information we do not collect

We do not ask you to create an account, and we do not collect your name, email address or other personal details through the tools. We do not sell personal information.

## 3. Advertising: Google AdSense

${SITE_NAME} is free because it shows advertising served by Google AdSense. To serve and measure ads, Google and its partners may use cookies, web beacons, device identifiers and similar technologies.

- Third-party vendors, including Google, use cookies to serve ads based on a user's prior visits to this website or other websites.
- Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and/or other sites on the Internet.
- You can learn more about how Google uses this data in [How Google uses information from sites or apps that use our services](https://policies.google.com/technologies/partner-sites).

### How to opt out of personalised advertising

- You can opt out of personalised advertising from Google by visiting [Google Ads Settings](https://adssettings.google.com/).
- You can opt out of some third-party vendors' use of cookies for personalised advertising by visiting [www.aboutads.info/choices](https://www.aboutads.info/choices/).
- Users in the European Economic Area, the United Kingdom and Switzerland are shown a consent message, provided through Google's certified consent management platform, before personalised ads or advertising cookies are used. You can change your choice at any time using the privacy settings link shown by that message.

If you opt out, you will still see ads, but they will not be based on your interests or browsing history.

Ads never have access to the files or text you process with our tools.`;

const analytics = GA_ID
  ? `## 4. Analytics: Google Analytics

We use Google Analytics 4 to understand how visitors use the site, for example which tools are popular and which pages have problems. Google Analytics uses cookies and collects information such as the pages you visit, approximate location derived from your IP address, browser and device type, and how you arrived at the site. We use this information only in aggregate to improve the site. It never includes the content you process with the tools.

You can prevent Google Analytics from collecting your data by installing the [Google Analytics Opt-out Browser Add-on](https://tools.google.com/dlpage/gaoptout). Learn more in [Google's Privacy Policy](https://policies.google.com/privacy).`
  : `## 4. Analytics

We do not currently use Google Analytics or any other analytics tool that sets cookies. If we start using one, this section will be updated before it is enabled.`;

const rest = `## 5. Hosting and server logs

The site is hosted on Cloudflare Pages. Like any web host, Cloudflare processes technical information such as your IP address, browser user agent and the pages requested, in order to deliver the site and protect it from abuse. We may use Cloudflare Web Analytics, which counts page views without using cookies and without tracking you across sites. See [Cloudflare's Privacy Policy](https://www.cloudflare.com/privacypolicy/).

## 6. Local storage on your device

If you choose a light or dark theme with the theme switch, your choice is saved in your browser's localStorage under the key \`theme\`, so the site remembers it on your next visit. This value never leaves your device and contains no personal information. You can remove it at any time by clearing your browser's site data.

## 7. Contacting us

${
  FORMSPREE_ID
    ? `If you email us or use the contact form, we receive your name, email address and message. Contact form messages are delivered by Formspree, which processes them on our behalf ([Formspree Privacy Policy](https://formspree.io/legal/privacy-policy/)). `
    : 'If you email us, we receive your email address and your message. '
}We use this information only to reply to you, and we delete messages when they are no longer needed for that purpose.

## 8. Children

${SITE_NAME} is a general audience website and is not directed at children under 13. We do not knowingly collect personal information from children.

## 9. Your rights

Depending on where you live (for example under the GDPR in the EU and UK or the CCPA/CPRA in California), you may have the right to access, correct or delete personal information about you and to object to certain processing. Because the tools do not collect personal data, the main data involved is advertising and analytics data held by Google; you can manage it with the links above and in your Google account. For anything else, contact us using the details below.

## 10. Changes to this policy

We may update this policy when the site or the law changes. The effective date at the top of this page shows when it was last revised.

## 11. Contact

Questions about this policy can be sent to ${OWNER_NAME} at [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}).`;

export default function PrivacyPolicyPage() {
  return (
    <StaticPageLayout page={page} h1="Privacy Policy">
      <Markdown source={intro} />
      <Markdown source={analytics} />
      <Markdown source={rest} />
    </StaticPageLayout>
  );
}

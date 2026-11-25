import { Markdown } from '@/components/Markdown';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { CONTACT_EMAIL, DOMAIN, OWNER_NAME, SITE_NAME } from '@/config/site';
import { getStaticPage } from '@/data/pages';
import { buildMetadata } from '@/lib/seo';

const page = getStaticPage('/terms');

export const metadata = buildMetadata({
  absoluteTitle: page.metaTitle,
  description: page.metaDescription,
  path: page.path,
});

const body = `These Terms of Use ("Terms") govern your use of ${SITE_NAME} at ${DOMAIN} (the "Site"), operated by ${OWNER_NAME}. By using the Site you agree to these Terms. If you do not agree, please do not use the Site.

**Effective date: November 25, 2026.**

## 1. The service

${SITE_NAME} provides free online tools that run in your web browser, including developer, image, PDF, CSS and text utilities. The tools process your files and text locally on your device; they are not uploaded to us. No account is required.

## 2. Free use and changes

The Site is free to use for personal and commercial purposes. We may add, change or remove tools, or suspend the Site, at any time and without notice. We have no obligation to keep any particular tool available.

## 3. Your files and your responsibility

You are responsible for the files and content you use with the tools, including:

- having the right to use, modify and convert them;
- keeping your own backups: always keep the original file until you have checked the result;
- checking that the output is correct and suitable before you rely on it, publish it or send it to anyone.

Because processing happens on your device, results can depend on your browser, device memory and the input itself. Very large files may fail or take a long time.

## 4. Output and ownership

You keep all rights to your content. Output you create with the tools (for example formatted code, converted images, generated CSS, palettes or QR codes) is yours to use without attribution. We claim no ownership of it.

## 5. Acceptable use

You agree not to:

- use the Site for any unlawful purpose or to process content you have no right to process;
- attempt to disrupt, overload or gain unauthorised access to the Site or its infrastructure;
- copy and republish the Site's written content or design as your own;
- use automated means to scrape the Site at a rate that degrades it for other visitors.

## 6. No warranty

THE SITE AND ALL TOOLS ARE PROVIDED "AS IS" AND "AS AVAILABLE", WITHOUT WARRANTIES OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING ANY WARRANTY OF ACCURACY, FITNESS FOR A PARTICULAR PURPOSE, NON-INFRINGEMENT OR UNINTERRUPTED AVAILABILITY. Explanations and examples on the Site are for general information and are not professional, legal or security advice.

## 7. Limitation of liability

TO THE MAXIMUM EXTENT PERMITTED BY LAW, ${OWNER_NAME.toUpperCase()} WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL OR PUNITIVE DAMAGES, OR FOR ANY LOSS OF DATA, FILES, PROFITS OR BUSINESS, ARISING FROM YOUR USE OF OR INABILITY TO USE THE SITE OR ITS TOOLS, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. Some jurisdictions do not allow certain limitations, so some of the above may not apply to you.

## 8. Third-party services and links

The Site shows advertising from Google and may link to third-party websites. We are not responsible for third-party content, products or privacy practices. How advertising cookies are used is described in the [Privacy Policy](/privacy-policy).

## 9. Intellectual property

The Site's design, logo, text and code are owned by ${OWNER_NAME} unless stated otherwise. Open-source libraries used by the tools remain under their own licences.

## 10. Changes to these Terms

We may update these Terms from time to time. The effective date above shows when they were last changed. Continuing to use the Site after a change means you accept the updated Terms.

## 11. Contact

Questions about these Terms can be sent to [${CONTACT_EMAIL}](mailto:${CONTACT_EMAIL}).`;

export default function TermsPage() {
  return (
    <StaticPageLayout page={page} h1="Terms of Use">
      <Markdown source={body} />
    </StaticPageLayout>
  );
}

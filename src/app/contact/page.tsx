import { ContactForm } from '@/components/ContactForm';
import { Markdown } from '@/components/Markdown';
import { StaticPageLayout } from '@/components/StaticPageLayout';
import { CONTACT_EMAIL, FORMSPREE_ID, SITE_NAME } from '@/config/site';
import { getStaticPage } from '@/data/pages';
import { buildMetadata } from '@/lib/seo';

const page = getStaticPage('/contact');

export const metadata = buildMetadata({
  absoluteTitle: page.metaTitle,
  description: page.metaDescription,
  path: page.path,
});

const afterContact = `## What to include

To help us respond quickly, please mention:

- **For a bug report**: the tool's name or URL, your browser and device, what you expected to happen and what happened instead. If an error message appeared, copy its exact text.
- **For a tool suggestion**: what you want to do and how you do it today. Requests that many people share are the most likely to be built next.
- **For a correction**: the page and the sentence that is wrong, and a source if you have one.

Please do **not** send confidential files, passwords or tokens. The tools never need them to be shared with us, and email is not a secure channel.

## Response time

${SITE_NAME} is run by one person, so replies can take a few days. Every message is read.`;

export default function ContactPage() {
  return (
    <StaticPageLayout
      page={page}
      h1={`Contact ${SITE_NAME}`}
      schemaType="ContactPage"
      intro={
        <p>
          Found a bug, have an idea for a new tool or a question about privacy? We would like to
          hear from you.
        </p>
      }
    >
      <h2>Email</h2>
      <p>
        Write to{' '}
        <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold">
          {CONTACT_EMAIL}
        </a>
        . Your email app will open with the address filled in.
      </p>
      {FORMSPREE_ID ? (
        <>
          <h2>Contact form</h2>
          <p>Prefer not to open your email app? Use this form instead.</p>
          <ContactForm formId={FORMSPREE_ID} />
        </>
      ) : null}
      <Markdown source={afterContact} />
    </StaticPageLayout>
  );
}

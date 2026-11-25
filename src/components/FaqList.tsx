import type { Faq } from '@/data/types';

/**
 * Visible FAQ list. Question and answer strings are rendered verbatim so the FAQPage JSON-LD
 * built from the same array matches the visible text exactly.
 */
export function FaqList({ faqs, headingLevel = 3 }: { faqs: Faq[]; headingLevel?: 3 | 4 }) {
  const Q = headingLevel === 3 ? 'h3' : 'h4';
  return (
    <div className="divide-y divide-border rounded-xl border border-border bg-card">
      {faqs.map((faq) => (
        <div key={faq.question} className="p-5" data-faq-item="">
          <Q className="text-base font-semibold text-fg" data-faq-question="">
            {faq.question}
          </Q>
          <p className="mt-2 text-fg-muted" data-faq-answer="">
            {faq.answer}
          </p>
        </div>
      ))}
    </div>
  );
}

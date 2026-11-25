'use client';

import Link from 'next/link';
import { useId, useState } from 'react';

type Status = { kind: 'idle' | 'sending' | 'sent' } | { kind: 'error'; message: string };

const inputClass =
  'mt-1 block w-full rounded-lg border border-border-strong bg-card px-3 py-2.5 text-base text-fg placeholder:text-fg-muted focus:border-accent';

/** Contact form posting to Formspree (rendered only when NEXT_PUBLIC_FORMSPREE_ID is set). */
export function ContactForm({ formId }: { formId: string }) {
  const id = useId();
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus({ kind: 'sending' });
    try {
      const res = await fetch(`https://formspree.io/f/${encodeURIComponent(formId)}`, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });
      if (res.ok) {
        form.reset();
        setStatus({ kind: 'sent' });
      } else {
        const data = (await res.json().catch(() => null)) as {
          errors?: { message: string }[];
        } | null;
        setStatus({
          kind: 'error',
          message:
            data?.errors?.map((x) => x.message).join(' ') ||
            'The message could not be sent. Please try again or use the email address above.',
        });
      }
    } catch {
      setStatus({
        kind: 'error',
        message:
          'Network error: the message was not sent. Check your connection or use the email address above.',
      });
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="mt-6 space-y-5 rounded-xl border border-border bg-bg-subtle p-6"
    >
      <div>
        <label htmlFor={`${id}-name`} className="text-sm font-medium">
          Your name
        </label>
        <input id={`${id}-name`} name="name" autoComplete="name" required className={inputClass} />
      </div>
      <div>
        <label htmlFor={`${id}-email`} className="text-sm font-medium">
          Your email address
        </label>
        <input
          id={`${id}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          className={inputClass}
        />
      </div>
      <div>
        <label htmlFor={`${id}-message`} className="text-sm font-medium">
          Message
        </label>
        <textarea id={`${id}-message`} name="message" rows={6} required className={inputClass} />
      </div>
      {/* Honeypot field for spam bots, hidden from people and assistive technology. */}
      <input
        type="text"
        name="_gotcha"
        tabIndex={-1}
        autoComplete="off"
        className="hidden"
        aria-hidden="true"
      />
      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status.kind === 'sending'}
          className="rounded-lg bg-accent px-5 py-2.5 font-semibold text-accent-fg hover:bg-accent-hover disabled:opacity-60"
        >
          {status.kind === 'sending' ? 'Sending…' : 'Send message'}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status.kind === 'sent' ? (
            <span className="text-success">Thank you. Your message has been sent.</span>
          ) : status.kind === 'error' ? (
            <span className="text-danger">{status.message}</span>
          ) : null}
        </p>
      </div>
      <p className="text-xs text-fg-muted">
        Messages sent with this form are delivered by Formspree. See the{' '}
        <Link href="/privacy-policy" className="underline">
          Privacy Policy
        </Link>{' '}
        for details.
      </p>
    </form>
  );
}

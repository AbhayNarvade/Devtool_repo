import Link from 'next/link';
import type { ToolCardData } from '@/data';
import { Icon } from './Icon';

export function ToolCard({ card, headingLevel = 3 }: { card: ToolCardData; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 2 ? 'h2' : 'h3';
  return (
    <Link
      href={card.path}
      className="group flex h-full gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:border-accent hover:bg-bg-subtle"
    >
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-soft text-accent-text">
        <Icon name={card.icon} className="h-6 w-6" />
      </span>
      <span className="min-w-0">
        <Heading className="text-base font-semibold text-fg group-hover:text-accent-text">
          {card.name}
        </Heading>
        <span className="mt-1 block text-sm leading-snug text-fg-muted">{card.description}</span>
      </span>
    </Link>
  );
}

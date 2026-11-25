import Link from 'next/link';
import type { Crumb } from '@/lib/jsonld';
import { UiIcon } from './Icon';

/** Visible breadcrumb trail. The same `crumbs` array feeds the BreadcrumbList JSON-LD. */
export function Breadcrumbs({ crumbs }: { crumbs: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-fg-muted">
      <ol className="flex flex-wrap items-center gap-1">
        {crumbs.map((crumb, i) => {
          const last = i === crumbs.length - 1;
          return (
            <li key={crumb.path} className="flex items-center gap-1">
              {last ? (
                <span aria-current="page" className="font-medium text-fg">
                  {crumb.name}
                </span>
              ) : (
                <>
                  <Link href={crumb.path} className="hover:text-fg hover:underline">
                    {crumb.name}
                  </Link>
                  <UiIcon name="chevronRight" className="h-3.5 w-3.5" />
                </>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

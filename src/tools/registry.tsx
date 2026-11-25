'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';

/** Placeholder with reserved height while a tool chunk loads (prevents layout shift). */
function ToolLoading() {
  return (
    <div
      className="flex min-h-[420px] items-center justify-center rounded-2xl border border-border bg-card text-fg-muted"
      role="status"
    >
      Loading tool…
    </div>
  );
}

const load = (importer: () => Promise<{ default: ComponentType }>) =>
  dynamic(importer, { loading: ToolLoading });

/**
 * Tool UIs, keyed by registry slug. Each entry is its own code-split chunk: a tool page
 * only downloads the code for its own tool. Heavy libraries are imported inside the tool
 * when they are first needed.
 */
const TOOL_COMPONENTS: Record<string, ComponentType> = {
  'json-formatter': load(() => import('./json-formatter/Tool')),
  'json-to-yaml': load(() => import('./json-to-yaml/Tool')),
  'yaml-to-json': load(() => import('./yaml-to-json/Tool')),
  'json-to-csv': load(() => import('./json-to-csv/Tool')),
  'csv-to-json': load(() => import('./csv-to-json/Tool')),
  'json-to-typescript': load(() => import('./json-to-typescript/Tool')),
  'base64-encode': load(() => import('./base64-encode/Tool')),
  'base64-decode': load(() => import('./base64-decode/Tool')),
  'url-encode': load(() => import('./url-encode/Tool')),
  'url-decode': load(() => import('./url-decode/Tool')),
};

export function hasToolComponent(slug: string): boolean {
  return slug in TOOL_COMPONENTS;
}

export function ToolMount({ slug }: { slug: string }) {
  const Tool = TOOL_COMPONENTS[slug];
  if (!Tool) return null;
  return <Tool />;
}

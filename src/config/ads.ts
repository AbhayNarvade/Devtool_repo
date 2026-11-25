/**
 * Ad placements: the ONE place to configure where ads appear.
 *
 * Ads only render when NEXT_PUBLIC_ADSENSE_CLIENT is set AND the placement has a slot ID.
 * Create one "Display ad" unit per placement in AdSense -> Ads -> By ad unit, then paste the
 * numeric data-ad-slot value here. Set `enabled: false` to switch a placement off.
 *
 * Policy notes (do not change lightly):
 * - No ads on About, Contact, Privacy Policy, Terms or the 404 page (those pages never render AdSlot).
 * - Home and category pages use at most 2 placements.
 * - Ad containers have reserved min-height (no layout shift) and generous margins so they are
 *   never adjacent to tool buttons or download links.
 */

export type AdFormat = 'auto' | 'horizontal' | 'rectangle' | 'vertical';

export interface AdPlacement {
  enabled: boolean;
  /** AdSense data-ad-slot ID (digits). Empty = placement not rendered. */
  slot: string;
  format: AdFormat;
  /** Reserved height in px (prevents CLS). */
  minHeight: number;
  /** Only render on large screens (sidebar). */
  desktopOnly?: boolean;
}

export const AD_PLACEMENTS = {
  /** Tool pages: below the tool UI, separated from its controls. */
  toolBelowTool: { enabled: true, slot: '', format: 'horizontal', minHeight: 280 },
  /** Tool pages: in the middle of the long-form content. */
  toolMidContent: { enabled: true, slot: '', format: 'auto', minHeight: 280 },
  /** Tool pages: right before the FAQ section. */
  toolBeforeFaq: { enabled: true, slot: '', format: 'auto', minHeight: 280 },
  /** Tool pages: sticky sidebar, desktop only (>= 1280px). */
  toolSidebar: { enabled: true, slot: '', format: 'vertical', minHeight: 600, desktopOnly: true },
  /** Homepage: two placements max. */
  homeTop: { enabled: true, slot: '', format: 'horizontal', minHeight: 280 },
  homeBottom: { enabled: true, slot: '', format: 'auto', minHeight: 280 },
  /** Category pages: two placements max. */
  categoryTop: { enabled: true, slot: '', format: 'horizontal', minHeight: 280 },
  categoryBottom: { enabled: true, slot: '', format: 'auto', minHeight: 280 },
} satisfies Record<string, AdPlacement>;

export type AdPlacementKey = keyof typeof AD_PLACEMENTS;

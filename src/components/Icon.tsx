import type { IconName } from '@/data/types';

/** Simple original stroke icons (24×24 grid). Decorative by default (aria-hidden). */
const PATHS: Record<IconName, string> = {
  braces:
    'M8 4c-2 0-3 1-3 3v2c0 1.5-1 2.5-2 3 1 .5 2 1.5 2 3v2c0 2 1 3 3 3M16 4c2 0 3 1 3 3v2c0 1.5 1 2.5 2 3-1 .5-2 1.5-2 3v2c0 2-1 3-3 3',
  convert: 'M4 8h13l-4-4M20 16H7l4 4',
  table: 'M4 5h16v14H4zM4 10h16M4 15h16M10 5v14',
  code: 'M9 7l-5 5 5 5M15 7l5 5-5 5',
  binary: 'M6 4v6M4 4h2M9 4h3v6H9zM15 14h3v6h-3zM6 14v6M4 14h2M20 4v6',
  link: 'M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1',
  key: 'M14.5 9.5a4.5 4.5 0 1 1-1.3-3.2 4.5 4.5 0 0 1 1.3 3.2zM13.2 12.8 20 19.6M17 16.6l2-2M15 14.6l2-2',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 7v5l3 2',
  fingerprint:
    'M7 20c1-2 1.5-4 1.5-7a3.5 3.5 0 0 1 7 0c0 2-.3 4-1 6M12 13c0 3-.5 5.5-1.5 8M4.5 15c.3-1 .5-2 .5-3a7 7 0 0 1 14 0c0 1.5-.1 3-.4 4.5M6 5.6A9 9 0 0 1 18 5.6',
  hash: 'M5 9h15M4 15h15M10 3 8 21M16 3l-2 18',
  regex: 'M17 3v8M13.5 5l7 4M20.5 5l-7 4M5 15h5v5H5z',
  calendar: 'M4 6h16v14H4zM4 10h16M8 3v5M16 3v5M8 14h2M14 14h2M8 17h2',
  database:
    'M4 6c0-1.7 3.6-3 8-3s8 1.3 8 3-3.6 3-8 3-8-1.3-8-3zM4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3',
  lock: 'M6 11h12v10H6zM8 11V8a4 4 0 0 1 8 0v3M12 15v2',
  network: 'M12 3v5M5 16v-3h14v3M9 3h6v5H9zM2 16h6v5H2zM16 16h6v5h-6zM12 8v5',
  image: 'M4 5h16v14H4zM4 16l5-5 4 4 2-2 5 5M15.5 9a1.5 1.5 0 1 0 0-.01',
  resize: 'M4 14v6h6M20 10V4h-6M4 20l7-7M20 4l-7 7',
  crop: 'M6 2v16h16M2 6h16v16',
  compress: 'M4 14h6v6M20 10h-6V4M10 14l-6 6M14 10l6-6',
  file: 'M6 3h8l5 5v13H6zM14 3v5h5M9 13h7M9 17h7',
  merge: 'M6 3v6a6 6 0 0 0 6 6h0a6 6 0 0 1 6 6v0M18 3v6a6 6 0 0 1-6 6M12 15v6',
  split: 'M12 3v6M12 9 6 15v6M12 9l6 6v6M9 6l3-3 3 3',
  pages: 'M8 3h10l3 3v13H8zM5 7v14h11M12 9h6M12 13h6',
  gradient: 'M4 4h16v16H4zM4 20 20 4M4 12 12 4M12 20l8-8',
  shadow: 'M4 4h12v12H4zM8 20h12V8',
  palette:
    'M12 3a9 9 0 1 0 0 18c1.2 0 1.6-1 1.2-2-.5-1.2.2-2.5 1.5-2.5H17a4 4 0 0 0 4-4C21 6.6 17 3 12 3zM7.5 11a1 1 0 1 0 0-.01M10.5 7a1 1 0 1 0 0-.01M15 7.5a1 1 0 1 0 0-.01',
  droplet: 'M12 3s6 6.5 6 11a6 6 0 0 1-12 0c0-4.5 6-11 6-11z',
  qr: 'M4 4h6v6H4zM14 4h6v6h-6zM4 14h6v6H4zM14 14h2v2h-2zM18 14h2v2h-2zM14 18h2v2h-2zM18 18h2v2h-2zM16 16h2v2h-2z',
  text: 'M4 6V4h16v2M12 4v16M9 20h6',
  password: 'M3 8h18v8H3zM7 12h.01M11 12h.01M15 12h.01M19 12h.01',
  tools:
    'M14.7 6.3a4 4 0 0 0-5.4 5.2L3 17.8V21h3.2l6.3-6.3a4 4 0 0 0 5.2-5.4l-2.5 2.5-2.3-.6-.6-2.3z',
};

interface IconProps {
  name: IconName;
  className?: string;
  /** If set, the icon is announced with this label instead of being hidden. */
  title?: string;
}

export function Icon({ name, className = 'h-6 w-6', title }: IconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={title ? undefined : true}
      role={title ? 'img' : undefined}
      focusable="false"
    >
      {title ? <title>{title}</title> : null}
      <path d={PATHS[name]} />
    </svg>
  );
}

/** A few UI glyphs used by the chrome (menu, close, search, sun, moon, etc.). */
const UI_PATHS = {
  menu: 'M4 6h16M4 12h16M4 18h16',
  close: 'M6 6l12 12M18 6 6 18',
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14zM20 20l-4-4',
  sun: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4',
  moon: 'M20 14.5A8 8 0 0 1 9.5 4 8 8 0 1 0 20 14.5z',
  monitor: 'M3 4h18v12H3zM8 20h8M12 16v4',
  chevronRight: 'M9 6l6 6-6 6',
  arrowRight: 'M5 12h14M13 6l6 6-6 6',
  shield: 'M12 3 4 6v6c0 4.5 3.4 8.3 8 9 4.6-.7 8-4.5 8-9V6z M9 12l2 2 4-4',
  copy: 'M9 9h11v11H9zM5 15H4V4h11v1',
  download: 'M12 3v12M7 10l5 5 5-5M4 20h16',
  upload: 'M12 21V9M7 14l5-5 5 5M4 4h16',
  check: 'M5 12l5 5 9-10',
  trash: 'M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3',
  refresh: 'M20 12a8 8 0 1 1-2.3-5.7M20 4v5h-5',
  alert: 'M12 3 2 20h20zM12 10v4M12 17h.01',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zM12 11v5M12 8h.01',
  bolt: 'M13 2 4 14h7l-1 8 9-12h-7z',
  gift: 'M4 11h16v10H4zM3 7h18v4H3zM12 7v14M12 7S10 3 7.5 3a2 2 0 0 0 0 4M12 7s2-4 4.5-4a2 2 0 0 1 0 4',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4 21a8 8 0 0 1 16 0',
  mail: 'M3 5h18v14H3zM3 6l9 7 9-7',
  rotate: 'M4 12a8 8 0 1 0 2.3-5.7M4 4v5h5',
  flipH: 'M12 3v18M8 7l-5 5 5 5zM16 7l5 5-5 5z',
  flipV: 'M3 12h18M7 8l5-5 5 5zM7 16l5 5 5-5z',
  grip: 'M9 5h.01M9 12h.01M9 19h.01M15 5h.01M15 12h.01M15 19h.01',
  plus: 'M12 5v14M5 12h14',
  minus: 'M5 12h14',
  arrowUp: 'M12 19V5M6 11l6-6 6 6',
  arrowDown: 'M12 5v14M6 13l6 6 6-6',
  eye: 'M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zM12 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6z',
  file: 'M6 3h8l5 5v13H6zM14 3v5h5',
} as const;

export type UiIconName = keyof typeof UI_PATHS;

export function UiIcon({
  name,
  className = 'h-5 w-5',
  strokeWidth = 2,
}: {
  name: UiIconName;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path d={UI_PATHS[name]} />
    </svg>
  );
}

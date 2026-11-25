import { LOGO_PATHS, LOGO_VIEWBOX } from '@/config/brand';

export function LogoMark({ className = 'h-8 w-8' }: { className?: string }) {
  const c = LOGO_PATHS.cursor;
  return (
    <svg viewBox={LOGO_VIEWBOX} className={className} aria-hidden="true" focusable="false">
      <path d={LOGO_PATHS.tile} className="fill-accent" />
      <path
        d={LOGO_PATHS.left}
        fill="none"
        stroke="#fff"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d={LOGO_PATHS.right}
        fill="none"
        stroke="#fff"
        strokeWidth={5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect x={c.x} y={c.y} width={c.width} height={c.height} rx={c.rx} fill="#fff" />
    </svg>
  );
}

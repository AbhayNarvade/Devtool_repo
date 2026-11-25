'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { applyTheme, readPreference, writePreference, type ThemePreference } from '@/lib/theme';
import { UiIcon } from './Icon';

const EVENT = 'themepreferencechange';

function subscribe(callback: () => void) {
  window.addEventListener(EVENT, callback);
  window.addEventListener('storage', callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener('storage', callback);
  };
}

const ORDER: ThemePreference[] = ['system', 'light', 'dark'];
const LABEL: Record<ThemePreference, string> = {
  system: 'Theme: system',
  light: 'Theme: light',
  dark: 'Theme: dark',
};

export function ThemeToggle() {
  const pref = useSyncExternalStore(subscribe, readPreference, () => 'system' as ThemePreference);

  // Follow live OS changes while the preference is "system".
  useEffect(() => {
    if (pref !== 'system' || !window.matchMedia) return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => applyTheme('system');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, [pref]);

  const cycle = useCallback(() => {
    const next = ORDER[(ORDER.indexOf(readPreference()) + 1) % ORDER.length] ?? 'system';
    writePreference(next);
    applyTheme(next);
    window.dispatchEvent(new Event(EVENT));
  }, []);

  const nextPref = ORDER[(ORDER.indexOf(pref) + 1) % ORDER.length] ?? 'system';

  return (
    <button
      type="button"
      onClick={cycle}
      className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-fg-muted hover:bg-bg-muted hover:text-fg"
      aria-label={`${LABEL[pref]}. Switch to ${nextPref}.`}
      title={`${LABEL[pref]} (click to switch to ${nextPref})`}
    >
      <UiIcon name={pref === 'dark' ? 'moon' : pref === 'light' ? 'sun' : 'monitor'} />
    </button>
  );
}

export type ThemePreference = 'light' | 'dark' | 'system';

export const THEME_STORAGE_KEY = 'theme';

/**
 * Runs synchronously in <head> before first paint: applies the stored preference, or the
 * system setting when nothing (or "system") is stored. localStorage access is wrapped in
 * try/catch because it can throw (privacy modes, disabled storage).
 */
export const THEME_INIT_SCRIPT = `(function(){var d=document.documentElement,p=null;try{p=localStorage.getItem('${THEME_STORAGE_KEY}')}catch(e){}var m=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;d.setAttribute('data-theme',p==='dark'||(p!=='light'&&m)?'dark':'light')})();`;

export function readPreference(): ThemePreference {
  try {
    const value = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (value === 'light' || value === 'dark') return value;
  } catch {
    // storage unavailable: fall back to system
  }
  return 'system';
}

export function writePreference(pref: ThemePreference): void {
  try {
    if (pref === 'system') window.localStorage.removeItem(THEME_STORAGE_KEY);
    else window.localStorage.setItem(THEME_STORAGE_KEY, pref);
  } catch {
    // storage unavailable: the choice applies to this page view only
  }
}

export function systemPrefersDark(): boolean {
  return (
    typeof window !== 'undefined' && !!window.matchMedia?.('(prefers-color-scheme: dark)').matches
  );
}

export function applyTheme(pref: ThemePreference): void {
  const dark = pref === 'dark' || (pref === 'system' && systemPrefersDark());
  document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
}

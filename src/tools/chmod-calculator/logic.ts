export interface PermissionSet {
  read: boolean;
  write: boolean;
  execute: boolean;
}

export interface Permissions {
  owner: PermissionSet;
  group: PermissionSet;
  others: PermissionSet;
  setuid: boolean;
  setgid: boolean;
  sticky: boolean;
}

export const CLASSES = ['owner', 'group', 'others'] as const;
export type PermissionClass = (typeof CLASSES)[number];

const digitToSet = (d: number): PermissionSet => ({
  read: (d & 4) !== 0,
  write: (d & 2) !== 0,
  execute: (d & 1) !== 0,
});
const setToDigit = (s: PermissionSet) => (s.read ? 4 : 0) + (s.write ? 2 : 0) + (s.execute ? 1 : 0);

/** "755" or "4755" -> permissions; null if invalid. */
export function fromOctal(input: string): Permissions | null {
  const text = input.trim().replace(/^0o/i, '');
  if (!/^[0-7]{3,4}$/.test(text)) return null;
  const digits = text.padStart(4, '0').split('').map(Number) as [number, number, number, number];
  const [special, u, g, o] = digits;
  return {
    owner: digitToSet(u),
    group: digitToSet(g),
    others: digitToSet(o),
    setuid: (special & 4) !== 0,
    setgid: (special & 2) !== 0,
    sticky: (special & 1) !== 0,
  };
}

/** Permissions -> "755", or "4755" when a special bit is set. */
export function toOctal(p: Permissions): string {
  const special = (p.setuid ? 4 : 0) + (p.setgid ? 2 : 0) + (p.sticky ? 1 : 0);
  const base = `${setToDigit(p.owner)}${setToDigit(p.group)}${setToDigit(p.others)}`;
  return special ? `${special}${base}` : base;
}

/** Permissions -> "rwxr-xr-x" as shown by ls -l (s/S for setuid/setgid, t/T for sticky). */
export function toSymbolic(p: Permissions): string {
  const triplet = (s: PermissionSet, special: boolean, lower: string, upper: string) =>
    `${s.read ? 'r' : '-'}${s.write ? 'w' : '-'}${special ? (s.execute ? lower : upper) : s.execute ? 'x' : '-'}`;
  return (
    triplet(p.owner, p.setuid, 's', 'S') +
    triplet(p.group, p.setgid, 's', 'S') +
    triplet(p.others, p.sticky, 't', 'T')
  );
}

/** "rwxr-xr-x" or "-rwxr-xr-x" / "drwxr-xr-x" (ls -l style) -> permissions; null if invalid. */
export function fromSymbolic(input: string): Permissions | null {
  let text = input.trim();
  if (text.length === 10) text = text.slice(1); // file type character from ls -l
  if (!/^[r-][w-][xsS-][r-][w-][xsS-][r-][w-][xtT-]$/.test(text)) return null;
  const set = (i: number): PermissionSet => ({
    read: text[i] === 'r',
    write: text[i + 1] === 'w',
    execute: ['x', 's', 't'].includes(text[i + 2]!),
  });
  return {
    owner: set(0),
    group: set(3),
    others: set(6),
    setuid: 'sS'.includes(text[2]!),
    setgid: 'sS'.includes(text[5]!),
    sticky: 'tT'.includes(text[8]!),
  };
}

/** Arguments for symbolic chmod, e.g. "u=rwx,g=rx,o=rx" or "u=rwxs,g=rx,o=" */
export function toChmodSymbolic(p: Permissions): string {
  const part = (c: string, s: PermissionSet, special: string) =>
    `${c}=${s.read ? 'r' : ''}${s.write ? 'w' : ''}${s.execute ? 'x' : ''}${special}`;
  return [
    part('u', p.owner, p.setuid ? 's' : ''),
    part('g', p.group, p.setgid ? 's' : ''),
    part('o', p.others, p.sticky ? 't' : ''),
  ].join(',');
}

/** Single-quote a file name for the shell when it contains special characters. */
export function shellQuote(name: string): string {
  return /^[\w@%+=:,./-]+$/.test(name) ? name : `'${name.replace(/'/g, `'\\''`)}'`;
}

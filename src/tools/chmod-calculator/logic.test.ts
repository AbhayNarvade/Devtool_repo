import { describe, expect, it } from 'vitest';
import { fromOctal, fromSymbolic, shellQuote, toChmodSymbolic, toOctal, toSymbolic } from './logic';

describe('chmod conversions', () => {
  const cases: [string, string, string][] = [
    ['755', 'rwxr-xr-x', 'u=rwx,g=rx,o=rx'],
    ['644', 'rw-r--r--', 'u=rw,g=r,o=r'],
    ['600', 'rw-------', 'u=rw,g=,o='],
    ['777', 'rwxrwxrwx', 'u=rwx,g=rwx,o=rwx'],
    ['4755', 'rwsr-xr-x', 'u=rwxs,g=rx,o=rx'],
    ['2750', 'rwxr-s---', 'u=rwx,g=rxs,o='],
    ['1777', 'rwxrwxrwt', 'u=rwx,g=rwx,o=rwxt'],
    ['4644', 'rwSr--r--', 'u=rws,g=r,o=r'],
    ['1770', 'rwxrwx--T', 'u=rwx,g=rwx,o=t'],
  ];
  it.each(cases)('%s <-> %s', (octal, symbolic, args) => {
    const p = fromOctal(octal)!;
    expect(toSymbolic(p)).toBe(symbolic);
    expect(toChmodSymbolic(p)).toBe(args);
    expect(toOctal(fromSymbolic(symbolic)!)).toBe(octal);
  });
  it('accepts ls -l output and leading zeros', () => {
    expect(toOctal(fromSymbolic('drwxr-xr-x')!)).toBe('755');
    expect(toOctal(fromOctal('0644')!)).toBe('644');
  });
  it('rejects invalid input', () => {
    expect(fromOctal('789')).toBeNull();
    expect(fromOctal('12')).toBeNull();
    expect(fromSymbolic('rwxrwx')).toBeNull();
    expect(fromSymbolic('rwzr-xr-x')).toBeNull();
  });
  it('quotes file names for the shell', () => {
    expect(shellQuote('deploy.sh')).toBe('deploy.sh');
    expect(shellQuote("my file's.txt")).toBe("'my file'\\''s.txt'");
  });
});

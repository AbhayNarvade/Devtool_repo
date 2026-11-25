import { describe, expect, it } from 'vitest';
import { formatBytes, utf8Length } from './download';

describe('formatBytes', () => {
  it('formats sizes', () => {
    expect(formatBytes(0)).toBe('0 B');
    expect(formatBytes(1023)).toBe('1023 B');
    expect(formatBytes(1536)).toBe('1.5 KB');
    expect(formatBytes(1024 * 1024 * 12.25)).toBe('12.3 MB');
    expect(formatBytes(1024 * 200)).toBe('200 KB');
  });
});

describe('utf8Length', () => {
  it('counts UTF-8 bytes', () => {
    expect(utf8Length('abc')).toBe(3);
    expect(utf8Length('é')).toBe(2);
    expect(utf8Length('😀')).toBe(4);
  });
});

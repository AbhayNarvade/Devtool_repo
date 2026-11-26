import { describe, expect, it } from 'vitest';
import { previewText } from './preview';

describe('previewText', () => {
  it('returns short text unchanged', () => {
    expect(previewText('abc', 10)).toEqual({ text: 'abc', truncated: false });
  });
  it('cuts long text at a nearby line break', () => {
    const text = `${'a'.repeat(95)}\n${'b'.repeat(50)}`;
    expect(previewText(text, 100)).toEqual({ text: `${'a'.repeat(95)}\n…`, truncated: true });
  });
  it('cuts at the limit when there is no nearby line break', () => {
    expect(previewText('x'.repeat(500), 100)).toEqual({
      text: `${'x'.repeat(100)}\n…`,
      truncated: true,
    });
  });
});

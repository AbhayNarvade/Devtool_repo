import { describe, expect, it } from 'vitest';
import { searchItems } from './search';

const items = [
  {
    name: 'JSON Formatter',
    description: 'Format JSON',
    category: 'Developer Tools',
    keywords: 'json beautifier',
  },
  {
    name: 'JSON to YAML',
    description: 'Convert JSON to YAML',
    category: 'Developer Tools',
    keywords: 'json yaml',
  },
  {
    name: 'Compress Image',
    description: 'Make JPG smaller',
    category: 'Image Tools',
    keywords: 'image compressor',
  },
];

describe('searchItems', () => {
  it('returns nothing for an empty query', () => {
    expect(searchItems(items, '   ')).toEqual([]);
  });
  it('requires every term to match', () => {
    expect(searchItems(items, 'json yaml').map((i) => i.name)).toEqual(['JSON to YAML']);
  });
  it('ranks name matches above description matches', () => {
    expect(searchItems(items, 'json').map((i) => i.name)).toEqual([
      'JSON Formatter',
      'JSON to YAML',
    ]);
    expect(searchItems(items, 'jpg').map((i) => i.name)).toEqual(['Compress Image']);
  });
  it('is case-insensitive', () => {
    expect(searchItems(items, 'COMPRESS')).toHaveLength(1);
  });
});

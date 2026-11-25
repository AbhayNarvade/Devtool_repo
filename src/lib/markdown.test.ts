import { describe, expect, it } from 'vitest';
import { inlineToText, parseInline, parseMarkdown } from './markdown';

describe('parseInline', () => {
  it('parses code, bold, italic and links', () => {
    const nodes = parseInline('Use `JSON.parse`, **never** *eval*, see [docs](/developer-tools).');
    expect(nodes).toEqual([
      { type: 'text', value: 'Use ' },
      { type: 'code', value: 'JSON.parse' },
      { type: 'text', value: ', ' },
      { type: 'strong', children: [{ type: 'text', value: 'never' }] },
      { type: 'text', value: ' ' },
      { type: 'em', children: [{ type: 'text', value: 'eval' }] },
      { type: 'text', value: ', see ' },
      { type: 'link', href: '/developer-tools', children: [{ type: 'text', value: 'docs' }] },
      { type: 'text', value: '.' },
    ]);
  });

  it('leaves a lone asterisk alone', () => {
    expect(parseInline('5 * 3 = 15')).toEqual([{ type: 'text', value: '5 * 3 = 15' }]);
  });
});

describe('parseMarkdown', () => {
  it('parses all block types', () => {
    const md = [
      'First paragraph',
      'continues here.',
      '',
      '### Sub heading',
      '',
      '- one',
      '- two',
      '',
      '1. first',
      '2. second',
      '',
      '```json',
      '{',
      '',
      '  "a": 1',
      '}',
      '```',
      '',
      '| Col A | Col B |',
      '| --- | --- |',
      '| `x` | y |',
    ].join('\n');
    const blocks = parseMarkdown(md);
    expect(blocks.map((b) => b.type)).toEqual([
      'paragraph',
      'heading',
      'list',
      'list',
      'code',
      'table',
    ]);
    expect(blocks[0]).toEqual({
      type: 'paragraph',
      children: [{ type: 'text', value: 'First paragraph continues here.' }],
    });
    expect(blocks[4]).toEqual({ type: 'code', lang: 'json', value: '{\n\n  "a": 1\n}' });
    const table = blocks[5];
    expect(table?.type === 'table' && table.rows[0]?.[0]).toEqual([{ type: 'code', value: 'x' }]);
  });

  it('extracts plain text from inline nodes', () => {
    expect(inlineToText(parseInline('See **the** [formatter](/x) and `code`.'))).toBe(
      'See the formatter and code.',
    );
  });
});

/**
 * A tiny, dependency-free Markdown-subset parser for registry content.
 * Parsing is pure (unit tested); rendering to React lives in src/components/Markdown.tsx.
 *
 * Supported blocks: paragraphs, "## " / "### " / "#### " headings, "- " lists, "1. " lists,
 * fenced code blocks (```lang), and pipe tables.
 * Supported inline: `code`, **bold**, *italic*, [text](href).
 */

export type InlineNode =
  | { type: 'text'; value: string }
  | { type: 'code'; value: string }
  | { type: 'strong'; children: InlineNode[] }
  | { type: 'em'; children: InlineNode[] }
  | { type: 'link'; href: string; children: InlineNode[] };

export type BlockNode =
  | { type: 'paragraph'; children: InlineNode[] }
  | { type: 'heading'; level: 2 | 3 | 4; children: InlineNode[] }
  | { type: 'list'; ordered: boolean; items: InlineNode[][] }
  | { type: 'code'; lang: string; value: string }
  | { type: 'table'; header: InlineNode[][]; rows: InlineNode[][][] };

const INLINE_RE = /(`[^`]+`)|(\*\*(?:(?!\*\*).)+\*\*)|(\*[^*\s][^*]*\*)|(\[[^\]]+\]\([^)\s]+\))/g;

export function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];
  let last = 0;
  for (const match of text.matchAll(INLINE_RE)) {
    const index = match.index ?? 0;
    if (index > last) nodes.push({ type: 'text', value: text.slice(last, index) });
    const token = match[0];
    if (match[1]) {
      nodes.push({ type: 'code', value: token.slice(1, -1) });
    } else if (match[2]) {
      nodes.push({ type: 'strong', children: parseInline(token.slice(2, -2)) });
    } else if (match[3]) {
      nodes.push({ type: 'em', children: parseInline(token.slice(1, -1)) });
    } else if (match[4]) {
      const closeBracket = token.indexOf('](');
      const label = token.slice(1, closeBracket);
      const href = token.slice(closeBracket + 2, -1);
      nodes.push({ type: 'link', href, children: parseInline(label) });
    }
    last = index + token.length;
  }
  if (last < text.length) nodes.push({ type: 'text', value: text.slice(last) });
  return nodes;
}

function splitRow(line: string): string[] {
  return line
    .trim()
    .replace(/^\|/, '')
    .replace(/\|$/, '')
    .split('|')
    .map((cell) => cell.trim());
}

const UL_RE = /^\s*[-*]\s+/;
const OL_RE = /^\s*\d+[.)]\s+/;

export function parseMarkdown(source: string): BlockNode[] {
  const lines = source.replace(/\r\n?/g, '\n').split('\n');
  const blocks: BlockNode[] = [];
  let i = 0;

  while (i < lines.length) {
    const line = lines[i] ?? '';
    const trimmed = line.trim();

    if (trimmed === '') {
      i++;
      continue;
    }

    // Fenced code block
    if (trimmed.startsWith('```')) {
      const lang = trimmed.slice(3).trim();
      const body: string[] = [];
      i++;
      while (i < lines.length && !(lines[i] ?? '').trim().startsWith('```')) {
        body.push(lines[i] ?? '');
        i++;
      }
      i++; // skip closing fence
      blocks.push({ type: 'code', lang, value: body.join('\n') });
      continue;
    }

    // Headings
    const heading = /^(#{2,4})\s+(.*)$/.exec(trimmed);
    if (heading) {
      const level = (heading[1] ?? '###').length as 2 | 3 | 4;
      blocks.push({ type: 'heading', level, children: parseInline(heading[2] ?? '') });
      i++;
      continue;
    }

    // Tables
    if (trimmed.startsWith('|')) {
      const tableLines: string[] = [];
      while (i < lines.length && (lines[i] ?? '').trim().startsWith('|')) {
        tableLines.push((lines[i] ?? '').trim());
        i++;
      }
      const [headerLine, separator, ...rowLines] = tableLines;
      if (headerLine && separator && /^\|?\s*:?-{2,}/.test(separator)) {
        blocks.push({
          type: 'table',
          header: splitRow(headerLine).map(parseInline),
          rows: rowLines.map((row) => splitRow(row).map(parseInline)),
        });
      } else {
        blocks.push({ type: 'paragraph', children: parseInline(tableLines.join(' ')) });
      }
      continue;
    }

    // Lists
    if (UL_RE.test(line) || OL_RE.test(line)) {
      const ordered = OL_RE.test(line);
      const re = ordered ? OL_RE : UL_RE;
      const items: string[] = [];
      while (i < lines.length) {
        const current = lines[i] ?? '';
        if (re.test(current)) {
          items.push(current.replace(re, ''));
        } else if (current.trim() !== '' && /^\s{2,}/.test(current) && items.length > 0) {
          items[items.length - 1] += ` ${current.trim()}`;
        } else {
          break;
        }
        i++;
      }
      blocks.push({ type: 'list', ordered, items: items.map(parseInline) });
      continue;
    }

    // Paragraph: consume until blank line or another block starts
    const para: string[] = [];
    while (i < lines.length) {
      const current = lines[i] ?? '';
      const t = current.trim();
      if (
        t === '' ||
        t.startsWith('```') ||
        /^#{2,4}\s/.test(t) ||
        t.startsWith('|') ||
        UL_RE.test(current) ||
        OL_RE.test(current)
      ) {
        break;
      }
      para.push(t);
      i++;
    }
    blocks.push({ type: 'paragraph', children: parseInline(para.join(' ')) });
  }

  return blocks;
}

/** Plain text of inline nodes (used for word counts and tests). */
export function inlineToText(nodes: InlineNode[]): string {
  return nodes
    .map((n) => {
      if (n.type === 'text' || n.type === 'code') return n.value;
      return inlineToText(n.children);
    })
    .join('');
}

/** Plain text of a whole Markdown document (code blocks included). */
export function markdownToText(source: string): string {
  return parseMarkdown(source)
    .map((b) => {
      switch (b.type) {
        case 'paragraph':
        case 'heading':
          return inlineToText(b.children);
        case 'list':
          return b.items.map(inlineToText).join('\n');
        case 'code':
          return b.value;
        case 'table':
          return [b.header, ...b.rows].map((r) => r.map(inlineToText).join(' ')).join('\n');
      }
    })
    .join('\n\n');
}

/** Internal link targets used inside a Markdown document (for link validation). */
export function collectLinks(source: string): string[] {
  const out: string[] = [];
  const walk = (nodes: InlineNode[]) => {
    for (const n of nodes) {
      if (n.type === 'link') {
        out.push(n.href);
        walk(n.children);
      } else if (n.type === 'strong' || n.type === 'em') {
        walk(n.children);
      }
    }
  };
  for (const b of parseMarkdown(source)) {
    if (b.type === 'paragraph' || b.type === 'heading') walk(b.children);
    else if (b.type === 'list') b.items.forEach(walk);
    else if (b.type === 'table') [b.header, ...b.rows].forEach((r) => r.forEach(walk));
  }
  return out;
}

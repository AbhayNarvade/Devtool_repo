import Link from 'next/link';
import type { ReactNode } from 'react';
import { parseMarkdown, type BlockNode, type InlineNode } from '@/lib/markdown';

function renderInline(nodes: InlineNode[], keyPrefix = 'i'): ReactNode[] {
  return nodes.map((node, i) => {
    const key = `${keyPrefix}-${i}`;
    switch (node.type) {
      case 'text':
        return node.value;
      case 'code':
        return <code key={key}>{node.value}</code>;
      case 'strong':
        return <strong key={key}>{renderInline(node.children, key)}</strong>;
      case 'em':
        return <em key={key}>{renderInline(node.children, key)}</em>;
      case 'link': {
        const children = renderInline(node.children, key);
        if (node.href.startsWith('/')) {
          return (
            <Link key={key} href={node.href}>
              {children}
            </Link>
          );
        }
        if (!/^https?:/.test(node.href)) {
          return (
            <a key={key} href={node.href}>
              {children}
            </a>
          );
        }
        return (
          <a key={key} href={node.href} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      }
    }
  });
}

function renderBlock(block: BlockNode, i: number): ReactNode {
  const key = `b-${i}`;
  switch (block.type) {
    case 'paragraph':
      return <p key={key}>{renderInline(block.children, key)}</p>;
    case 'heading':
      if (block.level === 2) return <h2 key={key}>{renderInline(block.children, key)}</h2>;
      if (block.level === 3) return <h3 key={key}>{renderInline(block.children, key)}</h3>;
      return <h4 key={key}>{renderInline(block.children, key)}</h4>;
    case 'list': {
      const items = block.items.map((item, j) => (
        <li key={`${key}-${j}`}>{renderInline(item, `${key}-${j}`)}</li>
      ));
      return block.ordered ? <ol key={key}>{items}</ol> : <ul key={key}>{items}</ul>;
    }
    case 'code':
      return (
        <pre
          key={key}
          tabIndex={0}
          aria-label={block.lang ? `${block.lang} example` : 'Code example'}
        >
          <code>{block.value}</code>
        </pre>
      );
    case 'table':
      return (
        <div key={key} className="table-wrap" tabIndex={0} role="region" aria-label="Table">
          <table>
            <thead>
              <tr>
                {block.header.map((cell, j) => (
                  <th key={j} scope="col">
                    {renderInline(cell, `${key}-h${j}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((row, r) => (
                <tr key={r}>
                  {row.map((cell, j) => (
                    <td key={j}>{renderInline(cell, `${key}-${r}-${j}`)}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

/** Render registry Markdown on the server (no client JS). */
export function Markdown({ source }: { source: string }) {
  return <>{parseMarkdown(source).map(renderBlock)}</>;
}

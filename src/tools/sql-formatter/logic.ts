import { format, type SqlLanguage } from 'sql-formatter';
import type { KeywordCase, SqlIndent } from './dialects';
import { fail, ok, type ConvertResult } from '@/lib/convert';

export interface SqlFormatOptions {
  language: SqlLanguage;
  keywordCase: KeywordCase;
  indent: SqlIndent;
}

export function formatSql(input: string, options: SqlFormatOptions): ConvertResult {
  try {
    const output = format(input, {
      language: options.language,
      keywordCase: options.keywordCase,
      dataTypeCase: options.keywordCase,
      functionCase: options.keywordCase,
      tabWidth: options.indent === '4' ? 4 : 2,
      useTabs: options.indent === 'tab',
      linesBetweenQueries: 1,
    });
    return ok(output);
  } catch (e) {
    const message = e instanceof Error ? e.message.split('\n')[0]! : String(e);
    const pos = /at line (\d+) column (\d+)/.exec(message);
    return fail(
      'Could not format this SQL',
      `${message.replace(/ at line \d+ column \d+/, '')}. Check for unbalanced parentheses or quotes, or try a different dialect.`,
      pos ? { line: Number(pos[1]), column: Number(pos[2]) } : {},
    );
  }
}

'use client';

import { useCallback, useState } from 'react';
import { Select } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import { SQL_DIALECTS, type KeywordCase, type SqlIndent } from './dialects';
import type { SqlLanguage } from 'sql-formatter';

const SAMPLE = `select o.id, c.name as customer, sum(i.quantity * i.unit_price) as total from orders o join customers c on c.id = o.customer_id left join order_items i on i.order_id = o.id where o.created_at >= '2026-01-01' and o.status in ('paid', 'shipped') group by o.id, c.name having sum(i.quantity * i.unit_price) > 100 order by total desc limit 20;`;

export default function SqlFormatterTool() {
  const [language, setLanguage] = useState<SqlLanguage>('sql');
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [indent, setIndent] = useState<SqlIndent>('2');
  const convert = useCallback(
    async (input: string) => {
      const { formatSql } = await import('./logic');
      return formatSql(input, { language, keywordCase, indent });
    },
    [language, keywordCase, indent],
  );
  return (
    <TextConverter
      inputLabel="SQL input"
      outputLabel="Formatted SQL"
      inputPlaceholder="Paste one or more SQL statements"
      sample={SAMPLE}
      convert={convert}
      outputFilename="formatted.sql"
      outputMime="application/sql"
      inputAccept=".sql,text/plain,application/sql"
      inputFileLabel="Open .sql file"
      options={
        <>
          <Select label="Dialect" value={language} onChange={setLanguage} options={SQL_DIALECTS} />
          <Select
            label="Keyword case"
            value={keywordCase}
            onChange={setKeywordCase}
            options={[
              { value: 'upper', label: 'UPPERCASE' },
              { value: 'lower', label: 'lowercase' },
              { value: 'preserve', label: 'Keep as typed' },
            ]}
          />
          <Select
            label="Indentation"
            value={indent}
            onChange={setIndent}
            options={[
              { value: '2', label: '2 spaces' },
              { value: '4', label: '4 spaces' },
              { value: 'tab', label: 'Tabs' },
            ]}
          />
        </>
      }
    />
  );
}

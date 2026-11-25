'use client';

import { useCallback, useState } from 'react';
import { Checkbox, Select } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import type { CsvDelimiter } from './logic';

const SAMPLE = `sku;product;price;in_stock;zip_code
KB-01;Mechanical keyboard;89.90;true;02139
MS-07;"Wireless mouse; silent";24.50;false;10001
HD-11;USB-C hub;39;true;
`;

export default function CsvToJsonTool() {
  const [header, setHeader] = useState(true);
  const [delimiter, setDelimiter] = useState<CsvDelimiter>('auto');
  const [dynamicTyping, setDynamicTyping] = useState(true);
  const [minify, setMinify] = useState(false);
  const convert = useCallback(
    async (input: string) => {
      const { csvToJson } = await import('./logic');
      return csvToJson(input, { header, delimiter, dynamicTyping, minify });
    },
    [header, delimiter, dynamicTyping, minify],
  );
  return (
    <TextConverter
      inputLabel="CSV input"
      outputLabel="JSON output"
      inputPlaceholder={'name,age\nAnn,31\nRaj,27'}
      sample={SAMPLE}
      convert={convert}
      outputFilename="data.json"
      outputMime="application/json"
      inputAccept=".csv,.tsv,.txt,text/csv,text/tab-separated-values,text/plain"
      inputFileLabel="Open .csv file"
      options={
        <>
          <Select
            label="Delimiter"
            value={delimiter}
            onChange={setDelimiter}
            options={[
              { value: 'auto', label: 'Auto-detect' },
              { value: ',', label: 'Comma (,)' },
              { value: ';', label: 'Semicolon (;)' },
              { value: '\t', label: 'Tab' },
              { value: '|', label: 'Pipe (|)' },
            ]}
          />
          <Checkbox label="First row is a header" checked={header} onChange={setHeader} />
          <Checkbox
            label="Detect numbers and booleans"
            description="Leading zeros stay text"
            checked={dynamicTyping}
            onChange={setDynamicTyping}
          />
          <Checkbox label="Minify output" checked={minify} onChange={setMinify} />
        </>
      }
    />
  );
}

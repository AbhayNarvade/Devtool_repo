'use client';

import { useCallback, useState } from 'react';
import { Checkbox, Select } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import type { Delimiter } from './logic';

const SAMPLE = `[
  { "orderId": "A-1001", "customer": { "name": "Priya Shah", "country": "IN" }, "total": 129.5, "items": ["keyboard", "mouse"] },
  { "orderId": "A-1002", "customer": { "name": "Tom O'Neil", "country": "IE" }, "total": 18, "items": ["cable"], "coupon": "SPRING10" },
  { "orderId": "A-1003", "customer": { "name": "Lena Müller", "country": "DE" }, "total": 342.99, "items": ["monitor, 27\\"", "stand"] }
]`;

export default function JsonToCsvTool() {
  const [delimiter, setDelimiter] = useState<Delimiter>(',');
  const [flatten, setFlatten] = useState(true);
  const convert = useCallback(
    async (input: string) => {
      const { jsonToCsv } = await import('./logic');
      return jsonToCsv(input, { delimiter, flatten });
    },
    [delimiter, flatten],
  );
  return (
    <TextConverter
      inputLabel="JSON input (array of objects)"
      outputLabel="CSV output"
      inputPlaceholder='[{"name":"Ann","age":31},{"name":"Raj","age":27}]'
      sample={SAMPLE}
      convert={convert}
      outputFilename={delimiter === '\t' ? 'data.tsv' : 'data.csv'}
      outputMime={delimiter === '\t' ? 'text/tab-separated-values' : 'text/csv'}
      inputAccept=".json,application/json,text/plain"
      inputFileLabel="Open .json file"
      options={
        <>
          <Select
            label="Delimiter"
            value={delimiter}
            onChange={setDelimiter}
            options={[
              { value: ',', label: 'Comma (,)' },
              { value: ';', label: 'Semicolon (;)' },
              { value: '\t', label: 'Tab' },
              { value: '|', label: 'Pipe (|)' },
            ]}
          />
          <Checkbox
            label="Flatten nested objects"
            description="customer.name, items.0 … (off: nested values as JSON text)"
            checked={flatten}
            onChange={setFlatten}
          />
        </>
      }
    />
  );
}

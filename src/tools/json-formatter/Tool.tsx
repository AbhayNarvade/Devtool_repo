'use client';

import { useCallback, useState } from 'react';
import { Checkbox, Segmented, Select } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import type { Indent } from '@/lib/json';
import { formatJson, type JsonMode } from './logic';

const SAMPLE = `{"id":1024,"name":"Wireless Keyboard","price":49.99,"inStock":true,"tags":["electronics","accessories"],"dimensions":{"width":43.5,"depth":12.8,"unit":"cm"},"supplier":null}`;

export default function JsonFormatterTool() {
  const [mode, setMode] = useState<JsonMode>('beautify');
  const [indent, setIndent] = useState<Indent>('2');
  const [sortKeys, setSortKeys] = useState(false);
  const convert = useCallback(
    (input: string) => formatJson(input, { mode, indent, sortKeys }),
    [mode, indent, sortKeys],
  );
  return (
    <TextConverter
      inputLabel="JSON input"
      outputLabel={mode === 'minify' ? 'Minified JSON' : 'Formatted JSON'}
      inputPlaceholder='Paste JSON here, e.g. {"name":"value"}'
      sample={SAMPLE}
      convert={convert}
      outputFilename={mode === 'minify' ? 'minified.json' : 'formatted.json'}
      outputMime="application/json"
      inputAccept=".json,application/json,text/plain"
      inputFileLabel="Open .json file"
      options={
        <>
          <Segmented
            label="Mode"
            value={mode}
            onChange={setMode}
            options={[
              { value: 'beautify', label: 'Beautify' },
              { value: 'minify', label: 'Minify' },
            ]}
          />
          {mode === 'beautify' ? (
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
          ) : null}
          <Checkbox label="Sort keys A–Z" checked={sortKeys} onChange={setSortKeys} />
        </>
      }
    />
  );
}

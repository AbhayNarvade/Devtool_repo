'use client';

import { useCallback, useState } from 'react';
import { Checkbox, Select } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';

const SAMPLE = `{
  "service": "checkout-api",
  "replicas": 3,
  "image": "registry.example.com/checkout:2.4.1",
  "ports": [8080, 9090],
  "env": {
    "LOG_LEVEL": "info",
    "FEATURE_FLAGS": "yes",
    "TIMEOUT_MS": "1500"
  },
  "healthCheck": { "path": "/healthz", "intervalSeconds": 10 },
  "description": "Handles carts and payments.\\nOwned by the payments team."
}`;

export default function JsonToYamlTool() {
  const [indent, setIndent] = useState<'2' | '4'>('2');
  const [sortKeys, setSortKeys] = useState(false);
  const convert = useCallback(
    async (input: string) => {
      const { jsonToYaml } = await import('./logic');
      return jsonToYaml(input, { indent: indent === '4' ? 4 : 2, sortKeys });
    },
    [indent, sortKeys],
  );
  return (
    <TextConverter
      inputLabel="JSON input"
      outputLabel="YAML output"
      inputPlaceholder="Paste JSON to convert to YAML"
      sample={SAMPLE}
      convert={convert}
      outputFilename="converted.yaml"
      outputMime="application/yaml"
      inputAccept=".json,application/json,text/plain"
      inputFileLabel="Open .json file"
      options={
        <>
          <Select
            label="YAML indentation"
            value={indent}
            onChange={setIndent}
            options={[
              { value: '2', label: '2 spaces' },
              { value: '4', label: '4 spaces' },
            ]}
          />
          <Checkbox label="Sort keys A–Z" checked={sortKeys} onChange={setSortKeys} />
        </>
      }
    />
  );
}

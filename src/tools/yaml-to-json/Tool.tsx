'use client';

import { useCallback, useState } from 'react';
import { Checkbox, Select } from '@/components/tool/controls';
import { TextConverter } from '@/components/tool/TextConverter';
import type { Indent } from '@/lib/json';

const SAMPLE = `# Deployment settings
defaults: &defaults
  region: eu-west-1
  retries: 3

production:
  <<: *defaults
  replicas: 4
  domains:
    - shop.example.com
    - www.shop.example.com
  maintenance: false
  banner: |
    Scheduled maintenance:
    Sunday 02:00-03:00 UTC
`;

export default function YamlToJsonTool() {
  const [indent, setIndent] = useState<Indent | 'minify'>('2');
  const [multiDocument, setMultiDocument] = useState(false);
  const convert = useCallback(
    async (input: string) => {
      const { yamlToJson } = await import('./logic');
      return yamlToJson(input, { indent, multiDocument });
    },
    [indent, multiDocument],
  );
  return (
    <TextConverter
      inputLabel="YAML input"
      outputLabel="JSON output"
      inputPlaceholder="Paste YAML to convert to JSON"
      sample={SAMPLE}
      convert={convert}
      outputFilename="converted.json"
      outputMime="application/json"
      inputAccept=".yaml,.yml,application/yaml,text/yaml,text/plain"
      inputFileLabel="Open .yaml file"
      options={
        <>
          <Select
            label="JSON output"
            value={indent}
            onChange={setIndent}
            options={[
              { value: '2', label: 'Indent 2 spaces' },
              { value: '4', label: 'Indent 4 spaces' },
              { value: 'tab', label: 'Indent with tabs' },
              { value: 'minify', label: 'Minified' },
            ]}
          />
          <Checkbox
            label="Multiple documents"
            description='Convert "---" separated documents into a JSON array'
            checked={multiDocument}
            onChange={setMultiDocument}
          />
        </>
      }
    />
  );
}

import { describe, expect, it } from 'vitest';
import { jsonToYaml } from '../json-to-yaml/logic';
import { yamlToJson } from './logic';

describe('jsonToYaml', () => {
  it('converts nested JSON to block YAML', () => {
    const r = jsonToYaml(
      '{"name":"app","ports":[80,443],"db":{"host":"localhost","ssl":true},"note":null}',
      {
        indent: 2,
        sortKeys: false,
      },
    );
    expect(r.ok && r.output).toBe(
      'name: app\nports:\n  - 80\n  - 443\ndb:\n  host: localhost\n  ssl: true\nnote: null\n',
    );
  });
  it('quotes strings that would change type in YAML', () => {
    const r = jsonToYaml('{"a":"yes","b":"123","c":"true","d":"2024-01-02"}', {
      indent: 2,
      sortKeys: false,
    });
    expect(r.ok && r.output).toBe("a: 'yes'\nb: '123'\nc: 'true'\nd: '2024-01-02'\n");
  });
  it('sorts keys and uses 4-space indent', () => {
    const r = jsonToYaml('{"b":{"z":1,"x":2},"a":1}', { indent: 4, sortKeys: true });
    expect(r.ok && r.output).toBe('a: 1\nb:\n    x: 2\n    z: 1\n');
  });
  it('quotes keys that YAML 1.1 parsers would read as booleans', () => {
    const r = jsonToYaml('{"y":1,"no":2}', { indent: 2, sortKeys: false });
    expect(r.ok && r.output).toBe("'y': 1\n'no': 2\n");
  });
  it('round-trips', () => {
    const json = '{"a":[1,{"b":"two lines\\nhere"}],"c":"é"}';
    const y = jsonToYaml(json, { indent: 2, sortKeys: false });
    const back = y.ok ? yamlToJson(y.output, { indent: 'minify', multiDocument: false }) : null;
    expect(back?.ok && back.output).toBe(json);
  });
  it('reports JSON errors', () => {
    const r = jsonToYaml('{"a":}', { indent: 2, sortKeys: false });
    expect(r.ok).toBe(false);
  });
});

describe('yamlToJson', () => {
  it('converts YAML with comments, anchors and block strings', () => {
    const yaml = [
      '# config',
      'base: &base',
      '  retries: 3',
      'service:',
      '  name: api',
      '  settings: *base',
      '  script: |',
      '    echo hi',
      '    exit 0',
      '  enabled: true',
      '  version: 1.10',
      '  tag: "1.10"',
    ].join('\n');
    const r = yamlToJson(yaml, { indent: 'minify', multiDocument: false });
    expect(r.ok && JSON.parse(r.output)).toEqual({
      base: { retries: 3 },
      service: {
        name: 'api',
        settings: { retries: 3 },
        script: 'echo hi\nexit 0\n',
        enabled: true,
        version: 1.1,
        tag: '1.10',
      },
    });
  });
  it('supports merge keys', () => {
    const r = yamlToJson('base: &b\n  a: 1\n  b: 2\nprod:\n  <<: *b\n  b: 3', {
      indent: 'minify',
      multiDocument: false,
    });
    expect(r.ok && r.output).toBe('{"base":{"a":1,"b":2},"prod":{"a":1,"b":3}}');
  });
  it('keeps a __proto__ key as data', () => {
    const r = yamlToJson('__proto__: 1\nb: 2', { indent: 'minify', multiDocument: false });
    expect(r.ok && r.output).toBe('{"__proto__":1,"b":2}');
  });
  it('keeps yes/no as strings (YAML 1.2 core schema)', () => {
    const r = yamlToJson('a: yes\nb: no\nc: on', { indent: 'minify', multiDocument: false });
    expect(r.ok && r.output).toBe('{"a":"yes","b":"no","c":"on"}');
  });
  it('handles multiple documents', () => {
    const single = yamlToJson('a: 1\n---\nb: 2', { indent: 'minify', multiDocument: false });
    expect(single.ok).toBe(false);
    if (!single.ok) expect(single.error.message).toMatch(/Multiple documents/);
    const multi = yamlToJson('a: 1\n---\nb: 2', { indent: 'minify', multiDocument: true });
    expect(multi.ok && multi.output).toBe('[{"a":1},{"b":2}]');
  });
  it('reports the 1-based line of a syntax error', () => {
    const r = yamlToJson('a: 1\nb: [1, 2\nc: 3', { indent: '2', multiDocument: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.line).toBe(3);
  });
  it('stops alias bombs instead of exhausting memory', () => {
    const levels = 'bcdefghi'.split('');
    const bomb = [
      'a: &a [x, x, x, x, x, x, x, x, x, x]',
      ...levels.map(
        (k, i) =>
          `${k}: &${k} [${Array(10)
            .fill('*' + 'abcdefghi'[i])
            .join(', ')}]`,
      ),
    ].join('\n');
    const started = Date.now();
    const r = yamlToJson(bomb, { indent: 'minify', multiDocument: false });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.title).toMatch(/too much data/);
    expect(Date.now() - started).toBeLessThan(5000);
  });
  it('still expands normal aliases', () => {
    const r = yamlToJson('base: &b [1, 2]\ncopy: *b', { indent: 'minify', multiDocument: false });
    expect(r.ok && r.output).toBe('{"base":[1,2],"copy":[1,2]}');
  });
  it('rejects .inf which JSON cannot represent', () => {
    const r = yamlToJson('x: .inf', { indent: '2', multiDocument: false });
    expect(r.ok).toBe(false);
  });
  it('indents with tabs', () => {
    const r = yamlToJson('a: 1', { indent: 'tab', multiDocument: false });
    expect(r.ok && r.output).toBe('{\n\t"a": 1\n}');
  });
});

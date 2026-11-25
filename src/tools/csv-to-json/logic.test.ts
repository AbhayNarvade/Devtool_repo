import { describe, expect, it } from 'vitest';
import { escapeFormula, flattenObject, jsonToCsv } from '../json-to-csv/logic';
import { csvToJson, typeCell } from './logic';

describe('flattenObject', () => {
  it('flattens nested objects and arrays with dot notation', () => {
    expect(flattenObject({ a: { b: 1, c: { d: 'x' } }, e: [1, { f: 2 }], g: {}, h: null })).toEqual(
      {
        'a.b': 1,
        'a.c.d': 'x',
        'e.0': 1,
        'e.1.f': 2,
        g: '',
        h: null,
      },
    );
  });
});

describe('jsonToCsv', () => {
  it('converts an array of objects with a union of columns', () => {
    const r = jsonToCsv('[{"id":1,"name":"Ann"},{"id":2,"email":"b@x.io"}]', {
      delimiter: ',',
      flatten: true,
    });
    expect(r.ok && r.output).toBe('id,name,email\r\n1,Ann,\r\n2,,b@x.io');
  });
  it('quotes values containing delimiters, quotes and newlines', () => {
    const r = jsonToCsv('[{"a":"x,y","b":"say \\"hi\\"","c":"two\\nlines"}]', {
      delimiter: ',',
      flatten: true,
    });
    expect(r.ok && r.output).toBe('a,b,c\r\n"x,y","say ""hi""","two\nlines"');
  });
  it('flattens nested values or keeps them as JSON text', () => {
    const json = '[{"user":{"name":"Ann","tags":["a","b"]}}]';
    const flat = jsonToCsv(json, { delimiter: ';', flatten: true });
    expect(flat.ok && flat.output).toBe('user.name;user.tags.0;user.tags.1\r\nAnn;a;b');
    const nested = jsonToCsv(json, { delimiter: ',', flatten: false });
    expect(nested.ok && nested.output).toBe('user\r\n"{""name"":""Ann"",""tags"":[""a"",""b""]}"');
  });
  it('accepts a single object and arrays of primitives', () => {
    const single = jsonToCsv('{"a":1}', { delimiter: '\t', flatten: true });
    expect(single.ok && single.output).toBe('a\r\n1');
    const prims = jsonToCsv('[1,"two",null]', { delimiter: ',', flatten: true });
    expect(prims.ok && prims.output).toBe('value\r\n1\r\ntwo\r\n');
  });
  it('optionally escapes spreadsheet formulas but not numbers', () => {
    expect(escapeFormula('=HYPERLINK("http://x")')).toBe('\'=HYPERLINK("http://x")');
    expect(escapeFormula('@SUM(A1)')).toBe("'@SUM(A1)");
    expect(escapeFormula('-5')).toBe('-5');
    expect(escapeFormula('+1.5e3')).toBe('+1.5e3');
    expect(escapeFormula('-rm')).toBe("'-rm");
    const json = '[{"a":"=1+1","b":-2}]';
    const off = jsonToCsv(json, { delimiter: ',', flatten: true });
    expect(off.ok && off.output).toBe('a,b\r\n=1+1,-2');
    const on = jsonToCsv(json, { delimiter: ',', flatten: true, escapeFormulas: true });
    expect(on.ok && on.output).toBe("a,b\r\n'=1+1,-2");
  });
  it('rejects an empty array', () => {
    expect(jsonToCsv('[]', { delimiter: ',', flatten: true }).ok).toBe(false);
  });
});

describe('csvToJson', () => {
  const base = { header: true, delimiter: 'auto' as const, dynamicTyping: true, minify: true };
  it('parses with a header row and types values', () => {
    const r = csvToJson('id,name,active,score\n1,Ann,true,\n2,"Smith, Bob",false,3.5', base);
    expect(r.ok && r.output).toBe(
      '[{"id":1,"name":"Ann","active":true,"score":null},{"id":2,"name":"Smith, Bob","active":false,"score":3.5}]',
    );
  });
  it('auto-detects semicolons and tabs', () => {
    const semi = csvToJson('a;b\n1;2', base);
    expect(semi.ok && semi.output).toBe('[{"a":1,"b":2}]');
    expect(semi.ok && semi.info).toMatch(/semicolon \(detected\)/);
    const tab = csvToJson('a\tb\nx\ty', base);
    expect(tab.ok && tab.output).toBe('[{"a":"x","b":"y"}]');
  });
  it('returns arrays of arrays without a header row', () => {
    const r = csvToJson('1,2\n3,4', { ...base, header: false });
    expect(r.ok && r.output).toBe('[[1,2],[3,4]]');
  });
  it('keeps leading zeros and huge integers as strings when typing', () => {
    const r = csvToJson('zip,id,n\n01234,12345678901234567890,-0.5e2', base);
    expect(r.ok && r.output).toBe('[{"zip":"01234","id":"12345678901234567890","n":-50}]');
  });
  it('keeps strings when typing is off and strips BOM', () => {
    const r = csvToJson('\uFEFFzip,n\n01234,5', { ...base, dynamicTyping: false });
    expect(r.ok && r.output).toBe('[{"zip":"01234","n":"5"}]');
  });
  it('reports an unclosed quote with its line', () => {
    const r = csvToJson('a,b\n1,"x\n2,3', base);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error.line).toBe(2);
  });
  it('keeps __proto__ keys and renames duplicate headers', () => {
    const r = csvToJson('__proto__,a,a\n1,2,3', base);
    expect(r.ok && r.output).toBe('[{"__proto__":1,"a":2,"a_1":3}]');
    expect(JSON.stringify(flattenObject(JSON.parse('{"__proto__":{"x":1}}')))).toBe(
      '{"__proto__.x":1}',
    );
  });
  it('warns about rows with missing fields', () => {
    const r = csvToJson('a,b\n1', base);
    expect(r.ok && r.warnings?.[0]).toMatch(/Row 2/);
  });
});

describe('typeCell', () => {
  it('types booleans, numbers and empty cells', () => {
    expect(typeCell('TRUE')).toBe(true);
    expect(typeCell('0')).toBe(0);
    expect(typeCell('007')).toBe('007');
    expect(typeCell(' ')).toBe(null);
    expect(typeCell('1e3')).toBe(1000);
    expect(typeCell('abc')).toBe('abc');
  });
});

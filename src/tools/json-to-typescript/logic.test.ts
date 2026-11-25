import { describe, expect, it } from 'vitest';
import { jsonToTypeScript, jsonToTypeScriptFromValue, singularize, toPascalCase } from './logic';

const opts = { rootName: 'Root', allOptional: false, exportTypes: true, useTypeAlias: false };
const gen = (value: unknown, o = {}) => jsonToTypeScriptFromValue(value, { ...opts, ...o });

describe('helpers', () => {
  it('converts names to PascalCase', () => {
    expect(toPascalCase('user_profile')).toBe('UserProfile');
    expect(toPascalCase('billing-address')).toBe('BillingAddress');
    expect(toPascalCase('createdBy')).toBe('CreatedBy');
    expect(toPascalCase('2fa')).toBe('T2fa');
    expect(toPascalCase('$$$')).toBe('Item');
  });
  it('singularizes array names', () => {
    expect(singularize('users')).toBe('user');
    expect(singularize('categories')).toBe('category');
    expect(singularize('boxes')).toBe('box');
    expect(singularize('address')).toBe('addressItem');
    expect(singularize('data')).toBe('dataItem');
  });
});

describe('jsonToTypeScript', () => {
  it('generates nested interfaces', () => {
    expect(
      gen({
        id: 1,
        name: 'Ann',
        active: true,
        address: { city: 'Pune', zip: '411001' },
        tags: ['a'],
      }),
    ).toBe(
      [
        'export interface Root {',
        '  id: number;',
        '  name: string;',
        '  active: boolean;',
        '  address: Address;',
        '  tags: string[];',
        '}',
        '',
        'export interface Address {',
        '  city: string;',
        '  zip: string;',
        '}',
        '',
      ].join('\n'),
    );
  });

  it('merges array items and marks missing keys optional', () => {
    const out = gen({
      users: [
        { id: 1, email: 'a@x.io' },
        { id: 2, phone: null },
      ],
    });
    expect(out).toContain('users: User[];');
    expect(out).toContain(
      'export interface User {\n  id: number;\n  email?: string;\n  phone?: null;\n}',
    );
  });

  it('handles unions, empty arrays, empty objects and odd keys', () => {
    const out = gen({ mixed: [1, 'a'], none: [], meta: {}, 'content-type': 'x', value: null });
    expect(out).toContain('mixed: (string | number)[];');
    expect(out).toContain('none: unknown[];');
    expect(out).toContain('meta: Record<string, unknown>;');
    expect(out).toContain('"content-type": string;');
    expect(out).toContain('value: null;');
  });

  it('reuses identical shapes and avoids name clashes', () => {
    const out = gen({ from: { lat: 1, lng: 2 }, to: { lat: 3, lng: 4 }, root: { x: 1 } });
    expect(out).toContain('from: From;');
    expect(out).toContain('to: From;');
    expect(out).toContain('root: Root2;');
  });

  it('supports root arrays, primitives, all-optional, type aliases and no export', () => {
    expect(gen([{ a: 1 }])).toBe(
      'export type Root = RootItem[];\n\nexport interface RootItem {\n  a: number;\n}\n',
    );
    expect(gen('x')).toBe('export type Root = string;\n');
    expect(gen({ a: 1 }, { allOptional: true })).toContain('a?: number;');
    expect(gen({ a: 1 }, { useTypeAlias: true, exportTypes: false })).toBe(
      'type Root = {\n  a: number;\n};\n',
    );
  });

  it('uses the root name and reports invalid JSON', () => {
    const r = jsonToTypeScript('{"a":1}', { ...opts, rootName: 'api response' });
    expect(r.ok && r.output.startsWith('export interface ApiResponse {')).toBe(true);
    expect(jsonToTypeScript('{a:1}', opts).ok).toBe(false);
  });
});

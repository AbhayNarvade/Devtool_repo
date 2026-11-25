import { describe, expect, it } from 'vitest';
import { findMatch, hashText } from './logic';

// Known test vectors (RFC 1321, FIPS 180 examples).
const VECTORS: Record<string, Record<string, string>> = {
  '': {
    MD5: 'd41d8cd98f00b204e9800998ecf8427e',
    'SHA-1': 'da39a3ee5e6b4b0d3255bfef95601890afd80709',
    'SHA-256': 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    'SHA-384':
      '38b060a751ac96384cd9327eb1b1e36a21fdb71114be07434c0cc7bf63f6e1da274edebfe76f65fbd51ad2f14898b95b',
    'SHA-512':
      'cf83e1357eefb8bdf1542850d66d8007d620e4050b5715dc83f4a921d36ce9ce47d0d13c5d85f2b0ff8318d2877eec2f63b931bd47417a81a538327af927da3e',
  },
  abc: {
    MD5: '900150983cd24fb0d6963f7d28e17f72',
    'SHA-1': 'a9993e364706816aba3e25717850c26c9cd0d89d',
    'SHA-256': 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
    'SHA-384':
      'cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7',
    'SHA-512':
      'ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f',
  },
};

describe('hashText', () => {
  it.each(Object.keys(VECTORS))('matches known vectors for "%s"', async (input) => {
    expect(await hashText(input)).toEqual(VECTORS[input]);
  });
  it('hashes UTF-8 text', async () => {
    // Reference values from Node's crypto module.
    expect((await hashText('é', ['MD5'])).MD5).toBe('66ddcd97cfdeabb2f6fb8a999b4bc76f');
    expect((await hashText('héllo 😀', ['SHA-256']))['SHA-256']).toBe(
      'a53c56966616f0ec3ed9db7ea07a6034430149528bbaba8966c284f9373669c2',
    );
    expect((await hashText('The quick brown fox jumps over the lazy dog', ['MD5'])).MD5).toBe(
      '9e107d9d372bb6826bd81d3542a419d6',
    );
  });
});

describe('findMatch', () => {
  it('compares case-insensitively', () => {
    expect(findMatch(VECTORS.abc!, '  900150983CD24FB0D6963F7D28E17F72 ')).toBe('MD5');
    expect(findMatch(VECTORS.abc!, 'nope')).toBeNull();
  });
});

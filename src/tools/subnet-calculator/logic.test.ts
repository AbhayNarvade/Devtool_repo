import { describe, expect, it } from 'vitest';
import {
  calculateSubnet,
  formatIPv4,
  maskToPrefix,
  parseCidr,
  parseIPv4,
  prefixToMask,
} from './logic';

const calc = (cidr: string) => {
  const p = parseCidr(cidr);
  if (!p.ok) throw new Error(p.message);
  return calculateSubnet(p.ip, p.prefix);
};

describe('IPv4 parsing', () => {
  it('parses and formats addresses', () => {
    expect(parseIPv4('192.168.1.10')).toBe(3232235786);
    expect(formatIPv4(3232235786)).toBe('192.168.1.10');
    expect(parseIPv4('255.255.255.255')).toBe(4294967295);
    for (const bad of ['256.1.1.1', '1.2.3', '1.2.3.4.5', '01.2.3.4', 'a.b.c.d', '1.2.3.-4'])
      expect(parseIPv4(bad)).toBeNull();
  });
  it('converts masks and prefixes', () => {
    expect(formatIPv4(prefixToMask(24))).toBe('255.255.255.0');
    expect(formatIPv4(prefixToMask(0))).toBe('0.0.0.0');
    expect(formatIPv4(prefixToMask(32))).toBe('255.255.255.255');
    expect(maskToPrefix(parseIPv4('255.255.240.0')!)).toBe(20);
    expect(maskToPrefix(parseIPv4('255.0.255.0')!)).toBeNull();
  });
  it('accepts CIDR, mask and fallback formats', () => {
    expect(parseCidr('10.0.0.1/8')).toEqual({ ok: true, ip: 167772161, prefix: 8 });
    expect(parseCidr('10.0.0.1 255.255.0.0')).toMatchObject({ ok: true, prefix: 16 });
    expect(parseCidr('10.0.0.1/255.255.255.128')).toMatchObject({ ok: true, prefix: 25 });
    expect(parseCidr('10.0.0.1', 30)).toMatchObject({ ok: true, prefix: 30 });
    expect(parseCidr('10.0.0.1/33').ok).toBe(false);
    expect(parseCidr('10.0.0.1/255.0.255.0').ok).toBe(false);
  });
});

describe('calculateSubnet', () => {
  it('calculates a /24', () => {
    expect(calc('192.168.1.130/24')).toMatchObject({
      network: '192.168.1.0',
      broadcast: '192.168.1.255',
      netmask: '255.255.255.0',
      wildcard: '0.0.0.255',
      firstHost: '192.168.1.1',
      lastHost: '192.168.1.254',
      totalAddresses: 256,
      usableHosts: 254,
      addressClass: 'C',
      type: 'Private (RFC 1918)',
      cidr: '192.168.1.0/24',
    });
  });
  it('calculates a /20 that does not align to an octet', () => {
    expect(calc('172.16.37.9/20')).toMatchObject({
      network: '172.16.32.0',
      broadcast: '172.16.47.255',
      firstHost: '172.16.32.1',
      lastHost: '172.16.47.254',
      usableHosts: 4094,
    });
  });
  it('handles /31, /32 and /0', () => {
    expect(calc('10.0.0.7/31')).toMatchObject({
      firstHost: '10.0.0.6',
      lastHost: '10.0.0.7',
      usableHosts: 2,
    });
    expect(calc('8.8.8.8/32')).toMatchObject({
      firstHost: '8.8.8.8',
      lastHost: '8.8.8.8',
      usableHosts: 1,
      type: 'Public',
    });
    expect(calc('1.2.3.4/0')).toMatchObject({
      network: '0.0.0.0',
      broadcast: '255.255.255.255',
      totalAddresses: 4294967296,
    });
  });
  it('classifies special ranges', () => {
    expect(calc('100.72.1.1/10').type).toMatch(/CGNAT/);
    expect(calc('127.0.0.1/8').type).toBe('Loopback');
    expect(calc('172.32.0.1/16').type).toBe('Public');
    expect(calc('224.0.0.1/4').addressClass).toBe('D (multicast)');
  });
  it('shows binary forms', () => {
    expect(calc('192.168.1.1/24').binaryMask).toBe('11111111.11111111.11111111.00000000');
  });
});

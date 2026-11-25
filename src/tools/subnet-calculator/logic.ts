export function parseIPv4(input: string): number | null {
  const parts = input.trim().split('.');
  if (parts.length !== 4) return null;
  let n = 0;
  for (const p of parts) {
    if (!/^\d{1,3}$/.test(p) || (p.length > 1 && p.startsWith('0'))) return null;
    const v = Number(p);
    if (v > 255) return null;
    n = n * 256 + v;
  }
  return n >>> 0;
}

export function formatIPv4(n: number): string {
  return [24, 16, 8, 0].map((s) => (n >>> s) & 255).join('.');
}

export function prefixToMask(prefix: number): number {
  return prefix === 0 ? 0 : (0xffffffff << (32 - prefix)) >>> 0;
}

/** Prefix length for a contiguous netmask such as 255.255.255.0, or null. */
export function maskToPrefix(mask: number): number | null {
  const inverted = ~mask >>> 0;
  if ((inverted & (inverted + 1)) !== 0) return null; // host bits must be contiguous ones
  return 32 - Math.log2(inverted + 1);
}

export function toBinary(n: number): string {
  return [24, 16, 8, 0].map((s) => ((n >>> s) & 255).toString(2).padStart(8, '0')).join('.');
}

export type ParsedCidr = { ok: true; ip: number; prefix: number } | { ok: false; message: string };

/** Accepts "10.0.0.5/24", "10.0.0.5 255.255.255.0", "10.0.0.5/255.255.255.0" or an IP plus a fallback prefix. */
export function parseCidr(input: string, fallbackPrefix = 24): ParsedCidr {
  const text = input.trim();
  const [ipText = '', suffix] = text.split(/\s*\/\s*|\s+/);
  const ip = parseIPv4(ipText);
  if (ip === null)
    return {
      ok: false,
      message: `"${ipText}" is not a valid IPv4 address (four numbers from 0 to 255).`,
    };
  if (suffix === undefined || suffix === '') return { ok: true, ip, prefix: fallbackPrefix };
  if (/^\d{1,2}$/.test(suffix)) {
    const prefix = Number(suffix);
    if (prefix > 32) return { ok: false, message: 'The prefix length must be between 0 and 32.' };
    return { ok: true, ip, prefix };
  }
  const mask = parseIPv4(suffix);
  const prefix = mask === null ? null : maskToPrefix(mask);
  if (prefix === null)
    return {
      ok: false,
      message: `"${suffix}" is not a valid subnet mask (ones must be contiguous).`,
    };
  return { ok: true, ip, prefix };
}

export type AddressType =
  | 'Private (RFC 1918)'
  | 'Public'
  | 'Loopback'
  | 'Link-local'
  | 'Shared address space (CGNAT, RFC 6598)'
  | 'Multicast'
  | 'Reserved'
  | 'This network'
  | 'Documentation (RFC 5737)';

const RANGES: [string, number, AddressType][] = [
  ['10.0.0.0', 8, 'Private (RFC 1918)'],
  ['172.16.0.0', 12, 'Private (RFC 1918)'],
  ['192.168.0.0', 16, 'Private (RFC 1918)'],
  ['127.0.0.0', 8, 'Loopback'],
  ['169.254.0.0', 16, 'Link-local'],
  ['100.64.0.0', 10, 'Shared address space (CGNAT, RFC 6598)'],
  ['192.0.2.0', 24, 'Documentation (RFC 5737)'],
  ['198.51.100.0', 24, 'Documentation (RFC 5737)'],
  ['203.0.113.0', 24, 'Documentation (RFC 5737)'],
  ['224.0.0.0', 4, 'Multicast'],
  ['240.0.0.0', 4, 'Reserved'],
  ['0.0.0.0', 8, 'This network'],
];

export function addressType(ip: number): AddressType {
  for (const [net, prefix, type] of RANGES) {
    const mask = prefixToMask(prefix);
    if ((ip & mask) >>> 0 === parseIPv4(net)) return type;
  }
  return 'Public';
}

export function addressClass(ip: number): 'A' | 'B' | 'C' | 'D (multicast)' | 'E (reserved)' {
  const first = ip >>> 24;
  if (first < 128) return 'A';
  if (first < 192) return 'B';
  if (first < 224) return 'C';
  if (first < 240) return 'D (multicast)';
  return 'E (reserved)';
}

export interface SubnetInfo {
  address: string;
  prefix: number;
  cidr: string;
  netmask: string;
  wildcard: string;
  network: string;
  broadcast: string;
  firstHost: string;
  lastHost: string;
  totalAddresses: number;
  usableHosts: number;
  addressClass: ReturnType<typeof addressClass>;
  type: AddressType;
  binaryAddress: string;
  binaryMask: string;
}

export function calculateSubnet(ip: number, prefix: number): SubnetInfo {
  const mask = prefixToMask(prefix);
  const network = (ip & mask) >>> 0;
  const broadcast = (network | (~mask >>> 0)) >>> 0;
  const total = 2 ** (32 - prefix);
  let first = network;
  let last = broadcast;
  let usable = total;
  if (prefix <= 30) {
    first = network + 1;
    last = broadcast - 1;
    usable = total - 2;
  } // /31 (RFC 3021 point-to-point) uses both addresses; /32 is a single host.
  return {
    address: formatIPv4(ip),
    prefix,
    cidr: `${formatIPv4(network)}/${prefix}`,
    netmask: formatIPv4(mask),
    wildcard: formatIPv4(~mask >>> 0),
    network: formatIPv4(network),
    broadcast: formatIPv4(broadcast),
    firstHost: formatIPv4(first),
    lastHost: formatIPv4(last),
    totalAddresses: total,
    usableHosts: usable,
    addressClass: addressClass(ip),
    type: addressType(ip),
    binaryAddress: toBinary(ip),
    binaryMask: toBinary(mask),
  };
}

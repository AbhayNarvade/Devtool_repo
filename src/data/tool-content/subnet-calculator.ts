import { brandTitle } from '@/config/site';
import type { Tool } from '../types';

export const subnetCalculator: Tool = {
  slug: 'subnet-calculator',
  category: 'developer-tools',
  name: 'Subnet Calculator',
  h1: 'IPv4 Subnet Calculator (CIDR)',
  metaTitle: brandTitle('Subnet Calculator: IPv4 CIDR & Netmask Tool'),
  metaDescription:
    'IPv4 subnet calculator: enter an IP with CIDR or netmask to get the network, broadcast, wildcard mask, usable host range and host count. Free, instant, private.',
  primaryKeyword: 'subnet calculator',
  secondaryKeywords: [
    'cidr calculator',
    'ip subnet calculator',
    'netmask calculator',
    'ipv4 calculator',
    'wildcard mask',
  ],
  intro:
    'This IPv4 subnet calculator takes an address with a CIDR prefix or subnet mask and shows the network and broadcast addresses, usable host range, host count, wildcard mask and binary breakdown.',
  cardDescription: 'Calculate IPv4 network, broadcast and host ranges.',
  icon: 'network',
  howToSteps: [
    'Type an IPv4 address with a prefix (10.0.12.5/22) or a mask (10.0.12.5 255.255.252.0), or load the sample.',
    'Or type only the address and choose the prefix from the list.',
    'Read the network address, broadcast address, usable host range and number of hosts.',
    'Use the wildcard mask for ACLs and the binary rows to see exactly which bits belong to the network.',
    'Copy all results with one click.',
  ],
  contentSections: [
    {
      heading: 'What does a subnet calculator do?',
      kind: 'concept',
      body: `An IPv4 address is a 32-bit number, written as four decimal octets such as \`192.168.10.77\`. A subnet divides that number into two parts: the **network** part, which is the same for every device in the subnet, and the **host** part, which identifies a single device. The **prefix length** in CIDR notation (Classless Inter-Domain Routing) says how many leading bits belong to the network: in \`192.168.10.77/26\`, the first 26 bits are the network and the last 6 bits are for hosts.

A subnet calculator does the bitwise arithmetic for you:

- **Network address**: the IP with all host bits set to 0, the identifier of the subnet.
- **Broadcast address**: all host bits set to 1, which reaches every device in the subnet.
- **Usable host range**: everything between the two. A subnet with *n* host bits has 2ⁿ addresses and 2ⁿ − 2 usable hosts.
- **Subnet mask**: the prefix written as an address, such as \`255.255.255.192\` for /26.
- **Wildcard mask**: the inverted mask (\`0.0.0.63\`), used in Cisco ACLs and OSPF configuration.

Two prefixes are special. A **/31** has no network or broadcast address: RFC 3021 allows both addresses to be used on point-to-point links. A **/32** describes a single host, used for loopbacks and host routes.

### Private and special ranges

The calculator also tells you what kind of address you entered. RFC 1918 reserves \`10.0.0.0/8\`, \`172.16.0.0/12\` and \`192.168.0.0/16\` for private networks; \`100.64.0.0/10\` is shared address space for carrier-grade NAT; \`127.0.0.0/8\` is loopback and \`169.254.0.0/16\` is link-local.`,
    },
    {
      heading: 'Subnetting example',
      kind: 'examples',
      body: `For \`192.168.10.77/26\`:

\`\`\`text
Address      192.168.10.77     11000000.10101000.00001010.01001101
Netmask      255.255.255.192   11111111.11111111.11111111.11000000
Network      192.168.10.64     (host bits set to 0)
Broadcast    192.168.10.127    (host bits set to 1)
Hosts        192.168.10.65 – 192.168.10.126  (62 usable)
\`\`\`

### Quick reference

| Prefix | Mask | Addresses | Usable hosts |
| --- | --- | --- | --- |
| /30 | 255.255.255.252 | 4 | 2 |
| /29 | 255.255.255.248 | 8 | 6 |
| /28 | 255.255.255.240 | 16 | 14 |
| /27 | 255.255.255.224 | 32 | 30 |
| /26 | 255.255.255.192 | 64 | 62 |
| /24 | 255.255.255.0 | 256 | 254 |
| /22 | 255.255.252.0 | 1,024 | 1,022 |
| /16 | 255.255.0.0 | 65,536 | 65,534 |`,
    },
    {
      heading: 'Subnetting tips',
      kind: 'tips',
      body: `- **Cloud providers reserve extra addresses.** AWS reserves 5 addresses in every VPC subnet and Azure also reserves 5, so a /28 gives 11 usable addresses there, not 14.
- **Plan for growth.** Choose a prefix with room for at least twice the hosts you expect; renumbering a network later is painful.
- **Subnets must not overlap** if they are connected by routing or VPN. Check new ranges against existing ones, including home networks of remote staff (\`192.168.0.0/24\` and \`192.168.1.0/24\` are extremely common).
- **Masks must be contiguous.** \`255.255.0.255\` is not a valid subnet mask; the calculator reports such input as invalid.
- **Leading zeros are rejected** (\`010.0.0.1\`), because some software reads them as octal numbers, which is a known source of security bugs.
- This tool covers IPv4. IPv6 subnets are almost always /64 for LANs and do not use broadcast addresses.`,
    },
  ],
  features: [
    'Accepts CIDR (10.0.0.1/24), dotted masks (255.255.255.0) or a prefix chosen from a list.',
    'Network, broadcast, first and last usable host, and host counts.',
    'Subnet mask, wildcard mask and binary representation of address and mask.',
    'Correct handling of /31 point-to-point links (RFC 3021) and /32 host routes.',
    'Identifies private, public, loopback, link-local, CGNAT, multicast and documentation ranges.',
    'Copy all results as text.',
    'Fully unit-tested calculations that run in your browser.',
  ],
  faqs: [
    {
      question: 'How many usable hosts are in a /24?',
      answer:
        'A /24 has 256 addresses. The network and broadcast addresses cannot be assigned to hosts, so 254 are usable.',
    },
    {
      question: 'What is the difference between a subnet mask and a wildcard mask?',
      answer:
        'A subnet mask has 1 bits for the network part (255.255.255.0). A wildcard mask is its inverse, with 1 bits for the host part (0.0.0.255), and is used in Cisco access lists and OSPF.',
    },
    {
      question: 'What does /31 mean and can I use it?',
      answer:
        'A /31 contains two addresses. RFC 3021 allows both to be used as host addresses on point-to-point links, which saves addresses compared with a /30.',
    },
    {
      question: 'Which IP ranges are private?',
      answer:
        'RFC 1918 defines 10.0.0.0/8, 172.16.0.0/12 (172.16.0.0 to 172.31.255.255) and 192.168.0.0/16 as private ranges that are not routed on the public internet.',
    },
    {
      question: 'What is CIDR notation?',
      answer:
        'CIDR notation writes an address followed by a slash and the number of network bits, such as 10.0.0.0/8. It replaced the old class A, B and C system in 1993.',
    },
    {
      question: 'Does this calculator support IPv6?',
      answer:
        'No, it is designed for IPv4 subnetting, which is where host counts and broadcast addresses matter most.',
    },
  ],
  relatedSlugs: [
    'chmod-calculator',
    'cron-expression-generator',
    'unix-timestamp-converter',
    'hash-generator',
  ],
  schemaCategory: 'DeveloperApplication',
  lastUpdated: '2026-11-25',
};

export interface CaMatch {
  ca: string
  isFree: boolean
}

// Heuristic allowlist. NOTE: this matches on the issuer *name*, which is a
// proxy for cost, not ground truth. Free/automated CAs (DV, $0 issuance):
const FREE_CA_PATTERNS: string[] = [
  "let's encrypt",
  'isrg',
  'zerossl',
  'google trust services',
  'gts ',
  'cpanel',
  'amazon',
  'buypass go',
  'actalis free',
  'cloudflare',
]

// Canonical display names keyed by a lowercase substring found in issuer O or CN.
const CA_NAMES: Array<[string, string]> = [
  ["let's encrypt", "Let's Encrypt"],
  ['isrg', "Let's Encrypt"],
  ['zerossl', 'ZeroSSL'],
  ['google trust', 'Google Trust Services'],
  ['cpanel', 'cPanel'],
  ['amazon', 'Amazon'],
  ['digicert', 'DigiCert'],
  ['sectigo', 'Sectigo'],
  ['comodo', 'Sectigo (COMODO)'],
  ['globalsign', 'GlobalSign'],
  ['godaddy', 'GoDaddy'],
  ['starfield', 'GoDaddy (Starfield)'],
  ['entrust', 'Entrust'],
  ['geotrust', 'GeoTrust'],
  ['thawte', 'Thawte'],
  ['verisign', 'VeriSign'],
  ['symantec', 'Symantec'],
  ['ssl.com', 'SSL.com'],
  ['certum', 'Certum'],
  ['buypass', 'Buypass'],
  ['actalis', 'Actalis'],
  ['cloudflare', 'Cloudflare'],
]

function hay(o: string | null, cn: string): string {
  return `${o ?? ''} ${cn}`.toLowerCase()
}

export function isFreeCA(issuerOrganization: string | null, issuerCommonName: string): boolean {
  const h = hay(issuerOrganization, issuerCommonName)
  return FREE_CA_PATTERNS.some((p) => h.includes(p))
}

export function identifyCa(issuerOrganization: string | null, issuerCommonName: string): CaMatch {
  const h = hay(issuerOrganization, issuerCommonName)
  const hit = CA_NAMES.find(([sub]) => h.includes(sub))
  const ca = hit ? hit[1] : (issuerOrganization ?? issuerCommonName)
  return { ca, isFree: isFreeCA(issuerOrganization, issuerCommonName) }
}

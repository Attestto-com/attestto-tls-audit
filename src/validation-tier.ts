export type ValidationTier = 'DV' | 'OV' | 'EV' | 'unknown'

// CA/Browser Forum reserved certificate policy OIDs.
const CABF: Record<string, ValidationTier> = {
  '2.23.140.1.2.1': 'DV',
  '2.23.140.1.2.2': 'OV',
  '2.23.140.1.2.3': 'OV', // individual-validated, treated as OV-equivalent
  '2.23.140.1.1': 'EV',
}

export function isOrganizationValidated(subjectOrganization: string | null): boolean {
  return !!subjectOrganization && subjectOrganization.trim().length > 0
}

export function validationTier(
  policyOids: string[],
  subjectOrganization: string | null,
): ValidationTier {
  for (const oid of policyOids) {
    const tier = CABF[oid]
    if (tier) return tier
  }
  // Heuristic fallback (documented): no CABF policy OID present.
  return isOrganizationValidated(subjectOrganization) ? 'OV' : 'DV'
}

import type { ValidationTier } from './validation-tier.js'

export type { ValidationTier }

export interface TlsClassification {
  issuerCommonName: string
  issuerOrganization: string | null
  ca: string
  isFreeCA: boolean
  validationTier: ValidationTier
  isOrganizationValidated: boolean
  subjectCommonName: string
  subjectAltNames: string[]
  validFrom: string | null
  validTo: string | null
  daysToExpiry: number | null
  expired: boolean
  sha256: string
}

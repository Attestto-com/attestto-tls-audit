import type { CertificateInfo } from '@attestto/x509-core'
import { identifyCa } from './ca-registry.js'
import { validationTier, isOrganizationValidated } from './validation-tier.js'
import type { TlsClassification } from './types.js'

export async function sha256Hex(der: Uint8Array): Promise<string> {
  const buf = await crypto.subtle.digest('SHA-256', der as unknown as BufferSource)
  return [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, '0')).join('')
}

export function classifyCert(info: CertificateInfo, now: Date = new Date()): TlsClassification {
  const { ca, isFree } = identifyCa(info.issuerOrganization, info.issuerCommonName)
  const notAfter = info.validTo ? new Date(info.validTo) : null
  const daysToExpiry = notAfter
    ? Math.floor((notAfter.getTime() - now.getTime()) / 86_400_000)
    : null
  return {
    issuerCommonName: info.issuerCommonName,
    issuerOrganization: info.issuerOrganization,
    ca,
    isFreeCA: isFree,
    validationTier: validationTier(info.policyOids, info.organization),
    isOrganizationValidated: isOrganizationValidated(info.organization),
    subjectCommonName: info.commonName,
    subjectAltNames: info.subjectAltNames,
    validFrom: info.validFrom,
    validTo: info.validTo,
    daysToExpiry,
    expired: notAfter ? notAfter.getTime() < now.getTime() : false,
    // populated by classifyLeafDer/auditHost via sha256Hex(rawDer); '' when
    // classifying a parsed record without the raw bytes on hand.
    sha256: '',
  }
}

import { parseCertificate } from '@attestto/x509-core'
import { classifyCert, sha256Hex } from './classifier.js'
import type { TlsClassification } from './types.js'
import { fetchLiveCert } from './fetch-cert.js'

export interface TlsAuditResult extends TlsClassification {
  host: string
  tlsVersion: string | null
  servedChainAuthorized: boolean
  error?: string
}

/** Network-free core: parse a DER leaf → classify → fill sha256. */
export async function classifyLeafDer(
  leafDer: Uint8Array,
  now = new Date(),
): Promise<TlsClassification> {
  const info = parseCertificate(leafDer)
  const c = classifyCert(info, now)
  c.sha256 = await sha256Hex(leafDer)
  return c
}

export async function auditHost(host: string, now = new Date()): Promise<TlsAuditResult> {
  try {
    const live = await fetchLiveCert(host)
    const c = await classifyLeafDer(live.leafDer, now)
    return {
      host,
      tlsVersion: live.tlsVersion,
      servedChainAuthorized: live.servedChainAuthorized,
      ...c,
    }
  } catch (e) {
    return {
      host,
      tlsVersion: null,
      servedChainAuthorized: false,
      error: (e as Error).message,
      issuerCommonName: '',
      issuerOrganization: null,
      ca: '',
      isFreeCA: false,
      validationTier: 'unknown',
      isOrganizationValidated: false,
      subjectCommonName: '',
      subjectAltNames: [],
      validFrom: null,
      validTo: null,
      daysToExpiry: null,
      expired: false,
      sha256: '',
    }
  }
}

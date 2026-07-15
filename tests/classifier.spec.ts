import { describe, it, expect } from 'vitest'
import { classifyCert } from '../src/classifier.js'
import type { CertificateInfo } from '@attestto/x509-core'

const base: CertificateInfo = {
  commonName: 'hacienda.go.cr',
  organization: 'Ministerio de Hacienda',
  organizationalUnit: null,
  country: 'CR',
  serialNumber: 'ab',
  issuerCommonName: 'DigiCert SHA2 High Assurance Server CA',
  issuerOrganization: 'DigiCert Inc',
  validFrom: '2026-01-01T00:00:00Z',
  validTo: '2027-01-01T00:00:00Z',
  isCa: false,
  policyOids: ['2.23.140.1.2.2'],
  email: null,
  subjectAltNames: ['hacienda.go.cr'],
  keyUsage: [],
  extKeyUsage: ['serverAuth'],
  role: 'end-entity',
  rawDerHex: 'deadbeef',
}

describe('classifyCert', () => {
  it('classifies an OV DigiCert cert', () => {
    const c = classifyCert(base, new Date('2026-07-01T00:00:00Z'))
    expect(c.ca).toBe('DigiCert')
    expect(c.isFreeCA).toBe(false)
    expect(c.validationTier).toBe('OV')
    expect(c.isOrganizationValidated).toBe(true)
    expect(c.expired).toBe(false)
    expect(c.daysToExpiry).toBeGreaterThan(180)
  })
  it('flags an expired free DV cert', () => {
    const c = classifyCert(
      {
        ...base,
        issuerOrganization: "Let's Encrypt",
        issuerCommonName: 'R3',
        organization: null,
        policyOids: ['2.23.140.1.2.1'],
        validTo: '2026-03-01T00:00:00Z',
      },
      new Date('2026-07-01T00:00:00Z'),
    )
    expect(c.isFreeCA).toBe(true)
    expect(c.validationTier).toBe('DV')
    expect(c.isOrganizationValidated).toBe(false)
    expect(c.expired).toBe(true)
    expect(c.daysToExpiry).toBeLessThan(0)
  })
})

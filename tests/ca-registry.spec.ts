import { describe, it, expect } from 'vitest'
import { identifyCa, isFreeCA } from '../src/ca-registry.js'

describe('identifyCa', () => {
  it('classifies Let\'s Encrypt as free', () => {
    const m = identifyCa("Let's Encrypt", 'R3')
    expect(m.ca).toBe("Let's Encrypt")
    expect(m.isFree).toBe(true)
  })
  it('classifies DigiCert as paid', () => {
    expect(isFreeCA('DigiCert Inc', 'DigiCert SHA2 High Assurance Server CA')).toBe(false)
  })
  it('classifies cPanel AutoSSL as free', () => {
    expect(isFreeCA('cPanel, Inc.', 'cPanel, Inc. Certification Authority')).toBe(true)
  })
  it('falls back to issuer string when unknown', () => {
    const m = identifyCa('Nonexistent CA Ltd', 'Nonexistent Root')
    expect(m.ca).toBe('Nonexistent CA Ltd')
    expect(m.isFree).toBe(false)
  })
})

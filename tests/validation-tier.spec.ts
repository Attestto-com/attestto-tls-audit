import { describe, it, expect } from 'vitest'
import { validationTier, isOrganizationValidated } from '../src/validation-tier.js'

describe('validationTier', () => {
  it('detects DV from CABF DV OID', () => {
    expect(validationTier(['2.23.140.1.2.1'], null)).toBe('DV')
  })
  it('detects OV from CABF OV OID', () => {
    expect(validationTier(['2.23.140.1.2.2'], 'Banco Nacional de Costa Rica')).toBe('OV')
  })
  it('detects EV from CABF EV OID', () => {
    expect(validationTier(['2.23.140.1.1'], 'ACME S.A.')).toBe('EV')
  })
  it('falls back to OV heuristic when subject O present and no CABF OID', () => {
    expect(validationTier([], 'Some Org S.A.')).toBe('OV')
  })
  it('falls back to DV when no CABF OID and no subject O', () => {
    expect(validationTier([], null)).toBe('DV')
  })
})

describe('isOrganizationValidated', () => {
  it('true when subject O present', () => {
    expect(isOrganizationValidated('X S.A.')).toBe(true)
  })
  it('false when subject O empty', () => {
    expect(isOrganizationValidated(null)).toBe(false)
  })
})

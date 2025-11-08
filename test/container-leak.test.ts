import { describe, it, expect } from 'vitest'

describe('Leak?', () => {
  it('yes it leaks', () => {
    expect(true).toBe(true)
  })
})

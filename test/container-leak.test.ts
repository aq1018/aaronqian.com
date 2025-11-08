import { describe, expect, it } from 'vitest'

describe('Leak?', () => {
  it('yes it leaks', () => {
    expect(true).toBeTruthy()
  })
})

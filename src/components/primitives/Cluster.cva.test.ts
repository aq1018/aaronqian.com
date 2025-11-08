import { describe, expect, it } from 'vitest'

import { testDefaultVariants } from '@test/testHelpers'

import { clusterCva } from './Cluster.cva'

describe('Cluster.cva', () => {
  testDefaultVariants(clusterCva, ['inline-flex', 'gap-2', 'items-center'])

  describe('Edge Cases', () => {
    it('should handle undefined props gracefully', () => {
      const result = clusterCva({ space: undefined, align: undefined })
      expect(result).toBeTruthy()
      expect(result).toContain('inline-flex')
    })
  })
})

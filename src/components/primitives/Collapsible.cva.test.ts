import { describe, expect, it } from 'vitest'

import { collapsibleContentVariants, collapsibleVariants } from './Collapsible.cva'

import {
  testAllVariants,
  testBaseClasses,
  testCompoundVariants,
  testDefaultVariants,
  testEdgeCases,
} from '@test/testHelpers'

describe('Collapsible.cva', () => {
  describe('collapsibleVariants', () => {
    testBaseClasses(collapsibleVariants, ['grid', 'collapsible-wrapper'])

    testDefaultVariants(collapsibleVariants, [
      'transition-[grid-template-rows]',
      'ease-out',
      'duration-300',
    ])

    describe('Speed Variants', () => {
      testAllVariants(collapsibleVariants, 'speed', ['fast', 'normal', 'slow'])

      it('should apply fast speed (150ms)', () => {
        expect(collapsibleVariants({ speed: 'fast' })).toContainClasses([
          'transition-[grid-template-rows]',
          'ease-out',
          'duration-150',
        ])
      })

      it('should apply normal speed (300ms)', () => {
        expect(collapsibleVariants({ speed: 'normal' })).toContainClasses([
          'transition-[grid-template-rows]',
          'ease-out',
          'duration-300',
        ])
      })

      it('should apply slow speed (500ms)', () => {
        expect(collapsibleVariants({ speed: 'slow' })).toContainClasses([
          'transition-[grid-template-rows]',
          'ease-out',
          'duration-500',
        ])
      })
    })

    describe('Bordered Variant', () => {
      it('should generate valid classes for bordered true', () => {
        const result = collapsibleVariants({ bordered: true })
        expect(result).toBeTruthy()
      })

      it('should generate valid classes for bordered false', () => {
        const result = collapsibleVariants({ bordered: false })
        expect(result).toBeTruthy()
      })

      it('should apply border styles when bordered is true', () => {
        expect(collapsibleVariants({ bordered: true })).toContainClasses([
          'rounded-lg',
          'border',
          'border-border',
        ])
      })

      it('should not apply border styles when bordered is false', () => {
        const result = collapsibleVariants({ bordered: false })
        expect(result).not.toContain('border')
        expect(result).not.toContain('rounded-lg')
      })
    })

    // Note: testCompoundVariants only supports string arrays, boolean props omitted
    testCompoundVariants(collapsibleVariants, {
      speed: ['fast', 'normal', 'slow'],
    })

    testEdgeCases(collapsibleVariants, { speed: 'normal', bordered: false }, [
      'grid',
      'duration-300',
    ])

    describe('CSS Grid Architecture', () => {
      it('should use grid-template-rows transition', () => {
        expect(collapsibleVariants()).toContainClasses(['transition-[grid-template-rows]'])
      })

      it('should use ease-out timing function for natural motion', () => {
        expect(collapsibleVariants()).toContainClasses(['ease-out'])
      })

      it('should use grid display mode', () => {
        expect(collapsibleVariants()).toContainClasses(['grid'])
      })

      it('should support configurable animation duration via speed variant', () => {
        expect(collapsibleVariants({ speed: 'fast' })).toContainClasses(['duration-150'])
        expect(collapsibleVariants({ speed: 'normal' })).toContainClasses(['duration-300'])
        expect(collapsibleVariants({ speed: 'slow' })).toContainClasses(['duration-500'])
      })
    })
  })

  describe('collapsibleContentVariants', () => {
    testBaseClasses(collapsibleContentVariants, ['overflow-hidden', 'collapsible-content'])

    it('should include overflow hidden for grid technique', () => {
      expect(collapsibleContentVariants()).toContainClasses(['overflow-hidden'])
    })

    it('should include collapsible-content class for CSS selectors', () => {
      expect(collapsibleContentVariants()).toContainClasses(['collapsible-content'])
    })

    it('should merge custom classes with base classes', () => {
      expect(collapsibleContentVariants({ class: 'custom-class' })).toContainClasses([
        'custom-class',
        'overflow-hidden',
        'collapsible-content',
      ])
    })
  })
})

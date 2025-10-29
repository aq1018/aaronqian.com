import { describe, expect, it } from 'vitest'

import { textVariants } from './typography.cva'

import { testAllVariants, testDefaultVariants, testEdgeCases } from '@test/testHelpers'

describe('Text.cva (textVariants)', () => {
  testDefaultVariants(textVariants, [
    'text-base', // size: body
    'leading-7',
    'text-inherit', // color: inherit
  ])

  describe('Size Variants', () => {
    testAllVariants(textVariants, 'size', [
      'lead',
      'body',
      'body-dense',
      'small',
      'small-dense',
      'micro',
      'label-lg',
      'label',
      'label-sm',
      'xl',
      '2xl',
    ])

    it('should apply lead size', () => {
      expect(textVariants({ size: 'lead' })).toContainClasses(['text-lg', 'leading-8'])
    })

    it('should apply body size', () => {
      expect(textVariants({ size: 'body' })).toContainClasses(['text-base', 'leading-7'])
    })

    it('should apply small size', () => {
      expect(textVariants({ size: 'small' })).toContainClasses(['text-sm', 'leading-6'])
    })

    it('should apply label-lg with tracking', () => {
      expect(textVariants({ size: 'label-lg' })).toContainClasses([
        'text-base',
        'leading-6',
        'tracking-wide',
      ])
    })

    it('should apply label-sm with wider tracking', () => {
      expect(textVariants({ size: 'label-sm' })).toContainClasses([
        'text-xs',
        'leading-4',
        'tracking-wider',
      ])
    })
  })

  describe('Align Variants', () => {
    testAllVariants(textVariants, 'align', ['start', 'center', 'end', 'justify'])

    it('should apply center alignment', () => {
      expect(textVariants({ align: 'center' })).toContainClasses(['text-center'])
    })

    it('should apply justify alignment', () => {
      expect(textVariants({ align: 'justify' })).toContainClasses(['text-justify'])
    })
  })

  describe('Color Variants', () => {
    testAllVariants(textVariants, 'color', [
      'inherit',
      'default',
      'muted',
      'primary',
      'secondary',
      'accent',
      'success',
      'warning',
      'danger',
      'info',
    ])

    it('should apply default color', () => {
      expect(textVariants({ color: 'default' })).toContainClasses(['text-content'])
    })

    it('should apply muted color', () => {
      expect(textVariants({ color: 'muted' })).toContainClasses(['text-muted'])
    })

    it('should apply primary color', () => {
      expect(textVariants({ color: 'primary' })).toContainClasses(['text-primary'])
    })
  })

  describe('Family Variants', () => {
    testAllVariants(textVariants, 'family', ['inherit', 'sans', 'mono'])

    it('should apply sans family', () => {
      expect(textVariants({ family: 'sans' })).toContainClasses(['font-sans'])
    })

    it('should apply mono family', () => {
      expect(textVariants({ family: 'mono' })).toContainClasses(['font-mono'])
    })

    it('should not add classes for inherit family', () => {
      const result = textVariants({ family: 'inherit' })
      expect(result).not.toContain('font-sans')
      expect(result).not.toContain('font-mono')
    })
  })

  describe('Boolean Style Variants', () => {
    it('should not apply uppercase by default', () => {
      const result = textVariants()
      expect(result).not.toContain('uppercase')
    })

    it('should apply uppercase when true', () => {
      expect(textVariants({ uppercase: true })).toContainClasses(['uppercase'])
    })

    it('should not apply strong by default', () => {
      const result = textVariants()
      expect(result).not.toContain('font-semibold')
    })

    it('should apply strong when true', () => {
      expect(textVariants({ strong: true })).toContainClasses(['font-semibold'])
    })

    it('should not apply italic by default', () => {
      const result = textVariants()
      expect(result).not.toContain('italic')
    })

    it('should apply italic when true', () => {
      expect(textVariants({ italic: true })).toContainClasses(['italic'])
    })

    it('should not apply strike by default', () => {
      const result = textVariants()
      expect(result).not.toContain('line-through')
    })

    it('should apply strike when true', () => {
      expect(textVariants({ strike: true })).toContainClasses(['line-through'])
    })

    it('should combine all boolean styles', () => {
      expect(
        textVariants({
          uppercase: true,
          strong: true,
          italic: true,
          strike: true,
        }),
      ).toContainClasses(['uppercase', 'font-semibold', 'italic', 'line-through'])
    })
  })

  describe('Whitespace Variants', () => {
    testAllVariants(textVariants, 'whitespace', ['normal', 'nowrap'])

    it('should apply normal whitespace', () => {
      expect(textVariants({ whitespace: 'normal' })).toContainClasses(['whitespace-normal'])
    })

    it('should apply nowrap whitespace', () => {
      expect(textVariants({ whitespace: 'nowrap' })).toContainClasses(['whitespace-nowrap'])
    })
  })

  describe('Truncate Variants', () => {
    it('should not apply truncate by default', () => {
      const result = textVariants()
      expect(result).not.toContain('truncate')
    })

    it('should apply truncate when true', () => {
      expect(textVariants({ truncate: true })).toContainClasses(['truncate'])
    })
  })

  describe('Break Variants', () => {
    testAllVariants(textVariants, 'break', ['normal', 'words', 'all'])

    it('should apply normal break', () => {
      expect(textVariants({ break: 'normal' })).toContainClasses(['break-normal'])
    })

    it('should apply words break', () => {
      expect(textVariants({ break: 'words' })).toContainClasses(['break-words'])
    })

    it('should apply all break', () => {
      expect(textVariants({ break: 'all' })).toContainClasses(['break-all'])
    })
  })

  describe('Transform Variants', () => {
    testAllVariants(textVariants, 'transform', ['none', 'capitalize', 'uppercase', 'lowercase'])

    it('should apply capitalize transform', () => {
      expect(textVariants({ transform: 'capitalize' })).toContainClasses(['capitalize'])
    })

    it('should apply uppercase transform', () => {
      expect(textVariants({ transform: 'uppercase' })).toContainClasses(['uppercase'])
    })

    it('should apply lowercase transform', () => {
      expect(textVariants({ transform: 'lowercase' })).toContainClasses(['lowercase'])
    })
  })

  testEdgeCases(textVariants, { size: 'body', color: 'inherit' }, ['text-base', 'leading-7'])

  describe('Combined Props', () => {
    it('should work with multiple props combined', () => {
      expect(
        textVariants({
          size: 'small',
          color: 'muted',
          strong: true,
          uppercase: true,
          align: 'center',
        }),
      ).toContainClasses(['text-sm', 'text-muted', 'font-semibold', 'uppercase', 'text-center'])
    })
  })

  describe('Label Variants Consistency', () => {
    it('should apply proper tracking for all label variants', () => {
      const labelLg = textVariants({ size: 'label-lg' })
      const label = textVariants({ size: 'label' })
      const labelSm = textVariants({ size: 'label-sm' })

      expect(labelLg).toContain('tracking-wide')
      expect(label).toContain('tracking-wide')
      expect(labelSm).toContain('tracking-wider')
    })
  })

  describe('Semantic Usage', () => {
    it('should provide appropriate styles for muted secondary text', () => {
      expect(textVariants({ size: 'small', color: 'muted' })).toContainClasses([
        'text-sm',
        'text-muted',
      ])
    })

    it('should provide appropriate styles for emphasized text', () => {
      expect(textVariants({ strong: true, color: 'default' })).toContainClasses([
        'font-semibold',
        'text-content',
      ])
    })

    it('should provide appropriate styles for uppercase labels', () => {
      expect(textVariants({ size: 'label', uppercase: true })).toContainClasses([
        'text-sm',
        'uppercase',
        'tracking-wide',
      ])
    })
  })
})

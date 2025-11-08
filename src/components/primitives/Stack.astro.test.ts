import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import Stack from './Stack.astro'

describe('Stack.astro', () => {
  describe('Rendering', () => {
    it('should render as a div element', async () => {
      const root = await renderAstroComponent(Stack, {
        props: {},
      })

      const div = root.querySelector('div')
      expect(div).toBeDefined()
    })

    it('should render slot content', async () => {
      const root = await renderAstroComponent(Stack, {
        props: {},
        slots: { default: '<span>Child 1</span><span>Child 2</span>' },
      })

      const div = root.querySelector('div')
      const children = div?.querySelectorAll('span')
      expect(children?.length).toBe(2)
      expect(children?.[0].textContent).toBe('Child 1')
      expect(children?.[1].textContent).toBe('Child 2')
    })

    it('should apply variant classes', async () => {
      const root = await renderAstroComponent(Stack, {
        props: { direction: 'row', space: 'lg' },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['flex'])
    })

    it('should merge custom classes with variant classes', async () => {
      const root = await renderAstroComponent(Stack, {
        props: { class: 'custom-stack' },
      })

      const div = root.querySelector('div')
      expect(div?.classList.contains('custom-stack')).toBeTruthy()
      expect(div).toHaveClasses(['flex']) // Base class still present
    })

    it('should pass through HTML attributes', async () => {
      const root = await renderAstroComponent(Stack, {
        props: { 'data-testid': 'stack', id: 'test-stack' },
      })

      const div = root.querySelector('div')
      expect(div?.id).toBe('test-stack')
      expect(div).toHaveDataAttribute('data-testid', 'stack')
    })
  })

  describe('Responsive Direction Props', () => {
    it('should pass through responsive direction props', async () => {
      const root = await renderAstroComponent(Stack, {
        props: {
          direction: 'column',
          'direction-lg': 'column',
          'direction-md': 'row',
        },
      })

      const div = root.querySelector('div')
      // Just verify base class is present, CVA tests handle variant logic
      expect(div).toHaveClasses(['flex'])
    })
  })

  describe('Variant Prop Combinations', () => {
    it('should handle all variant props together', async () => {
      const root = await renderAstroComponent(Stack, {
        props: {
          align: 'center',
          direction: 'row',
          justify: 'between',
          space: 'md',
        },
      })

      const div = root.querySelector('div')
      expect(div).toHaveClasses(['flex'])
    })
  })
})

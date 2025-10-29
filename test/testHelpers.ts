import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { isAstroComponentFactory } from 'astro/runtime/server/render/astro/factory.js'
import type { VariantProps } from 'class-variance-authority'
import type { ClassValue } from 'clsx'
import { describe, expect, it } from 'vitest'

type WithClass<T> = T & { class?: ClassValue | null }
type CVAFn = (props?: Record<string, unknown>) => string
type VariantsOf<TFn extends CVAFn> = VariantProps<TFn>
type Entry<TFn extends CVAFn> = {
  [K in keyof VariantsOf<TFn>]: readonly [K, VariantsOf<TFn>[K]]
}[keyof VariantsOf<TFn>]

function makeEntries<TFn extends CVAFn>(
  keys: Array<keyof VariantsOf<TFn>>,
  combo: unknown[],
): ReadonlyArray<Entry<TFn>> {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- audited cast
  return keys.map((k, i) => [k, combo[i]] as const) as ReadonlyArray<Entry<TFn>>
}

/**
 * Renders an Astro component to a DOM element for testing.
 *
 * @param component - The Astro component to render
 * @param options - Optional props and slots to pass to the component
 * @returns HTMLDivElement containing the rendered component
 *
 * @example
 * ```ts
 * import Component from '@/components/MyComponent.astro'
 * const root = await renderAstroComponent(Component, {
 *   props: { title: 'Hello' },
 *   slots: { default: '<p>Content</p>' }
 * })
 * expect(root.querySelector('h1')).toHaveTextContent('Hello')
 * ```
 */
export async function renderAstroComponent(
  component: unknown,
  options?: { props?: Record<string, unknown>; slots?: Record<string, string> },
): Promise<HTMLDivElement> {
  if (!isAstroComponentFactory(component)) {
    throw new TypeError(
      'renderAstroComponent: `component` must be a function or object exported by an .astro file.',
    )
  }

  const container = await AstroContainer.create()
  const result = await container.renderToString(component, options)
  const div = document.createElement('div')
  div.innerHTML = result
  return div
}

// ============================================================================
// CVA Test Utilities
// ============================================================================

/**
 * Test that a CVA function includes all base classes
 *
 * @param variantFn - The CVA variant function to test
 * @param baseClasses - Array of expected base classes
 *
 * @example
 * ```ts
 * testBaseClasses(badgeVariants, ['inline-flex', 'items-center', 'rounded'])
 * ```
 */
export function testBaseClasses(variantFn: CVAFn, baseClasses: string[]): void {
  describe('Base Classes', () => {
    it('should include base classes in all variants', () => {
      const result = variantFn()
      expect(result).toContainClasses(baseClasses)
    })
  })
}

/**
 * Test all values for a single variant prop
 *
 * @param variantFn - The CVA variant function to test
 * @param propName - The name of the variant prop
 * @param values - Array of valid values for the prop
 *
 * @example
 * ```ts
 * testAllVariants(badgeVariants, 'size', ['sm', 'md', 'lg'])
 * ```
 */
export function testAllVariants<TFn extends CVAFn, K extends keyof VariantProps<TFn>>(
  variantFn: TFn,
  propName: K,
  values: ReadonlyArray<VariantProps<TFn>[K]>,
): void {
  describe(`${propName.toString().charAt(0).toUpperCase() + propName.toString().slice(1)} Variants`, () => {
    it(`should generate valid classes for all ${propName.toString()} variants`, () => {
      values.forEach((value) => {
        const result = variantFn({ [propName]: value })
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })
}

/**
 * Test compound variants (cartesian product of multiple props)
 *
 * @param variantFn - The CVA variant function to test
 * @param variantCombinations - Object mapping prop names to arrays of values
 *
 * @example
 * ```ts
 * testCompoundVariants(badgeVariants, {
 *   variant: ['solid', 'outline'] as const,
 *   color: ['primary', 'accent'] as const
 * })
 * ```
 */
export function testCompoundVariants<TFn extends CVAFn>(
  variantFn: TFn,
  variantCombinations: {
    [K in keyof VariantsOf<TFn>]?: ReadonlyArray<VariantsOf<TFn>[K]>
  },
): void {
  const keys = Object.keys(variantCombinations)
  const lists = keys.map((k) => variantCombinations[k] ?? [])
  const combos = lists.reduce<unknown[][]>(
    (acc, curr) =>
      acc.length > 0 ? acc.flatMap((a) => curr.map((v) => [...a, v])) : curr.map((v) => [v]),
    [],
  )

  describe('Variant Combinations', () => {
    it('should generate valid classes for all variant combinations', () => {
      combos.forEach((combo) => {
        // Build entries with proper key/value relation using `satisfies`
        const entries = makeEntries(keys, combo)
        const props = Object.fromEntries(entries)
        const result = variantFn(props)
        expect(result).toBeTruthy()
        expect(typeof result).toBe('string')
        expect(result.length).toBeGreaterThan(0)
      })
    })
  })
}
/**
 * Test that default variants are applied correctly
 *
 * @param variantFn - The CVA variant function to test
 * @param expectedClasses - Classes that should be present with default variants
 *
 * @example
 * ```ts
 * testDefaultVariants(badgeVariants, ['bg-primary', 'text-primary-content'])
 * ```
 */
export function testDefaultVariants(variantFn: CVAFn, expectedClasses: string[]): void {
  describe('Default Variants', () => {
    it('should apply default variants with empty object', () => {
      const result = variantFn({})
      expect(result).toContainClasses(expectedClasses)
    })
    it('should apply default variants with no arguments', () => {
      const result = variantFn()
      expect(result).toContainClasses(expectedClasses)
    })
  })
}

/**
 * Test edge cases (undefined, null, empty values)
 *
 * @param variantFn - The CVA variant function to test
 * @param props - Object with prop names and their types
 * @param defaultClasses - Classes that should be present when using defaults
 *
 * @example
 * ```ts
 * testEdgeCases(badgeVariants, { size: 'sm', variant: 'solid' }, ['bg-primary'])
 * ```
 */
export function testEdgeCases<TFn extends CVAFn>(
  variantFn: TFn,
  props: Partial<WithClass<VariantProps<TFn>>>,
  defaultClasses: string[],
): void {
  describe('Edge Cases', () => {
    Object.keys(props).forEach((propName) => {
      it(`should handle undefined ${propName} (use default)`, () => {
        const result = variantFn({ [propName]: undefined })
        expect(result).toContainClasses(defaultClasses)
      })
    })

    it('should handle empty object (use all defaults)', () => {
      const result = variantFn({})
      expect(result).toContainClasses(defaultClasses)
    })

    it('should handle null class gracefully', () => {
      const result = variantFn({ class: null })
      expect(result).toBeTruthy()
    })

    it('should handle empty string class gracefully', () => {
      const result = variantFn({ class: '' })
      expect(result).toBeTruthy()
    })
  })
}

// ============================================================================
// Hook Test Utilities
// ============================================================================

/**
 * Setup DOM for hook testing with automatic cleanup tracking
 *
 * @param html - HTML string to set as document.body.innerHTML
 * @returns Cleanup function to reset DOM
 *
 * @example
 * ```ts
 * const cleanup = setupTestDOM('<button data-toggle>Toggle</button>')
 * // ... run tests
 * cleanup()
 * ```
 */
export function setupTestDOM(html: string): () => void {
  document.body.innerHTML = html

  return () => {
    document.body.innerHTML = ''
  }
}

/**
 * Verify that a cleanup function removes event listeners
 *
 * @param cleanup - The cleanup function to test
 * @param element - Element to check for event listeners
 * @param eventType - Type of event to verify was removed
 *
 * @example
 * ```ts
 * const button = document.querySelector('button')!
 * expectEventListenersRemoved(cleanup, button, 'click')
 * ```
 */
export function expectEventListenersRemoved(
  cleanup: () => void,
  element: Element,
  eventType: string,
): void {
  let eventFired = false
  const testHandler = () => {
    eventFired = true
  }

  element.addEventListener(eventType, testHandler)
  cleanup()

  // Dispatch event and verify it doesn't fire
  element.dispatchEvent(new Event(eventType))
  expect(eventFired).toBe(false)

  // Clean up test listener
  element.removeEventListener(eventType, testHandler)
}

/**
 * Simulate a DOM event with custom event init
 *
 * @param element - Element to dispatch event on
 * @param eventType - Type of event (click, input, etc.)
 * @param eventInit - Optional EventInit properties
 *
 * @example
 * ```ts
 * simulateEvent(button, 'click')
 * simulateEvent(input, 'input', { bubbles: true })
 * ```
 */
export function simulateEvent(element: Element, eventType: string, eventInit?: EventInit): void {
  const event = new Event(eventType, { bubbles: true, cancelable: true, ...eventInit })
  element.dispatchEvent(event)
}

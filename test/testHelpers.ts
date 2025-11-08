import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import { isAstroComponentFactory } from 'astro/runtime/server/render/astro/factory.js'
import { describe, expect, it } from 'vitest'

type CVAFn = (props?: Record<string, unknown>) => string

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
  describe('default Variants', () => {
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
  expect(eventFired).toBeFalsy()

  // Clean up test listener
  element.removeEventListener(eventType, testHandler)
}

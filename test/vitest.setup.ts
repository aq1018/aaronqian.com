import { expect } from 'vitest'

interface MatcherResult {
  pass: boolean
  message: () => string
  actual?: unknown
  expected?: unknown
}

// Extend Vitest matchers with custom assertions
expect.extend({
  /**
   * Assert that a class string contains all expected classes
   * @example expect(cvaResult).toContainClasses(['flex', 'items-center'])
   */
  toContainClasses(received: string, expected: string[]): MatcherResult {
    const missing = expected.filter((className) => !received.includes(className))

    return {
      pass: missing.length === 0,
      message: () =>
        missing.length === 0
          ? `Expected classes not to be in "${received}"`
          : `Expected classes ${missing.map((c) => `"${c}"`).join(', ')} to be in "${received}"`,
      actual: received,
      expected,
    }
  },

  /**
   * Assert that a CVA function with given props returns expected classes
   * @example expect(badgeVariants).toHaveAllVariantClasses({ size: 'sm' }, ['text-xs'])
   */
  toHaveAllVariantClasses(
    received: (props?: Record<string, unknown>) => string,
    props: Record<string, unknown>,
    expected: string[],
  ): MatcherResult {
    const result = received(props)
    const missing = expected.filter((className) => !result.includes(className))

    return {
      pass: missing.length === 0,
      message: () =>
        missing.length === 0
          ? `Expected variant classes not to be in result`
          : `Expected variant classes ${missing.map((c) => `"${c}"`).join(', ')} to be in result with props ${JSON.stringify(props)}`,
      actual: result,
      expected,
    }
  },

  /**
   * Assert that an element exists in the rendered component
   * @example expect(root).toRenderElement('[data-testid="badge"]')
   */
  toRenderElement(received: HTMLElement, selector: string): MatcherResult {
    const element = received.querySelector(selector)
    const exists = element !== null

    return {
      pass: exists,
      message: () =>
        exists
          ? `Expected element "${selector}" not to exist`
          : `Expected element "${selector}" to exist in rendered component`,
      actual: element,
      expected: selector,
    }
  },

  /**
   * Assert that an element has a data attribute with optional value check
   * @example expect(element).toHaveDataAttribute('data-state', 'open')
   */
  toHaveDataAttribute(
    received: Element | null,
    attribute: string,
    expectedValue?: string,
  ): MatcherResult {
    if (received === null) {
      return {
        pass: false,
        message: () => `Expected element to exist, but got null`,
        actual: received,
        expected: attribute,
      }
    }

    const actualValue = received.getAttribute(attribute)
    const hasAttribute = actualValue !== null
    const valueMatches = expectedValue === undefined || actualValue === expectedValue

    return {
      pass: hasAttribute && valueMatches,
      message: () => {
        if (!hasAttribute) {
          return `Expected element to have attribute "${attribute}"`
        }
        if (!valueMatches) {
          return `Expected attribute "${attribute}" to be "${expectedValue}", but got "${actualValue}"`
        }
        return `Expected element not to have attribute "${attribute}"`
      },
      actual: actualValue,
      expected: expectedValue ?? attribute,
    }
  },

  /**
   * Assert that an element has all expected CSS classes
   * @example expect(element).toHaveClasses(['flex', 'items-center'])
   */
  toHaveClasses(received: Element | null, expected: string[]): MatcherResult {
    if (received === null) {
      return {
        pass: false,
        message: () => `Expected element to exist, but got null`,
        actual: received,
        expected,
      }
    }

    const missing = expected.filter((className) => !received.classList.contains(className))

    return {
      pass: missing.length === 0,
      message: () =>
        missing.length === 0
          ? `Expected element not to have classes ${expected.map((c) => `"${c}"`).join(', ')}`
          : `Expected element to have classes ${missing.map((c) => `"${c}"`).join(', ')}`,
      actual: Array.from(received.classList),
      expected,
    }
  },
})

// Extend Vitest's expect types
declare module 'vitest' {
  interface Assertion<T> {
    toContainClasses: (classes: string[]) => T
    toHaveAllVariantClasses: (props: Record<string, unknown>, classes: string[]) => T
    toRenderElement: (selector: string) => T
    toHaveDataAttribute: (attribute: string, value?: string) => T
    toHaveClasses: (classes: string[]) => T
  }
}

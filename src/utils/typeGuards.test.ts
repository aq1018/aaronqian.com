/**
 * Tests for type guard utilities
 */

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

import {
  assertHTMLElement,
  assertNonNull,
  assertSVGSVGElement,
  getElementById,
  isHTMLElement,
  isNonNull,
  isNumber,
  isSVGSVGElement,
  isString,
  queryElement,
  querySVGElement,
} from './typeGuards'

describe('typeGuards', () => {
  beforeEach(() => {
    document.body.innerHTML = ''
  })

  afterEach(() => {
    document.body.innerHTML = ''
  })

  // ==========================================================================
  // DOM Type Guards
  // ==========================================================================

  describe('isHTMLElement', () => {
    it('should return true for HTMLElement instances', () => {
      const div = document.createElement('div')
      expect(isHTMLElement(div)).toBe(true)
    })

    it('should return true for specific HTMLElement types', () => {
      const button = document.createElement('button')
      const input = document.createElement('input')
      expect(isHTMLElement(button)).toBe(true)
      expect(isHTMLElement(input)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isHTMLElement(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isHTMLElement(undefined)).toBe(false)
    })

    it('should return false for non-HTMLElement objects', () => {
      expect(isHTMLElement({})).toBe(false)
      expect(isHTMLElement({ nodeType: 1 })).toBe(false)
    })

    it('should return false for primitives', () => {
      expect(isHTMLElement('div')).toBe(false)
      expect(isHTMLElement(123)).toBe(false)
      expect(isHTMLElement(true)).toBe(false)
    })

    it('should return false for SVGElement', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      // SVGElement is not an HTMLElement
      expect(isHTMLElement(svg)).toBe(false)
    })
  })

  describe('isSVGSVGElement', () => {
    it('should return true for SVGSVGElement instances', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      expect(isSVGSVGElement(svg)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isSVGSVGElement(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isSVGSVGElement(undefined)).toBe(false)
    })

    it('should return false for HTMLElement', () => {
      const div = document.createElement('div')
      expect(isSVGSVGElement(div)).toBe(false)
    })

    it('should return false for other SVG elements', () => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      expect(isSVGSVGElement(circle)).toBe(false)
    })

    it('should return false for non-element objects', () => {
      expect(isSVGSVGElement({})).toBe(false)
      expect(isSVGSVGElement('svg')).toBe(false)
    })
  })

  // ==========================================================================
  // Type-Safe DOM Query Helpers
  // ==========================================================================

  describe('queryElement', () => {
    it('should return HTMLElement when element exists', () => {
      const div = document.createElement('div')
      div.setAttribute('data-test', 'foo')
      document.body.appendChild(div)

      const result = queryElement<HTMLDivElement>('[data-test="foo"]')
      expect(result).toBe(div)
      expect(result).toBeInstanceOf(HTMLDivElement)
    })

    it('should return null when element does not exist', () => {
      const result = queryElement('[data-nonexistent]')
      expect(result).toBeNull()
    })

    it('should return null when querySelector finds SVG element', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.classList.add('test-svg')
      document.body.appendChild(svg)

      // queryElement expects HTMLElement, should return null for SVG
      const result = queryElement('.test-svg')
      expect(result).toBeNull()
    })

    it('should work with complex selectors', () => {
      const parent = document.createElement('div')
      const child = document.createElement('span')
      child.classList.add('child')
      parent.appendChild(child)
      document.body.appendChild(parent)

      const result = queryElement<HTMLSpanElement>('div > .child')
      expect(result).toBe(child)
    })
  })

  describe('querySVGElement', () => {
    it('should return SVGSVGElement when element exists', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.classList.add('test-svg')
      document.body.appendChild(svg)

      const result = querySVGElement('.test-svg')
      expect(result).toBe(svg)
      expect(result).toBeInstanceOf(SVGSVGElement)
    })

    it('should return null when element does not exist', () => {
      const result = querySVGElement('.nonexistent-svg')
      expect(result).toBeNull()
    })

    it('should return null when querySelector finds HTMLElement', () => {
      const div = document.createElement('div')
      div.classList.add('not-svg')
      document.body.appendChild(div)

      const result = querySVGElement('.not-svg')
      expect(result).toBeNull()
    })

    it('should return null for non-SVG SVG elements', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.classList.add('circle')
      svg.appendChild(circle)
      document.body.appendChild(svg)

      // querySVGElement specifically checks for SVGSVGElement
      const result = querySVGElement('.circle')
      expect(result).toBeNull()
    })
  })

  describe('getElementById', () => {
    it('should return HTMLElement when element exists', () => {
      const div = document.createElement('div')
      div.id = 'test-id'
      document.body.appendChild(div)

      const result = getElementById('test-id')
      expect(result).toBe(div)
      expect(result).toBeInstanceOf(HTMLElement)
    })

    it('should return null when element does not exist', () => {
      const result = getElementById('nonexistent-id')
      expect(result).toBeNull()
    })

    it('should return SVG element (as HTMLElement is parent of SVGElement)', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      svg.id = 'test-svg'
      document.body.appendChild(svg)

      const result = getElementById('test-svg')
      expect(result).toBe(svg)
      // Note: SVGElement extends Element, not HTMLElement in strict typing
      // but getElementById returns HTMLElement | null in DOM API
    })
  })

  // ==========================================================================
  // General Type Guards
  // ==========================================================================

  describe('isNonNull', () => {
    it('should return true for non-null values', () => {
      expect(isNonNull('string')).toBe(true)
      expect(isNonNull(123)).toBe(true)
      expect(isNonNull(true)).toBe(true)
      expect(isNonNull({})).toBe(true)
      expect(isNonNull([])).toBe(true)
    })

    it('should return true for falsy values that are not null/undefined', () => {
      expect(isNonNull(0)).toBe(true)
      expect(isNonNull('')).toBe(true)
      expect(isNonNull(false)).toBe(true)
    })

    it('should return false for null', () => {
      expect(isNonNull(null)).toBe(false)
    })

    it('should return false for undefined', () => {
      expect(isNonNull(undefined)).toBe(false)
    })
  })

  describe('isString', () => {
    it('should return true for string values', () => {
      expect(isString('hello')).toBe(true)
      expect(isString('')).toBe(true)
      expect(isString('123')).toBe(true)
    })

    it('should return false for non-string values', () => {
      expect(isString(123)).toBe(false)
      expect(isString(true)).toBe(false)
      expect(isString(null)).toBe(false)
      expect(isString(undefined)).toBe(false)
      expect(isString({})).toBe(false)
      expect(isString([])).toBe(false)
    })
  })

  describe('isNumber', () => {
    it('should return true for number values', () => {
      expect(isNumber(123)).toBe(true)
      expect(isNumber(0)).toBe(true)
      expect(isNumber(-42)).toBe(true)
      expect(isNumber(3.14)).toBe(true)
    })

    it('should return false for NaN', () => {
      expect(isNumber(Number.NaN)).toBe(false)
    })

    it('should return false for non-number values', () => {
      expect(isNumber('123')).toBe(false)
      expect(isNumber(true)).toBe(false)
      expect(isNumber(null)).toBe(false)
      expect(isNumber(undefined)).toBe(false)
      expect(isNumber({})).toBe(false)
    })
  })

  // ==========================================================================
  // Type Assertions
  // ==========================================================================

  describe('assertNonNull', () => {
    it('should not throw for non-null values', () => {
      expect(() => {
        assertNonNull('string')
      }).not.toThrow()
      expect(() => {
        assertNonNull(123)
      }).not.toThrow()
      expect(() => {
        assertNonNull({})
      }).not.toThrow()
    })

    it('should not throw for falsy non-null values', () => {
      expect(() => {
        assertNonNull(0)
      }).not.toThrow()
      expect(() => {
        assertNonNull('')
      }).not.toThrow()
      expect(() => {
        assertNonNull(false)
      }).not.toThrow()
    })

    it('should throw for null with default message', () => {
      expect(() => {
        assertNonNull(null)
      }).toThrow('Expected non-null value')
    })

    it('should throw for undefined with default message', () => {
      expect(() => {
        assertNonNull(undefined)
      }).toThrow('Expected non-null value')
    })

    it('should throw with custom message', () => {
      expect(() => {
        assertNonNull(null, 'Custom error message')
      }).toThrow('Custom error message')
    })
  })

  describe('assertHTMLElement', () => {
    it('should not throw for HTMLElement', () => {
      const div = document.createElement('div')
      expect(() => {
        assertHTMLElement(div)
      }).not.toThrow()
    })

    it('should throw for null with default message', () => {
      expect(() => {
        assertHTMLElement(null)
      }).toThrow('Expected HTMLElement')
    })

    it('should throw for non-HTMLElement with default message', () => {
      expect(() => {
        assertHTMLElement({})
      }).toThrow('Expected HTMLElement')
    })

    it('should throw for SVGElement with default message', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      expect(() => {
        assertHTMLElement(svg)
      }).toThrow('Expected HTMLElement')
    })

    it('should throw with custom message', () => {
      expect(() => {
        assertHTMLElement(null, 'Button element not found')
      }).toThrow('Button element not found')
    })
  })

  describe('assertSVGSVGElement', () => {
    it('should not throw for SVGSVGElement', () => {
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
      expect(() => {
        assertSVGSVGElement(svg)
      }).not.toThrow()
    })

    it('should throw for null with default message', () => {
      expect(() => {
        assertSVGSVGElement(null)
      }).toThrow('Expected SVGSVGElement')
    })

    it('should throw for HTMLElement with default message', () => {
      const div = document.createElement('div')
      expect(() => {
        assertSVGSVGElement(div)
      }).toThrow('Expected SVGSVGElement')
    })

    it('should throw for non-SVG SVG elements', () => {
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      expect(() => {
        assertSVGSVGElement(circle)
      }).toThrow('Expected SVGSVGElement')
    })

    it('should throw with custom message', () => {
      expect(() => {
        assertSVGSVGElement(null, 'SVG canvas not found')
      }).toThrow('SVG canvas not found')
    })
  })
})

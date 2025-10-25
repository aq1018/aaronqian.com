/**
 * Type guards and type-safe DOM query utilities
 *
 * This module provides runtime type checking and type-safe DOM querying
 * to eliminate unsafe type assertions throughout the codebase.
 */

// ============================================================================
// DOM Type Guards
// ============================================================================

/**
 * Type guard to check if a value is an HTMLElement
 *
 * @example
 * const el = document.querySelector('.foo')
 * if (isHTMLElement(el)) {
 *   el.style.color = 'red' // TypeScript knows el is HTMLElement
 * }
 */
export function isHTMLElement(el: unknown): el is HTMLElement {
  return el instanceof HTMLElement
}

/**
 * Type guard to check if a value is an SVGSVGElement
 *
 * @example
 * const svg = document.querySelector('svg')
 * if (isSVGSVGElement(svg)) {
 *   svg.setAttribute('viewBox', '0 0 100 100') // TypeScript knows type
 * }
 */
export function isSVGSVGElement(el: unknown): el is SVGSVGElement {
  return el instanceof SVGSVGElement
}

// ============================================================================
// Type-Safe DOM Query Helpers
// ============================================================================

/**
 * Type-safe querySelector that returns a specific HTMLElement type or null
 *
 * @example
 * const button = queryElement<HTMLButtonElement>('[data-submit]')
 * if (button) {
 *   button.disabled = true // TypeScript knows it's HTMLButtonElement
 * }
 */
// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters -- T allows callers to specify exact HTMLElement subtype
export function queryElement<T extends HTMLElement>(selector: string): T | null {
  const element = document.querySelector(selector)
  if (element === null) {
    return null
  }
  if (element instanceof HTMLElement) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-type-assertion -- Runtime check ensures HTMLElement, T is caller-specified subtype
    return element as T
  }
  return null
}

/**
 * Type-safe querySelector specifically for SVG elements
 *
 * @example
 * const svg = querySVGElement('.digital-analyzer-static')
 * if (svg) {
 *   svg.setAttribute('width', '100') // TypeScript knows it's SVGSVGElement
 * }
 */
export function querySVGElement(selector: string): SVGSVGElement | null {
  const element = document.querySelector(selector)
  if (element === null) {
    return null
  }
  if (element instanceof SVGSVGElement) {
    return element
  }
  return null
}

/**
 * Type-safe getElementById that returns HTMLElement or null
 *
 * Note: getElementById already returns HTMLElement | null, but this wrapper
 * provides consistency with other query helpers and explicit null handling.
 *
 * @example
 * const svg = getElementById('digital-analyzer-svg')
 * if (svg && isSVGSVGElement(svg)) {
 *   // Now TypeScript knows it's SVGSVGElement
 * }
 */
export function getElementById(id: string): HTMLElement | null {
  return document.getElementById(id)
}

// ============================================================================
// General Type Guards
// ============================================================================

/**
 * Type guard to check if a value is non-null and non-undefined
 *
 * @example
 * const value: string | null = getValue()
 * if (isNonNull(value)) {
 *   console.log(value.toUpperCase()) // TypeScript knows value is string
 * }
 */
export function isNonNull<T>(value: T | null | undefined): value is NonNullable<T> {
  return value !== null && value !== undefined
}

/**
 * Type guard to check if a value is a string
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

/**
 * Type guard to check if a value is a number
 */
export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !Number.isNaN(value)
}

// ============================================================================
// Type Assertions (throw on failure)
// ============================================================================

/**
 * Asserts that a value is non-null, throws if null/undefined
 *
 * @throws {Error} If value is null or undefined
 *
 * @example
 * const config = getConfig()
 * assertNonNull(config, 'Config must be defined')
 * // TypeScript knows config is non-null after this line
 */
export function assertNonNull<T>(
  value: T | null | undefined,
  message = 'Expected non-null value',
): asserts value is NonNullable<T> {
  if (value === null || value === undefined) {
    throw new Error(message)
  }
}

/**
 * Asserts that a value is an HTMLElement, throws if not
 *
 * @throws {Error} If value is not an HTMLElement
 *
 * @example
 * const el = document.querySelector('.foo')
 * assertHTMLElement(el)
 * // TypeScript knows el is HTMLElement after this line
 */
export function assertHTMLElement(
  value: unknown,
  message = 'Expected HTMLElement',
): asserts value is HTMLElement {
  if (!isHTMLElement(value)) {
    throw new Error(message)
  }
}

/**
 * Asserts that a value is an SVGSVGElement, throws if not
 *
 * @throws {Error} If value is not an SVGSVGElement
 *
 * @example
 * const svg = document.querySelector('svg')
 * assertSVGSVGElement(svg)
 * // TypeScript knows svg is SVGSVGElement after this line
 */
export function assertSVGSVGElement(
  value: unknown,
  message = 'Expected SVGSVGElement',
): asserts value is SVGSVGElement {
  if (!isSVGSVGElement(value)) {
    throw new Error(message)
  }
}

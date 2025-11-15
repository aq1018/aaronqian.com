/**
 * Tests for JSON-LD utility functions
 */
import { describe, expect, it } from 'vitest'

import { sanitizeText, toAbsoluteUrl, toIsoDate } from './utils'

describe('toAbsoluteUrl', () => {
  const baseUrl = 'https://example.com'

  it('should return absolute URLs unchanged', () => {
    expect(toAbsoluteUrl('https://example.com/path', baseUrl)).toBe('https://example.com/path')
    expect(toAbsoluteUrl('http://example.com/path', baseUrl)).toBe('http://example.com/path')
  })

  it('should convert relative URLs to absolute', () => {
    expect(toAbsoluteUrl('/blog/post', baseUrl)).toBe('https://example.com/blog/post')
    expect(toAbsoluteUrl('blog/post', baseUrl)).toBe('https://example.com/blog/post')
  })

  it('should handle trailing slashes correctly', () => {
    expect(toAbsoluteUrl('/blog', 'https://example.com/')).toBe('https://example.com/blog')
    expect(toAbsoluteUrl('blog', 'https://example.com/')).toBe('https://example.com/blog')
  })

  it('should handle empty paths', () => {
    expect(toAbsoluteUrl('/', baseUrl)).toBe('https://example.com/')
    expect(toAbsoluteUrl('', baseUrl)).toBe('https://example.com/')
  })
})

describe('toIsoDate', () => {
  it('should convert Date objects to ISO strings', () => {
    const date = new Date('2024-01-15T12:00:00Z')
    expect(toIsoDate(date)).toBe('2024-01-15T12:00:00.000Z')
  })

  it('should convert ISO string dates to ISO format', () => {
    expect(toIsoDate('2024-01-15')).toMatch(/2024-01-15T\d{2}:\d{2}:\d{2}\.\d{3}Z/)
  })

  it('should handle date strings with time', () => {
    const result = toIsoDate('2024-01-15T12:00:00Z')
    expect(result).toBe('2024-01-15T12:00:00.000Z')
  })
})

describe('sanitizeText', () => {
  it('should remove extra whitespace', () => {
    expect(sanitizeText('  hello   world  ')).toBe('hello world')
    expect(sanitizeText('hello    world')).toBe('hello world')
  })

  it('should remove newlines', () => {
    expect(sanitizeText('hello\nworld')).toBe('hello world')
    expect(sanitizeText('hello\r\nworld')).toBe('hello world')
  })

  it('should handle mixed whitespace', () => {
    expect(sanitizeText('  hello\n\t  world  \r\n  ')).toBe('hello world')
  })

  it('should handle single words', () => {
    expect(sanitizeText('  hello  ')).toBe('hello')
  })

  it('should handle empty strings', () => {
    expect(sanitizeText('')).toBe('')
    expect(sanitizeText('   ')).toBe('')
  })
})

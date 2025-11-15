/**
 * Utility functions for JSON-LD generation
 */

/**
 * Ensures a URL is absolute
 * Converts relative URLs to absolute using the base site URL
 */
export function toAbsoluteUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url
  }

  // Remove leading slash if present to avoid double slashes
  const path = url.startsWith('/') ? url.slice(1) : url

  // Remove trailing slash from baseUrl if present
  const base = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl

  return `${base}/${path}`
}

/**
 * Formats a date to ISO 8601 format
 * Handles both Date objects and ISO strings
 */
export function toIsoDate(date: Date | string): string {
  if (typeof date === 'string') {
    // If already a string, validate it's a valid date and return ISO format
    return new Date(date).toISOString()
  }

  return date.toISOString()
}

/**
 * Sanitizes text for JSON-LD
 * Removes extra whitespace and newlines
 */
export function sanitizeText(text: string): string {
  return text.replaceAll(/\s+/g, ' ').trim()
}

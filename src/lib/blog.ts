/**
 * Blog utilities for handling date-prefixed folder names
 * Format: YYYY-MM-DD-slug-name
 */

/**
 * Extract the clean slug from a blog entry ID (folder name)
 * @param entryId - Blog entry ID (e.g., "2023-01-15-my-post")
 * @returns Clean slug without date prefix (e.g., "my-post")
 */
export function getBlogSlug(entryId: string): string {
  return entryId.slice(11) // Strip "YYYY-MM-DD-" prefix
}

/**
 * Parse the publication date from a blog entry ID (folder name)
 * @param entryId - Blog entry ID (e.g., "2023-01-15-my-post")
 * @returns Date object parsed from the YYYY-MM-DD prefix
 */
export function getBlogDate(entryId: string): Date {
  return new Date(entryId.slice(0, 10)) // Parse "YYYY-MM-DD"
}

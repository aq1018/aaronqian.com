/**
 * Type definitions for JSON-LD structured data
 * Re-exports schema-dts types with custom helper types
 */
import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  CreativeWork,
  ImageObject,
  ItemList,
  Organization,
  Person,
  ProfilePage,
  Thing,
  WebPage,
  WebSite,
  WithContext,
} from 'schema-dts'

// Re-export schema-dts types for convenience
export type {
  Article,
  BlogPosting,
  BreadcrumbList,
  CreativeWork,
  ImageObject,
  ItemList,
  Organization,
  Person,
  ProfilePage,
  WebPage,
  WebSite,
  WithContext,
}

/**
 * Helper type for JSON-LD with @context
 * Ensures all schemas have the required @context property
 */
export type JsonLdSchema<T extends Thing> = WithContext<T>

/**
 * Common props for article-like schemas
 */
export interface ArticleProps {
  title: string
  description: string
  datePublished: Date | string
  dateModified?: Date | string
  author?: string
  image?: string
  url?: string
}

/**
 * Props for breadcrumb generation
 */
export interface BreadcrumbItem {
  name: string
  url: string
}

/**
 * Props for CreativeWork schema
 */
export interface CreativeWorkProps {
  name: string
  description: string
  dateCreated: Date | string
  author?: string
  url?: string
  image?: string
  keywords?: string[]
}

/**
 * Props for ItemList schema
 */
export interface ItemListProps {
  name: string
  description?: string
  items: {
    name: string
    url: string
    description?: string
  }[]
}

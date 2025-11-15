/**
 * Type-safe JSON-LD schema generators
 * Uses schema-dts for complete type safety
 */
import type {
  Article,
  BlogPosting,
  BreadcrumbList,
  CreativeWork,
  ItemList,
  ProfilePage,
} from 'schema-dts'

import type {
  ArticleProps,
  BreadcrumbItem,
  CreativeWorkProps,
  ItemListProps,
  JsonLdSchema,
  Organization,
  Person,
  WebSite,
} from './types'
import { sanitizeText, toAbsoluteUrl, toIsoDate } from './utils'

/**
 * Generates WebSite schema with search action
 */
export function generateWebSiteSchema(config: {
  name: string
  url: string
  description: string
}): JsonLdSchema<WebSite> {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    url: config.url,
    description: sanitizeText(config.description),
    inLanguage: 'en-US',
  }
}

/**
 * Generates Person schema for author/profile
 */
export function generatePersonSchema(config: {
  name: string
  url: string
  description?: string
  email?: string
  image?: string
  sameAs?: string[]
}): JsonLdSchema<Person> {
  const schema: JsonLdSchema<Person> = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: config.name,
    url: config.url,
  }

  if (config.description !== undefined && config.description !== '') {
    schema.description = sanitizeText(config.description)
  }

  if (config.email !== undefined && config.email !== '') {
    schema.email = config.email
  }

  if (config.image !== undefined && config.image !== '') {
    schema.image = {
      '@type': 'ImageObject',
      url: config.image,
    }
  }

  if (config.sameAs !== undefined && config.sameAs.length > 0) {
    schema.sameAs = config.sameAs
  }

  return schema
}

/**
 * Generates Organization schema
 */
export function generateOrganizationSchema(config: {
  name: string
  url: string
  logo?: string
  sameAs?: string[]
}): JsonLdSchema<Organization> {
  const schema: JsonLdSchema<Organization> = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    url: config.url,
  }

  if (config.logo !== undefined && config.logo !== '') {
    schema.logo = {
      '@type': 'ImageObject',
      url: config.logo,
    }
  }

  if (config.sameAs !== undefined && config.sameAs.length > 0) {
    schema.sameAs = config.sameAs
  }

  return schema
}

/**
 * Generates Article schema for general articles
 */
export function generateArticleSchema(
  props: ArticleProps,
  config: { baseUrl: string; authorName: string; authorUrl: string },
): JsonLdSchema<Article> {
  const articleUrl =
    props.url !== undefined && props.url !== ''
      ? toAbsoluteUrl(props.url, config.baseUrl)
      : config.baseUrl

  const authorName =
    props.author !== undefined && props.author !== '' ? props.author : config.authorName

  const schema: JsonLdSchema<Article> = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: sanitizeText(props.title),
    description: sanitizeText(props.description),
    datePublished: toIsoDate(props.datePublished),
    author: {
      '@type': 'Person',
      name: authorName,
      url: config.authorUrl,
    },
    url: articleUrl,
  }

  if (props.dateModified !== undefined) {
    schema.dateModified = toIsoDate(props.dateModified)
  }

  if (props.image !== undefined && props.image !== '') {
    schema.image = {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(props.image, config.baseUrl),
    }
  }

  return schema
}

/**
 * Generates BlogPosting schema for blog posts
 */
export function generateBlogPostingSchema(
  props: ArticleProps,
  config: { baseUrl: string; authorName: string; authorUrl: string },
): JsonLdSchema<BlogPosting> {
  const postUrl =
    props.url !== undefined && props.url !== ''
      ? toAbsoluteUrl(props.url, config.baseUrl)
      : config.baseUrl

  const authorName =
    props.author !== undefined && props.author !== '' ? props.author : config.authorName

  const schema: JsonLdSchema<BlogPosting> = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: sanitizeText(props.title),
    description: sanitizeText(props.description),
    datePublished: toIsoDate(props.datePublished),
    author: {
      '@type': 'Person',
      name: authorName,
      url: config.authorUrl,
    },
    url: postUrl,
  }

  if (props.dateModified !== undefined) {
    schema.dateModified = toIsoDate(props.dateModified)
  }

  if (props.image !== undefined && props.image !== '') {
    schema.image = {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(props.image, config.baseUrl),
    }
  }

  return schema
}

/**
 * Generates BreadcrumbList schema for navigation
 */
export function generateBreadcrumbSchema(
  items: BreadcrumbItem[],
  baseUrl: string,
): JsonLdSchema<BreadcrumbList> {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: toAbsoluteUrl(item.url, baseUrl),
    })),
  }
}

/**
 * Generates ProfilePage schema wrapping a Person schema
 */
export function generateProfilePageSchema(config: {
  name: string
  url: string
  description?: string
  email?: string
  image?: string
  sameAs?: string[]
}): JsonLdSchema<ProfilePage> {
  const mainEntity: Person = {
    '@type': 'Person',
    name: config.name,
    url: config.url,
  }

  if (config.description !== undefined && config.description !== '') {
    mainEntity.description = sanitizeText(config.description)
  }

  if (config.email !== undefined && config.email !== '') {
    mainEntity.email = config.email
  }

  if (config.image !== undefined && config.image !== '') {
    mainEntity.image = {
      '@type': 'ImageObject',
      url: config.image,
    }
  }

  if (config.sameAs !== undefined && config.sameAs.length > 0) {
    mainEntity.sameAs = config.sameAs
  }

  return {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    mainEntity,
  }
}

/**
 * Generates CreativeWork schema for projects and creative works
 */
export function generateCreativeWorkSchema(
  props: CreativeWorkProps,
  config: { baseUrl: string; authorName: string; authorUrl: string },
): JsonLdSchema<CreativeWork> {
  const workUrl =
    props.url !== undefined && props.url !== ''
      ? toAbsoluteUrl(props.url, config.baseUrl)
      : config.baseUrl

  const authorName =
    props.author !== undefined && props.author !== '' ? props.author : config.authorName

  const schema: JsonLdSchema<CreativeWork> = {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: sanitizeText(props.name),
    description: sanitizeText(props.description),
    dateCreated: toIsoDate(props.dateCreated),
    author: {
      '@type': 'Person',
      name: authorName,
      url: config.authorUrl,
    },
    url: workUrl,
  }

  if (props.image !== undefined && props.image !== '') {
    schema.image = {
      '@type': 'ImageObject',
      url: toAbsoluteUrl(props.image, config.baseUrl),
    }
  }

  if (props.keywords !== undefined && props.keywords.length > 0) {
    schema.keywords = props.keywords.join(', ')
  }

  return schema
}

/**
 * Generates ItemList schema for collection pages
 */
export function generateItemListSchema(
  props: ItemListProps,
  baseUrl: string,
): JsonLdSchema<ItemList> {
  const schema: JsonLdSchema<ItemList> = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: sanitizeText(props.name),
    numberOfItems: props.items.length,
    itemListElement: props.items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: sanitizeText(item.name),
      url: toAbsoluteUrl(item.url, baseUrl),
      ...(item.description !== undefined &&
        item.description !== '' && { description: sanitizeText(item.description) }),
    })),
  }

  if (props.description !== undefined && props.description !== '') {
    schema.description = sanitizeText(props.description)
  }

  return schema
}

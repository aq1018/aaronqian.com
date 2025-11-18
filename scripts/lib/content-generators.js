import fs from 'fs'

/**
 * Generate frontmatter YAML from object
 * @param {Record<string, unknown>} frontmatter
 * @returns {string}
 */
export function generateFrontmatterYaml(frontmatter) {
  return Object.entries(frontmatter)
    .map(([key, value]) => {
      if (Array.isArray(value)) {
        return `${key}:\n${value.map((v) => `  - ${String(v)}`).join('\n')}`
      }
      if (typeof value === 'boolean') {
        return `${key}: ${value}`
      }
      if (typeof value === 'number') {
        return `${key}: ${value}`
      }
      return `${key}: '${String(value)}'`
    })
    .join('\n')
}

/**
 * Generate blog post content
 * @param {Record<string, unknown>} frontmatter
 * @returns {string}
 */
export function generateBlogPostContent(frontmatter) {
  const yaml = generateFrontmatterYaml(frontmatter)

  return `---
${yaml}
---

## Introduction

Write your introduction here.

## Main Content

Write your main content here.

## Conclusion

Write your conclusion here.
`
}

/**
 * Generate project content
 * @param {Record<string, unknown>} frontmatter
 * @returns {string}
 */
export function generateProjectContent(frontmatter) {
  const yaml = generateFrontmatterYaml(frontmatter)

  return `---
${yaml}
---

## Overview

Describe your project here.

## Key Features

- Feature 1
- Feature 2
- Feature 3

## Technical Details

Share technical implementation details.

## Current Status

What's the current state and next steps?
`
}

/**
 * Generate project log content
 * @param {Record<string, unknown>} frontmatter
 * @returns {string}
 */
export function generateProjectLogContent(frontmatter) {
  const yaml = generateFrontmatterYaml(frontmatter)

  return `---
${yaml}
---

## What I Did

Describe what you worked on today.

## Challenges

Any blockers or issues encountered?

## Next Steps

What's coming up next?
`
}

/**
 * Write content to file
 * @param {string} filePath
 * @param {string} content
 */
export function writeContentFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8')
}

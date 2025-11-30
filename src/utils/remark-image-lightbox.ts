import type { Root } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface ImageNode {
  type: 'image'
  url: string
  title?: string | null
  alt?: string | null
  data?: {
    hProperties?: Record<string, unknown>
  }
}

interface MdxJsxElement {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: {
    type: string
    name: string
    value: unknown
  }[]
}

/**
 * Remark plugin to add lightbox functionality to images in MDX
 * Adds data-lightbox-trigger attribute to all images
 */
const remarkImageLightbox: Plugin<[], Root> = () => (tree: Root) => {
  // Handle markdown images
  visit(tree, 'image', (node: ImageNode) => {
    // Add hProperties for the image element
    node.data = node.data ?? {}
    node.data.hProperties = node.data.hProperties ?? {}

    // Use camelCase for data attributes (React/MDX converts kebab-case to camelCase)
    node.data.hProperties.dataLightboxTrigger = true

    // Add cursor pointer style
    const existingStyle = node.data.hProperties.style
    const styleString = typeof existingStyle === 'string' ? existingStyle : ''
    node.data.hProperties.style = styleString
      ? `${styleString}; cursor: pointer;`
      : 'cursor: pointer;'

    // Add title for tooltip on hover
    const hasTitle = node.data.hProperties.title != null
    if (node.alt != null && node.alt !== '' && !hasTitle) {
      node.data.hProperties.title = 'Click to view fullscreen'
    }
  })

  // Also handle JSX image elements if present
  visit(tree, 'mdxJsxFlowElement', (node: MdxJsxElement) => {
    if (node.name === 'img' || node.name === 'Image') {
      // Check if data-lightbox-trigger attribute already exists
      const triggerAttr = node.attributes.find((attr) => attr.name === 'data-lightbox-trigger')

      if (!triggerAttr) {
        // Add data-lightbox-trigger attribute
        node.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'data-lightbox-trigger',
          value: true,
        })
      }

      // Add cursor pointer style
      const styleAttr = node.attributes.find((attr) => attr.name === 'style')
      if (styleAttr) {
        if (typeof styleAttr.value === 'string') {
          styleAttr.value = `${styleAttr.value}; cursor: pointer;`
        }
      } else {
        node.attributes.push({
          type: 'mdxJsxAttribute',
          name: 'style',
          value: 'cursor: pointer;',
        })
      }
    }
  })
}

export default remarkImageLightbox

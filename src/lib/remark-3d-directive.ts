/**
 * Remark plugin to transform ::3d directives into GltfViewer components
 * Supports syntax: ::3d[alt text]{src="/path/to/model.glb" aspectRatio="16/9"}
 */
import type { Html, Root, Text } from 'mdast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

interface LeafDirective {
  type: 'leafDirective'
  name: string
  attributes?: Record<string, string | null | undefined> | null
  children?: Text[]
}

/**
 * Type guard to check if a node is a LeafDirective
 */
function isLeafDirective(node: unknown): node is LeafDirective {
  return (
    typeof node === 'object' &&
    node != null &&
    'type' in node &&
    node.type === 'leafDirective' &&
    'name' in node &&
    typeof (node as Record<string, unknown>).name === 'string'
  )
}

interface ParsedAttributes {
  src?: string
  aspectRatio: string
  height?: string
  width: string
  fallbackImage?: string
  className?: string
}

/**
 * Parse directive attributes from the attributes object
 */
function parseAttributes(
  attributes: Record<string, string | null | undefined> | null | undefined,
): ParsedAttributes {
  if (!attributes) {
    return {
      src: undefined,
      aspectRatio: '16/9',
      height: undefined,
      width: '100%',
      fallbackImage: undefined,
      className: undefined,
    }
  }

  const cleanAttributes: Record<string, string> = {}
  for (const [key, value] of Object.entries(attributes)) {
    if (typeof value === 'string') {
      cleanAttributes[key] = value
    }
  }

  const {
    src,
    aspectRatio = '16/9',
    height,
    width = '100%',
    fallbackImage,
    class: className,
  } = cleanAttributes

  return {
    src,
    aspectRatio,
    height,
    width,
    fallbackImage,
    className,
  }
}

/**
 * Generate the HTML for the GltfViewer
 */
function generateGltfViewerHTML(src: string, alt: string, attributes: ParsedAttributes): string {
  const { aspectRatio, height, width, fallbackImage, className } = attributes

  // Build style string
  const normalizedWidth = width

  let style: string
  if (height != null && height !== '') {
    style = `width: ${normalizedWidth}; height: ${height};`
  } else {
    style = `width: ${normalizedWidth}; aspect-ratio: ${aspectRatio};`
  }

  const classAttr = className != null && className !== '' ? ` class="${className}"` : ''
  const fallbackAttr =
    fallbackImage != null && fallbackImage !== '' ? ` data-fallback-image="${fallbackImage}"` : ''

  return `<div${classAttr} data-gltf-viewer data-gltf-src="${src}"${fallbackAttr} style="${style}">
  <div data-gltf-loading class="gltf-viewer-loading">
    <div class="gltf-viewer-spinner"></div>
    <p class="gltf-viewer-loading-text">Loading 3D model...</p>
  </div>
  <div data-gltf-error class="gltf-viewer-error" style="display: none;">
    <div class="gltf-viewer-error-content">
      <p class="gltf-viewer-error-text">Failed to load 3D model</p>
      ${fallbackImage != null && fallbackImage !== '' ? `<img src="${fallbackImage}" alt="${alt}" class="gltf-viewer-fallback-image" loading="lazy" />` : ''}
    </div>
  </div>
  <canvas data-gltf-canvas style="display: none; width: 100%; height: 100%;" aria-label="${alt}"></canvas>
  <noscript>
    ${
      fallbackImage != null && fallbackImage !== ''
        ? `<img src="${fallbackImage}" alt="${alt}" style="${style} object-fit: contain;" />`
        : `<div class="gltf-viewer-no-js" style="${style} display: flex; align-items: center; justify-content: center; background: var(--color-surface-2); color: var(--color-content-muted);">
             <p>3D model requires JavaScript to view</p>
           </div>`
    }
  </noscript>
</div>`
}

/**
 * Remark plugin to transform ::3d directives
 */
export const remark3dDirective: Plugin<[], Root> = () => (tree) => {
  visit(tree, 'leafDirective', (node, index, parent) => {
    // Type guard to ensure we have the right node type
    if (!isLeafDirective(node)) return
    if (node.name !== '3d') return

    const attributes = parseAttributes(node.attributes)

    if (attributes.src == null || attributes.src === '') {
      console.warn('::3d directive missing required "src" attribute')
      return
    }

    // Extract alt text from children
    const altText = node.children?.map((child: Text): string => child.value).join(' ')
    const alt = altText != null && altText !== '' ? altText : '3D Model'

    const html = generateGltfViewerHTML(attributes.src, alt, attributes)

    // Replace the directive with raw HTML
    const htmlNode: Html = {
      type: 'html',
      value: html,
    }

    if (parent?.children && typeof index === 'number') {
      parent.children[index] = htmlNode
    }
  })
}

export default remark3dDirective

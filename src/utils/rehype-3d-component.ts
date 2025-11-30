import type { Element, Root } from 'hast'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * Rehype plugin to transform 3d directive placeholders into GltfViewer components
 */
const rehype3dComponent: Plugin<[], Root> = () => (tree: Root) => {
  visit(tree, 'element', (node: Element) => {
    if (node.tagName !== 'gltf-viewer-placeholder') return

    const props = node.properties ?? {}

    // Transform to the actual GltfViewer component import
    // This will be processed by Astro
    node.tagName = 'GltfViewer'
    node.properties = {
      ...props,
      'data-astro-component': '@/components/features/GltfViewer.astro',
    }
  })
}

export default rehype3dComponent

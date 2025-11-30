import type { Html, Root } from 'mdast'
import type { LeafDirective } from 'mdast-util-directive'
import type { Plugin } from 'unified'
import { visit } from 'unist-util-visit'

/**
 * Generate HTML content for 3D viewer
 */
function generateHtmlContent(src: string, alt: string, containerStyle: string): string {
  return `
<div data-gltf-viewer data-gltf-src="${src}" style="${containerStyle}">
  <!-- Loading State -->
  <div data-gltf-loading class="gltf-viewer-loading">
    <div class="gltf-viewer-spinner"></div>
    <p class="gltf-viewer-loading-text">Loading 3D model...</p>
  </div>
  <!-- Error State -->
  <div data-gltf-error class="gltf-viewer-error" style="display: none;">
    <div class="gltf-viewer-error-content">
      <p class="gltf-viewer-error-text">Failed to load 3D model</p>
    </div>
  </div>
  <!-- 3D Canvas Container -->
  <div class="gltf-viewer-canvas-wrapper">
    <canvas data-gltf-canvas style="display: none; width: 100%; height: 100%;" aria-label="${alt}"></canvas>
    <!-- Control Buttons -->
    <div class="gltf-viewer-controls" data-gltf-controls>
      <button class="gltf-control-btn" data-control="fullscreen" aria-label="Toggle fullscreen" title="Fullscreen">
        <svg class="gltf-control-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="m13.28 7.78l3.22-3.22v2.69a.75.75 0 0 0 1.5 0v-4.5a.75.75 0 0 0-.75-.75h-4.5a.75.75 0 0 0 0 1.5h2.69l-3.22 3.22a.75.75 0 0 0 1.06 1.06M2 17.25v-4.5a.75.75 0 0 1 1.5 0v2.69l3.22-3.22a.75.75 0 0 1 1.06 1.06L4.56 16.5h2.69a.75.75 0 0 1 0 1.5h-4.5a.747.747 0 0 1-.75-.75m10.22-3.97l3.22 3.22h-2.69a.75.75 0 0 0 0 1.5h4.5a.747.747 0 0 0 .75-.75v-4.5a.75.75 0 0 0-1.5 0v2.69l-3.22-3.22a.75.75 0 1 0-1.06 1.06M3.5 4.56l3.22 3.22a.75.75 0 0 0 1.06-1.06L4.56 3.5h2.69a.75.75 0 0 0 0-1.5h-4.5a.75.75 0 0 0-.75.75v4.5a.75.75 0 0 0 1.5 0z"/>
        </svg>
      </button>
      <button class="gltf-control-btn" data-control="zoom-in" aria-label="Zoom in" title="Zoom in">
        <svg class="gltf-control-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M9 6a.75.75 0 0 1 .75.75v1.5h1.5a.75.75 0 0 1 0 1.5h-1.5v1.5a.75.75 0 0 1-1.5 0v-1.5h-1.5a.75.75 0 0 1 0-1.5h1.5v-1.5A.75.75 0 0 1 9 6"/>
          <path fill-rule="evenodd" d="M2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9m7-5.5a5.5 5.5 0 1 0 0 11a5.5 5.5 0 0 0 0-11" clip-rule="evenodd"/>
        </svg>
      </button>
      <button class="gltf-control-btn" data-control="zoom-out" aria-label="Zoom out" title="Zoom out">
        <svg class="gltf-control-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path d="M6.75 8.25a.75.75 0 0 0 0 1.5h4.5a.75.75 0 0 0 0-1.5z"/>
          <path fill-rule="evenodd" d="M9 2a7 7 0 1 0 4.391 12.452l3.329 3.328a.75.75 0 1 0 1.06-1.06l-3.328-3.329A7 7 0 0 0 9 2M3.5 9a5.5 5.5 0 1 1 11 0a5.5 5.5 0 0 1-11 0" clip-rule="evenodd"/>
        </svg>
      </button>
      <button class="gltf-control-btn" data-control="reset" aria-label="Reset view" title="Reset view">
        <svg class="gltf-control-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M15.312 11.424a5.5 5.5 0 0 1-9.201 2.466l-.312-.311h2.433a.75.75 0 0 0 0-1.5H3.989a.75.75 0 0 0-.75.75v4.242a.75.75 0 0 0 1.5 0v-2.43l.31.31a7 7 0 0 0 11.712-3.138a.75.75 0 0 0-1.449-.39m1.23-3.723a.75.75 0 0 0 .219-.53V2.929a.75.75 0 0 0-1.5 0V5.36l-.31-.31A7 7 0 0 0 3.239 8.188a.75.75 0 1 0 1.448.389A5.5 5.5 0 0 1 13.89 6.11l.311.31h-2.432a.75.75 0 0 0 0 1.5h4.243a.75.75 0 0 0 .53-.219" clip-rule="evenodd"/>
        </svg>
      </button>
      <button class="gltf-control-btn" data-control="rotate" data-active="true" aria-label="Toggle auto-rotate" title="Auto-rotate">
        <svg class="gltf-control-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
          <path fill-rule="evenodd" d="M2 10a8 8 0 1 1 16 0a8 8 0 0 1-16 0m6.39-2.908a.75.75 0 0 1 .766.027l3.5 2.25a.75.75 0 0 1 0 1.262l-3.5 2.25A.75.75 0 0 1 8 12.25v-4.5a.75.75 0 0 1 .39-.658" clip-rule="evenodd"/>
        </svg>
      </button>
    </div>
  </div>
</div>`
}

/**
 * Remark plugin to transform ::3d directives into GltfViewer HTML
 * Usage: ::3d[alt text]{src="/path/to/model.glb" aspectRatio="16/9"}
 */
const remark3dDirective: Plugin<[], Root> = () => (tree: Root) => {
  visit(tree, 'leafDirective', (node: LeafDirective, index, parent) => {
    if (node.name !== '3d' || !parent || index == null) return

    const attributes = node.attributes ?? {}
    const children = node.children ?? []
    const firstChild = children[0]
    const alt =
      firstChild != null && 'value' in firstChild && firstChild.value != null
        ? String(firstChild.value)
        : '3D Model'
    const src = attributes.src == null ? '' : String(attributes.src)
    const aspectRatio = attributes.aspectRatio == null ? '16/9' : String(attributes.aspectRatio)
    const width = attributes.width == null ? '100%' : String(attributes.width)
    const height = attributes.height == null ? undefined : String(attributes.height)

    // Calculate container style
    let containerStyle = `width: ${width};`
    if (height == null) {
      containerStyle += ` aspect-ratio: ${aspectRatio};`
    } else {
      containerStyle += ` height: ${height};`
    }

    // Generate HTML and replace the directive node
    const htmlContent = generateHtmlContent(src, alt, containerStyle)
    const htmlNode: Html = {
      type: 'html',
      value: htmlContent.trim(),
    }

    parent.children[index] = htmlNode
  })
}

export default remark3dDirective

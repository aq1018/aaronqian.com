/**
 * Feature component lifecycle hooks
 * Initialize all feature component hooks
 */
import { setupComments } from './Comments.hook'
import { setupDigitalAnalyzer } from './DigitalAnalyzer.hook'
import { setupDecoderToggle } from './DigitalAnalyzerDecoderToggle.hook'
import { setupImageLightbox } from './ImageLightbox.hook'
import { setupThemeToggle } from './ThemeToggle.hook'

/**
 * Lazy load GltfViewer only when needed (contains heavy Three.js dependency)
 * This saves ~150KB of JS on pages without 3D content
 */
async function setupGltfViewersLazy(): Promise<void> {
  // Only load Three.js bundle if there are glTF viewers on the page
  if (document.querySelector('[data-gltf-viewer]')) {
    const { setupGltfViewers } = await import('./GltfViewer.hook')
    setupGltfViewers()
  }
}

export function initFeatureHooks(): void {
  setupThemeToggle()
  setupDigitalAnalyzer()
  setupDecoderToggle()
  setupComments()
  void setupGltfViewersLazy()
  setupImageLightbox()
}

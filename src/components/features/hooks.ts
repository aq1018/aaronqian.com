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
 * Lazy load GltfViewer only when viewer is about to enter viewport
 * This saves ~600KB of JS execution time until the 3D viewer is actually needed
 * Uses IntersectionObserver with a generous rootMargin to preload before visible
 */
function setupGltfViewersLazy(): void {
  const viewers = document.querySelectorAll('[data-gltf-viewer]')
  if (viewers.length === 0) return

  let loaded = false

  const loadThreeJS = async (): Promise<void> => {
    if (loaded) return
    loaded = true
    observer.disconnect()
    const { setupGltfViewers } = await import('./GltfViewer.hook')
    setupGltfViewers()
  }

  // Load when any viewer is within 200px of viewport (preload buffer)
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          void loadThreeJS()
          return
        }
      }
    },
    { rootMargin: '200px' },
  )

  for (const viewer of viewers) {
    observer.observe(viewer)
  }

  // Cleanup observer on page navigation (View Transitions)
  document.addEventListener(
    'astro:before-preparation',
    () => {
      observer.disconnect()
    },
    { once: true },
  )
}

export function initFeatureHooks(): void {
  setupThemeToggle()
  setupDigitalAnalyzer()
  setupDecoderToggle()
  setupComments()
  setupGltfViewersLazy()
  setupImageLightbox()
}

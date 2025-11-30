/**
 * Feature component lifecycle hooks
 * Initialize all feature component hooks
 */
import { setupComments } from './Comments.hook'
import { setupDigitalAnalyzer } from './DigitalAnalyzer.hook'
import { setupDecoderToggle } from './DigitalAnalyzerDecoderToggle.hook'
import { setupGltfViewers } from './GltfViewer.hook'
import { setupImageLightbox } from './ImageLightbox.hook'
import { setupThemeToggle } from './ThemeToggle.hook'

export function initFeatureHooks(): void {
  setupThemeToggle()
  setupDigitalAnalyzer()
  setupDecoderToggle()
  setupComments()
  setupGltfViewers()
  setupImageLightbox()
}

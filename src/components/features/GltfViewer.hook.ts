/**
 * GltfViewer client-side hook
 * Handles glTF file loading and 3D rendering with Three.js
 */
import type * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { isHTMLElement } from '@/utils/typeGuards'

import { setupControlButtons } from './GltfViewer.controls'
import { initializeThreeJS, startAnimation } from './GltfViewer.three'
import type { CleanupFunction, GltfViewerInstance } from './GltfViewer.types'
import {
  fitCameraToObjects,
  handleResize,
  showError,
  showSuccess,
  updateBackgroundColor,
} from './GltfViewer.utils'

let cleanup: CleanupFunction | null = null
const activeViewers = new Map<HTMLElement, GltfViewerInstance>()

/**
 * Promisify GLTFLoader.load method to avoid Promise constructor antipattern
 */
function promisifyGltfLoad(loader: GLTFLoader, fileUrl: string): Promise<THREE.Group> {
  // eslint-disable-next-line promise/avoid-new
  return new Promise<THREE.Group>((resolve, reject) => {
    loader.load(
      fileUrl,
      (gltf) => {
        resolve(gltf.scene)
      },
      undefined,
      (error) => {
        console.error('Failed to load glTF file:', error)
        const errorMessage = error instanceof Error ? error.message : 'Unknown error'
        reject(new Error(`Failed to load glTF file: ${errorMessage}`))
      },
    )
  })
}

/**
 * Load and parse glTF file
 */
function loadGltfFile(fileUrl: string): Promise<THREE.Group> {
  const loader = new GLTFLoader()
  return promisifyGltfLoad(loader, fileUrl)
}

/**
 * Initialize a single GltfViewer instance
 */
async function initializeGltfViewer(container: HTMLElement): Promise<void> {
  if (!isHTMLElement(container)) {
    console.warn('GltfViewer container is not an HTMLElement')
    return
  }

  const gltfSrc = container.dataset.gltfSrc
  if (gltfSrc == null || gltfSrc.trim() === '') {
    console.warn('GltfViewer missing data-gltf-src attribute')
    showError(container)
    return
  }

  const canvas = container.querySelector('[data-gltf-canvas]')
  if (!canvas || !isHTMLElement(canvas) || !(canvas instanceof HTMLCanvasElement)) {
    console.warn('GltfViewer missing canvas element')
    showError(container)
    return
  }

  try {
    // Load glTF file
    const gltfScene = await loadGltfFile(gltfSrc)

    // Initialize Three.js
    const instance = initializeThreeJS(container, canvas)

    // Add model to scene
    instance.scene.add(gltfScene)

    // Fit camera and start animation
    fitCameraToObjects(instance)
    startAnimation(instance)

    // Handle resize
    const resizeHandler = (): void => {
      handleResize(instance)
    }
    window.addEventListener('resize', resizeHandler)

    // Handle theme changes
    const themeChangeHandler = (): void => {
      updateBackgroundColor(instance)
    }

    // Listen for theme toggle events (common theme system events)
    document.addEventListener('theme-changed', themeChangeHandler)
    document.addEventListener('astro:after-swap', themeChangeHandler)

    // Also listen for class changes on html element (common pattern)
    const observer = new MutationObserver(() => {
      updateBackgroundColor(instance)
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class', 'data-theme'],
    })

    // Store instance for cleanup
    activeViewers.set(container, instance)

    // Setup control buttons
    setupControlButtons(instance)

    // Show success state
    showSuccess(container)
  } catch (error) {
    console.error('GltfViewer initialization failed:', error)
    showError(container)
  }
}

/**
 * Initialize all GltfViewer instances
 */
export function initializeGltfViewers(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup) {
    cleanup()
  }

  const containers = document.querySelectorAll('[data-gltf-viewer]')

  // Initialize each viewer
  containers.forEach((container) => {
    if (isHTMLElement(container)) {
      void initializeGltfViewer(container)
    }
  })

  // Return cleanup function
  cleanup = () => {
    // Stop animations and clean up Three.js instances
    activeViewers.forEach((instance) => {
      if (instance.animationId != null) {
        cancelAnimationFrame(instance.animationId)
      }
      instance.renderer.dispose()
      instance.scene.clear()
    })
    activeViewers.clear()
    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupGltfViewers(): void {
  initializeGltfViewers()

  // Re-initialize on page load (for View Transitions)
  document.addEventListener('astro:page-load', initializeGltfViewers)

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup) {
      cleanup()
    }
  })
}

/**
 * GltfViewer Utility Functions
 */
import * as THREE from 'three'

import { isHTMLElement } from '@/utils/typeGuards'

import type { GltfViewerInstance } from './GltfViewer.types'

/**
 * Get theme background color
 */
export function getThemeBackgroundColor(container: HTMLElement): string {
  const isDark = document.documentElement.classList.contains('dark')
  const darkColor = container.dataset.gltfDarkBg ?? '#0a0a0a'
  const lightColor = container.dataset.gltfLightBg ?? '#f5f5f5'
  return isDark ? darkColor : lightColor
}

/**
 * Handle window resize
 */
export function handleResize(instance: GltfViewerInstance): void {
  const rect = instance.container.getBoundingClientRect()
  const width = rect.width || 800
  const height = rect.height || 400

  instance.camera.aspect = width / height
  instance.camera.updateProjectionMatrix()
  instance.renderer.setSize(width, height)
}

/**
 * Safe element style setter
 */
export function setElementDisplay(element: Element | null, display: string): void {
  if (element && isHTMLElement(element)) {
    element.style.display = display
  }
}

/**
 * Show error state
 */
export function showError(container: HTMLElement): void {
  const loadingEl = container.querySelector('[data-gltf-loading]')
  const errorEl = container.querySelector('[data-gltf-error]')

  setElementDisplay(loadingEl, 'none')
  setElementDisplay(errorEl, 'flex')
}

/**
 * Show success state
 */
export function showSuccess(container: HTMLElement): void {
  const loadingEl = container.querySelector('[data-gltf-loading]')
  const errorEl = container.querySelector('[data-gltf-error]')
  const canvas = container.querySelector('[data-gltf-canvas]')

  setElementDisplay(loadingEl, 'none')
  setElementDisplay(errorEl, 'none')
  setElementDisplay(canvas, 'block')
  // Controls visibility is handled by CSS hover
}

/**
 * Update background color for theme changes
 */
export function updateBackgroundColor(instance: GltfViewerInstance): void {
  const newColor = getThemeBackgroundColor(instance.container)
  instance.scene.background = new THREE.Color(newColor)
}

/**
 * Fit camera to show all objects
 */
export function fitCameraToObjects(instance: GltfViewerInstance): void {
  const { scene, camera, controls } = instance

  const box = new THREE.Box3()

  // Calculate bounding box of all visible objects
  box.makeEmpty()
  scene.traverse((object) => {
    if (object instanceof THREE.Mesh) {
      box.expandByObject(object)
    }
  })

  if (box.isEmpty()) {
    // No objects to fit
    return
  }

  const center = new THREE.Vector3()
  const size = new THREE.Vector3()
  box.getCenter(center)
  box.getSize(size)

  const maxDim = Math.max(size.x, size.y, size.z)
  const fov = camera.fov * (Math.PI / 180)
  // Use tan instead of sin for proper field of view calculation
  const distance = maxDim / (2 * Math.tan(fov / 2))

  const newPosition = center.clone().add(new THREE.Vector3(distance, distance / 2, distance))

  camera.position.copy(newPosition)
  camera.lookAt(center)

  controls.target.copy(center)
  controls.update()

  // Store initial positions for reset
  if (!instance.initialCameraPosition) {
    instance.initialCameraPosition = newPosition.clone()
    instance.initialControlsTarget = center.clone()
  }
}

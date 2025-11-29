/**
 * GltfViewer Control Functions
 */
import * as THREE from 'three'

import type { GltfViewerInstance } from './GltfViewer.types'

/**
 * Handle zoom in
 */
export function zoomIn(instance: GltfViewerInstance): void {
  const { camera, controls } = instance
  const direction = new THREE.Vector3()
  direction.subVectors(camera.position, controls.target).multiplyScalar(0.8)
  camera.position.copy(controls.target).add(direction)
  controls.update()
}

/**
 * Handle zoom out
 */
export function zoomOut(instance: GltfViewerInstance): void {
  const { camera, controls } = instance
  const direction = new THREE.Vector3()
  direction.subVectors(camera.position, controls.target).multiplyScalar(1.25)
  camera.position.copy(controls.target).add(direction)
  controls.update()
}

/**
 * Reset camera view
 */
export function resetView(instance: GltfViewerInstance): void {
  if (instance.initialCameraPosition && instance.initialControlsTarget) {
    instance.camera.position.copy(instance.initialCameraPosition)
    instance.controls.target.copy(instance.initialControlsTarget)
    instance.camera.lookAt(instance.initialControlsTarget)
    instance.controls.update()
  }
}

/**
 * Toggle fullscreen
 */
export function toggleFullscreen(instance: GltfViewerInstance): void {
  if (document.fullscreenElement) {
    void document.exitFullscreen()
  } else {
    void instance.container.requestFullscreen()
  }
}

/**
 * Setup control buttons
 */
export function setupControlButtons(instance: GltfViewerInstance): void {
  const container = instance.container
  const controls = container.querySelector('[data-gltf-controls]')
  if (!controls) return

  // Fullscreen button
  const fullscreenBtn = controls.querySelector('[data-control="fullscreen"]')
  fullscreenBtn?.addEventListener('click', () => {
    toggleFullscreen(instance)
  })

  // Zoom in button
  const zoomInBtn = controls.querySelector('[data-control="zoom-in"]')
  zoomInBtn?.addEventListener('click', () => {
    zoomIn(instance)
  })

  // Zoom out button
  const zoomOutBtn = controls.querySelector('[data-control="zoom-out"]')
  zoomOutBtn?.addEventListener('click', () => {
    zoomOut(instance)
  })

  // Reset view button
  const resetBtn = controls.querySelector('[data-control="reset"]')
  resetBtn?.addEventListener('click', () => {
    resetView(instance)
  })

  // Auto rotate button
  const rotateBtn = controls.querySelector('[data-control="rotate"]')
  rotateBtn?.addEventListener('click', () => {
    instance.autoRotate = !instance.autoRotate
    if (rotateBtn instanceof HTMLElement) {
      rotateBtn.dataset.active = String(instance.autoRotate)
    }
  })
}

/**
 * GltfViewer Types and Interfaces
 */
import type * as THREE from 'three'
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export interface GltfViewerInstance {
  container: HTMLElement
  canvas: HTMLCanvasElement
  scene: THREE.Scene
  camera: THREE.PerspectiveCamera
  renderer: THREE.WebGLRenderer
  controls: OrbitControls
  animationId: number | null
  initialCameraPosition?: THREE.Vector3
  initialControlsTarget?: THREE.Vector3
  autoRotate: boolean
}

export type CleanupFunction = () => void

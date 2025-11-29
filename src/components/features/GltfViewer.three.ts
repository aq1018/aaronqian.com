/**
 * GltfViewer Three.js Initialization
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

import type { GltfViewerInstance } from './GltfViewer.types'
import { getThemeBackgroundColor } from './GltfViewer.utils'

/**
 * Initialize Three.js components
 */
export function initializeThreeJS(
  container: HTMLElement,
  canvas: HTMLCanvasElement,
): GltfViewerInstance {
  const rect = container.getBoundingClientRect()
  const width = rect.width || 800
  const height = rect.height || 400

  // Scene
  const scene = new THREE.Scene()
  const bgColor = getThemeBackgroundColor(container)
  scene.background = new THREE.Color(bgColor)

  // Camera - adjusted near/far planes for better clipping
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10_000)
  camera.position.set(5, 5, 5)

  // Renderer
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true })
  renderer.setSize(width, height)
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  renderer.outputColorSpace = THREE.SRGBColorSpace

  // Controls
  const controls = new OrbitControls(camera, canvas)
  controls.enableDamping = true
  controls.dampingFactor = 0.05
  controls.enableZoom = true
  controls.enablePan = true

  // Lighting
  const ambientLight = new THREE.AmbientLight(0x40_40_40, 0.7)
  scene.add(ambientLight)

  const hemisphereLight = new THREE.HemisphereLight(0xff_ff_ff, 0x22_22_22, 0.7)
  scene.add(hemisphereLight)

  const directionalLight = new THREE.DirectionalLight(0xff_ff_ff, 1)
  directionalLight.position.set(50, 100, 50)
  directionalLight.castShadow = true
  directionalLight.shadow.mapSize.width = 2048
  directionalLight.shadow.mapSize.height = 2048
  scene.add(directionalLight)

  const instance: GltfViewerInstance = {
    container,
    canvas,
    scene,
    camera,
    renderer,
    controls,
    animationId: null,
    autoRotate: true, // Start with auto-rotate enabled
  }

  return instance
}

/**
 * Start animation loop
 */
export function startAnimation(instance: GltfViewerInstance): void {
  const animate = (): void => {
    instance.animationId = requestAnimationFrame(animate)

    // Handle auto-rotation
    if (instance.autoRotate) {
      instance.controls.autoRotate = true
      instance.controls.autoRotateSpeed = 2
    } else {
      instance.controls.autoRotate = false
    }

    instance.controls.update()
    instance.renderer.render(instance.scene, instance.camera)
  }
  animate()
}

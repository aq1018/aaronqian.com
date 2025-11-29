/* eslint-disable max-lines */
/**
 * GltfViewer client-side hook
 * Handles glTF file loading and 3D rendering with Three.js
 */
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

import { isHTMLElement } from '@/utils/typeGuards'

type CleanupFunction = () => void

interface GltfViewerInstance {
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
 * Get theme-aware background color for Three.js scene
 */
function getThemeBackgroundColor(container: HTMLElement): number {
  const computedStyle = getComputedStyle(container)
  const bgColor = computedStyle.getPropertyValue('--color-surface-1').trim()

  // Convert CSS color to Three.js color, fallback to theme-based default
  if (bgColor) {
    try {
      return new THREE.Color(bgColor).getHex()
    } catch {
      // Fallback if CSS color parsing fails
      return document.documentElement.classList.contains('dark') ? 0x1a_1a_1a : 0xf5_f5_f5
    }
  }

  // Default fallback
  return document.documentElement.classList.contains('dark') ? 0x1a_1a_1a : 0xf5_f5_f5
}

/**
 * Initialize Three.js scene and renderer
 */
function initializeThreeJS(container: HTMLElement, canvas: HTMLCanvasElement): GltfViewerInstance {
  const rect = container.getBoundingClientRect()
  const width = rect.width || 800
  const height = rect.height || 400

  // Scene with theme-aware background
  const scene = new THREE.Scene()
  scene.background = new THREE.Color(getThemeBackgroundColor(container))

  // Camera with closer near plane for detailed PCB viewing
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.01, 10_000)
  camera.position.set(0, 80, 150)

  // Renderer
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  })
  renderer.setSize(width, height)
  renderer.setPixelRatio(window.devicePixelRatio)
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
function startAnimation(instance: GltfViewerInstance): void {
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

/**
 * Fit camera to show all objects
 */
function fitCameraToObjects(instance: GltfViewerInstance): void {
  const { scene, camera, controls } = instance

  const box = new THREE.Box3()
  const meshes: THREE.Object3D[] = []

  // Find all meshes in the scene
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      meshes.push(child)
    }
  })

  if (meshes.length === 0) {
    return
  }

  // Calculate bounding box
  meshes.forEach((mesh) => {
    box.expandByObject(mesh)
  })

  const center = box.getCenter(new THREE.Vector3())
  const size = box.getSize(new THREE.Vector3())

  const maxDim = Math.max(size.x, size.y, size.z)
  const distance = maxDim * 1.2

  // Position camera
  const newPosition = new THREE.Vector3(
    center.x + distance,
    center.y + distance,
    center.z + distance,
  )
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

/**
 * Handle window resize
 */
function handleResize(instance: GltfViewerInstance): void {
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
function setElementDisplay(element: Element | null, display: string): void {
  if (element && isHTMLElement(element)) {
    element.style.display = display
  }
}

/**
 * Show error state
 */
function showError(container: HTMLElement): void {
  const loadingEl = container.querySelector('[data-gltf-loading]')
  const errorEl = container.querySelector('[data-gltf-error]')

  setElementDisplay(loadingEl, 'none')
  setElementDisplay(errorEl, 'flex')
}

/**
 * Show success state
 */
function showSuccess(container: HTMLElement): void {
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
function updateBackgroundColor(instance: GltfViewerInstance): void {
  const newColor = getThemeBackgroundColor(instance.container)
  instance.scene.background = new THREE.Color(newColor)
}

/**
 * Handle zoom in
 */
function zoomIn(instance: GltfViewerInstance): void {
  const { camera, controls } = instance
  const direction = new THREE.Vector3()
  direction.subVectors(camera.position, controls.target).multiplyScalar(0.8)
  camera.position.copy(controls.target).add(direction)
  controls.update()
}

/**
 * Handle zoom out
 */
function zoomOut(instance: GltfViewerInstance): void {
  const { camera, controls } = instance
  const direction = new THREE.Vector3()
  direction.subVectors(camera.position, controls.target).multiplyScalar(1.25)
  camera.position.copy(controls.target).add(direction)
  controls.update()
}

/**
 * Reset camera view
 */
function resetView(instance: GltfViewerInstance): void {
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
async function toggleFullscreen(container: HTMLElement): Promise<void> {
  try {
    if (document.fullscreenElement) {
      await document.exitFullscreen()
    } else {
      await container.requestFullscreen()
    }
  } catch (error) {
    console.warn('Fullscreen API not supported or failed:', error)
  }
}

/**
 * Setup control buttons
 */
function setupControlButtons(instance: GltfViewerInstance): void {
  const controls = instance.container.querySelector('[data-gltf-controls]')
  if (!controls || !isHTMLElement(controls)) {
    return
  }

  // Show controls
  controls.style.display = 'flex'

  // Fullscreen button
  const fullscreenBtn = controls.querySelector('[data-control="fullscreen"]')
  if (fullscreenBtn && isHTMLElement(fullscreenBtn)) {
    fullscreenBtn.addEventListener('click', () => {
      void toggleFullscreen(instance.container)
    })
  }

  // Zoom in button
  const zoomInBtn = controls.querySelector('[data-control="zoom-in"]')
  if (zoomInBtn && isHTMLElement(zoomInBtn)) {
    zoomInBtn.addEventListener('click', () => {
      zoomIn(instance)
    })
  }

  // Zoom out button
  const zoomOutBtn = controls.querySelector('[data-control="zoom-out"]')
  if (zoomOutBtn && isHTMLElement(zoomOutBtn)) {
    zoomOutBtn.addEventListener('click', () => {
      zoomOut(instance)
    })
  }

  // Reset view button
  const resetBtn = controls.querySelector('[data-control="reset"]')
  if (resetBtn && isHTMLElement(resetBtn)) {
    resetBtn.addEventListener('click', () => {
      resetView(instance)
    })
  }

  // Auto-rotate toggle button
  const rotateBtn = controls.querySelector('[data-control="rotate"]')
  if (rotateBtn && isHTMLElement(rotateBtn)) {
    rotateBtn.addEventListener('click', () => {
      instance.autoRotate = !instance.autoRotate
      rotateBtn.dataset.active = instance.autoRotate.toString()
    })
  }
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

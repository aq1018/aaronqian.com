/**
 * ImageLightbox component hook
 * Manages fullscreen image viewing with View Transitions support
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null
let isOpen = false

/**
 * Initialize image lightbox functionality
 * Sets up click handlers for images and lightbox controls
 * Returns a cleanup function to prevent memory leaks
 */
export function initializeImageLightbox(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup) {
    cleanup()
  }

  const overlay = document.querySelector<HTMLElement>('[data-lightbox-overlay]')
  const lightboxImage = document.querySelector<HTMLImageElement>('[data-lightbox-image]')
  const closeButton = document.querySelector<HTMLElement>('[data-lightbox-close]')

  console.log('[ImageLightbox] Initializing:', {
    overlay: !!overlay,
    lightboxImage: !!lightboxImage,
  })

  if (!overlay || !lightboxImage) {
    console.warn('[ImageLightbox] Missing required elements')
    cleanup = null
    return () => {}
  }

  const handlers = new Map<Element, EventListener>()

  setupImageTriggers(overlay, lightboxImage, handlers)
  setupCloseHandlers(overlay, closeButton, handlers)

  const escapeHandler = setupEscapeHandler(overlay)
  document.addEventListener('keydown', escapeHandler)

  // Return cleanup function
  cleanup = () => {
    handlers.forEach((handler, element) => {
      element.removeEventListener('click', handler)
    })
    document.removeEventListener('keydown', escapeHandler)
    handlers.clear()
    if (isOpen) {
      closeLightbox(overlay)
    }
    cleanup = null
  }

  return cleanup
}

/**
 * Setup image click triggers
 */
function setupImageTriggers(
  overlay: HTMLElement,
  lightboxImage: HTMLImageElement,
  handlers: Map<Element, EventListener>,
): void {
  // Find all images and check for data attribute (React renders as dataLightboxTrigger property)
  const allImages = document.querySelectorAll<HTMLImageElement>('img')
  const triggers: HTMLImageElement[] = []

  allImages.forEach((img) => {
    // Check if image has the lightbox trigger attribute
    // MDX/React renders data-lightbox-trigger as dataLightboxTrigger (camelCase attribute)
    // Use dataset API for cleaner code, but also check camelCase attribute for MDX compatibility
    if ('lightboxTrigger' in img.dataset || img.hasAttribute('dataLightboxTrigger')) {
      triggers.push(img)
    }
  })

  console.log('[ImageLightbox] Found triggers:', triggers.length)

  triggers.forEach((trigger) => {
    const handler = (e: Event) => {
      e.preventDefault()
      openLightbox(trigger, overlay, lightboxImage)
    }
    trigger.addEventListener('click', handler)
    handlers.set(trigger, handler)
  })
}

/**
 * Setup close handlers for button and overlay
 */
function setupCloseHandlers(
  overlay: HTMLElement,
  closeButton: HTMLElement | null,
  handlers: Map<Element, EventListener>,
): void {
  // Handle close button
  const closeHandler = () => {
    closeLightbox(overlay)
  }
  if (closeButton) {
    closeButton.addEventListener('click', closeHandler)
    handlers.set(closeButton, closeHandler)
  }

  // Handle overlay click (click outside image)
  const overlayHandler = (e: Event) => {
    if (e.target === overlay) {
      closeLightbox(overlay)
    }
  }
  overlay.addEventListener('click', overlayHandler)
  handlers.set(overlay, overlayHandler)
}

/**
 * Setup escape key handler
 */
function setupEscapeHandler(overlay: HTMLElement): (e: KeyboardEvent) => void {
  return (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) {
      closeLightbox(overlay)
    }
  }
}

/**
 * Open the lightbox with the clicked image
 */
function openLightbox(
  trigger: HTMLImageElement,
  overlay: HTMLElement,
  lightboxImage: HTMLImageElement,
): void {
  // Set the image source and alt text
  const src = trigger.src || trigger.dataset.src
  const alt = trigger.alt || ''

  if (src == null || src === '') return

  lightboxImage.src = src
  lightboxImage.alt = alt

  // Show overlay
  overlay.classList.remove('hidden')
  overlay.setAttribute('aria-hidden', 'false')

  // Trigger reflow to ensure transition works
  void overlay.offsetHeight
  overlay.classList.add('active')

  // Prevent body scroll
  document.body.classList.add('lightbox-open')
  isOpen = true
}

/**
 * Close the lightbox
 */
function closeLightbox(overlay: HTMLElement): void {
  overlay.classList.remove('active')
  overlay.setAttribute('aria-hidden', 'true')

  // Wait for transition to complete before hiding
  setTimeout(() => {
    if (!isOpen) {
      overlay.classList.add('hidden')
    }
  }, 200)

  // Re-enable body scroll
  document.body.classList.remove('lightbox-open')
  isOpen = false
}

/**
 * Setup function called by hooks orchestrator
 * Registers its own astro:page-load listener
 */
export function setupImageLightbox(): void {
  // Initial setup on first page load
  initializeImageLightbox()

  // Re-initialize after View Transitions navigation
  document.addEventListener('astro:page-load', () => {
    initializeImageLightbox()
  })

  // Cleanup before page swap to prevent memory leaks
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup != null) {
      cleanup()
    }
  })
}

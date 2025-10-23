/**
 * Centralized parallax manager
 * Handles mouse parallax effect on hero section
 * Properly cleans up on navigation for Astro View Transitions
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Initialize parallax behavior
 * Creates subtle mouse-driven parallax effect
 */
export function initializeParallax(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  const hero = document.querySelector<HTMLElement>('[data-parallax]')
  const parallaxBg = document.querySelector<HTMLElement>('[data-parallax-target]')

  // Early return if required elements don't exist
  if (hero === null || parallaxBg === null) {
    cleanup = () => {}
    return cleanup
  }

  let rafId: number | null = null

  const handleMouseMove = (e: MouseEvent): void => {
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions -- RAF ID can be 0 (falsy) or a positive number (truthy)
    if (rafId) return

    rafId = requestAnimationFrame(() => {
      const { clientX, clientY } = e
      const { innerWidth, innerHeight } = window

      const xOffset = ((clientX - innerWidth / 2) / innerWidth) * 15
      const yOffset = ((clientY - innerHeight / 2) / innerHeight) * 15

      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Guard against runtime edge cases
      if (parallaxBg !== null) {
        parallaxBg.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      }
      rafId = null
    })
  }

  const handleMouseLeave = (): void => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition -- Guard against runtime edge cases
    if (parallaxBg !== null) {
      parallaxBg.style.transform = 'translate(0, 0)'
    }
  }

  hero.addEventListener('mousemove', handleMouseMove)
  hero.addEventListener('mouseleave', handleMouseLeave)

  // Return cleanup function
  cleanup = () => {
    hero.removeEventListener('mousemove', handleMouseMove)
    hero.removeEventListener('mouseleave', handleMouseLeave)

    // Cancel pending RAF
    if (rafId !== null) {
      cancelAnimationFrame(rafId)
      rafId = null
    }

    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupParallax(): void {
  initializeParallax()

  // Re-initialize on page load (for View Transitions)
  document.addEventListener('astro:page-load', initializeParallax)

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}

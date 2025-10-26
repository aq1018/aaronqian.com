/**
 * Centralized comments manager
 * Syncs Giscus theme with site theme changes
 */

type CleanupFunction = () => void

let cleanup: CleanupFunction | null = null

/**
 * Get current theme from document
 */
function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light'
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Get the Giscus theme URL for the current theme
 */
function getGiscusThemeUrl(theme: 'light' | 'dark'): string {
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}/giscus-${theme}.generated.css`
}

/**
 * Send theme change message to Giscus iframe
 */
function syncGiscusTheme(theme: 'light' | 'dark'): void {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (iframe?.contentWindow == null) return

  const themeUrl = getGiscusThemeUrl(theme)

  // Use wildcard origin in development to avoid CORS issues
  // In production, use specific origin for better security
  const isDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
  let targetOrigin: string = isDev ? '*' : 'https://giscus.app'

  // In production, try to extract actual iframe origin
  if (!isDev) {
    try {
      if (iframe.src !== '') {
        const url = new URL(iframe.src)
        targetOrigin = url.origin
      }
    } catch {
      // Keep default if parsing fails
    }
  }

  try {
    iframe.contentWindow.postMessage(
      {
        giscus: {
          setConfig: {
            theme: themeUrl,
          },
        },
      },
      targetOrigin,
    )
  } catch (error) {
    // Silently fail - theme syncing is non-critical
    console.debug('Failed to sync Giscus theme:', error)
  }
}

/**
 * Initialize comments behavior
 * Watches for theme changes and syncs with Giscus
 */
export function initializeComments(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup !== null) {
    cleanup()
  }

  // Get comments container
  const commentsContainer = document.querySelector('[data-comments]')

  // Return early if comments don't exist on this page
  if (commentsContainer === null) {
    return () => {}
  }

  // Watch for theme changes on documentElement
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
        const theme = getCurrentTheme()
        syncGiscusTheme(theme)
      }
    })
  })

  // Start observing theme changes
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['class'],
  })

  // Set initial theme once iframe loads
  // Giscus iframe may not exist immediately, so we wait for it
  const checkIframe = setInterval(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (iframe !== null) {
      clearInterval(checkIframe)
      // Wait a bit for iframe to be ready
      setTimeout(() => {
        const theme = getCurrentTheme()
        syncGiscusTheme(theme)
      }, 100)
    }
  }, 100)

  // Cleanup after 10 seconds if iframe never loads
  const cleanupTimeout = setTimeout(() => {
    clearInterval(checkIframe)
  }, 10000)

  // Return cleanup function
  cleanup = () => {
    observer.disconnect()
    clearInterval(checkIframe)
    clearTimeout(cleanupTimeout)
    cleanup = null
  }

  return cleanup
}

/**
 * Setup with automatic cleanup for Astro View Transitions
 */
export function setupComments(): void {
  initializeComments()

  // Re-initialize on page load (for View Transitions)
  document.addEventListener('astro:page-load', initializeComments)

  // Cleanup before navigation
  document.addEventListener('astro:before-preparation', () => {
    if (cleanup !== null) {
      cleanup()
    }
  })
}

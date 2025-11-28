/**
 * Centralized comments manager
 * Syncs Giscus theme with site theme changes
 */
import { isHTMLElement } from '@/utils/typeGuards'

type CleanupFunction = () => void

/**
 * Message structure for Giscus theme configuration
 */
export interface GiscusMessage {
  giscus: {
    setConfig: {
      theme: string
    }
  }
}

let cleanup: CleanupFunction | null

/**
 * Get current theme from document
 * Exported for testing
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') {
    return 'light'
  }
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light'
}

/**
 * Get the Giscus theme URL for the current theme
 * Exported for testing
 */
export function getGiscusThemeUrl(theme: 'light' | 'dark'): string {
  // Always use custom theme files with full URL
  // In dev, this will cause a CORS error but Giscus will fallback to default theme
  // In production, the custom themes will load correctly
  const origin = typeof window === 'undefined' ? '' : window.location.origin
  return `${origin}/giscus-${theme}.generated.css`
}

/**
 * Send theme change message to Giscus iframe
 * Exported for testing
 */
export function syncGiscusTheme(theme: 'light' | 'dark'): void {
  const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
  if (iframe?.contentWindow == null) {
    return
  }

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

  const message: GiscusMessage = {
    giscus: {
      setConfig: {
        theme: themeUrl,
      },
    },
  }

  try {
    iframe.contentWindow.postMessage(message, targetOrigin)
  } catch (error) {
    // Silently fail - theme syncing is non-critical
    console.debug('Failed to sync Giscus theme:', error)
  }
}

/**
 * Wait for Giscus iframe to be ready
 */
function waitForGiscusIframe(theme: 'light' | 'dark', callback: () => void): void {
  let checkCount = 0
  const maxChecks = 100 // 5 seconds at 50ms intervals

  const checkInterval = setInterval(() => {
    checkCount++
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')

    if (iframe?.contentWindow != null) {
      clearInterval(checkInterval)
      // Give iframe a moment to initialize
      setTimeout(() => {
        syncGiscusTheme(theme)
        callback()
      }, 100)
    } else if (checkCount >= maxChecks) {
      clearInterval(checkInterval)
      callback()
    }
  }, 50)
}

/**
 * Create Giscus script element
 */
function createGiscusScript(container: HTMLElement): HTMLScriptElement | null {
  const repo = container.dataset.giscusRepo
  const repoId = container.dataset.giscusRepoId
  const category = container.dataset.giscusCategory
  const categoryId = container.dataset.giscusCategoryId

  if (repo == null || repoId == null || category == null || categoryId == null) {
    console.warn('Missing Giscus configuration data attributes')
    return null
  }

  const theme = getCurrentTheme()
  const themeUrl = getGiscusThemeUrl(theme)

  const script = document.createElement('script')
  script.src = 'https://giscus.app/client.js'
  script.dataset.repo = repo
  script.dataset.repoId = repoId
  script.dataset.category = category
  script.dataset.categoryId = categoryId
  script.dataset.mapping = 'pathname'
  script.dataset.strict = '0'
  script.dataset.reactionsEnabled = '1'
  script.dataset.emitMetadata = '0'
  script.dataset.inputPosition = 'top'
  script.dataset.theme = themeUrl
  script.dataset.lang = 'en'
  script.dataset.loading = 'lazy'
  script.setAttribute('crossorigin', 'anonymous')
  script.async = true

  return script
}

/**
 * Initialize Giscus script on the page
 */
function loadGiscusScript(container: Element): void {
  // Check if Giscus is already loaded in this container
  const existingScript = container.querySelector('script[src*="giscus.app"]')
  const existingFrame = container.querySelector('iframe.giscus-frame')

  if (existingScript || existingFrame) {
    // Giscus already loaded, just sync theme
    const theme = getCurrentTheme()
    syncGiscusTheme(theme)
    return
  }

  // Type guard to ensure container is HTMLElement
  if (!isHTMLElement(container)) {
    console.warn('Comments container is not an HTMLElement')
    return
  }

  const script = createGiscusScript(container)
  if (script == null) {
    return
  }

  const theme = getCurrentTheme()

  // Wait for script to load and create iframe
  script.addEventListener('load', () => {
    waitForGiscusIframe(theme, () => {
      // Theme has been synced in waitForGiscusIframe
    })
  })

  // Append to container
  container.append(script)
}

/**
 * Initialize comments behavior
 * Watches for theme changes and syncs with Giscus
 */
export function initializeComments(): CleanupFunction {
  // Clean up previous initialization if it exists
  if (cleanup) {
    cleanup()
  }

  // Get comments container
  const commentsContainer = document.querySelector('[data-comments]')

  // Return early if comments don't exist on this page
  if (commentsContainer == null) {
    return () => {}
  }

  // Load Giscus script
  loadGiscusScript(commentsContainer)

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
    attributeFilter: ['class'],
    attributes: true,
  })

  // Set initial theme once iframe loads
  // Giscus iframe may not exist immediately, so we wait for it
  const checkIframe = setInterval(() => {
    const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
    if (iframe) {
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
  }, 10_000)

  // Return cleanup function
  cleanup = () => {
    observer.disconnect()
    clearInterval(checkIframe)
    clearTimeout(cleanupTimeout)

    // Remove Giscus elements on cleanup to ensure fresh start on next page
    const giscusFrame = document.querySelector('.giscus-frame')
    const giscusScript = document.querySelector('script[src*="giscus.app"]')
    if (giscusFrame) {
      giscusFrame.remove()
    }
    if (giscusScript) {
      giscusScript.remove()
    }

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
    if (cleanup) {
      cleanup()
    }
  })
}

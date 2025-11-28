import { describe, expect, it, vi } from 'vitest'

import { setupTestDOM } from '@test/testHelpers'

import {
  getCurrentTheme,
  getGiscusThemeUrl,
  initializeComments,
  setupComments,
  syncGiscusTheme,
} from './Comments.hook'
import type { GiscusMessage } from './Comments.hook'

// Type guard for GiscusMessage
function isGiscusMessage(value: unknown): value is GiscusMessage {
  return (
    typeof value === 'object' &&
    value != null &&
    'giscus' in value &&
    typeof value.giscus === 'object' &&
    value.giscus != null &&
    'setConfig' in value.giscus &&
    typeof value.giscus.setConfig === 'object' &&
    value.giscus.setConfig != null &&
    'theme' in value.giscus.setConfig &&
    typeof value.giscus.setConfig.theme === 'string'
  )
}

// Type guard for postMessage call arguments
function isPostMessageCall(value: unknown): value is [GiscusMessage, string] {
  return (
    Array.isArray(value) &&
    value.length === 2 &&
    isGiscusMessage(value[0]) &&
    typeof value[1] === 'string'
  )
}

// Helper to create a complete MutationRecord for testing
function createMutationRecord(partial: {
  type: MutationRecordType
  target: Node
  attributeName?: string | null
}): MutationRecord {
  return {
    addedNodes: document.createDocumentFragment().childNodes,
    attributeName: partial.attributeName ?? null,
    attributeNamespace: null,
    nextSibling: null,
    oldValue: null,
    previousSibling: null,
    removedNodes: document.createDocumentFragment().childNodes,
    target: partial.target,
    type: partial.type,
  }
}

describe('Comments System', () => {
  // Helper to setup and teardown fake timers
  function setupFakeTimers(): () => void {
    vi.clearAllTimers()
    vi.useFakeTimers()
    return () => {
      vi.clearAllTimers()
      vi.useRealTimers()
    }
  }

  describe('getCurrentTheme', () => {
    it('should return "light" when dark class is not present', () => {
      document.documentElement.classList.remove('dark')
      expect(getCurrentTheme()).toBe('light')
    })

    it('should return "dark" when dark class is present', () => {
      document.documentElement.classList.add('dark')
      expect(getCurrentTheme()).toBe('dark')
    })
  })

  describe('getGiscusThemeUrl', () => {
    it('should return light theme URL', () => {
      const url = getGiscusThemeUrl('light')
      expect(url).toMatch(/\/giscus-light\.generated\.css$/)
      expect(url).toContain(window.location.origin)
    })

    it('should return dark theme URL', () => {
      const url = getGiscusThemeUrl('dark')
      expect(url).toMatch(/\/giscus-dark\.generated\.css$/)
      expect(url).toContain(window.location.origin)
    })
  })

  describe('syncGiscusTheme', () => {
    it('should send theme change message to giscus iframe', () => {
      const domCleanup = setupTestDOM(`
        <iframe class="giscus-frame"></iframe>
      `)

      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      expect(iframe).not.toBeNull()
      if (iframe == null) {
        return
      }

      const postMessageSpy = vi.fn<Window['postMessage']>()
      Object.defineProperty(iframe, 'contentWindow', {
        value: {
          postMessage: postMessageSpy,
        },
        writable: true,
      })

      syncGiscusTheme('dark')

      expect(postMessageSpy).toHaveBeenCalledTimes(1)
      const message: unknown = postMessageSpy.mock.calls[0]?.[0]
      if (isGiscusMessage(message)) {
        expect(message.giscus.setConfig.theme).toContain('giscus-dark.generated.css')
      } else {
        throw new Error('Expected postMessage to be called with GiscusMessage')
      }
      expect(postMessageSpy.mock.calls[0]?.[1]).toBe('*')

      domCleanup()
    })

    it('should handle missing iframe gracefully', () => {
      const domCleanup = setupTestDOM(`<div>No iframe here</div>`)

      // Should not throw
      expect(() => {
        syncGiscusTheme('light')
      }).not.toThrow()

      domCleanup()
    })

    it('should handle iframe without contentWindow gracefully', () => {
      const domCleanup = setupTestDOM(`
        <iframe class="giscus-frame"></iframe>
      `)

      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      if (iframe == null) {
        return
      }

      Object.defineProperty(iframe, 'contentWindow', {
        value: null,
        writable: true,
      })

      // Should not throw
      expect(() => {
        syncGiscusTheme('dark')
      }).not.toThrow()

      domCleanup()
    })

    it('should use wildcard origin in development', () => {
      const domCleanup = setupTestDOM(`
        <iframe class="giscus-frame"></iframe>
      `)

      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      if (iframe == null) {
        return
      }

      const postMessageSpy = vi.fn()
      Object.defineProperty(iframe, 'contentWindow', {
        value: {
          postMessage: postMessageSpy,
        },
        writable: true,
      })

      syncGiscusTheme('light')

      // In test environment (localhost), should use '*' for CORS flexibility
      expect(postMessageSpy).toHaveBeenCalledWith(expect.any(Object), '*')

      domCleanup()
    })
  })

  describe('initializeComments', () => {
    it('should initialize comments when container exists', () => {
      const timerCleanup = setupFakeTimers()
      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        ></div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        // Filter out Giscus scripts but append everything else normally
        for (const node of nodes) {
          if (!(node instanceof HTMLScriptElement && node.src?.includes('giscus.app'))) {
            // Use appendChild for non-script nodes (works with both Node and string)
            if (typeof node === 'string') {
              this.insertAdjacentHTML('beforeend', node)
            } else {
              this.append(node)
            }
          }
        }
      })

      const cleanup = initializeComments()

      const container = document.querySelector('[data-comments]')
      expect(container).toBeDefined()
      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
      domCleanup()
      timerCleanup()
    })

    it('should return early if comments container does not exist', () => {
      const timerCleanup = setupFakeTimers()
      const domCleanup = setupTestDOM(`<div>No comments here</div>`)

      const cleanup = initializeComments()

      // Should not throw error
      expect(cleanup).toBeDefined()
      expect(typeof cleanup).toBe('function')

      cleanup()
      domCleanup()
      timerCleanup()
    })

    it('should sync theme to giscus iframe when theme changes to dark', () => {
      const timerCleanup = setupFakeTimers()

      // Start with light theme (no dark class)
      document.documentElement.classList.remove('dark')

      // Capture the MutationObserver callback
      let observerCallback: MutationCallback | undefined
      const OriginalMutationObserver = window.MutationObserver
      window.MutationObserver = class MockMutationObserver extends OriginalMutationObserver {
        constructor(callback: MutationCallback) {
          super(callback)
          observerCallback = callback
        }
      }

      // Setup DOM with comments container and giscus iframe
      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        >
          <iframe class="giscus-frame"></iframe>
        </div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      expect(iframe).not.toBeNull()
      if (iframe == null) {
        return
      }

      const postMessageSpy = vi.fn<Window['postMessage']>()

      // Mock iframe contentWindow
      Object.defineProperty(iframe, 'contentWindow', {
        value: {
          postMessage: postMessageSpy,
        },
        writable: true,
      })

      const cleanup = initializeComments()

      // Fast-forward to allow iframe detection and initial theme sync
      vi.advanceTimersByTime(200)

      // Clear initial theme sync call
      postMessageSpy.mockClear()

      // Simulate theme change to dark
      document.documentElement.classList.add('dark')

      // Manually trigger the MutationObserver callback
      expect(observerCallback).toBeDefined()
      if (observerCallback) {
        const mockMutations: MutationRecord[] = [
          createMutationRecord({
            attributeName: 'class',
            target: document.documentElement,
            type: 'attributes',
          }),
        ]
        observerCallback(mockMutations, new OriginalMutationObserver(() => {}))
      }

      // Should have sent message to set dark theme
      expect(postMessageSpy).toHaveBeenCalledTimes(1)
      const callArgs: unknown = postMessageSpy.mock.calls[0]
      if (isPostMessageCall(callArgs)) {
        const [message, origin] = callArgs
        expect(message.giscus.setConfig.theme).toContain('giscus-dark.generated.css')
        expect(origin).toBe('*')
      } else {
        throw new Error('Expected postMessage to be called with valid arguments')
      }

      // Restore original MutationObserver
      window.MutationObserver = OriginalMutationObserver

      cleanup()
      domCleanup()
      timerCleanup()
    })

    it('should sync theme to giscus iframe when theme changes to light', () => {
      const timerCleanup = setupFakeTimers()

      // Start with dark theme
      document.documentElement.classList.add('dark')

      // Capture the MutationObserver callback
      let observerCallback: MutationCallback | undefined
      const OriginalMutationObserver = window.MutationObserver
      window.MutationObserver = class MockMutationObserver extends OriginalMutationObserver {
        constructor(callback: MutationCallback) {
          super(callback)
          observerCallback = callback
        }
      }

      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        >
          <iframe class="giscus-frame"></iframe>
        </div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      expect(iframe).not.toBeNull()
      if (iframe == null) {
        return
      }

      const postMessageSpy = vi.fn<Window['postMessage']>()

      Object.defineProperty(iframe, 'contentWindow', {
        value: {
          postMessage: postMessageSpy,
        },
        writable: true,
      })

      const cleanup = initializeComments()

      // Fast-forward to allow iframe detection
      vi.advanceTimersByTime(200)

      // Clear previous calls
      postMessageSpy.mockClear()

      // Simulate theme change to light
      document.documentElement.classList.remove('dark')

      // Manually trigger the MutationObserver callback
      expect(observerCallback).toBeDefined()
      if (observerCallback) {
        const mockMutations: MutationRecord[] = [
          createMutationRecord({
            attributeName: 'class',
            target: document.documentElement,
            type: 'attributes',
          }),
        ]
        observerCallback(mockMutations, new OriginalMutationObserver(() => {}))
      }

      // Should have sent message to set light theme
      expect(postMessageSpy).toHaveBeenCalledTimes(1)
      const callArgs: unknown = postMessageSpy.mock.calls[0]
      if (isPostMessageCall(callArgs)) {
        const [message, origin] = callArgs
        expect(message.giscus.setConfig.theme).toContain('giscus-light.generated.css')
        expect(origin).toBe('*')
      } else {
        throw new Error('Expected postMessage to be called with valid arguments')
      }

      // Restore original MutationObserver
      window.MutationObserver = OriginalMutationObserver

      cleanup()
      domCleanup()
      timerCleanup()
    })

    it('should set initial theme when iframe loads', () => {
      const timerCleanup = setupFakeTimers()

      // Start with Giscus iframe already loaded (simulating after Giscus script loads)
      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        >
          <iframe class="giscus-frame"></iframe>
        </div>
      `)

      // Mock the iframe's contentWindow.postMessage
      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      expect(iframe).not.toBeNull()
      if (iframe == null) {
        return
      }

      const postMessageSpy = vi.fn()
      Object.defineProperty(iframe, 'contentWindow', {
        value: {
          postMessage: postMessageSpy,
        },
        writable: true,
        configurable: true,
      })

      // Mock script append to prevent external script loading
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src?.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      // Initialize comments - should detect existing iframe and set initial theme
      const cleanup = initializeComments()

      // Fast-forward to trigger the interval check
      vi.advanceTimersByTime(200)

      // Should have sent initial theme message (may be called more than once due to interval + timeout)
      expect(postMessageSpy).toHaveBeenCalled()

      // Check the first call
      const callArgs: unknown = postMessageSpy.mock.calls[0]
      if (isPostMessageCall(callArgs)) {
        const [message, origin] = callArgs
        // Default theme is light (no dark class on documentElement)
        expect(message.giscus.setConfig.theme).toContain('giscus-light.generated.css')
        expect(origin).toBe('*') // Uses wildcard in dev environment
      } else {
        throw new Error('Expected postMessage to be called with valid arguments')
      }

      cleanup()
      domCleanup()
      timerCleanup()
    })

    it('should handle iframe not loading within timeout', () => {
      const timerCleanup = setupFakeTimers()
      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        ></div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      const cleanup = initializeComments()

      // Fast-forward past the 10 second timeout
      vi.advanceTimersByTime(11_000)

      // Should not throw error even though iframe never loaded
      expect(() => {
        cleanup()
      }).not.toThrow()

      cleanup()
      domCleanup()
      timerCleanup()
    })

    it('should configure MutationObserver to watch documentElement classList changes', () => {
      const timerCleanup = setupFakeTimers()

      // Mock MutationObserver to capture configuration
      let observedElement: Node | null = null
      let observerOptions: MutationObserverInit | null = null

      const OriginalMutationObserver = window.MutationObserver
      window.MutationObserver = class MockMutationObserver extends OriginalMutationObserver {
        observe(target: Node, options?: MutationObserverInit): void {
          observedElement = target
          observerOptions = options ?? null
          super.observe(target, options)
        }
      }

      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        ></div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      const cleanup = initializeComments()

      // Verify observer is configured correctly
      expect(observedElement).toBe(document.documentElement)
      expect(observerOptions).toEqual({
        attributeFilter: ['class'],
        attributes: true,
      })

      // Restore original MutationObserver
      window.MutationObserver = OriginalMutationObserver

      cleanup()
      domCleanup()
      timerCleanup()
    })

    it('should clean up MutationObserver when cleanup is called', () => {
      const timerCleanup = setupFakeTimers()
      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        >
          <iframe class="giscus-frame"></iframe>
        </div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      expect(iframe).not.toBeNull()
      if (iframe == null) {
        return
      }

      const postMessageSpy = vi.fn()

      Object.defineProperty(iframe, 'contentWindow', {
        value: {
          postMessage: postMessageSpy,
        },
        writable: true,
      })

      const cleanup = initializeComments()

      // Fast-forward to allow iframe detection
      vi.advanceTimersByTime(200)

      // Call cleanup
      cleanup()

      // Clear previous calls
      postMessageSpy.mockClear()

      // Simulate theme change after cleanup
      document.documentElement.classList.add('dark')

      // Wait for potential MutationObserver callback
      vi.advanceTimersByTime(100)

      // Should NOT send message because observer was disconnected
      expect(postMessageSpy).not.toHaveBeenCalled()

      domCleanup()
      timerCleanup()
    })

    it('should clean up previous initialization when called multiple times', () => {
      const timerCleanup = setupFakeTimers()

      // Track observer disconnect calls
      const disconnectCalls: number[] = []
      let observerIndex = 0

      const OriginalMutationObserver = window.MutationObserver
      window.MutationObserver = class MockMutationObserver extends OriginalMutationObserver {
        private readonly myIndex: number

        constructor(callback: MutationCallback) {
          super(callback)
          this.myIndex = observerIndex
          observerIndex += 1
        }

        disconnect(): void {
          disconnectCalls.push(this.myIndex)
          super.disconnect()
        }
      }

      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        >
          <iframe class="giscus-frame"></iframe>
        </div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      const iframe = document.querySelector<HTMLIFrameElement>('iframe.giscus-frame')
      expect(iframe).not.toBeNull()
      if (iframe == null) {
        return
      }

      const postMessageSpy = vi.fn()

      Object.defineProperty(iframe, 'contentWindow', {
        value: {
          postMessage: postMessageSpy,
        },
        writable: true,
      })

      // First initialization - creates observer index 0
      const cleanup1 = initializeComments()

      // Fast-forward to allow iframe detection
      vi.advanceTimersByTime(200)

      // Verify first observer was created (index 0)
      expect(observerIndex).toBe(1)

      // Second initialization (should clean up first) - creates observer index 1
      const cleanup2 = initializeComments()

      // Fast-forward to allow iframe detection
      vi.advanceTimersByTime(200)

      // Verify:
      // 1. Second observer was created (index 1)
      // 2. First observer was disconnected during second initialization
      expect(observerIndex).toBe(2)
      expect(disconnectCalls).toContain(0) // First observer should be disconnected

      // Restore original MutationObserver
      window.MutationObserver = OriginalMutationObserver

      cleanup1()
      cleanup2()
      domCleanup()
      timerCleanup()
    })
  })

  describe('setupComments', () => {
    it('should initialize comments immediately', () => {
      const timerCleanup = setupFakeTimers()
      const domCleanup = setupTestDOM(`
        <div data-comments
          data-giscus-repo="test/repo"
          data-giscus-repo-id="test-repo-id"
          data-giscus-category="test-category"
          data-giscus-category-id="test-category-id"
        ></div>
      `)

      // Mock script append to prevent Happy DOM from trying to load external scripts
      vi.spyOn(Element.prototype, 'append').mockImplementation(function (this: Element, ...nodes) {
        for (const node of nodes) {
          if (node instanceof HTMLScriptElement && node.src.includes('giscus.app')) {
            return
          }
        }
        // Otherwise, do nothing (we're just preventing the script load error)
      })

      setupComments()

      const container = document.querySelector('[data-comments]')
      expect(container).toBeDefined()

      domCleanup()
      timerCleanup()
    })

    it('should setup View Transitions event listeners', () => {
      const addEventListenerSpy = vi.spyOn(document, 'addEventListener')

      setupComments()

      expect(addEventListenerSpy).toHaveBeenCalledWith('astro:page-load', expect.any(Function))
      expect(addEventListenerSpy).toHaveBeenCalledWith(
        'astro:before-preparation',
        expect.any(Function),
      )

      addEventListenerSpy.mockRestore()
    })
  })
})

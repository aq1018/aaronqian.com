import { experimental_AstroContainer as AstroContainer } from 'astro/container'

/**
 * Renders an Astro component to a DOM element for testing.
 *
 * @param component - The Astro component to render
 * @param options - Optional props and slots to pass to the component
 * @returns HTMLDivElement containing the rendered component
 *
 * @example
 * ```ts
 * import Component from '@/components/MyComponent.astro'
 * const root = await renderAstroComponent(Component, {
 *   props: { title: 'Hello' },
 *   slots: { default: '<p>Content</p>' }
 * })
 * expect(root.querySelector('h1')).toHaveTextContent('Hello')
 * ```
 */
export async function renderAstroComponent(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- Astro components don't have exported types
  component: any,
  options?: { props?: Record<string, unknown>; slots?: Record<string, string> },
): Promise<HTMLDivElement> {
  const container = await AstroContainer.create()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument -- component is intentionally `any`
  const result = await container.renderToString(component, options)
  const div = document.createElement('div')
  div.innerHTML = result
  return div
}

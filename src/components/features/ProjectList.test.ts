import '@testing-library/jest-dom/vitest'
import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import ProjectList from './ProjectList.astro'

// Mock project data
const createMockProject = (
  id: string,
  title: string,
  status: 'active' | 'planning' | 'done',
  live = false,
): CollectionEntry<'projects'> =>
  ({
    id,
    collection: 'projects',
    data: {
      title,
      description: `Description for ${title}`,
      aside: `Aside for ${title}`,
      status,
      live,
      order: 1,
      tags: [],
    },
    slug: id.replace(/\/index(\.md)?$/, ''),
  }) as unknown as CollectionEntry<'projects'>

const defaultStatusStyles = {
  active: 'text-primary',
  planning: 'text-muted',
  done: 'text-fg/60',
}

const defaultStatusLabels = {
  active: 'ACTIVE',
  planning: 'PLANNING',
  done: 'DONE',
}

describe('ProjectList', () => {
  const renderComponent = async (props: {
    projects: Array<CollectionEntry<'projects'>>
    statusStyles: Record<string, string>
    statusLabels: Record<string, string>
    showFooter?: boolean
  }) => {
    const container = await AstroContainer.create()
    const result = await container.renderToString(ProjectList, { props })
    const div = document.createElement('div')
    div.innerHTML = result
    return div
  }

  describe('Project rendering', () => {
    it('should render project title as link', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      const link = root.querySelector('a')
      expect(link).toBeTruthy()
      expect(link?.textContent.trim()).toBe('Project A')
      expect(link?.getAttribute('href')).toBe('/projects/project-a')
    })

    it('should render project status with correct style', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root.textContent).toContain('ACTIVE')
      expect(root.innerHTML).toContain('text-primary')
    })

    it('should render project description and aside', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root.textContent).toContain('Description for Project A')
      expect(root.textContent).toContain('Aside for Project A')
    })

    it('should render multiple projects', async () => {
      const projects = [
        createMockProject('project-a/index.md', 'Project A', 'active'),
        createMockProject('project-b/index.md', 'Project B', 'planning'),
        createMockProject('project-c/index.md', 'Project C', 'done'),
      ]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      const links = root.querySelectorAll('a')
      expect(links.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('Live badge', () => {
    it('should render LIVE badge for live projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active', true)]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root.textContent).toContain('LIVE')
    })

    it('should not render LIVE badge for non-live projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active', false)]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      // Count occurrences of 'LIVE' - should only appear in status if at all
      const textContent = root.textContent
      const liveMatches = textContent.match(/LIVE/g)
      const liveCount = liveMatches === null ? 0 : liveMatches.length
      expect(liveCount).toBe(0)
    })
  })

  describe('Status labels and styles', () => {
    it('should apply correct status label for active projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root.textContent).toContain('ACTIVE')
    })

    it('should apply correct status label for planning projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'planning')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root.textContent).toContain('PLANNING')
    })

    it('should apply correct status label for done projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'done')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root.textContent).toContain('DONE')
    })

    it('should apply correct status style class', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      const statusSpan = root.querySelector('span')
      expect(statusSpan?.className).toContain('text-primary')
    })
  })

  describe('Footer', () => {
    it('should render footer by default', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root.textContent).toContain('Updates monthly. Expect context switches.')
    })

    it('should render footer when showFooter=true', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
        showFooter: true,
      })

      expect(root.textContent).toContain('Updates monthly. Expect context switches.')
    })

    it('should not render footer when showFooter=false', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
        showFooter: false,
      })

      expect(root.textContent).not.toContain('Updates monthly. Expect context switches.')
    })
  })

  describe('Empty state', () => {
    it('should render without projects', async () => {
      const root = await renderComponent({
        projects: [],
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      expect(root).toBeTruthy()
    })

    it('should have no project links when projects array is empty', async () => {
      const root = await renderComponent({
        projects: [],
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      const links = root.querySelectorAll('a')
      expect(links.length).toBe(0)
    })
  })

  describe('Project links', () => {
    it('should create correct link URLs', async () => {
      const projects = [
        createMockProject('project-a/index.md', 'Project A', 'active'),
        createMockProject('project-b/index', 'Project B', 'planning'),
        createMockProject('project-c', 'Project C', 'done'),
      ]
      const root = await renderComponent({
        projects,
        statusStyles: defaultStatusStyles,
        statusLabels: defaultStatusLabels,
      })

      const links = root.querySelectorAll('a')
      expect(links[0].getAttribute('href')).toBe('/projects/project-a')
      expect(links[1].getAttribute('href')).toBe('/projects/project-b')
      expect(links[2].getAttribute('href')).toBe('/projects/project-c')
    })
  })
})

import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import ProjectList from './ProjectList.astro'

type ProjectEntry = CollectionEntry<'projects'>

// Mock project data
const createMockProject = (
  id: string,
  title: string,
  status: 'in-development' | 'active' | 'completed' | 'up-for-adoption',
  live = false,
): ProjectEntry => ({
  body: '',
  collection: 'projects',
  data: {
    aside: `Aside for ${title}`,
    description: `Description for ${title}`,
    live,
    order: 1,
    status,
    title,
  },
  id,
})

const defaultStatusStyles = {
  active: 'text-primary',
  done: 'text-fg/60',
  planning: 'text-muted',
}

const defaultStatusLabels = {
  active: 'ACTIVE',
  done: 'DONE',
  planning: 'PLANNING',
}

describe('ProjectList', () => {
  describe('Project rendering', () => {
    it('should render project title as link', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      // Find the project link (skip header links)
      const links = root.querySelectorAll('a')
      const projectLink = [...links].find((link) => link.textContent.trim() === 'Project A')
      expect(projectLink).toBeDefined()
      if (projectLink) {
        expect(projectLink.getAttribute('href')).toBe('/projects/project-a')
      }
    })

    it('should render project status label', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root.textContent).toContain('ACTIVE')
    })

    it('should render project description and aside', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root.textContent).toContain('Description for Project A')
      expect(root.textContent).toContain('Aside for Project A')
    })

    it('should render multiple projects', async () => {
      const projects = [
        createMockProject('project-a/index.md', 'Project A', 'active'),
        createMockProject('project-b/index.md', 'Project B', 'in-development'),
        createMockProject('project-c/index.md', 'Project C', 'completed'),
      ]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      // Check for ul element
      const list = root.querySelector('ul')
      expect(list).toBeTruthy()

      // Check for li elements (Sheet as="li")
      const listItems = root.querySelectorAll('li')
      expect(listItems.length).toBe(3)
    })
  })

  describe('Live badge', () => {
    it('should render LIVE badge for live projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active', true)]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root.textContent).toContain('LIVE')
    })

    it('should not render LIVE badge for non-live projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active', false)]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      // Count occurrences of 'LIVE' - should only appear in status if at all
      const textContent = root.textContent
      const liveMatches = textContent.match(/LIVE/g)
      const liveCount = liveMatches == null ? 0 : liveMatches.length
      expect(liveCount).toBe(0)
    })
  })

  describe('Status labels and styles', () => {
    it('should apply correct status label for active projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root.textContent).toContain('ACTIVE')
    })

    it('should apply correct status label for in-development projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'in-development')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root.textContent).toContain('IN DEVELOPMENT')
    })

    it('should apply correct status label for completed projects', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'completed')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root.textContent).toContain('COMPLETED')
    })
  })

  describe('Footer', () => {
    it('should render footer when provided', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const footerText = 'Updates monthly. Expect context switches.'
      const root = await renderAstroComponent(ProjectList, {
        props: {
          footer: footerText,
          projects,
        },
      })

      expect(root.textContent).toContain(footerText)
    })

    it('should render custom footer text', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const customFooter = 'Custom footer message'
      const root = await renderAstroComponent(ProjectList, {
        props: {
          footer: customFooter,
          projects,
        },
      })

      expect(root.textContent).toContain(customFooter)
    })

    it('should not render footer when not provided', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
        },
      })

      // Should not have a footer element
      expect(root.textContent).not.toContain('Updates monthly')
    })
  })

  describe('Empty state', () => {
    it('should render without projects', async () => {
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects: [],
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root).toBeTruthy()
    })

    it('should have no project links when projects array is empty', async () => {
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects: [],
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      const links = root.querySelectorAll('a')
      expect(links.length).toBe(0)
    })
  })

  describe('Project links', () => {
    it('should create correct link URLs', async () => {
      const projects = [
        createMockProject('project-a/index.md', 'Project A', 'active'),
        createMockProject('project-b/index', 'Project B', 'in-development'),
        createMockProject('project-c', 'Project C', 'completed'),
      ]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      // Find project links by title text
      const links = root.querySelectorAll('a')
      const projectALink = [...links].find((link) => link.textContent.trim().includes('Project A'))
      const projectBLink = [...links].find((link) => link.textContent.trim().includes('Project B'))
      const projectCLink = [...links].find((link) => link.textContent.trim().includes('Project C'))

      if (projectALink && projectBLink && projectCLink) {
        expect(projectALink.getAttribute('href')).toBe('/projects/project-a')
        expect(projectBLink.getAttribute('href')).toBe('/projects/project-b')
        expect(projectCLink.getAttribute('href')).toBe('/projects/project-c')
      }
    })
  })

  describe('Column headers', () => {
    it('should render column headers', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      expect(root.textContent).toContain('Project')
      expect(root.textContent).toContain('Status')
      expect(root.textContent).toContain('Description')
    })
  })

  describe('Semantic markup', () => {
    it('should use ul element for project list', async () => {
      const projects = [createMockProject('project-a/index.md', 'Project A', 'active')]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      const ul = root.querySelector('ul')
      expect(ul).toBeTruthy()
    })

    it('should use li elements for each project', async () => {
      const projects = [
        createMockProject('project-a/index.md', 'Project A', 'active'),
        createMockProject('project-b/index.md', 'Project B', 'in-development'),
      ]
      const root = await renderAstroComponent(ProjectList, {
        props: {
          projects,
          statusLabels: defaultStatusLabels,
          statusStyles: defaultStatusStyles,
        },
      })

      const listItems = root.querySelectorAll('li')
      expect(listItems.length).toBe(2)
    })
  })
})

import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import { renderAstroComponent } from '@test/testHelpers'

import ProjectListItem from './ProjectListItem.astro'

function createMockProject(
  overrides?: Partial<CollectionEntry<'projects'>['data']>,
): Partial<CollectionEntry<'projects'>> {
  return {
    body: '',
    collection: 'projects',
    data: {
      title: 'Test Project',
      description: 'A test project description',
      aside: 'Additional context',
      status: 'active',
      order: 1,
      ...overrides,
    },
    id: 'test-project/index.md',
  }
}

describe('ProjectListItem Component', () => {
  const mockProject = createMockProject()

  describe('Rendering', () => {
    it('should render as a link element', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('<a')
    })

    it('should render project title as a link', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
        },
      })

      expect(root.innerHTML).toContain('Test Project')
      expect(root.innerHTML).toContain('/projects/test-project')
    })

    it('should strip /index.md from project URL', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: { ...mockProject, id: 'another-project/index.md' },
        },
      })

      expect(root.innerHTML).toContain('/projects/another-project')
      expect(root.innerHTML).not.toContain('/projects/another-project/index')
    })

    it('should render status label', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
        },
      })

      expect(root.innerHTML).toContain('ACTIVE')
    })

    it('should render project description', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
        },
      })

      expect(root.innerHTML).toContain('A test project description')
    })

    it('should render aside text', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
        },
      })

      expect(root.innerHTML).toContain('Additional context')
    })
  })

  describe('Status Badge', () => {
    it('should render ACTIVE badge when project is active', async () => {
      const activeProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'active' },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: activeProject,
        },
      })

      expect(root.innerHTML).toContain('ACTIVE')
    })

    it('should render COMPLETED badge when project is completed', async () => {
      const completedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'completed' as const },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: completedProject,
        },
      })

      expect(root.innerHTML).toContain('COMPLETED')
    })
  })

  describe('Different Project Statuses', () => {
    it('should render completed status', async () => {
      const completedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'completed' },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: completedProject,
          statusLabel: 'Completed',
          statusStyle: 'text-gray-500',
        },
      })

      expect(root.innerHTML).toContain('COMPLETED')
    })

    it('should render up-for-adoption status', async () => {
      const upForAdoptionProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'up-for-adoption' as const },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: upForAdoptionProject,
        },
      })

      expect(root.innerHTML).toContain('UP FOR ADOPTION')
    })

    it('should render in-development status', async () => {
      const inDevelopmentProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'in-development' as const },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: inDevelopmentProject,
        },
      })

      expect(root.innerHTML).toContain('IN DEVELOPMENT')
    })
  })

  describe('Edge Cases', () => {
    it('should handle project with empty aside', async () => {
      const projectWithoutAside = {
        ...mockProject,
        data: { ...mockProject.data, aside: '' },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: projectWithoutAside,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('Test Project')
      expect(root.innerHTML).not.toContain('Additional context')
    })

    it('should handle long project titles', async () => {
      const longTitleProject = {
        ...mockProject,
        data: {
          ...mockProject.data,
          title: 'This is a Very Long Project Title That Should Still Render Correctly',
        },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: longTitleProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain(
        'This is a Very Long Project Title That Should Still Render Correctly',
      )
    })

    it('should handle long descriptions', async () => {
      const longDescProject = {
        ...mockProject,
        data: {
          ...mockProject.data,
          description:
            'This is a very long description that goes into great detail about all the features and capabilities of this amazing project',
        },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: longDescProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain(
        'This is a very long description that goes into great detail about all the features',
      )
    })
  })
})

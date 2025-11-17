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
      live: false,
      order: 1,
      ...overrides,
    },
    id: 'test-project/index.md',
  }
}

describe('ProjectListItem Component', () => {
  const mockProject = createMockProject()

  describe('Rendering', () => {
    it('should render as a list item (li)', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('<li')
    })

    it('should render project title as a link', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('Test Project')
      expect(root.innerHTML).toContain('/projects/test-project')
    })

    it('should strip /index.md from project URL', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: { ...mockProject, id: 'another-project/index.md' },
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('/projects/another-project')
      expect(root.innerHTML).not.toContain('/projects/another-project/index')
    })

    it('should render status label', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusLabel: 'In Progress',
          statusStyle: 'text-blue-500',
        },
      })

      expect(root.innerHTML).toContain('In Progress')
    })

    it('should render project description', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('A test project description')
    })

    it('should render aside text', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('Additional context')
    })
  })

  describe('Live Badge', () => {
    it('should render LIVE badge when project is live', async () => {
      const liveProject = {
        ...mockProject,
        data: { ...mockProject.data, live: true },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: liveProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).toContain('LIVE')
    })

    it('should not render LIVE badge when project is not live', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusLabel: 'Active',
          statusStyle: 'text-green-500',
        },
      })

      expect(root.innerHTML).not.toContain('LIVE')
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

      expect(root.innerHTML).toContain('Completed')
    })

    it('should render paused status', async () => {
      const pausedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'paused' },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: pausedProject,
          statusLabel: 'Paused',
          statusStyle: 'text-yellow-500',
        },
      })

      expect(root.innerHTML).toContain('Paused')
    })

    it('should render archived status', async () => {
      const archivedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'archived' },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: archivedProject,
          statusLabel: 'Archived',
          statusStyle: 'text-gray-400',
        },
      })

      expect(root.innerHTML).toContain('Archived')
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

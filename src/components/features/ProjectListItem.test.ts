import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import ProjectListItem from './ProjectListItem.astro'

import { renderAstroComponent } from '@test/testHelpers'

describe('ProjectListItem Component', () => {
  const mockProject: CollectionEntry<'projects'> = {
    id: 'test-project/index.md',
    slug: 'test-project',
    collection: 'projects',
    data: {
      title: 'Test Project',
      description: 'A test project description',
      aside: 'Additional context',
      status: 'active',
      live: false,
      order: 1,
    },
  } as unknown as CollectionEntry<'projects'>

  describe('Rendering', () => {
    it('should render as a list item (li)', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain('<li')
    })

    it('should render project title as a link', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain('Test Project')
      expect(root.innerHTML).toContain('/projects/test-project')
    })

    it('should strip /index.md from project URL', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: { ...mockProject, id: 'another-project/index.md' },
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain('/projects/another-project')
      expect(root.innerHTML).not.toContain('/projects/another-project/index')
    })

    it('should render status with correct style', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-blue-500',
          statusLabel: 'In Progress',
        },
      })

      expect(root.innerHTML).toContain('In Progress')
      expect(root.innerHTML).toContain('text-blue-500')
    })

    it('should render project description', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain('A test project description')
    })

    it('should render aside text', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
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
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain('LIVE')
    })

    it('should not render LIVE badge when project is not live', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).not.toContain('LIVE')
    })
  })

  describe('Layout', () => {
    it('should use Sheet with bar variant', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      // Sheet with bar variant has border-l-2 and bg-transparent
      expect(root.innerHTML).toContain('border-l-2')
      expect(root.innerHTML).toContain('bg-transparent')
    })

    it('should have hover effect on Sheet', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain('transition-colors')
    })

    it('should use Grid layout with 12-column system', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      // Should have grid container
      expect(root.innerHTML).toContain('grid')
      // Should have responsive column spans
      expect(root.innerHTML).toContain('col-span-12')
      expect(root.innerHTML).toContain('md:col-span-4')
    })

    it('should align status column to the right on desktop', async () => {
      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain('md:justify-self-end')
      expect(root.innerHTML).toContain('md:items-end')
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
          statusStyle: 'text-gray-500',
          statusLabel: 'Completed',
        },
      })

      expect(root.innerHTML).toContain('Completed')
      expect(root.innerHTML).toContain('text-gray-500')
    })

    it('should render paused status', async () => {
      const pausedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'paused' },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: pausedProject,
          statusStyle: 'text-yellow-500',
          statusLabel: 'Paused',
        },
      })

      expect(root.innerHTML).toContain('Paused')
      expect(root.innerHTML).toContain('text-yellow-500')
    })

    it('should render archived status', async () => {
      const archivedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'archived' },
      }

      const root = await renderAstroComponent(ProjectListItem, {
        props: {
          project: archivedProject,
          statusStyle: 'text-gray-400',
          statusLabel: 'Archived',
        },
      })

      expect(root.innerHTML).toContain('Archived')
      expect(root.innerHTML).toContain('text-gray-400')
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
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
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
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
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
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(root.innerHTML).toContain(
        'This is a very long description that goes into great detail about all the features',
      )
    })
  })
})

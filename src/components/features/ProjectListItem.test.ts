import { experimental_AstroContainer as AstroContainer } from 'astro/container'
import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import ProjectListItem from './ProjectListItem.astro'

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
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('<li')
    })

    it('should render project title as a link', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('Test Project')
      expect(result).toContain('/projects/test-project')
    })

    it('should strip /index.md from project URL', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: { ...mockProject, id: 'another-project/index.md' },
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('/projects/another-project')
      expect(result).not.toContain('/projects/another-project/index')
    })

    it('should render status with correct style', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-blue-500',
          statusLabel: 'In Progress',
        },
      })

      expect(result).toContain('In Progress')
      expect(result).toContain('text-blue-500')
    })

    it('should render project description', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('A test project description')
    })

    it('should render aside text', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('Additional context')
    })
  })

  describe('Live Badge', () => {
    it('should render LIVE badge when project is live', async () => {
      const container = await AstroContainer.create()
      const liveProject = {
        ...mockProject,
        data: { ...mockProject.data, live: true },
      }

      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: liveProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('LIVE')
    })

    it('should not render LIVE badge when project is not live', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).not.toContain('LIVE')
    })
  })

  describe('Layout', () => {
    it('should use Sheet with bar variant', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      // Sheet with bar variant has border-l-2 and bg-transparent
      expect(result).toContain('border-l-2')
      expect(result).toContain('bg-transparent')
    })

    it('should have hover effect on Sheet', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('transition-colors')
    })

    it('should use Grid layout with 12-column system', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      // Should have grid container
      expect(result).toContain('grid')
      // Should have responsive column spans
      expect(result).toContain('col-span-12')
      expect(result).toContain('md:col-span-4')
    })

    it('should align status column to the right on desktop', async () => {
      const container = await AstroContainer.create()
      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: mockProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('md:justify-self-end')
      expect(result).toContain('md:items-end')
    })
  })

  describe('Different Project Statuses', () => {
    it('should render completed status', async () => {
      const container = await AstroContainer.create()
      const completedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'completed' },
      }

      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: completedProject,
          statusStyle: 'text-gray-500',
          statusLabel: 'Completed',
        },
      })

      expect(result).toContain('Completed')
      expect(result).toContain('text-gray-500')
    })

    it('should render paused status', async () => {
      const container = await AstroContainer.create()
      const pausedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'paused' },
      }

      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: pausedProject,
          statusStyle: 'text-yellow-500',
          statusLabel: 'Paused',
        },
      })

      expect(result).toContain('Paused')
      expect(result).toContain('text-yellow-500')
    })

    it('should render archived status', async () => {
      const container = await AstroContainer.create()
      const archivedProject = {
        ...mockProject,
        data: { ...mockProject.data, status: 'archived' },
      }

      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: archivedProject,
          statusStyle: 'text-gray-400',
          statusLabel: 'Archived',
        },
      })

      expect(result).toContain('Archived')
      expect(result).toContain('text-gray-400')
    })
  })

  describe('Edge Cases', () => {
    it('should handle project with empty aside', async () => {
      const container = await AstroContainer.create()
      const projectWithoutAside = {
        ...mockProject,
        data: { ...mockProject.data, aside: '' },
      }

      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: projectWithoutAside,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain('Test Project')
      expect(result).not.toContain('Additional context')
    })

    it('should handle long project titles', async () => {
      const container = await AstroContainer.create()
      const longTitleProject = {
        ...mockProject,
        data: {
          ...mockProject.data,
          title: 'This is a Very Long Project Title That Should Still Render Correctly',
        },
      }

      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: longTitleProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain(
        'This is a Very Long Project Title That Should Still Render Correctly',
      )
    })

    it('should handle long descriptions', async () => {
      const container = await AstroContainer.create()
      const longDescProject = {
        ...mockProject,
        data: {
          ...mockProject.data,
          description:
            'This is a very long description that goes into great detail about all the features and capabilities of this amazing project',
        },
      }

      const result = await container.renderToString(ProjectListItem, {
        props: {
          project: longDescProject,
          statusStyle: 'text-green-500',
          statusLabel: 'Active',
        },
      })

      expect(result).toContain(
        'This is a very long description that goes into great detail about all the features',
      )
    })
  })
})

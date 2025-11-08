import type { CollectionEntry } from 'astro:content'
import { describe, expect, it, vi } from 'vitest'

import {
  getLatestActiveProjectSlug,
  markLatestProjectAsLive,
  sortProjectsByLatestLog,
} from './projects'

type ProjectEntry = CollectionEntry<'projects'>
type ProjectLogEntry = CollectionEntry<'projectLogs'>

// Mock project data
const createProject = (id: string, title: string): ProjectEntry => ({
  body: '',
  collection: 'projects',
  data: {
    aside: '',
    description: 'Test project',
    live: false,
    order: 0,
    status: 'active',
    title,
  },
  id,
  render: vi.fn(),
  slug: id.replace(/\/index(\.md)?$/, ''),
})

// Mock project log data
const createProjectLog = (id: string): ProjectLogEntry => ({
  body: '',
  collection: 'projectLogs',
  data: {
    date: new Date(),
    project: '',
    tags: [],
    title: 'Test log',
  },
  id,
  render: vi.fn(),
  slug: id.replace(/\.md$/, ''),
})

describe('sortProjectsByLatestLog', () => {
  it('should sort projects by latest log date (most recent first)', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
      createProject('project-c/index.md', 'Project C'),
    ]

    const projectLogs = [
      createProjectLog('project-a-2025-01-10-first-log.md'),
      createProjectLog('project-b-2025-01-15-update.md'),
      createProjectLog('project-c-2025-01-05-start.md'),
    ]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted).toHaveLength(3)
    expect(sorted[0].id).toBe('project-b/index.md') // 2025-01-15
    expect(sorted[1].id).toBe('project-a/index.md') // 2025-01-10
    expect(sorted[2].id).toBe('project-c/index.md') // 2025-01-05
  })

  it('should attach latestLogDate to each project', () => {
    const projects = [createProject('project-a/index.md', 'Project A')]

    const projectLogs = [createProjectLog('project-a-2025-01-10-log.md')]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate).toBeInstanceOf(Date)
    expect(sorted[0].latestLogDate?.toISOString()).toContain('2025-01-10')
  })

  it('should handle multiple logs per project and use the latest', () => {
    const projects = [createProject('project-a/index.md', 'Project A')]

    const projectLogs = [
      createProjectLog('project-a-2025-01-10-old-log.md'),
      createProjectLog('project-a-2025-01-20-newer-log.md'),
      createProjectLog('project-a-2025-01-15-middle-log.md'),
    ]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate?.toISOString()).toContain('2025-01-20')
  })

  it('should place projects without logs at the end', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
      createProject('project-c/index.md', 'Project C'),
    ]

    const projectLogs = [
      createProjectLog('project-a-2025-01-10-log.md'),
      createProjectLog('project-c-2025-01-05-log.md'),
      // project-b has no logs
    ]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].id).toBe('project-a/index.md')
    expect(sorted[1].id).toBe('project-c/index.md')
    expect(sorted[2].id).toBe('project-b/index.md') // No logs, goes last
    expect(sorted[2].latestLogDate).toBeUndefined()
  })

  it('should handle empty project logs array', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const sorted = sortProjectsByLatestLog(projects, [])

    expect(sorted).toHaveLength(2)
    expect(sorted[0].latestLogDate).toBeUndefined()
    expect(sorted[1].latestLogDate).toBeUndefined()
  })

  it('should handle empty projects array', () => {
    const projectLogs = [createProjectLog('project-a-2025-01-10-log.md')]

    const sorted = sortProjectsByLatestLog([], projectLogs)

    expect(sorted).toHaveLength(0)
  })

  it('should handle log filenames with hyphens in project slug', () => {
    const projects = [createProject('my-cool-project/index.md', 'My Cool Project')]

    const projectLogs = [createProjectLog('my-cool-project-2025-01-10-update.md')]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate).toBeInstanceOf(Date)
    expect(sorted[0].latestLogDate?.toISOString()).toContain('2025-01-10')
  })

  it('should handle log filenames without .md extension', () => {
    const projects = [createProject('project-a/index', 'Project A')]

    const projectLogs = [createProjectLog('project-a-2025-01-10-log')]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate).toBeInstanceOf(Date)
  })

  it('should ignore logs with invalid date format', () => {
    const projects = [createProject('project-a/index.md', 'Project A')]

    const projectLogs = [
      createProjectLog('project-a-invalid-date-log.md'),
      createProjectLog('project-a-2025-99-99-bad-date.md'),
    ]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate).toBeUndefined()
  })
})

describe('getLatestActiveProjectSlug', () => {
  it('should return slug of project with most recent log', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const projectLogs = [
      createProjectLog('project-a-2025-01-10-log.md'),
      createProjectLog('project-b-2025-01-20-log.md'),
    ]

    const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)

    expect(latestSlug).toBe('project-b')
  })

  it('should return null if no projects exist', () => {
    const latestSlug = getLatestActiveProjectSlug([], [])

    expect(latestSlug).toBeNull()
  })

  it('should return null if no projects have logs', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const latestSlug = getLatestActiveProjectSlug(projects, [])

    expect(latestSlug).toBeNull()
  })

  it('should remove /index.md suffix from project id', () => {
    const projects = [createProject('my-project/index.md', 'My Project')]

    const projectLogs = [createProjectLog('my-project-2025-01-10-log.md')]

    const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)

    expect(latestSlug).toBe('my-project')
  })

  it('should remove /index suffix without .md', () => {
    const projects = [createProject('my-project/index', 'My Project')]

    const projectLogs = [createProjectLog('my-project-2025-01-10-log.md')]

    const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)

    expect(latestSlug).toBe('my-project')
  })

  it('should handle multiple logs and return project with latest', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const projectLogs = [
      createProjectLog('project-a-2025-01-10-old.md'),
      createProjectLog('project-a-2025-01-25-newer.md'),
      createProjectLog('project-b-2025-01-20-log.md'),
    ]

    const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)

    expect(latestSlug).toBe('project-a') // Has log from 2025-01-25
  })
})

describe('markLatestProjectAsLive', () => {
  it('should mark the project with latest log as live', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const projectLogs = [
      createProjectLog('project-a-2025-01-10-log.md'),
      createProjectLog('project-b-2025-01-20-log.md'),
    ]

    const marked = markLatestProjectAsLive(projects, projectLogs)

    expect(marked[0].data.live).toBeFalsy() // project-a not marked
    expect(marked[1].data.live).toBeTruthy() // project-b is latest
  })

  it('should not modify projects if none have logs', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const marked = markLatestProjectAsLive(projects, [])

    expect(marked[0].data.live).toBeFalsy()
    expect(marked[1].data.live).toBeFalsy()
  })

  it('should not modify projects if projects array is empty', () => {
    const projectLogs = [createProjectLog('project-a-2025-01-10-log.md')]

    const marked = markLatestProjectAsLive([], projectLogs)

    expect(marked).toHaveLength(0)
  })

  it('should return new array without modifying original', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const projectLogs = [createProjectLog('project-a-2025-01-10-log.md')]

    const marked = markLatestProjectAsLive(projects, projectLogs)

    // Original should not be modified
    expect(projects[0].data.live).toBeFalsy()
    expect(projects[1].data.live).toBeFalsy()

    // New array should have marked project
    expect(marked[0].data.live).toBeTruthy()
    expect(marked[1].data.live).toBeFalsy()
  })

  it('should preserve other project data properties', () => {
    const projects = [createProject('project-a/index.md', 'Project A')]
    const projectLogs = [createProjectLog('project-a-2025-01-10-log.md')]

    const marked = markLatestProjectAsLive(projects, projectLogs)

    expect(marked[0].data.title).toBe('Project A')
    expect(marked[0].data.description).toBe('Test project')
    expect(marked[0].data.status).toBe('active')
    expect(marked[0].data.live).toBeTruthy()
  })

  it('should only mark one project as live (the latest)', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
      createProject('project-c/index.md', 'Project C'),
    ]

    const projectLogs = [
      createProjectLog('project-a-2025-01-10-log.md'),
      createProjectLog('project-b-2025-01-20-log.md'),
      createProjectLog('project-c-2025-01-05-log.md'),
    ]

    const marked = markLatestProjectAsLive(projects, projectLogs)

    const liveProjects = marked.filter((p) => p.data.live)
    expect(liveProjects).toHaveLength(1)
    expect(liveProjects[0].id).toBe('project-b/index.md')
  })

  it('should handle project slug matching with various id formats', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index', 'Project B'),
      createProject('project-c', 'Project C'),
    ]

    const projectLogs = [createProjectLog('project-b-2025-01-20-log.md')]

    const marked = markLatestProjectAsLive(projects, projectLogs)

    expect(marked[0].data.live).toBeFalsy()
    expect(marked[1].data.live).toBeTruthy() // project-b/index matched
    expect(marked[2].data.live).toBeFalsy()
  })
})

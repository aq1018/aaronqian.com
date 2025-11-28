import type { CollectionEntry } from 'astro:content'
import { describe, expect, it } from 'vitest'

import { getLatestActiveProjectSlug, sortProjectsByLatestLog } from './projects'

type ProjectEntry = CollectionEntry<'projects'>
type ProjectLogEntry = CollectionEntry<'projectLogs'>

// Mock project data
const createProject = (id: string, title: string): ProjectEntry => ({
  body: '',
  collection: 'projects',
  data: {
    aside: '',
    description: 'Test project',
    order: 0,
    status: 'active',
    title,
  },
  id,
})

// Mock project log data
const createProjectLog = (id: string): ProjectLogEntry => ({
  body: '',
  collection: 'projectLogs',
  data: {
    date: new Date(),
    draft: false,
    tags: [],
    title: 'Test log',
  },
  id,
})

describe('sortProjectsByLatestLog', () => {
  it('should sort projects by latest log date (most recent first)', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
      createProject('project-c/index.md', 'Project C'),
    ]

    const projectLogs = [
      createProjectLog('project-a/logs/2025-01-10-first-log.md'),
      createProjectLog('project-b/logs/2025-01-15-update.md'),
      createProjectLog('project-c/logs/2025-01-05-start.md'),
    ]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted).toHaveLength(3)
    expect(sorted[0].id).toBe('project-b/index.md') // 2025-01-15
    expect(sorted[1].id).toBe('project-a/index.md') // 2025-01-10
    expect(sorted[2].id).toBe('project-c/index.md') // 2025-01-05
  })

  it('should attach latestLogDate to each project', () => {
    const projects = [createProject('project-a/index.md', 'Project A')]

    const projectLogs = [createProjectLog('project-a/logs/2025-01-10-log.md')]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate).toBeInstanceOf(Date)
    expect(sorted[0].latestLogDate?.toISOString()).toContain('2025-01-10')
  })

  it('should handle multiple logs per project and use the latest', () => {
    const projects = [createProject('project-a/index.md', 'Project A')]

    const projectLogs = [
      createProjectLog('project-a/logs/2025-01-10-old-log.md'),
      createProjectLog('project-a/logs/2025-01-20-newer-log.md'),
      createProjectLog('project-a/logs/2025-01-15-middle-log.md'),
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
      createProjectLog('project-a/logs/2025-01-10-log.md'),
      createProjectLog('project-c/logs/2025-01-05-log.md'),
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
    const projectLogs = [createProjectLog('project-a/logs/2025-01-10-log.md')]

    const sorted = sortProjectsByLatestLog([], projectLogs)

    expect(sorted).toHaveLength(0)
  })

  it('should handle log filenames with hyphens in project slug', () => {
    const projects = [createProject('my-cool-project/index.md', 'My Cool Project')]

    const projectLogs = [createProjectLog('my-cool-project/logs/2025-01-10-update.md')]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate).toBeInstanceOf(Date)
    expect(sorted[0].latestLogDate?.toISOString()).toContain('2025-01-10')
  })

  it('should handle log filenames without .md extension', () => {
    const projects = [createProject('project-a/index', 'Project A')]

    const projectLogs = [createProjectLog('project-a/logs/2025-01-10-log')]

    const sorted = sortProjectsByLatestLog(projects, projectLogs)

    expect(sorted[0].latestLogDate).toBeInstanceOf(Date)
  })

  it('should ignore logs with invalid date format', () => {
    const projects = [createProject('project-a/index.md', 'Project A')]

    const projectLogs = [
      createProjectLog('project-a-invalid-date-log.md'),
      createProjectLog('project-a/logs/2025-99-99-bad-date.md'),
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
      createProjectLog('project-a/logs/2025-01-10-log.md'),
      createProjectLog('project-b/logs/2025-01-20-log.md'),
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

    const projectLogs = [createProjectLog('my-project/logs/2025-01-10-log.md')]

    const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)

    expect(latestSlug).toBe('my-project')
  })

  it('should remove /index suffix without .md', () => {
    const projects = [createProject('my-project/index', 'My Project')]

    const projectLogs = [createProjectLog('my-project/logs/2025-01-10-log.md')]

    const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)

    expect(latestSlug).toBe('my-project')
  })

  it('should handle multiple logs and return project with latest', () => {
    const projects = [
      createProject('project-a/index.md', 'Project A'),
      createProject('project-b/index.md', 'Project B'),
    ]

    const projectLogs = [
      createProjectLog('project-a/logs/2025-01-10-old.md'),
      createProjectLog('project-a/logs/2025-01-25-newer.md'),
      createProjectLog('project-b/logs/2025-01-20-log.md'),
    ]

    const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)

    expect(latestSlug).toBe('project-a') // Has log from 2025-01-25
  })
})

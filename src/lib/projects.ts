/**
 * Project utilities for sorting and filtering
 */
import type { CollectionEntry } from 'astro:content'

interface ProjectWithLatestLog extends CollectionEntry<'projects'> {
  latestLogDate?: Date
}

/**
 * Extract date from project log filename
 * Format: {project-slug}/logs/YYYY-MM-DD-{title}.md
 * Example: spider-bot/logs/2025-01-13-mg90-upgrade.md -> 2025-01-13
 */
function extractDateFromLogId(logId: string): Date | null {
  // Extract filename from path
  const filename = logId.split('/').pop()
  if (filename == null || filename === '') {
    return null
  }
  // Match pattern: YYYY-MM-DD at start of filename
  const dateMatch = /^(\d{4}-\d{2}-\d{2})-/.exec(filename)
  if (dateMatch == null) {
    return null
  }

  const dateStr = dateMatch[1]
  const date = new Date(dateStr)

  // Validate that the date is valid (not NaN)
  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

/**
 * Extract project slug from log entry
 * Log format: {project-slug}/logs/YYYY-MM-DD-{title}.md
 * Example: spider-bot/logs/2025-01-13-mg90-upgrade.md -> spider-bot
 */
function extractProjectSlugFromLog(logId: string): string {
  // Take first segment of path (before /logs/)
  return logId.split('/')[0]
}

/**
 * Sort projects by their latest log date (most recent first)
 * Also attaches latestLogDate to each project for reference
 */
export function sortProjectsByLatestLog(
  projects: CollectionEntry<'projects'>[],
  projectLogs: CollectionEntry<'projectLogs'>[],
): ProjectWithLatestLog[] {
  // Build map of project slug -> latest log date
  const latestLogDates = new Map<string, Date>()

  projectLogs.forEach((log) => {
    const projectSlug = extractProjectSlugFromLog(log.id)
    const logDate = extractDateFromLogId(log.id)

    if (logDate != null) {
      const currentLatest = latestLogDates.get(projectSlug)
      if (currentLatest == null || logDate > currentLatest) {
        latestLogDates.set(projectSlug, logDate)
      }
    }
  })

  // Attach latest log date to projects and sort
  const projectsWithDates: ProjectWithLatestLog[] = projects.map((project) => {
    const projectSlug = project.id.replace(/\/index(\.md)?$/, '')
    return {
      ...project,
      latestLogDate: latestLogDates.get(projectSlug),
    }
  })

  // Sort by latest log date (descending), projects without logs go last
  return projectsWithDates.toSorted((a, b) => {
    if (a.latestLogDate == null && b.latestLogDate == null) {
      return 0
    }
    if (a.latestLogDate == null) {
      return 1
    }
    if (b.latestLogDate == null) {
      return -1
    }
    return b.latestLogDate.getTime() - a.latestLogDate.getTime()
  })
}

/**
 * Get the slug of the project with the most recent log entry
 * Returns null if no projects have logs
 */
export function getLatestActiveProjectSlug(
  projects: CollectionEntry<'projects'>[],
  projectLogs: CollectionEntry<'projectLogs'>[],
): string | null {
  const sorted = sortProjectsByLatestLog(projects, projectLogs)

  if (sorted.length === 0) {
    return null
  }

  const latest = sorted[0]
  if (latest.latestLogDate == null) {
    return null
  }

  return latest.id.replace(/\/index(\.md)?$/, '')
}

/**
 * Mark the project with the latest log as "live"
 * Returns a new array with the live flag set
 */
export function markLatestProjectAsLive(
  projects: CollectionEntry<'projects'>[],
  projectLogs: CollectionEntry<'projectLogs'>[],
): CollectionEntry<'projects'>[] {
  const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)
  if (latestSlug == null) {
    return projects
  }

  return projects.map((project) => {
    const projectSlug = project.id.replace(/\/index(\.md)?$/, '')
    if (projectSlug === latestSlug) {
      return {
        ...project,
        data: {
          ...project.data,
          live: true,
        },
      }
    }
    return project
  })
}

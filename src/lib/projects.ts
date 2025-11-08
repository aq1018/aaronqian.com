/**
 * Project utilities for sorting and filtering
 */

import type { CollectionEntry } from 'astro:content'

interface ProjectWithLatestLog extends CollectionEntry<'projects'> {
  latestLogDate?: Date
}

/**
 * Extract date from project log filename
 * Format: {project-slug}-YYYY-MM-DD-{title}.md
 * Example: spider-bot-2025-01-13-mg90-upgrade.md -> 2025-01-13
 */
function extractDateFromLogId(logId: string): Date | null {
  // Match pattern: {slug}-YYYY-MM-DD-{rest}
  const dateMatch = /-(\d{4}-\d{2}-\d{2})-/.exec(logId)
  if (dateMatch == null) return null

  const dateStr = dateMatch[1]
  const date = new Date(dateStr)

  // Validate that the date is valid (not NaN)
  if (Number.isNaN(date.getTime())) return null

  return date
}

/**
 * Extract project slug from log entry
 * Log format: {project-slug}-YYYY-MM-DD-{title}.md
 * Example: spider-bot-2025-01-13-mg90-upgrade.md -> spider-bot
 */
function extractProjectSlugFromLog(logId: string): string {
  // Remove file extension first
  const withoutExt = logId.replace(/\.md$/, '')
  // Split by date pattern and take first part
  const parts = withoutExt.split(/-\d{4}-\d{2}-\d{2}-/)
  return parts[0]
}

/**
 * Sort projects by their latest log date (most recent first)
 * Also attaches latestLogDate to each project for reference
 */
export function sortProjectsByLatestLog(
  projects: Array<CollectionEntry<'projects'>>,
  projectLogs: Array<CollectionEntry<'projectLogs'>>,
): ProjectWithLatestLog[] {
  // Build map of project slug -> latest log date
  const latestLogDates = new Map<string, Date>()

  projectLogs.forEach((log) => {
    const projectSlug = extractProjectSlugFromLog(log.id)
    const logDate = extractDateFromLogId(log.id)

    if (logDate != null) {
      const currentLatest = latestLogDates.get(projectSlug)
      if (currentLatest === undefined || logDate > currentLatest) {
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
    if (a.latestLogDate === undefined && b.latestLogDate === undefined) return 0
    if (a.latestLogDate === undefined) return 1
    if (b.latestLogDate === undefined) return -1
    return b.latestLogDate.getTime() - a.latestLogDate.getTime()
  })
}

/**
 * Get the slug of the project with the most recent log entry
 * Returns null if no projects have logs
 */
export function getLatestActiveProjectSlug(
  projects: Array<CollectionEntry<'projects'>>,
  projectLogs: Array<CollectionEntry<'projectLogs'>>,
): string | null {
  const sorted = sortProjectsByLatestLog(projects, projectLogs)

  if (sorted.length === 0) return null

  const latest = sorted[0]
  if (latest.latestLogDate === undefined) return null

  return latest.id.replace(/\/index(\.md)?$/, '')
}

/**
 * Mark the project with the latest log as "live"
 * Returns a new array with the live flag set
 */
export function markLatestProjectAsLive(
  projects: Array<CollectionEntry<'projects'>>,
  projectLogs: Array<CollectionEntry<'projectLogs'>>,
): Array<CollectionEntry<'projects'>> {
  const latestSlug = getLatestActiveProjectSlug(projects, projectLogs)
  if (latestSlug == null) return projects

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

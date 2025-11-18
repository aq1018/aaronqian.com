import { execSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
export const projectRoot = path.resolve(__dirname, '../..')

/**
 * Convert title to URL-safe slug
 * @param {string} text
 * @returns {string}
 */
export function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replaceAll(/[^\w\s-]/g, '')
    .replaceAll(/[\s_-]+/g, '-')
    .replaceAll(/^-+|-+$/g, '')
}

/**
 * Format date as YYYY-MM-DD
 * @param {Date} date
 * @returns {string}
 */
export function formatDatePrefix(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

/**
 * Format date as ISO 8601 with timezone
 * @param {Date} date
 * @returns {string}
 */
export function formatISODate(date) {
  return date.toISOString()
}

/**
 * List existing projects from src/content/projects
 * @returns {string[]}
 */
export function listExistingProjects() {
  const projectsDir = path.join(projectRoot, 'src/content/projects')

  if (!fs.existsSync(projectsDir)) {
    return []
  }

  return fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name)
    .toSorted()
}

/**
 * Get next available project order number
 * @returns {number}
 */
export function getNextProjectOrder() {
  const projectsDir = path.join(projectRoot, 'src/content/projects')

  if (!fs.existsSync(projectsDir)) {
    return 1
  }

  let maxOrder = 0
  const projects = fs
    .readdirSync(projectsDir, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())

  for (const project of projects) {
    const indexPath = path.join(projectsDir, project.name, 'index.md')
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8')
      const orderMatch = content.match(/^order:\s*(\d+)/m)
      const orderStr = orderMatch?.[1]
      if (orderStr !== undefined && orderStr.length > 0) {
        const order = parseInt(orderStr, 10)
        if (order > maxOrder) {
          maxOrder = order
        }
      }
    }
  }

  return maxOrder + 1
}

/**
 * Detect user's preferred editor
 * @returns {string | null}
 */
export function detectEditor() {
  const editors = ['cursor', 'code', 'vim', 'nvim', 'nano']

  for (const editor of editors) {
    try {
      execSync(`which ${editor}`, { stdio: 'ignore' })
      return editor
    } catch {
      // Editor not found, continue
    }
  }

  const visual = process.env.VISUAL ?? ''
  const editor = process.env.EDITOR ?? ''

  if (visual.length > 0) return visual
  if (editor.length > 0) return editor

  return null
}

/**
 * Ensure directory exists, create if it doesn't
 * @param {string} dirPath
 */
export function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true })
  }
}

/**
 * Open file in editor
 * @param {string} filePath
 */
export function openInEditor(filePath) {
  const editor = detectEditor()

  if (editor == null || editor.length === 0) {
    // Can't use clack here due to circular dependency
    console.warn('⚠ No editor detected. Please open the file manually.')
    return
  }

  try {
    execSync(`${editor} "${filePath}"`, { stdio: 'inherit' })
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`⚠ Failed to open in ${editor}: ${message}`)
  }
}

/**
 * Git add file
 * @param {string} filePath
 */
export function gitAdd(filePath) {
  try {
    execSync(`git add "${filePath}"`, { cwd: projectRoot, stdio: 'ignore' })
    console.log(`✓ Added to git: ${filePath}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.warn(`⚠ Failed to git add: ${message}`)
  }
}

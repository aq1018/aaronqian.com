import path from 'path'

import * as clack from '@clack/prompts'

import { generateProjectLogContent, writeContentFile } from './content-generators.js'
import {
  ensureDir,
  formatDatePrefix,
  formatISODate,
  gitAdd,
  listExistingProjects,
  openInEditor,
  projectRoot,
  slugify,
} from './helpers.js'
import { handleCancel, promptDate, promptDraft, promptTags, promptTitle } from './prompts.js'

/**
 * Prompt for project selection
 * @returns {Promise<string>}
 */
async function promptProjectSlug() {
  const existingProjects = listExistingProjects()

  if (existingProjects.length === 0) {
    return promptNewProjectSlug()
  }

  const projectOptions = [
    ...existingProjects.map((proj) => ({ value: proj, label: proj })),
    { value: '__new__', label: '+ Create new project slug' },
  ]

  const projectChoice = await clack.select({
    message: 'Select project:',
    options: projectOptions,
  })

  handleCancel(projectChoice)

  if (projectChoice === '__new__') {
    return promptNewProjectSlug()
  }

  return String(projectChoice)
}

/**
 * Prompt for new project slug
 * @returns {Promise<string>}
 */
async function promptNewProjectSlug() {
  const newSlug = await clack.text({
    message: 'Project slug:',
    placeholder: 'my-project',
    validate: (value) => {
      if (value.length === 0) return 'Project slug is required'
      if (!/^[a-z0-9-]+$/.test(String(value))) {
        return 'Slug must contain only lowercase letters, numbers, and hyphens'
      }
    },
  })

  handleCancel(newSlug)
  return String(newSlug)
}

/**
 * Create a project log
 * @returns {Promise<string>}
 */
export async function createProjectLog() {
  clack.log.step('Creating new project log...')

  const projectSlug = await promptProjectSlug()
  const title = await promptTitle('Log Entry')
  const tags = await promptTags('research, development, bug-fix', true)

  const now = new Date()
  const todayStr = formatDatePrefix(now)
  const dateInput = await promptDate(todayStr)
  const isDraft = await promptDraft()

  const autoSlug = slugify(title)
  const fileName = `${dateInput}-${autoSlug}.md`
  const dirPath = path.join(projectRoot, 'src/content/projects', projectSlug, 'logs')
  const filePath = path.join(dirPath, fileName)

  ensureDir(dirPath)

  const frontmatter = {
    date: formatISODate(now),
    title,
    tags,
    project: projectSlug,
    ...(isDraft && { draft: true }),
  }

  const content = generateProjectLogContent(frontmatter)
  writeContentFile(filePath, content)

  clack.log.success(`Created project log: ${filePath}`)

  gitAdd(filePath)
  openInEditor(filePath)

  return filePath
}

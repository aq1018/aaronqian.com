import path from 'path'

import * as clack from '@clack/prompts'

import { generateProjectContent, writeContentFile } from './content-generators.js'
import {
  ensureDir,
  getNextProjectOrder,
  gitAdd,
  openInEditor,
  projectRoot,
  slugify,
} from './helpers.js'
import { handleCancel, promptDescription, promptSlug, promptTitle } from './prompts.js'

/**
 * Prompt for project status
 * @returns {Promise<string>}
 */
async function promptStatus() {
  const status = await clack.select({
    message: 'Project status:',
    options: [
      { value: 'active', label: 'Active' },
      { value: 'planning', label: 'Planning' },
      { value: 'done', label: 'Done' },
    ],
    initialValue: 'active',
  })

  handleCancel(status)
  return String(status)
}

/**
 * Prompt for project URL
 * @returns {Promise<string>}
 */
async function promptUrl() {
  const url = await clack.text({
    message: 'Project URL (optional):',
    placeholder: 'https://example.com',
  })

  handleCancel(url)
  const urlStr = String(url)
  return urlStr.length > 0 ? urlStr : ''
}

/**
 * Prompt for aside text
 * @returns {Promise<string>}
 */
async function promptAside() {
  const aside = await clack.text({
    message: 'Aside text:',
    placeholder: 'A catchy one-liner about your project',
    validate: (value) => {
      if (value.length === 0) return 'Aside text is required'
    },
  })

  handleCancel(aside)
  return String(aside)
}

/**
 * Prompt for project order
 * @returns {Promise<number>}
 */
async function promptOrder() {
  const nextOrder = getNextProjectOrder()
  const orderStr = await clack.text({
    message: 'Display order:',
    placeholder: String(nextOrder),
    initialValue: String(nextOrder),
    validate: (value) => {
      if (!/^\d+$/.test(String(value))) return 'Order must be a number'
    },
  })

  handleCancel(orderStr)
  return parseInt(String(orderStr), 10)
}

/**
 * Prompt for live status
 * @returns {Promise<boolean>}
 */
async function promptIsLive() {
  const isLive = await clack.confirm({
    message: 'Is this project live?',
    initialValue: false,
  })

  handleCancel(isLive)
  return Boolean(isLive)
}

/**
 * Create a project
 * @returns {Promise<string>}
 */
export async function createProject() {
  clack.log.step('Creating new project...')

  const title = await promptTitle('Project')
  const autoSlug = slugify(title)
  const slug = await promptSlug(autoSlug, 'Project slug')
  const description = await promptDescription('A brief description of the project')
  const status = await promptStatus()
  const url = await promptUrl()
  const aside = await promptAside()
  const order = await promptOrder()
  const isLive = await promptIsLive()

  const dirPath = path.join(projectRoot, 'src/content/projects', slug)
  const filePath = path.join(dirPath, 'index.md')
  const logsPath = path.join(dirPath, 'logs')

  ensureDir(dirPath)
  ensureDir(logsPath)

  const frontmatter = {
    title,
    description,
    status,
    ...(url.length > 0 && { url }),
    aside,
    order,
    ...(isLive && { live: true }),
  }

  const content = generateProjectContent(frontmatter)
  writeContentFile(filePath, content)

  clack.log.success(`Created project: ${filePath}`)
  clack.log.info(`Logs directory created: ${logsPath}`)

  gitAdd(filePath)
  openInEditor(filePath)

  return filePath
}

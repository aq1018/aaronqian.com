import path from 'path'

import * as clack from '@clack/prompts'

import { generateBlogPostContent, writeContentFile } from './content-generators.js'
import {
  ensureDir,
  formatDatePrefix,
  gitAdd,
  openInEditor,
  projectRoot,
  slugify,
} from './helpers.js'
import {
  handleCancel,
  promptDate,
  promptDescription,
  promptDraft,
  promptSlug,
  promptTags,
  promptTitle,
} from './prompts.js'

/**
 * Prompt for categories
 * @returns {Promise<string[]>}
 */
async function promptCategories() {
  const categories = await clack.multiselect({
    message: 'Categories (optional):',
    options: [
      { value: 'frontend', label: 'Frontend' },
      { value: 'backend', label: 'Backend' },
      { value: 'devops', label: 'DevOps' },
      { value: 'mobile', label: 'Mobile' },
      { value: 'ai', label: 'AI/ML' },
      { value: 'other', label: 'Other' },
    ],
    required: false,
  })

  handleCancel(categories)

  if (!Array.isArray(categories)) {
    return []
  }

  return categories.map(String)
}

/**
 * Create a blog post
 * @returns {Promise<string>}
 */
export async function createBlogPost() {
  clack.log.step('Creating new blog post...')

  const title = await promptTitle('Blog Post')
  const autoSlug = slugify(title)
  const slug = await promptSlug(autoSlug)
  const description = await promptDescription('A brief description of the blog post')
  const categories = await promptCategories()
  const tags = await promptTags('javascript, react, typescript', false)
  const todayStr = formatDatePrefix(new Date())
  const dateInput = await promptDate(todayStr)
  const isDraft = await promptDraft()

  const dirName = `${dateInput}-${slug}`
  const dirPath = path.join(projectRoot, 'src/content/blog', dirName)
  const filePath = path.join(dirPath, 'index.md')

  ensureDir(dirPath)

  const frontmatter = {
    title,
    description,
    lastUpdatedOn: dateInput,
    ...(categories.length > 0 && { categories }),
    ...(tags.length > 0 && { tags }),
    ...(isDraft && { draft: true }),
  }

  const content = generateBlogPostContent(frontmatter)
  writeContentFile(filePath, content)

  clack.log.success(`Created blog post: ${filePath}`)

  gitAdd(filePath)
  openInEditor(filePath)

  return filePath
}

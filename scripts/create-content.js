#!/usr/bin/env node

import path from 'path'

import * as clack from '@clack/prompts'

import { createBlogPost } from './lib/create-blog-post.js'
import { createProjectLog } from './lib/create-project-log.js'
import { createProject } from './lib/create-project.js'
import { projectRoot } from './lib/helpers.js'

/**
 * Main CLI function
 */
async function main() {
  console.clear()

  clack.intro('📝 Content Wizard')

  const contentType = await clack.select({
    message: 'What would you like to create?',
    options: [
      { value: 'blog', label: '📄 Blog Post', hint: 'New article or tutorial' },
      { value: 'project', label: '🚀 Project', hint: 'New project with logs directory' },
      { value: 'log', label: '📋 Project Log', hint: 'Update for existing project' },
    ],
  })

  if (clack.isCancel(contentType)) {
    clack.cancel('Operation cancelled')
    process.exit(0)
  }

  try {
    let filePath = ''

    switch (contentType) {
      case 'blog': {
        filePath = await createBlogPost()
        break
      }
      case 'project': {
        filePath = await createProject()
        break
      }
      case 'log': {
        filePath = await createProjectLog()
        break
      }
    }

    clack.outro(`✨ Done! Created: ${path.relative(projectRoot, filePath)}`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    clack.log.error(`Error: ${message}`)
    process.exit(1)
  }
}

await main()

#!/usr/bin/env node
// Auto-format and lint-fix after file edits

import { execSync } from 'node:child_process'
import fs from 'node:fs'

/**
 * @typedef {Object} ToolInput
 * @property {string} tool_name
 * @property {{file_path: string}} tool_input
 */

/**
 * @typedef {Object} HookFeedback
 * @property {string} [decision]
 * @property {string} [reason]
 * @property {{hookEventName: string, additionalContext: string}} hookSpecificOutput
 */

// Read JSON input from stdin
let inputData = ''
process.stdin.on('data', (/** @type {Buffer} */ chunk) => {
  inputData += chunk.toString()
})

process.stdin.on('end', () => {
  // Parse JSON input
  /** @type {unknown} */
  let parsedData = null
  try {
    parsedData = JSON.parse(inputData)
  } catch (error) {
    // Bad JSON format - exit with error
    console.error('ERROR: Bad JSON input')
    console.error('Input received:', inputData)
    console.error('Parse error:', String(error))
    process.exit(1)
  }

  try {
    // Type guard to ensure we have the expected structure
    if (
      typeof parsedData !== 'object' ||
      parsedData === null ||
      !('tool_input' in parsedData) ||
      typeof parsedData.tool_input !== 'object' ||
      parsedData.tool_input === null ||
      !('file_path' in parsedData.tool_input)
    ) {
      process.exit(0)
    }

    /** @type {ToolInput} */
    const data = parsedData
    const filePath = data.tool_input.file_path

    // Exit if no file path found
    if (typeof filePath !== 'string' || filePath === '') {
      process.exit(0)
    }

    // Exit if file doesn't exist (might be deleted)
    if (!fs.existsSync(filePath)) {
      process.exit(0)
    }

    /** @type {HookFeedback} */
    const feedback = {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: '',
      },
    }

    // Run eslint --fix on the file
    try {
      execSync(`npx eslint --fix "${filePath}"`, {
        stdio: 'pipe',
        cwd: process.env.CLAUDE_PROJECT_DIR,
      })
      feedback.hookSpecificOutput.additionalContext += `✓ ESLint --fix completed\n`
    } catch {
      // ESLint --fix failed, meaning unfixable errors exist
      feedback.hookSpecificOutput.additionalContext += `✗ ESLint --fix failed (unfixable errors detected)\n\n`

      // Get all errors by running eslint without --fix
      try {
        execSync(`npx eslint "${filePath}"`, {
          encoding: 'utf8',
          stdio: 'pipe',
          cwd: process.env.CLAUDE_PROJECT_DIR,
        })
      } catch (verifyError) {
        /** @type {{stdout?: string, stderr?: string}} */
        const err = verifyError
        const output = err.stdout ?? err.stderr ?? ''
        feedback.hookSpecificOutput.additionalContext += `ESLint errors:\n${output}\n\n`
      }

      feedback.hookSpecificOutput.additionalContext += `⊘ Formatting skipped (fix errors first)\n`
      feedback.hookSpecificOutput.additionalContext += `\nNext: Fix the errors above`

      console.log(JSON.stringify(feedback))
      process.exit(0)
    }

    // ESLint --fix passed, now run prettier
    try {
      execSync(`npx prettier --write "${filePath}"`, {
        stdio: 'pipe',
        cwd: process.env.CLAUDE_PROJECT_DIR,
      })
      feedback.hookSpecificOutput.additionalContext += `✓ Prettier completed (formatted)\n`
    } catch (error) {
      // CATASTROPHIC: Prettier should never fail on valid code
      /** @type {{message?: string}} */
      const err = error
      const prettierError = err.message ?? 'Unknown error'
      feedback.decision = 'block'
      feedback.reason = '🚨 CATASTROPHIC ERROR: Prettier failed after ESLint passed'
      feedback.hookSpecificOutput.additionalContext += `✗ Prettier failed (CATASTROPHIC)\n\n`
      feedback.hookSpecificOutput.additionalContext += `This should never happen. Prettier failed on code that passed ESLint.\n`
      feedback.hookSpecificOutput.additionalContext += `Error: ${prettierError}\n\n`
      feedback.hookSpecificOutput.additionalContext += `Action required: User intervention needed. Check system configuration.`

      console.log(JSON.stringify(feedback))
      process.exit(0)
    }

    // Both eslint and prettier passed, verify no errors remain
    try {
      execSync(`npx eslint "${filePath}"`, {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.env.CLAUDE_PROJECT_DIR,
      })

      feedback.hookSpecificOutput.additionalContext += `✓ ESLint verification passed (no errors)\n`
      feedback.hookSpecificOutput.additionalContext += `\nNext: Verify typecheck only (${filePath.endsWith('.ts') ? 'npx tsc --noEmit' : 'astro check'})`
    } catch (error) {
      // Unexpected: errors after eslint --fix passed
      /** @type {{stdout?: string, stderr?: string}} */
      const err = error
      const output = err.stdout ?? err.stderr ?? ''
      feedback.hookSpecificOutput.additionalContext += `⚠ ESLint verification found errors (unexpected)\n\n`
      feedback.hookSpecificOutput.additionalContext += `${output}\n`
      feedback.hookSpecificOutput.additionalContext += `\nNext: Fix the errors above, then verify typecheck`
    }

    console.log(JSON.stringify(feedback))
    process.exit(0)
  } catch (error) {
    console.log(
      JSON.stringify({
        hookSpecificOutput: {
          hookEventName: 'PostToolUse',
          additionalContext: `Hook error: ${String(error)}`,
        },
      }),
    )
    process.exit(0)
  }
})

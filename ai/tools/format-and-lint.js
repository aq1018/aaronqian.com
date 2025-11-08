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

/**
 * Parse and validate input data
 * @param {string} inputData - Raw JSON string
 * @returns {{filePath: string} | null} Parsed file path or null if invalid
 */
function parseInput(inputData) {
  /** @type {unknown} */
  let parsedData = null
  try {
    parsedData = JSON.parse(inputData)
  } catch (error) {
    console.error('ERROR: Bad JSON input')
    console.error('Input received:', inputData)
    console.error('Parse error:', String(error))
    process.exit(1)
  }

  if (
    typeof parsedData !== 'object' ||
    parsedData == null ||
    !('tool_input' in parsedData) ||
    typeof parsedData.tool_input !== 'object' ||
    parsedData.tool_input == null ||
    !('file_path' in parsedData.tool_input)
  ) {
    return null
  }

  /** @type {ToolInput} */
  const data = parsedData
  const filePath = data.tool_input.file_path

  if (typeof filePath !== 'string' || filePath === '' || !fs.existsSync(filePath)) {
    return null
  }

  return { filePath }
}

/**
 * Run oxlint --fix and return feedback
 * @param {string} filePath - File to lint
 * @param {HookFeedback} feedback - Feedback object to update
 * @returns {boolean} True if successful, false if errors
 */
function runOxlintFix(filePath, feedback) {
  try {
    execSync(`npx oxlint --type-aware --fix "${filePath}"`, {
      stdio: 'pipe',
      cwd: process.env.CLAUDE_PROJECT_DIR,
    })
    feedback.hookSpecificOutput.additionalContext += `✓ oxlint --type-aware --fix completed\n`
    return true
  } catch {
    feedback.hookSpecificOutput.additionalContext += `✗ oxlint --type-aware --fix failed (unfixable errors detected)\n\n`
    try {
      execSync(`npx oxlint --type-aware "${filePath}"`, {
        encoding: 'utf8',
        stdio: 'pipe',
        cwd: process.env.CLAUDE_PROJECT_DIR,
      })
    } catch (verifyError) {
      /** @type {{stdout?: string, stderr?: string}} */
      const err = verifyError
      const output = err.stdout ?? err.stderr ?? ''
      feedback.hookSpecificOutput.additionalContext += `oxlint errors:\n${output}\n\n`
    }
    feedback.hookSpecificOutput.additionalContext += `⊘ Formatting skipped (fix errors first)\n`
    feedback.hookSpecificOutput.additionalContext += `\nNext: Fix the errors above`
    return false
  }
}

/**
 * Run Prettier and return feedback
 * @param {string} filePath - File to format
 * @param {HookFeedback} feedback - Feedback object to update
 * @returns {boolean} True if successful, false if catastrophic error
 */
function runPrettier(filePath, feedback) {
  try {
    execSync(`npx prettier --write "${filePath}"`, {
      stdio: 'pipe',
      cwd: process.env.CLAUDE_PROJECT_DIR,
    })
    feedback.hookSpecificOutput.additionalContext += `✓ Prettier completed (formatted)\n`
    return true
  } catch (error) {
    /** @type {{message?: string}} */
    const err = error
    const prettierError = err.message ?? 'Unknown error'
    feedback.decision = 'block'
    feedback.reason = '🚨 CATASTROPHIC ERROR: Prettier failed after oxlint passed'
    feedback.hookSpecificOutput.additionalContext += `✗ Prettier failed (CATASTROPHIC)\n\n`
    feedback.hookSpecificOutput.additionalContext += `This should never happen. Prettier failed on code that passed oxlint.\n`
    feedback.hookSpecificOutput.additionalContext += `Error: ${prettierError}\n\n`
    feedback.hookSpecificOutput.additionalContext += `Action required: User intervention needed. Check system configuration.`
    return false
  }
}

/**
 * Verify no oxlint errors remain
 * @param {string} filePath - File to verify
 * @param {HookFeedback} feedback - Feedback object to update
 */
function verifyOxlint(filePath, feedback) {
  try {
    execSync(`npx oxlint --type-aware "${filePath}"`, {
      encoding: 'utf8',
      stdio: 'pipe',
      cwd: process.env.CLAUDE_PROJECT_DIR,
    })
    feedback.hookSpecificOutput.additionalContext += `✓ oxlint verification passed (no errors)\n`
    feedback.hookSpecificOutput.additionalContext += `\nNext: Verify typecheck only (${filePath.endsWith('.ts') ? 'npx tsc --noEmit' : 'astro check'})`
  } catch (error) {
    /** @type {{stdout?: string, stderr?: string}} */
    const err = error
    const output = err.stdout ?? err.stderr ?? ''
    feedback.hookSpecificOutput.additionalContext += `⚠ oxlint verification found errors (unexpected)\n\n`
    feedback.hookSpecificOutput.additionalContext += `${output}\n`
    feedback.hookSpecificOutput.additionalContext += `\nNext: Fix the errors above, then verify typecheck`
  }
}

// Read JSON input from stdin
let inputData = ''
process.stdin.on('data', (/** @type {Buffer} */ chunk) => {
  inputData += chunk.toString()
})

process.stdin.on('end', () => {
  try {
    const result = parseInput(inputData)
    if (result == null) {
      process.exit(0)
    }

    const { filePath } = result
    /** @type {HookFeedback} */
    const feedback = {
      hookSpecificOutput: {
        hookEventName: 'PostToolUse',
        additionalContext: '',
      },
    }

    if (!runOxlintFix(filePath, feedback)) {
      console.log(JSON.stringify(feedback))
      process.exit(0)
    }

    if (!runPrettier(filePath, feedback)) {
      console.log(JSON.stringify(feedback))
      process.exit(0)
    }

    verifyOxlint(filePath, feedback)
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

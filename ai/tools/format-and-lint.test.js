import { spawn } from 'node:child_process'
import { once } from 'node:events'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { afterEach, beforeEach, describe, expect, it } from 'vitest'

/**
 * @typedef {Object} ToolResult
 * @property {string} stdout
 * @property {string} stderr
 * @property {number | null} exitCode
 */

const FILENAME = fileURLToPath(import.meta.url)
const DIRNAME = path.dirname(FILENAME)

/**
 * Helper to run the format-and-lint tool with stdin input
 * @param {string} filePath
 * @returns {Promise<ToolResult>}
 */
async function runTool(filePath) {
  const toolPath = path.join(DIRNAME, 'format-and-lint.js')
  const child = spawn('node', [toolPath], {
    cwd: path.resolve(DIRNAME, '../..'),
  })

  let stdout = ''
  let stderr = ''

  child.stdout.on('data', (/** @type {Buffer} */ data) => {
    stdout += data.toString()
  })

  child.stderr.on('data', (/** @type {Buffer} */ data) => {
    stderr += data.toString()
  })

  // Send JSON input via stdin
  const input = JSON.stringify({
    tool_name: 'Write',
    tool_input: { file_path: filePath },
  })
  child.stdin.write(input)
  child.stdin.end()

  // Wait for process to close using events.once (promise-based)
  const closeEvent = /** @type {unknown} */ (await once(child, 'close'))
  /** @type {number | null} */
  const exitCode = /** @type {[number | null]} */ (closeEvent)[0]

  return { stdout, stderr, exitCode }
}

/**
 * Helper to create temp test file
 * @param {string} name
 * @param {string} content
 * @returns {string}
 */
function createTestFile(name, content) {
  const testDir = path.resolve(DIRNAME, '../..', 'test-temp')
  if (!fs.existsSync(testDir)) {
    fs.mkdirSync(testDir, { recursive: true })
  }
  const filePath = path.join(testDir, name)
  fs.writeFileSync(filePath, content)
  return filePath
}

/**
 * Helper to cleanup test files
 */
function cleanupTestFiles() {
  const testDir = path.resolve(DIRNAME, '../..', 'test-temp')
  if (fs.existsSync(testDir)) {
    fs.rmSync(testDir, { recursive: true, force: true })
  }
}

describe('format-and-lint tool', () => {
  beforeEach(() => {
    cleanupTestFiles()
  })

  afterEach(() => {
    cleanupTestFiles()
  })

  describe('Success Case', () => {
    it('should process valid TypeScript code successfully', async () => {
      const filePath = createTestFile(
        'success.ts',
        `// Valid code
export const validCode = "test"
export function validFunction() {
  return 42
}
`,
      )

      const result = await runTool(filePath)

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toBeTruthy()

      const parsed = /** @type {unknown} */ (JSON.parse(result.stdout))
      /** @type {{hookSpecificOutput: {additionalContext: string}}} */
      const output = parsed
      expect(output.hookSpecificOutput).toBeDefined()
      expect(output.hookSpecificOutput.additionalContext).toContain('✓ ESLint --fix completed')
      expect(output.hookSpecificOutput.additionalContext).toContain('✓ Prettier completed')
      expect(output.hookSpecificOutput.additionalContext).toContain('✓ ESLint verification passed')
      expect(output.hookSpecificOutput.additionalContext).toContain('Next: Verify typecheck only')
    }, 30000)
  })

  describe('ESLint Fails Case', () => {
    it('should show errors and skip formatting when ESLint fails', async () => {
      const filePath = createTestFile(
        'eslint-fail.ts',
        `// Unfixable errors
const unused_var = "bad naming"
const another_unused = "also unused"
function unusedFunc() { return 1 }
`,
      )

      const result = await runTool(filePath)

      expect(result.exitCode).toBe(0)
      expect(result.stdout).toBeTruthy()

      const parsed = /** @type {unknown} */ (JSON.parse(result.stdout))
      /** @type {{hookSpecificOutput: {additionalContext: string}}} */
      const output = parsed
      expect(output.hookSpecificOutput.additionalContext).toContain('✗ ESLint --fix failed')
      expect(output.hookSpecificOutput.additionalContext).toContain('ESLint errors:')
      expect(output.hookSpecificOutput.additionalContext).toContain('unused_var')
      expect(output.hookSpecificOutput.additionalContext).toContain('⊘ Formatting skipped')
      expect(output.hookSpecificOutput.additionalContext).toContain('Next: Fix the errors above')
    }, 30000)
  })

  describe('File Filtering', () => {
    it('should skip .json files', async () => {
      const filePath = createTestFile('test.json', '{"key": "value"}')

      const result = await runTool(filePath)

      expect(result.exitCode).toBe(0)
      // Should exit early without processing
    })

    it('should skip .md files', async () => {
      const filePath = createTestFile('test.md', '# Heading\n\nContent')

      const result = await runTool(filePath)

      expect(result.exitCode).toBe(0)
      // Should exit early without processing
    })

    it('should skip .css files', async () => {
      const filePath = createTestFile('test.css', '.class { color: red; }')

      const result = await runTool(filePath)

      expect(result.exitCode).toBe(0)
      // Should exit early without processing
    })

    it('should skip .claude directory files', async () => {
      const testDir = path.resolve(DIRNAME, '../..', 'test-temp/.claude')
      fs.mkdirSync(testDir, { recursive: true })
      const filePath = path.join(testDir, 'test.json')
      fs.writeFileSync(filePath, '{}')

      const result = await runTool(filePath)

      expect(result.exitCode).toBe(0)
      // Should exit early without processing
    })
  })

  describe('Edge Cases', () => {
    it('should handle missing file path gracefully', async () => {
      const child = spawn('node', [path.join(DIRNAME, 'format-and-lint.js')], {
        cwd: path.resolve(DIRNAME, '../..'),
      })

      let stdout = ''
      child.stdout.on('data', (/** @type {Buffer} */ data) => {
        stdout += data.toString()
      })

      child.stdin.write(JSON.stringify({ tool_name: 'Write' }))
      child.stdin.end()

      await once(child, 'close')

      // Should exit gracefully without error
      expect(stdout).toBe('')
    })

    it('should handle non-existent file gracefully', async () => {
      const result = await runTool('/non/existent/file.ts')

      expect(result.exitCode).toBe(0)
      // Should exit early without error
    })

    it('should exit with code 1 and show error for invalid JSON input', async () => {
      const child = spawn('node', [path.join(DIRNAME, 'format-and-lint.js')], {
        cwd: path.resolve(DIRNAME, '../..'),
      })

      let stderr = ''
      child.stderr.on('data', (/** @type {Buffer} */ data) => {
        stderr += data.toString()
      })

      child.stdin.write('invalid json')
      child.stdin.end()

      const closeEvent = /** @type {unknown} */ (await once(child, 'close'))
      /** @type {number | null} */
      const exitCode = /** @type {[number | null]} */ (closeEvent)[0]

      // Should exit with error code 1
      expect(exitCode).toBe(1)
      // Should print error message
      expect(stderr).toContain('ERROR: Bad JSON input')
      expect(stderr).toContain('Input received:')
      expect(stderr).toContain('invalid json')
      expect(stderr).toContain('Parse error:')
    })
  })

  describe('Astro Files', () => {
    it('should suggest astro check for .astro files', async () => {
      const filePath = createTestFile(
        'Component.astro',
        `---
export const title = "Test"
---
<div>{title}</div>
`,
      )

      const result = await runTool(filePath)

      expect(result.exitCode).toBe(0)
      const parsed = /** @type {unknown} */ (JSON.parse(result.stdout))
      /** @type {{hookSpecificOutput: {additionalContext: string}}} */
      const output = parsed
      expect(output.hookSpecificOutput.additionalContext).toContain('astro check')
    }, 30000)
  })
})

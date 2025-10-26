import fs from 'node:fs/promises'
import path from 'node:path'

import postcss from 'postcss'
import atImport from 'postcss-import'

/**
 * @typedef {Object} ThemeConfig
 * @property {string} name
 * @property {string} source
 * @property {string} output
 */

/** @type {ThemeConfig[]} */
const themes = [
  {
    name: 'giscus-light',
    source: 'src/styles/giscus-light.source.css',
    output: 'public/giscus-light.generated.css',
  },
  {
    name: 'giscus-dark',
    source: 'src/styles/giscus-dark.source.css',
    output: 'public/giscus-dark.generated.css',
  },
]

/**
 * @param {ThemeConfig} theme
 */
async function buildTheme(theme) {
  const css = await fs.readFile(theme.source, 'utf8')
  const result = await postcss().use(atImport()).process(css, { from: theme.source })

  await fs.mkdir(path.dirname(theme.output), { recursive: true })
  await fs.writeFile(theme.output, result.css, 'utf8')
}

async function generateGiscusTheme() {
  await Promise.all(themes.map(buildTheme))
}

/**
 * @param {unknown} error
 */
function handleGenerationError(error) {
  console.error('Failed to generate giscus themes', error)
  process.exitCode = 1
}

generateGiscusTheme().catch(handleGenerationError)

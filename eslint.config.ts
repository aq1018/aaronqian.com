import css from '@eslint/css'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import vitest from '@vitest/eslint-plugin'
import type { Linter } from 'eslint'
import love from 'eslint-config-love'
import eslintPluginAstro from 'eslint-plugin-astro'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// ============================================================================
// File Pattern Constants
// ============================================================================
const TS_JS_FILES = ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}']
const ASTRO_FILES = ['**/*.astro']
const TEST_FILES = ['**/*.{test,spec}.{ts,tsx}', '/test/*.{ts,tsx}']
const CSS_FILES = ['**/*.css']
const JSON_FILES = ['**/*.json']
const MARKDOWN_FILES = ['**/*.md']

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Ensures external configs are scoped to specific file patterns.
 * Prevents configs without `files` from applying globally.
 */
const scopeConfigs = (configs: Linter.Config[], files: string[]): Linter.Config[] =>
  configs.map((config) => ({
    ...config,
    files: config.files ?? files,
  }))

// ============================================================================
// Shared TypeScript Configuration
// Used for both .ts/.tsx and .astro files
// ============================================================================

const sharedTypeScriptPlugins = {
  ...love.plugins,
  '@typescript-eslint': tseslint.plugin,
}

const sharedTypeScriptSettings = {
  'import/resolver': {
    typescript: {
      alwaysTryTypes: true,
      project: '.',
    },
  },
}

const sharedImportRules = {
  'sort-imports': ['error', { ignoreDeclarationSort: true }],
  'import/no-unresolved': ['error', { ignore: ['^astro:'] }],
  'import/no-cycle': 'error',
  'import/order': [
    'error',
    {
      'newlines-between': 'always',
      alphabetize: {
        order: 'asc',
      },
    },
  ],
} satisfies Linter.Config['rules']

const sharedTypeScriptOverrides = {
  'max-lines': ['error', { max: 200, skipComments: true, skipBlankLines: true }],
  'no-console': 'off',
  complexity: 'off',
  '@typescript-eslint/explicit-function-return-type': 'off',
  '@typescript-eslint/no-magic-numbers': 'off',
  '@typescript-eslint/no-empty-function': 'off',
  '@typescript-eslint/prefer-destructuring': 'off',
  'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
  '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
} satisfies Linter.Config['rules']

// ============================================================================
// ESLint Configuration
// ============================================================================

export default [
  // ==========================================================================
  // Global Ignores
  // ==========================================================================
  {
    ignores: [
      'dist/',
      'node_modules/',
      '.astro/',
      '.wrangler/',
      'coverage/',
      '.claude/',
      '.vscode/',
      'package-lock.json',
      'src/styles/global.css', // Exception: Contains Tailwind v4 @custom-variant syntax that CSS parser cannot handle
      'src/components/primitives/typography.css', // Exception: Contains @apply with custom utilities that CSS parser cannot handle
      '*.generated.*', // Ignore all generated files
    ],
  },

  // ==========================================================================
  // TypeScript/JavaScript Files
  // Applies to: .js, .jsx, .ts, .tsx, .mjs, .cjs, .mts, .cts
  // ==========================================================================
  {
    files: TS_JS_FILES,
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    // Base config from eslint-config-love (strict TypeScript standards)
    ...love,
    files: TS_JS_FILES,
    plugins: sharedTypeScriptPlugins,
  },
  {
    // Import settings and rules
    files: TS_JS_FILES,
    settings: sharedTypeScriptSettings,
    rules: sharedImportRules,
  },
  {
    // Custom rule overrides for all TS/JS files
    files: TS_JS_FILES,
    rules: sharedTypeScriptOverrides,
  },

  // ==========================================================================
  // Astro Files - Base Configuration
  // Applies to: .astro files
  // Includes base Astro linting rules + accessibility checking
  // ==========================================================================
  ...scopeConfigs(eslintPluginAstro.configs['flat/recommended'], ASTRO_FILES),
  ...scopeConfigs(eslintPluginAstro.configs['flat/jsx-a11y-recommended'], ASTRO_FILES),
  {
    // TypeScript support for Astro frontmatter - Apply SAME rules as TS_JS_FILES
    files: ASTRO_FILES,
    languageOptions: {
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
        sourceType: 'module',
        project: './tsconfig.json',
      },
    },
    plugins: sharedTypeScriptPlugins,
    settings: sharedTypeScriptSettings,
    rules: {
      // Apply ALL the same rules as regular .ts files
      ...love.rules,
      ...sharedImportRules,
      ...sharedTypeScriptOverrides,
      // Astro-specific overrides: Astro components return `any`, disable unsafe return check
      '@typescript-eslint/no-unsafe-return': 'off',
    },
  },

  // ==========================================================================
  // Test Files
  // Applies to: .spec.ts, .spec.tsx files
  // ==========================================================================
  {
    files: TEST_FILES,
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      '@typescript-eslint/unbound-method': 'off',
      '@typescript-eslint/init-declarations': 'off',
      'max-lines': 'off',
      'max-nested-callbacks': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      '@typescript-eslint/no-unsafe-type-assertion': 'off',
      '@typescript-eslint/non-nullable-type-assertion-style': 'off',
    },
  },

  // ==========================================================================
  // CSS Files
  // Applies to: .css files
  // ==========================================================================
  {
    files: CSS_FILES,
    language: 'css/css',
    ...css.configs.recommended,
    rules: {
      'css/no-invalid-at-rules': 'off', // Disable for Tailwind v4 @theme, @plugin, @custom-variant directives
      'css/no-unknown-at-rules': 'off', // Disable for Tailwind v4 custom at-rules
    },
  },

  // ==========================================================================
  // JSON Files
  // Applies to: .json files
  // ==========================================================================
  {
    files: JSON_FILES,
    language: 'json/json',
    ...json.configs.recommended,
  },

  // ==========================================================================
  // Markdown Files
  // Applies to: .md files
  // Includes common markdown linting rules
  // ==========================================================================
  ...scopeConfigs(markdown.configs.recommended, MARKDOWN_FILES),

  // ==========================================================================
  // Config File Override
  // Exempt the config file itself from certain rules
  // ==========================================================================
  {
    files: ['eslint.config.ts'],
    rules: {
      'max-lines': 'off', // Config files can be longer than 200 lines
    },
  },
]

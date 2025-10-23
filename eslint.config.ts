import css from '@eslint/css'
import json from '@eslint/json'
import markdown from '@eslint/markdown'
import vitest from '@vitest/eslint-plugin'
import type { Linter } from 'eslint'
import love from 'eslint-config-love'
import eslintPluginAstro from 'eslint-plugin-astro'
import jsxA11y from 'eslint-plugin-jsx-a11y'
import react from 'eslint-plugin-react'
import globals from 'globals'
import tseslint from 'typescript-eslint'

// ============================================================================
// File Pattern Constants
// ============================================================================
const TS_JS_FILES = ['**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts}']
const REACT_FILES = ['**/*.{jsx,tsx}']
const ASTRO_FILES = ['**/*.astro']
const TEST_FILES = ['**/*.{test,spec}.{ts,tsx}']
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
      'coverage/',
      '.claude/',
      '.vscode/',
      '.prettierrc.mjs',
      'package-lock.json',
      'src/styles/global.css', // Exception: Contains Tailwind v4 @custom-variant syntax that CSS parser cannot handle
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
    plugins: {
      ...love.plugins,
      '@typescript-eslint': tseslint.plugin,
    },
  },
  {
    // Import settings and rules
    files: TS_JS_FILES,
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: '.',
        },
      },
    },
    rules: {
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
    },
  },
  {
    // Custom rule overrides for all TS/JS files
    files: TS_JS_FILES,
    rules: {
      'max-lines': ['error', { max: 200 }],
      'no-console': 'off',
      complexity: 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-magic-numbers': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/prefer-destructuring': 'off',
      'no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_' }],
    },
  },

  // ==========================================================================
  // React Components (JSX/TSX)
  // Applies to: .jsx, .tsx files
  // ==========================================================================
  {
    files: REACT_FILES,
    plugins: {
      react,
      'jsx-a11y': jsxA11y,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...react.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      // Override specific React rules as needed
      'react/no-unescaped-entities': 'off',
      'react/react-in-jsx-scope': 'off', // Not needed in modern React/Astro
    },
  },

  // ==========================================================================
  // Astro Files
  // Applies to: .astro files
  // Includes jsx-a11y for accessibility checking in Astro templates
  // ==========================================================================
  ...scopeConfigs(eslintPluginAstro.configs['jsx-a11y-recommended'], ASTRO_FILES),

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

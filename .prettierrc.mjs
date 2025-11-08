/** @type {import("prettier").Config} */
export default {
  printWidth: 100,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  trailingComma: 'all',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'always',
  endOfLine: 'lf',
  tailwindStylesheet: './src/styles/global.css',

  plugins: [
    'prettier-plugin-astro',
    'prettier-plugin-tailwindcss',
    '@trivago/prettier-plugin-sort-imports',
  ],

  overrides: [
    { files: '*.astro', options: { parser: 'astro' } },
    { files: ['*.json', '*.jsonc'], options: { parser: 'json', trailingComma: 'none' } },
    { files: ['*.yaml', '*.yml'], options: { parser: 'yaml', singleQuote: false, tabWidth: 2 } },
    { files: ['*.md', '*.mdx'], options: { parser: 'mdx', printWidth: 80, proseWrap: 'always' } },
  ],

  importOrder: [
    '<BUILTIN_MODULES>', // Node.js built-in modules
    '<THIRD_PARTY_MODULES>', // Other third-party libraries
    '^@/', // Project-specific components
    '^@test/', // Project-specific libraries
    '^[./]', // Relative imports
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,

  astroAllowShorthand: true,
}

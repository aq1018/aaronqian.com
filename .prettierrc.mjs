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

  plugins: ['prettier-plugin-astro'],

  overrides: [
    {
      files: '*.astro',
      options: {
        parser: 'astro',
      },
    },
    {
      files: ['*.json', '*.jsonc'],
      options: {
        parser: 'json',
        trailingComma: 'none',
      },
    },
    {
      files: ['*.yaml', '*.yml'],
      options: {
        parser: 'yaml',
        tabWidth: 2,
        singleQuote: false,
      },
    },
    {
      files: ['*.md', '*.mdx'],
      options: {
        parser: 'mdx',
        printWidth: 80,
        proseWrap: 'always',
        embeddedLanguageFormatting: 'auto',
      },
    },
  ],

  // Astro-specific options
  astroAllowShorthand: true,
}

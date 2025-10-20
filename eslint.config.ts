import css from "@eslint/css";
import json from "@eslint/json";
import markdown from "@eslint/markdown";
import vitest from "@vitest/eslint-plugin";
import love from "eslint-config-love";
import eslintPluginAstro from "eslint-plugin-astro";
import globals from "globals";
import tseslint from "typescript-eslint";

export default [
  // Global ignores
  {
    ignores: ["dist/", "node_modules/", ".astro/", "coverage/", ".claude/"],
  },

  // globals
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,astro}"],
  },

  // TypeScript ESLint plugin
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,astro}"],
    plugins: {
      "@typescript-eslint": tseslint.plugin,
    },
  },

  // default love config
  {
    ...love,
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,astro}"],
  },

  // Astro plugin recommended rules for .astro files
  ...eslintPluginAstro.configs["jsx-a11y-recommended"],

  // import settings
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs,mts,cts,astro}"],
    settings: {
      "import/resolver": {
        typescript: {
          alwaysTryTypes: true,
          project: ".",
        },
      },
    },
    rules: {
      "sort-imports": ["error", { ignoreDeclarationSort: true }],
      "import/no-unresolved": ["error", { ignore: ["^astro:"] }],
      "import/no-cycle": "error",
      "import/order": [
        "error",
        {
          "newlines-between": "always",
          alphabetize: {
            order: "asc",
          },
        },
      ],
    },
  },

  // rules overrides
  {
    rules: {
      "max-lines": ["error", { max: 200 }],
      "no-console": "off",
      complexity: "off",
      "react/no-unescaped-entities": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-magic-numbers": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/prefer-destructuring": "off",
      "no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
      "@typescript-eslint/no-unused-vars": [
        "error",
        { varsIgnorePattern: "^_" },
      ],
    },
  },

  // spec overrides
  {
    files: ["**/*.spec.ts", "**/*.spec.tsx"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
      "@typescript-eslint/unbound-method": "off",
      "max-lines": "off",
      "max-nested-callbacks": "off",
    },
  },

  // css
  {
    files: ["**/*.css"],
    language: "css/css",
    ...css.configs.recommended,
  },

  // json
  {
    files: ["**/*.json"],
    language: "json/json",
    ...json.configs.recommended,
  },

  // markdown
  ...markdown.configs.recommended,
];

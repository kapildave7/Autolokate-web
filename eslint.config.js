import { sharedConfig } from '@autolokate/config/eslint';

/** @type {import('eslint').Linter.Config[]} */
export default [
  ...sharedConfig,
  {
    languageOptions: {
      parserOptions: {
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },
];

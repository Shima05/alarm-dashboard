// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import * as espree from 'espree';

export default [
  {
    ignores: ['**/*.js'],
    settings: {},
    languageOptions: {
      parser: espree,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
        ecmaVersion: 2021,
      },
      globals: {
        describe: 'readonly',
        test: 'readonly',
        expect: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',
        jest: 'readonly',
        process: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      // @ts-ignore
      ...tseslint.configs.strictTypeChecked.rules,
      // @ts-ignore
      ...tseslint.configs.stylisticTypeChecked.rules,
    },
  },
  eslintConfigPrettier,
];

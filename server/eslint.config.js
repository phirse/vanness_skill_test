const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const prettier = require('eslint-config-prettier');

module.exports = [
  { ignores: ['dist'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  prettier,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];

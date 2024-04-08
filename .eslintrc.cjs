module.exports = {
  root: true,

  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: './tsconfig.json',
    extraFileExtensions: ['.cjs', '.mjs', '.ts'],
  },

  plugins: [
    '@typescript-eslint',
  ],

  env: {
    es2021: true,
    node: true,
  },

  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
  ],

  rules: {
    '@typescript-eslint/no-use-before-define': ['error', {
      'functions': false,
    }],
    'no-restricted-syntax': 'off',
    'no-continue': 'off',
  },

  overrides: [{
    files: [
      '**/*.test.ts',
    ],

    plugins: [
      'jest',
    ],

    env: {
      'jest/globals': true,
    },
  }],
};

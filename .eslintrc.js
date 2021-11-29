module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: { browser: true, node: true, es6: true },
  settings: { react: { version: 'detect' } },
  extends: [
    'plugin:react/recommended',
    'plugin:jsx-a11y/recommended',
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    // 'next',
    // 'next/core-web-vitals',
    'plugin:@next/next/recommended',
    'prettier',
  ],
  rules: {
    // '@typescript-eslint/semi': 0,
    // 'import/prefer-default-export': 0,
    // 'react/destructuring-assignment': 0,
    'prettier/prettier': 2,
    'jsx-quotes': 2,
    'react/jsx-curly-brace-presence': 2,
    'react/prop-types': 0, // TS handles this
    // '@typescript-eslint/explicit-function-return-type': 0,
    // '@typescript-eslint/indent': 0,

    'react/require-default-props': 0, // Since we do not use prop-types

    'jsx-a11y/anchor-is-valid': 0,
  },
  // parserOptions: {
  //   project: './tsconfig.eslint.json',
  // },
  // overrides: [{ files: ['**/*.test.tsx'], env: { jest: true } }],
  plugins: ['prettier'],
}

import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';

const eslintConfig = [
  {
    ignores: ['node_modules/', '.next/', 'out/', 'build/', 'next-env.d.ts'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': 'error',
      'no-unused-vars': 'off', // Turn off base rule as it conflicts with @typescript-eslint version
    },
  },
];

export default eslintConfig;

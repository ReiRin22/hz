import { defineConfig, globalIgnores } from 'eslint/config';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

const eslintConfig = defineConfig([
  {
    files: ['src/**/*.ts'],
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // 共通: any 型禁止
      '@typescript-eslint/no-explicit-any': 'error',
      // 共通: 未使用変数禁止（_ 始まりは除外）
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      // BFF 固有: console.log 警告（Logger を使用すること）
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      // BFF 固有: 非同期処理の適切な使用
      '@typescript-eslint/no-floating-promises': 'error',
      // BFF 固有: 戻り値の型定義（推奨）
      '@typescript-eslint/explicit-function-return-type': 'warn',
    },
  },
  globalIgnores([
    'dist/**',
    'node_modules/**',
    'coverage/**',
  ]),
]);

export default eslintConfig;

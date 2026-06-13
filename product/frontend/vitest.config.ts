import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/shared/plugins/setup.ts'],
    pool: 'forks',
    maxWorkers: 3,
    reporters: ['default', 'html'],
    outputFile: {
      html: './test-report/index.html',
    },
    include: [
      'src/**/**/test/**/*.{ts,tsx}',
      'test/integration/**/*.{ts,tsx}',
    ],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './coverage',
      thresholds: {
        statements: 70,
        branches: 70,
        functions: 70,
        lines: 70,
      },
      include: [
        'src/shared/stores/*.ts',
        'src/shared/hooks/*.ts',
        'src/shared/keys/*.ts',
        'src/features/**/components/**/*.{ts,tsx}',
      ],
      exclude: [
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.d.ts',
        'src/**/types/**',
        'src/**/assets/**',
        'src/shared/test/**',
        'src/shared/__mocks__/**',
        'src/shared/plugins/setup.ts',
      ],
    },
  },
  resolve: {
    preserveSymlinks: true,
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@sentry/nextjs': path.resolve(__dirname, './src/shared/__mocks__/@sentry/nextjs.ts'),
      'react': path.resolve(__dirname, './node_modules/react'),
      'react-dom': path.resolve(__dirname, './node_modules/react-dom'),
    },
  },
});

// import { defineConfig } from 'vitest/config';
// import path from 'path';

// export default defineConfig({
//   test: {
//     environment: 'jsdom',
//     globals: true,
//     setupFiles: ['./vitest.setup.ts'],
//     pool: 'forks',
//     maxWorkers: 3,
//     // MSW不要コンポーネントのストーリーテスト + MSWありのOrganismテストを含む
//     include: [
//       'src/**/*.test.{ts,tsx}',
//       'src/**/*.stories.test.{ts,tsx}',
//     ],
//     coverage: {
//       provider: 'v8',
//       // C0: ステートメントカバレッジ
//       // C1: ブランチカバレッジ（条件分岐）
//       // C2: 関数カバレッジ
//       reporter: ['text', 'json', 'html', 'lcov'],
//       reportsDirectory: './coverage',
//       thresholds: {
//         statements: 80,   // C0
//         branches: 70,     // C1
//         functions: 80,    // C2
//         lines: 80,
//       },
//       include: [
//         'src/features/**/components/**/*.{ts,tsx}',
//       ],
//       exclude: [
//         'src/**/*.stories.{ts,tsx}',
//         'src/**/*.test.{ts,tsx}',
//         'src/**/*.d.ts',
//         'src/**/types/**',
//         'src/**/assets/**',
//       ],
//     },
//   },
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, './src'),
//       '@shared': path.resolve(__dirname, './src/shared'),
//     },
//   },
// });

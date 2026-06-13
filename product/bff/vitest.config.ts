import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/**/*.test.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/**/*.test.ts', 'src/**/*.module.ts', 'src/index.ts'],
    },
  },
  resolve: {
    alias: {
      '@shared': resolve('./src/shared'),
      '@': resolve('./src'),
    },
  },
});

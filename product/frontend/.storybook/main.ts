import type { StorybookConfig } from '@storybook/react-vite';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.stories.@(ts|tsx)'],
  staticDirs: ['../public'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-a11y',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  docs: { autodocs: 'tag' },
  viteFinal: async (config) => {
    config.resolve = config.resolve ?? {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, '../src'),
      '@shared': path.resolve(__dirname, '../src/shared'),
      'next/navigation': path.resolve(__dirname, './mocks/next-navigation.ts'),
    };
    config.define = {
      ...config.define,
      'process.env': {},
      'process.env.NEXT_PUBLIC_BFF_URL': JSON.stringify('http://localhost:3001'),
    };
    return config;
  },
};

export default config;

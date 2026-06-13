import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { setupServer } from 'msw/node';

import * as Stories from '../stories/organisms/GlobalHeaderOrganism.stories';
import { useGlobalHeaderStore } from '../stores/use-global-header.store';

const { Default, FetchError } = composeStories(Stories);

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

afterEach(() => {
  cleanup();
  server.resetHandlers();
  useGlobalHeaderStore.getState().reset();
});

afterAll(() => server.close());

describe('GlobalHeaderOrganism / Default', () => {
  test('初期表示: BFF からユーザー名を取得してヘッダーに表示する', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);

    await waitFor(() => {
      const names = screen.getAllByText('田中 一郎');
      expect(names.length).toBeGreaterThan(0);
    });
  });

  test('初期表示: ユーザー役職・部署が表示される', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);

    await waitFor(() => {
      const roles = screen.getAllByText('医師');
      expect(roles.length).toBeGreaterThan(0);
    });
  });

  test('初期表示: アラートバッジが未読件数を表示する', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);

    // 2件のアラートが dismissed: false のため未読数 2 が表示される
    await waitFor(() => {
      expect(screen.getByText('2')).toBeInTheDocument();
    });
  });
});

// FetchError story: useGlobalHeaderInit が throw err → error.tsx 委譲パターンのため
// テスト環境では unhandled rejection が発生するためスキップ
// API 500 エラーのケースは E2E テストで検証する

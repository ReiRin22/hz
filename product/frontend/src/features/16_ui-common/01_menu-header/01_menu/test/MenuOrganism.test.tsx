import '@testing-library/jest-dom';
import { describe, test, expect, beforeAll, afterAll, afterEach } from 'vitest';
import { render, screen, waitFor, cleanup } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { setupServer } from 'msw/node';
import { vi } from 'vitest';
import * as Stories from '../stories/organisms/MenuOrganism.stories';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));

const { Default, MenuFetchError } = composeStories(Stories);

const server = setupServer();

beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => { cleanup(); server.resetHandlers(); mockRouterPush.mockClear(); });
afterAll(() => server.close());

describe('MenuOrganism', () => {
  test('初期表示: APIからメニュー項目が読み込まれる', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);
    await waitFor(() => expect(screen.getAllByText('患者基本情報').length).toBeGreaterThanOrEqual(1), { timeout: 3000 });
  });

  test('初期表示: 複数のボタンが存在する', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      expect(buttons.length).toBeGreaterThan(0);
    }, { timeout: 3000 });
  });

  test('初期表示: ダッシュボードセクションが表示される', async () => {
    server.use(...Stories.commonHandlers);
    render(<Default />);
    await waitFor(() => expect(screen.getByText('ダッシュボード')).toBeInTheDocument(), { timeout: 3000 });
  });

  test('MenuFetchError: APIエラー時はエラーメッセージが表示される', async () => {
    server.use(...((MenuFetchError as any).parameters?.msw?.handlers ?? []));
    render(<MenuFetchError />);
    await waitFor(() => expect(screen.getByText('メニューの取得に失敗しました')).toBeInTheDocument(), { timeout: 3000 });
  });
});

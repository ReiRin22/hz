import { render, screen, waitFor } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, test, vi } from 'vitest';
import { RightSideMenu } from '../../components/organisms/right-sidemenu/RightSideMenu';
import type { GetRightSideMenuItemsResponse } from '@/front_bff_shared/features/ui-common/menu-header/right-sidemenu/types/responses/right-side-menu.response';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));

const BASE_URL = 'http://localhost:3001/bff';

const SAMPLE_ITEMS = [
  { id: '1', label: '病棟マップ', iconKey: 'map', visible: true, sortOrder: 1 },
  { id: '2', label: '受診者一覧', iconKey: 'list', visible: true, sortOrder: 2 },
  { id: '3', label: '院内掲示板', iconKey: 'board', visible: true, sortOrder: 3 },
  { id: '4', label: '伝言メモ', iconKey: 'memo', visible: true, sortOrder: 4 },
];

const server = setupServer(
  http.get(`${BASE_URL}/right-side-menu-items`, () =>
    HttpResponse.json<GetRightSideMenuItemsResponse>({ items: SAMPLE_ITEMS })
  )
);

beforeAll(() => server.listen({ onUnhandledRequest: 'warn' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('RightSideMenu stories', () => {
  // C0: 正常取得後のレンダリング
  test('メニュー取得後に受診者一覧ラベルが表示される', async () => {
    render(<RightSideMenu />);
    await waitFor(
      () => expect(screen.getByText('受診者一覧')).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  // C0: メニューボタン
  test('メニューボタンが表示される', async () => {
    render(<RightSideMenu />);
    await waitFor(
      () => expect(screen.getByRole('button', { name: 'メニュー' })).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  // C1: API エラー時のエラー表示分岐
  test(
    'API エラー時にエラーメッセージが表示される',
    server.boundary(async () => {
      server.use(
        http.get(`${BASE_URL}/right-side-menu-items`, () =>
          HttpResponse.json({ message: 'サーバーエラー' }, { status: 500 })
        )
      );
      render(<RightSideMenu />);
      await waitFor(
        () => expect(screen.getByText('メニューの取得に失敗しました')).toBeInTheDocument(),
        { timeout: 3000 }
      );
    })
  );
});

import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { cleanup } from '@testing-library/react';
import { RightSideMenu } from '../components/organisms/RightSideMenu';
import { useRightSideMenuStore } from '../stores/use-right-side-menu.store';
import type { GetRightSideMenuItemsResponse } from '@/front_bff_shared/types/response/right-side-menu.response.type';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));

vi.mock('../api/right-side-menu.api');
import * as rightSideMenuApi from '../api/right-side-menu.api';
const mockGetRightSideMenuItems = vi.mocked(rightSideMenuApi.getRightSideMenuItems);

const SAMPLE_ITEMS: GetRightSideMenuItemsResponse = {
  items: [
    { id: '1', label: '病棟マップ', iconKey: 'map', visible: true, sortOrder: 1 },
    { id: '2', label: '受診者一覧', iconKey: 'list', visible: true, sortOrder: 2 },
    { id: '3', label: '院内掲示板', iconKey: 'board', visible: true, sortOrder: 3 },
    { id: '4', label: '伝言メモ', iconKey: 'memo', visible: true, sortOrder: 4 },
  ],
};

beforeEach(() => {
  vi.clearAllMocks();
  useRightSideMenuStore.getState().reset();
});

afterEach(() => {
  cleanup();
  useRightSideMenuStore.getState().reset();
});

describe('RightSideMenu stories', () => {
  // C0: 正常取得後のレンダリング
  test('メニュー取得後に受診者一覧ラベルが表示される', async () => {
    mockGetRightSideMenuItems.mockResolvedValue(SAMPLE_ITEMS);
    render(<RightSideMenu />);
    await waitFor(
      () => expect(screen.getByText('受診者一覧')).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  // C0: メニューボタン（メニュー項目の末尾に追加される固定ボタン）
  test('メニュー取得後にメニューボタンが表示される', async () => {
    mockGetRightSideMenuItems.mockResolvedValue(SAMPLE_ITEMS);
    render(<RightSideMenu />);
    await waitFor(
      () => expect(screen.getByRole('button', { name: 'メニュー' })).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });

  // C1: API エラー時のエラー表示分岐
  test('API エラー時にエラーメッセージが表示される', async () => {
    mockGetRightSideMenuItems.mockRejectedValue(new Error('server error'));
    render(<RightSideMenu />);
    await waitFor(
      () => expect(screen.getByText('メニューの取得に失敗しました')).toBeInTheDocument(),
      { timeout: 3000 }
    );
  });
});

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ETC005Page from '../../components/organisms/right-sidemenu/ETC005Page';
import * as rightSideMenuApi from '../../api/right-side-menu/right-side-menu.api';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));

vi.mock('@/shared/components/atoms/sonner', () => ({
  Toaster: () => null,
}));

vi.mock('../../api/right-side-menu/right-side-menu.api');
const mockGetRightSideMenuItems = vi.mocked(rightSideMenuApi.getRightSideMenuItems);

const MOCK_ITEMS = {
  items: [
    { id: '1', label: '病棟マップ', iconKey: 'map', visible: true, sortOrder: 1 },
    { id: '2', label: '受診者一覧', iconKey: 'list', visible: true, sortOrder: 2 },
    { id: '3', label: '院内掲示板', iconKey: 'board', visible: true, sortOrder: 3 },
    { id: '4', label: '伝言メモ', iconKey: 'memo', visible: true, sortOrder: 4 },
    { id: '5', label: 'システム設定', iconKey: 'settings', visible: true, sortOrder: 5 },
  ],
};

describe('ETC005 右サイドメニュー画面', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('メニューへボタン', () => {
    it('メニューへボタン押下で router.push が ETC002 のパスで呼ばれる', async () => {
      mockGetRightSideMenuItems.mockResolvedValue(MOCK_ITEMS);
      render(<ETC005Page />);
      const button = await waitFor(
        () => screen.getByRole('button', { name: 'メニュー' }),
        { timeout: 3000 },
      );
      fireEvent.click(button);
      expect(mockRouterPush).toHaveBeenCalledWith('/ui-common/menu-header/menu');
    });
  });

  describe('メニュー項目API呼び出し', () => {
    it('マウント時に getRightSideMenuItems が呼ばれる', async () => {
      mockGetRightSideMenuItems.mockResolvedValue(MOCK_ITEMS);
      render(<ETC005Page />);
      await waitFor(
        () => expect(mockGetRightSideMenuItems).toHaveBeenCalled(),
        { timeout: 3000 },
      );
    });
  });
});

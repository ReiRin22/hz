import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { toast } from 'sonner';
import { i18n } from '@/shared/i18n';
import { getDeptInstructions } from '../api/getDeptInstructions';
import { updateDeptInstructionStatus } from '../api/updateDeptInstructionStatus';
import { mockOrders, mockOrdersWithStartedSpecimen } from '../test/fixtures/orderFixtures';
import { useDeptInstructionStore } from '../stores/useDeptInstructionStore';
import * as stories from '../stories/organisms/DeptInstructionScreen.stories';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// api/ 層のみモック（テストルール準拠: repository/hooks/ モック禁止）
vi.mock('../api/getDeptInstructions');
vi.mock('../api/updateDeptInstructionStatus');

const { Default, ApiError, StatusUpdateError } = composeStories(stories);

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  useDeptInstructionStore.getState().reset();
});

describe('DeptInstructionScreen / Default', () => {
  test(
    'データ取得成功: タイトルが表示される',
    async () => {
      // Arrange
      vi.mocked(getDeptInstructions).mockResolvedValue({
        orders: mockOrders,
        total: mockOrders.length,
        page: 1,
        pageSize: 50,
      });
      render(<Default />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('臨床検査科指示受け一覧')).toBeInTheDocument();
      }, { timeout: 3000 });
    },
  );

  test(
    'データ取得成功: オーダーが表示される',
    async () => {
      // Arrange
      vi.mocked(getDeptInstructions).mockResolvedValue({
        orders: mockOrders,
        total: mockOrders.length,
        page: 1,
        pageSize: 50,
      });
      render(<Default />);

      // Assert
      await waitFor(() => {
        expect(screen.getByText('佐藤 花子')).toBeInTheDocument();
      }, { timeout: 3000 });
    },
  );

  test(
    '検索条件の折りたたみ: ボタン押下で折りたたまれる',
    async () => {
      // Arrange
      vi.mocked(getDeptInstructions).mockResolvedValue({
        orders: mockOrders,
        total: mockOrders.length,
        page: 1,
        pageSize: 50,
      });
      const user = userEvent.setup();
      render(<Default />);

      // データ読み込み待ち
      await waitFor(() => {
        expect(screen.getByText('臨床検査科指示受け一覧')).toBeInTheDocument();
      }, { timeout: 3000 });

      // Act: 検索条件の折りたたみボタンをクリック
      const toggleButton = screen.getByRole('button', { name: '検索条件を折りたたむ' });
      await user.click(toggleButton);

      // Assert: 折りたたまれた状態になる
      await waitFor(() => {
        expect(screen.getByRole('button', { name: '検索条件を展開する' })).toBeInTheDocument();
      }, { timeout: 3000 });
    },
  );
});

describe('DeptInstructionScreen / StatusUpdateError', () => {
  test(
    'ステータス更新失敗: エラートーストが呼び出される',
    async () => {
      // Arrange
      vi.mocked(getDeptInstructions).mockResolvedValue({
        orders: mockOrdersWithStartedSpecimen,
        total: mockOrdersWithStartedSpecimen.length,
        page: 1,
        pageSize: 50,
      });
      vi.mocked(updateDeptInstructionStatus).mockRejectedValue(new Error('ステータス更新エラー'));
      const toastErrorSpy = vi.spyOn(toast, 'error');
      const user = userEvent.setup();
      render(<StatusUpdateError />);

      // データ読み込み待ち（山田太郎が複数件いるため getAllByText で確認）
      await waitFor(() => {
        expect(screen.getAllByText('山田 太郎').length).toBeGreaterThan(0);
      }, { timeout: 3000 });

      // Act: 開始済・検体検査オーダーの「採取」ボタンをクリック
      const collectButton = screen.getByRole('button', { name: '採取' });
      await user.click(collectButton);

      // Assert: api/ スタブが throw するため axios.isAxiosError=false → フォールバックメッセージ
      await waitFor(() => {
        expect(toastErrorSpy).toHaveBeenCalled();
      }, { timeout: 3000 });
    },
  );
});

describe('DeptInstructionScreen / ApiError', () => {
  test(
    'API失敗: エラーメッセージが表示される',
    async () => {
      // Arrange
      vi.mocked(getDeptInstructions).mockRejectedValue(new Error('fetch failed'));

      // Act
      render(<ApiError />);

      // Assert
      await waitFor(() => {
        expect(
          screen.getByText(i18n.deptInstruction.screen.errors.fetchFailed),
        ).toBeInTheDocument();
      }, { timeout: 3000 });
    },
  );
});

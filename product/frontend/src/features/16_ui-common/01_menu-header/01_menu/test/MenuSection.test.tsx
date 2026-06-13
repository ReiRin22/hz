import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MenuSection } from '../components/organisms/MenuSection';
import * as api from '../api/getMenuItems.api';

const mockRouterPush = vi.hoisted(() => vi.fn());

vi.mock('../api/getMenuItems.api');
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));
const mockGetMenuItems = vi.mocked(api.getMenuItems);

const MOCK_THEME = {
  name: 'ブルー',
  value: 'blue',
  primary: '#3B82F6',
  secondary: '#DBEAFE',
};

const MOCK_ITEMS = [
  {
    id: '1',
    title: '患者基本情報',
    iconName: 'User',
    type: 'normal' as const,
    visible: true,
    isFavorite: true,
    sortOrder: 1,
  },
  {
    id: '2',
    title: '患者検索',
    iconName: 'Search',
    type: 'normal' as const,
    visible: false,
    isFavorite: false,
    sortOrder: 2,
  },
  {
    id: '9',
    title: '部門',
    iconName: 'Building',
    type: 'department' as const,
    visible: true,
    isFavorite: false,
    sortOrder: 9,
    children: [
      {
        id: '9-1',
        title: '臨床検査科',
        iconName: 'Building',
        type: 'departmentChild' as const,
        visible: true,
        isFavorite: false,
        sortOrder: 1,
        url: '/dept-instruction/lab-instruction',
        parentId: '9',
      },
    ],
  },
];

describe('MenuSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('ローディング・エラー状態', () => {
    it('API ローディング中は「読み込み中...」テキストを表示する', () => {
      mockGetMenuItems.mockReturnValue(new Promise(() => {}));

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} />);

      expect(screen.getByText('読み込み中...')).toBeInTheDocument();
    });

    it('API エラー時は「メニューの取得に失敗しました」テキストを表示する', async () => {
      mockGetMenuItems.mockRejectedValue(new Error('fetch failed'));

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} />);

      await waitFor(() => expect(screen.getByText('メニューの取得に失敗しました')).toBeInTheDocument(), { timeout: 3000 });
    });
  });

  describe('正常系: メニュー項目表示', () => {
    it('API から取得したメニュー項目のタイトルが表示される', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} />);

      // isFavorite:true のためお気に入り欄と通常欄の2箇所に表示される
      await waitFor(() => expect(screen.getAllByText('患者基本情報').length).toBeGreaterThanOrEqual(1), { timeout: 3000 });
    });

    it('visible: false のメニュー項目は表示されない', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} />);

      await waitFor(() => expect(screen.getAllByText('患者基本情報').length).toBeGreaterThanOrEqual(1), { timeout: 3000 });
      expect(screen.queryByText('患者検索')).not.toBeInTheDocument();
    });

    it('isFavorite: true のメニュー項目はお気に入りセクションに表示される', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} />);

      await waitFor(() => expect(screen.getByText('お気に入り')).toBeInTheDocument(), { timeout: 3000 });
    });
  });

  describe('正常系: 部門メニュー', () => {
    it('部門の子メニュー項目ボタンを押下すると router.push が url で呼び出される', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} />);

      await waitFor(() => expect(screen.getByText('部門')).toBeInTheDocument(), { timeout: 3000 });
      fireEvent.click(screen.getByText('部門'));

      await waitFor(() => expect(screen.getByText('臨床検査科')).toBeInTheDocument(), { timeout: 3000 });
      fireEvent.click(screen.getByText('臨床検査科'));

      expect(mockRouterPush).toHaveBeenCalledWith('/dept-instruction/lab-instruction');
    });

    it('url を持たないメニュー項目を押下しても router.push は呼ばれない', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} />);

      await waitFor(() => expect(screen.getAllByText('患者基本情報').length).toBeGreaterThanOrEqual(1), { timeout: 3000 });
      // 通常リスト内のボタン（お気に入りセクションのボタンも url なし）を押下
      fireEvent.click(screen.getAllByText('患者基本情報')[0]);

      expect(mockRouterPush).toHaveBeenCalledTimes(0);
    });
  });

  describe('正常系: メニュー設定ダイアログ', () => {
    it('isSettingsOpen: true のとき「メニュー設定」ダイアログが表示される', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} isSettingsOpen={true} onSettingsOpenChange={vi.fn()} />);

      await waitFor(() => expect(screen.getByText('メニュー設定')).toBeInTheDocument(), { timeout: 3000 });
    });

    it('isSettingsOpen: false のとき「メニュー設定」ダイアログは表示されない', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} isSettingsOpen={false} onSettingsOpenChange={vi.fn()} />);

      await waitFor(() => expect(screen.getAllByText('患者基本情報').length).toBeGreaterThanOrEqual(1), { timeout: 3000 });
      expect(screen.queryByText('メニュー設定')).not.toBeInTheDocument();
    });

    it('「キャンセル」ボタン押下で onSettingsOpenChange(false) が呼ばれる', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });
      const mockOnSettingsOpenChange = vi.fn();

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} isSettingsOpen={true} onSettingsOpenChange={mockOnSettingsOpenChange} />);

      await waitFor(() => expect(screen.getByText('キャンセル')).toBeInTheDocument(), { timeout: 3000 });
      fireEvent.click(screen.getByText('キャンセル'));

      expect(mockOnSettingsOpenChange).toHaveBeenCalledWith(false);
    });

    it('「保存」ボタン押下で onSettingsOpenChange(false) が呼ばれる', async () => {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });
      const mockOnSettingsOpenChange = vi.fn();

      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} isSettingsOpen={true} onSettingsOpenChange={mockOnSettingsOpenChange} />);

      await waitFor(() => expect(screen.getByText('保存')).toBeInTheDocument(), { timeout: 3000 });
      fireEvent.click(screen.getByText('保存'));

      expect(mockOnSettingsOpenChange).toHaveBeenCalledWith(false);
    });
  });

  describe('メニュー設定: パスワード変更バリデーション', () => {
    async function renderWithPasswordTab() {
      mockGetMenuItems.mockResolvedValue({ items: MOCK_ITEMS });
      // pointerEventsCheck: 0 bypasses the body pointer-events:none set by Radix Dialog scroll lock
      const user = userEvent.setup({ pointerEventsCheck: 0 });
      render(<MenuSection theme={MOCK_THEME} onThemeChange={vi.fn()} isSettingsOpen={true} onSettingsOpenChange={vi.fn()} />);
      await waitFor(() => expect(screen.getByRole('tab', { name: /パスワード/ })).toBeInTheDocument(), { timeout: 3000 });
      // Radix Tabs uses Presence: inactive tab content is unmounted until tab is clicked.
      // Radix Dialog renders via Portal to document.body, outside the render() container.
      await user.click(screen.getByRole('tab', { name: /パスワード/ }));
      await waitFor(() => expect(document.querySelectorAll('input[type="password"]').length).toBeGreaterThanOrEqual(3), { timeout: 3000 });
      return { user };
    }

    it('すべての入力欄が空のままパスワード変更ボタンを押すとエラーメッセージが表示される', async () => {
      const { user } = await renderWithPasswordTab();
      await user.click(screen.getByText('パスワード変更').closest('button')!);

      expect(screen.getByText('すべての項目を入力してください')).toBeInTheDocument();
    });

    it('新しいパスワードと確認用パスワードが不一致の場合はエラーメッセージが表示される', async () => {
      const { user } = await renderWithPasswordTab();
      const inputs = document.querySelectorAll('input[type="password"]');
      await user.type(inputs[0] as HTMLElement, 'current123');
      await user.type(inputs[1] as HTMLElement, 'newpass01');
      await user.type(inputs[2] as HTMLElement, 'different1');
      await user.click(screen.getByText('パスワード変更').closest('button')!);

      expect(screen.getByText('新しいパスワードが一致しません')).toBeInTheDocument();
    });

    it('新しいパスワードが8文字未満の場合はエラーメッセージが表示される', async () => {
      const { user } = await renderWithPasswordTab();
      const inputs = document.querySelectorAll('input[type="password"]');
      await user.type(inputs[0] as HTMLElement, 'current123');
      await user.type(inputs[1] as HTMLElement, 'short');
      await user.type(inputs[2] as HTMLElement, 'short');
      await user.click(screen.getByText('パスワード変更').closest('button')!);

      expect(screen.getByText('パスワードは8文字以上で設定してください')).toBeInTheDocument();
    });
  });
});

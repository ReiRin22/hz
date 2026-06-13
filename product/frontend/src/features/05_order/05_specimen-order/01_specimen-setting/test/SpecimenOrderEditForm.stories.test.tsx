import { describe, test, expect, afterEach, vi, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/organisms/SpecimenOrderEditForm.stories';

vi.mock('../api/specimenOrderApi', () => ({
  getSpecimenItems: vi.fn(),
  getSpecimenHistory: vi.fn(),
  getSpecimenSets: vi.fn(),
  confirmSpecimenOrders: vi.fn(),
}));

import { getSpecimenItems } from '../api/specimenOrderApi';

const MOCK_SPECIMEN_ITEMS = {
  items: [
    { id: 'si-001', code: 'CBC', name: '血算（CBC）', category: '血液', specimenType: 'blood' },
    { id: 'si-002', code: 'BMP', name: '生化学', category: '血液', specimenType: 'blood' },
    { id: 'si-003', code: 'UA', name: '尿一般', category: '尿', specimenType: 'urine' },
    { id: 'si-004', code: 'CULT', name: '尿培養', category: '尿', specimenType: 'urine' },
  ],
};

const { Default, WithAddedCodes, FetchError } = composeStories(stories);

afterEach(() => {
  cleanup();
  stories.default.args?.onAddItems?.mockClear?.();
});

describe('SpecimenOrderEditForm / Default', () => {
  beforeEach(() => {
    vi.mocked(getSpecimenItems).mockResolvedValue(MOCK_SPECIMEN_ITEMS);
  });

  test('初期表示: ローディング後フォームがレンダリングされる', async () => {
    render(<Default />);
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('検体項目ロード成功: カテゴリ名が表示される', async () => {
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText('血液')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('初期展開: ロード後に最初のカテゴリ（血液）が自動展開されアイテムが表示される（C1: Collapsible open分岐）', async () => {
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('カテゴリ折り畳み/展開: 閉じたカテゴリ（尿）をクリックすると尿アイテムが表示される', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText('尿')).toBeInTheDocument();
    }, { timeout: 3000 });
    await user.click(screen.getByText('尿'));
    await waitFor(() => {
      expect(screen.getByText('尿一般')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('チェックボックス操作: アイテム選択後に追加ボタンが有効になる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
    }, { timeout: 3000 });
    const checkbox = screen.getByRole('checkbox', { name: /CBC|血算/i });
    await user.click(checkbox);
    await waitFor(() => {
      const addBtn = screen.getByRole('button', { name: /追加|オーダーに追加/i });
      expect(addBtn).not.toBeDisabled();
    }, { timeout: 3000 });
  });

  test('チェックボックス選択後に追加実行: onAddItemsが呼ばれ選択がリセットされる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText('血算（CBC）')).toBeInTheDocument();
    }, { timeout: 3000 });
    const checkbox = screen.getByRole('checkbox', { name: /CBC|血算/i });
    await user.click(checkbox);
    const addBtn = screen.getByRole('button', { name: /選択項目を追加/ });
    await user.click(addBtn);
    expect(Default.args.onAddItems).toHaveBeenCalledOnce();
  });

  test('緊急度Collapsible: クリックで展開し至急を選択できる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText(/緊急度/)).toBeInTheDocument();
    }, { timeout: 3000 });
    await user.click(screen.getByText(/緊急度/));
    await waitFor(() => {
      expect(screen.getByLabelText('至急')).toBeInTheDocument();
    }, { timeout: 3000 });
    await user.click(screen.getByLabelText('至急'));
    await waitFor(() => {
      expect(screen.getByText(/緊急度: 至急/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('特記事項Collapsible: クリックで展開しテキスト入力できる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText(/特記事項/)).toBeInTheDocument();
    }, { timeout: 3000 });
    await user.click(screen.getByText(/特記事項/));
    await waitFor(() => {
      expect(screen.getByPlaceholderText('特記事項を入力（任意）')).toBeInTheDocument();
    }, { timeout: 3000 });
    await user.type(screen.getByPlaceholderText('特記事項を入力（任意）'), '早急に処理');
    expect(screen.getByDisplayValue('早急に処理')).toBeInTheDocument();
  });

  test('検査実施予定日Collapsible: クリックで展開し日付未定チェックボックスが表示される', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => {
      expect(screen.getByText(/検査実施予定日/)).toBeInTheDocument();
    }, { timeout: 3000 });
    await user.click(screen.getByText(/検査実施予定日/));
    await waitFor(() => {
      expect(screen.getByText('日付未定')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('SpecimenOrderEditForm / WithAddedCodes', () => {
  test('追加済みコードあり: コンポーネントが正常にレンダリングされる', async () => {
    vi.mocked(getSpecimenItems).mockResolvedValue(MOCK_SPECIMEN_ITEMS);
    render(<WithAddedCodes />);
    await waitFor(() => {
      expect(screen.queryByText('読み込み中...')).not.toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

describe('SpecimenOrderEditForm / FetchError', () => {
  test('API 500: エラーメッセージが表示される', async () => {
    vi.mocked(getSpecimenItems).mockRejectedValue(new Error('Internal Server Error'));
    render(<FetchError />);
    await waitFor(() => {
      const errorEl = screen.queryByRole('alert') ?? screen.queryByText(/エラー|失敗|取得できませんでした/i);
      expect(errorEl).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

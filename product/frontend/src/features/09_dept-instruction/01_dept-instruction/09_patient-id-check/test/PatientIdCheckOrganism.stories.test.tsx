import { render, screen, waitFor, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { getPatientIdCheckExpectations } from '../api/getPatientIdCheckExpectations';
import { getReasonTemplates } from '../api/getReasonTemplates';
import { usePatientIdCheckStore } from '../stores/usePatientIdCheckStore';
import * as stories from '../stories/organisms/PatientIdCheckOrganism.stories';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: vi.fn(), back: vi.fn(), replace: vi.fn() }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}));

// api/ 層のみモック（テストルール準拠: repository/hooks/ モック禁止）
vi.mock('../api/getPatientIdCheckExpectations');
vi.mock('../api/getReasonTemplates');

const { Default, LoadError } = composeStories(stories);

const EXPECTATIONS = {
  patient: {
    id: 'P00012345',
    name: '山田 太郎',
    kana: 'ヤマダ タロウ',
    birthDate: '1965-04-15',
    barcode: 'PT-12345678',
  },
  item: {
    name: '生理食塩水 500mL',
    lotNumber: 'LOT-20250101',
    barcode: 'IT-98765432',
  },
  order: { id: 'ORD-001', orderType: '注射' },
};

const REASON_TEMPLATES = {
  templates: [
    { code: 'T001', label: '本人確認書類（保険証）で確認' },
    { code: 'T002', label: '医療スタッフ2名で確認' },
  ],
};

afterEach(() => {
  cleanup();
  vi.resetAllMocks();
  usePatientIdCheckStore.getState().reset();
});

describe('PatientIdCheckOrganism / Default', () => {
  test('初期表示: ローディング表示後に患者情報が表示される', async () => {
    // Arrange
    vi.mocked(getPatientIdCheckExpectations).mockResolvedValue(EXPECTATIONS);
    vi.mocked(getReasonTemplates).mockResolvedValue(REASON_TEMPLATES);
    render(<Default />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('山田 太郎（ヤマダ タロウ）')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('初期表示: 3セクション（患者・物品・実施者）のタイトルが表示される', async () => {
    // Arrange
    vi.mocked(getPatientIdCheckExpectations).mockResolvedValue(EXPECTATIONS);
    vi.mocked(getReasonTemplates).mockResolvedValue(REASON_TEMPLATES);
    render(<Default />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('患者確認')).toBeInTheDocument();
      expect(screen.getByText('物品確認')).toBeInTheDocument();
      expect(screen.getByText('実施者確認')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('初期表示: チェック実施ボタンが無効状態（全未確認）', async () => {
    // Arrange
    vi.mocked(getPatientIdCheckExpectations).mockResolvedValue(EXPECTATIONS);
    vi.mocked(getReasonTemplates).mockResolvedValue(REASON_TEMPLATES);
    render(<Default />);

    // Assert
    await waitFor(() => {
      const submitButton = screen.getByRole('button', { name: 'チェック実施' });
      expect(submitButton).toBeDisabled();
    }, { timeout: 3000 });
  });

  test('キャンセルボタン押下: 確認ダイアログが表示される', async () => {
    // Arrange
    vi.mocked(getPatientIdCheckExpectations).mockResolvedValue(EXPECTATIONS);
    vi.mocked(getReasonTemplates).mockResolvedValue(REASON_TEMPLATES);
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => screen.getByText('患者確認'), { timeout: 3000 });

    // Act
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    // Assert
    await waitFor(() => {
      expect(screen.getByText(/患者取り違い防止チェックをキャンセルしますか？/)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('キャンセル確認ダイアログ: 「戻る」ボタンでダイアログが閉じる', async () => {
    // Arrange
    vi.mocked(getPatientIdCheckExpectations).mockResolvedValue(EXPECTATIONS);
    vi.mocked(getReasonTemplates).mockResolvedValue(REASON_TEMPLATES);
    const user = userEvent.setup();
    render(<Default />);
    await waitFor(() => screen.getByText('患者確認'), { timeout: 3000 });
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    await waitFor(() => screen.getByText(/患者取り違い防止チェックをキャンセルしますか？/), { timeout: 3000 });

    // Act
    await user.click(screen.getByRole('button', { name: '戻る' }));

    // Assert
    expect(screen.queryByText(/患者取り違い防止チェックをキャンセルしますか？/)).not.toBeInTheDocument();
  });
});

describe('PatientIdCheckOrganism / LoadError', () => {
  test('APIエラー: エラーメッセージと再試行リンクが表示される', async () => {
    // Arrange
    vi.mocked(getPatientIdCheckExpectations).mockRejectedValue(new Error('fetch failed'));
    vi.mocked(getReasonTemplates).mockRejectedValue(new Error('fetch failed'));
    render(<LoadError />);

    // Assert
    await waitFor(() => {
      expect(screen.getByText('初期化に失敗しました。再試行してください。')).toBeInTheDocument();
      expect(screen.getByText('再試行')).toBeInTheDocument();
    }, { timeout: 3000 });
  });
});

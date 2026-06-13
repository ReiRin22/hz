import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import * as stories from '../stories/organisms/AdminRequestDialog.stories';

const { Open, Closed } = composeStories(stories);

describe('AdminRequestDialog stories', () => {
  beforeEach(() => {
    Open.args.onClose?.mockClear?.();
  });

  // C0: open状態での基本レンダリング
  test('Open: ダイアログが表示される', () => {
    render(<Open />);
    expect(screen.getByText('パスワード再設定依頼')).toBeInTheDocument();
  });

  // C1: closed分岐
  test('Closed: ダイアログが表示されない', () => {
    render(<Closed />);
    expect(screen.queryByText('パスワード再設定依頼')).not.toBeInTheDocument();
  });

  // C0: フォーム要素が表示される
  test('Open: ユーザーID・氏名・所属の入力フィールドが表示される', () => {
    render(<Open />);
    expect(screen.getByPlaceholderText('ユーザーID')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('氏名')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('部署（任意）')).toBeInTheDocument();
  });

  // C0: ボタンが表示される
  test('Open: キャンセルボタンと送信ボタンが表示される', () => {
    render(<Open />);
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '送信' })).toBeInTheDocument();
  });

  // C2: キャンセルボタンで onClose が呼ばれる
  test('Open: キャンセルボタン押下で onClose が呼ばれる', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Open onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  // C1: バリデーションエラー分岐（ユーザーID・氏名が両方空）
  test('Open: ユーザーIDと氏名が両方空の状態で送信するとエラーが表示される', async () => {
    const user = userEvent.setup();
    render(<Open />);
    await user.click(screen.getByRole('button', { name: '送信' }));
    expect(screen.getByText('ユーザーIDまたは氏名のいずれかを入力してください。')).toBeInTheDocument();
  });
});

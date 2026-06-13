import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import * as stories from '../stories/organisms/PasswordResetDialog.stories';

const { Open, Closed } = composeStories(stories);

describe('PasswordResetDialog stories', () => {
  beforeEach(() => {
    Open.args.onClose?.mockClear?.();
  });

  // C0: open状態での基本レンダリング
  test('Open: ダイアログが表示される', () => {
    render(<Open />);
    expect(screen.getByText('パスワード再設定')).toBeInTheDocument();
  });

  // C1: closed分岐
  test('Closed: ダイアログが表示されない', () => {
    render(<Closed />);
    expect(screen.queryByText('パスワード再設定')).not.toBeInTheDocument();
  });

  // C0: フォーム要素が表示される
  test('Open: パスワード入力フィールドが3つ表示される', () => {
    render(<Open />);
    expect(screen.getByPlaceholderText('現在のパスワード')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('新しいパスワード（8文字以上）')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('新しいパスワードを再入力')).toBeInTheDocument();
  });

  // C2: キャンセルボタンで onClose が呼ばれる
  test('Open: キャンセルボタン押下で onClose が呼ばれる', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Open onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(onClose).toHaveBeenCalledOnce();
  });

  // C1: 変更ボタンが disabled（未入力時）
  test('Open: パスワード未入力時は変更ボタンが無効', () => {
    render(<Open />);
    expect(screen.getByRole('button', { name: '変更' })).toBeDisabled();
  });
});

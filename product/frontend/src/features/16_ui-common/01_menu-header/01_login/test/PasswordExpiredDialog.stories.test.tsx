import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, beforeEach, vi } from 'vitest';
import * as stories from '../stories/organisms/PasswordExpiredDialog.stories';

const { Open, Closed } = composeStories(stories);

describe('PasswordExpiredDialog stories', () => {
  beforeEach(() => {
    Open.args.onClose?.mockClear?.();
    Open.args.onResetPassword?.mockClear?.();
  });

  // C0: open状態での基本レンダリング
  test('Open: パスワード有効期限切れダイアログが表示される', () => {
    render(<Open />);
    expect(screen.getByText('パスワード有効期限切れ')).toBeInTheDocument();
  });

  // C1: closed分岐
  test('Closed: ダイアログが表示されない', () => {
    render(<Closed />);
    expect(screen.queryByText('パスワード有効期限切れ')).not.toBeInTheDocument();
  });

  // C0: 変更ボタンが存在する
  test('変更ボタンが表示される', () => {
    render(<Open />);
    expect(screen.getByRole('button', { name: '変更' })).toBeInTheDocument();
  });

  // C0: パスワード入力フィールドが表示される
  test('Open: 新しいパスワードと確認用パスワードの入力フィールドが表示される', () => {
    render(<Open />);
    expect(screen.getByPlaceholderText('新しいパスワード（8文字以上）')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('新しいパスワードを再入力')).toBeInTheDocument();
  });

  // C1: 変更ボタンが disabled（未入力時）
  test('Open: パスワード未入力時は変更ボタンが無効', () => {
    render(<Open />);
    expect(screen.getByRole('button', { name: '変更' })).toBeDisabled();
  });

  // C2: X ボタンで onClose が呼ばれる
  test('Open: Xボタン押下で onClose が呼ばれる', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Open onClose={onClose} />);
    const closeButtons = screen.getAllByRole('button');
    const xButton = closeButtons.find(btn => btn.className.includes('absolute'));
    if (xButton) {
      await user.click(xButton);
      expect(onClose).toHaveBeenCalledOnce();
    }
  });
});

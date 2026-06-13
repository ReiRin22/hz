import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/PasswordTab.stories';

const { Empty, WithError, FilledMatch } = composeStories(stories);

describe('PasswordTab', () => {
  beforeEach(() => {
    Empty.args.onChangePassword?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('Empty story: passwordフィールドが3つ表示される', () => {
    render(<Empty />);
    const inputs = document.querySelectorAll('input[type="password"]');
    expect(inputs.length).toBe(3);
  });

  test('Empty story: 「パスワード変更」ボタンが表示される', () => {
    render(<Empty />);
    expect(screen.getByRole('button', { name: /パスワード変更/ })).toBeInTheDocument();
  });

  // C1: エラー状態の分岐
  test('WithError story: passwordError が表示される', () => {
    render(<WithError />);
    expect(screen.getByText('新しいパスワードと確認用パスワードが一致しません')).toBeInTheDocument();
  });

  test('FilledMatch story: エラーメッセージは表示されない', () => {
    render(<FilledMatch />);
    expect(screen.queryByText('すべての項目を入力してください')).not.toBeInTheDocument();
    expect(screen.queryByText('新しいパスワードが一致しません')).not.toBeInTheDocument();
    expect(screen.queryByText('パスワードは8文字以上で設定してください')).not.toBeInTheDocument();
  });

  test('Empty story: エラーメッセージは表示されない', () => {
    render(<Empty />);
    expect(screen.queryByText('すべての項目を入力してください')).not.toBeInTheDocument();
  });

  // C2: コールバック操作
  test('「パスワード変更」ボタン押下で onChangePassword が呼ばれる', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<Empty />);
    await user.click(screen.getByRole('button', { name: /パスワード変更/ }));
    expect(Empty.args.onChangePassword).toHaveBeenCalledOnce();
  });
});

import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/EditConfirmDialog.stories';

const { NormalUser, SubstituteUser } = composeStories(stories);

beforeEach(() => {
  stories.NormalUser.args.onConfirm?.mockClear?.();
  stories.NormalUser.args.onClose?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('EditConfirmDialog / NormalUser', () => {
  test('ダイアログが表示される', () => {
    render(<NormalUser />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('編集理由ラベルが表示される（必須マークなし）', () => {
    render(<NormalUser />);
    expect(screen.getByText(/編集理由/)).toBeInTheDocument();
    expect(screen.queryByText('*')).not.toBeInTheDocument();
  });

  test('確認ボタン押下: onConfirm が呼ばれる', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<NormalUser onConfirm={onConfirm} />);
    await user.click(screen.getByRole('button', { name: '編集する' }));
    expect(onConfirm).toHaveBeenCalled();
  });

  test('閉じるボタン押下: onClose が呼ばれる', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<NormalUser onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('EditConfirmDialog / SubstituteUser', () => {
  test('代行入力者: 編集理由ラベルに必須マーク（*）が表示される', () => {
    render(<SubstituteUser />);
    expect(screen.getByText('*')).toBeInTheDocument();
  });

  test('代行入力者: 理由未入力で確認ボタン押下するとエラーメッセージが表示される', async () => {
    const user = userEvent.setup();
    render(<SubstituteUser />);
    await user.click(screen.getByRole('button', { name: '編集する' }));
    expect(screen.getByText('編集理由を入力してください')).toBeInTheDocument();
  });

  test('代行入力者: 理由入力後に確認ボタン押下すると onConfirm が呼ばれる', async () => {
    const onConfirm = vi.fn();
    const user = userEvent.setup();
    render(<SubstituteUser onConfirm={onConfirm} />);
    await user.type(screen.getByPlaceholderText('編集理由を入力してください'), '診察上の必要による変更');
    await user.click(screen.getByRole('button', { name: '編集する' }));
    expect(onConfirm).toHaveBeenCalledWith('診察上の必要による変更');
  });
});

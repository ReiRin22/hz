import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/ConfirmedOrderRow.stories';

const { Active, Revoked } = composeStories(stories);

beforeEach(() => {
  stories.Active.args.onEdit?.mockClear?.();
  stories.Active.args.onRevoke?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('ConfirmedOrderRow / Active', () => {
  test('オーダー種別名・詳細が表示される', () => {
    render(<Active />);
    expect(screen.getByText('投薬オーダー')).toBeInTheDocument();
    expect(screen.getByText('アスピリン 100mg 1錠/日')).toBeInTheDocument();
  });

  test('編集ボタン押下: onEdit が呼ばれる', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<Active onEdit={onEdit} />);
    await user.click(screen.getByRole('button', { name: /編集/ }));
    expect(onEdit).toHaveBeenCalledWith('order-003');
  });

  test('取り消しボタン押下: onRevoke が呼ばれる', async () => {
    const onRevoke = vi.fn();
    const user = userEvent.setup();
    render(<Active onRevoke={onRevoke} />);
    await user.click(screen.getByRole('button', { name: /取り消し/ }));
    expect(onRevoke).toHaveBeenCalledWith('order-003');
  });
});

describe('ConfirmedOrderRow / Revoked', () => {
  test('取り消し済みオーダーが表示される', () => {
    render(<Revoked />);
    expect(screen.getByText('画像オーダー')).toBeInTheDocument();
  });

  test('取り消し済みの場合: 編集・取り消しボタンが disabled', () => {
    render(<Revoked />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });
});

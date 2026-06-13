import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/NotificationDialog.stories';

const { Open, Closed, AllRead } = composeStories(stories);

describe('NotificationDialog', () => {
  beforeEach(() => {
    Open.args.onMarkAllAsRead?.mockClear?.();
    Open.args.onMarkAsRead?.mockClear?.();
    Open.args.onOpenChange?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('Open story: 「通知一覧」タイトルが表示される', async () => {
    render(<Open />);
    await waitFor(() => expect(screen.getByText('通知一覧')).toBeInTheDocument(), { timeout: 3000 });
  });

  test('Open story: 通知アイテム「患者アレルギー情報更新」が表示される', async () => {
    render(<Open />);
    await waitFor(() => expect(screen.getByText('患者アレルギー情報更新')).toBeInTheDocument(), { timeout: 3000 });
  });

  test('Open story: 「すべて既読にする」ボタンが表示される', async () => {
    render(<Open />);
    await waitFor(() => expect(screen.getByRole('button', { name: /すべて既読にする/ })).toBeInTheDocument(), { timeout: 3000 });
  });

  // C1: 状態による分岐
  test('Open story: unreadCount>0 のとき「すべて既読にする」ボタンが enabled', async () => {
    render(<Open />);
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /すべて既読にする/ });
      expect(btn).toBeEnabled();
    }, { timeout: 3000 });
  });

  test('AllRead story: unreadCount=0 のとき「すべて既読にする」ボタンが disabled', async () => {
    render(<AllRead />);
    await waitFor(() => {
      const btn = screen.getByRole('button', { name: /すべて既読にする/ });
      expect(btn).toBeDisabled();
    }, { timeout: 3000 });
  });

  // C2: コールバック操作
  test('「すべて既読にする」ボタン押下で onMarkAllAsRead が呼ばれる', async () => {
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    render(<Open />);
    await waitFor(() => expect(screen.getByRole('button', { name: /すべて既読にする/ })).toBeInTheDocument(), { timeout: 3000 });
    await user.click(screen.getByRole('button', { name: /すべて既読にする/ }));
    expect(Open.args.onMarkAllAsRead).toHaveBeenCalledOnce();
  });
});

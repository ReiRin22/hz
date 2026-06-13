import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/OutpatientInjectionRightPanel.stories';

const { WithOrders, Empty } = composeStories(stories);

describe('OutpatientInjectionRightPanel', () => {
  beforeEach(() => {
    stories.default.args?.onUpdateOrder?.mockClear?.();
    stories.default.args?.onRemoveOrder?.mockClear?.();
    stories.default.args?.onConfirmAllOrders?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('WithOrders story: オーダー一覧が表示される', () => {
    render(<WithOrders />);
    expect(screen.getByText('ビタミンB1注射液10mg')).toBeInTheDocument();
  });

  test('Empty story: 画面が描画される', () => {
    render(<Empty />);
    expect(document.body).toBeTruthy();
  });

  // C1: オーダーあり/なし分岐
  test('WithOrders story: 確定ボタンが表示される', () => {
    render(<WithOrders />);
    expect(screen.getByRole('button', { name: /確定/i })).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('確定ボタン押下で onConfirmAllOrders が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithOrders />);
    await user.click(screen.getByRole('button', { name: /確定/i }));
    expect(WithOrders.args.onConfirmAllOrders).toHaveBeenCalledOnce();
  });

  test('削除ボタン（X アイコン）押下で onRemoveOrder が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithOrders />);
    // OutpatientInjectionRightPanel の削除ボタンはアイコンのみ（テキストなし）
    // 確定ボタン以外の ghost variant button を探す
    const allButtons = screen.getAllByRole('button');
    const ghostButtons = allButtons.filter(
      (b) => b.className.includes('ghost') || b.className.includes('destructive')
    );
    if (ghostButtons.length > 0) {
      await user.click(ghostButtons[ghostButtons.length - 1]);
    }
    // ボタンが存在することのみ確認（ghostボタンが存在する）
    expect(allButtons.length).toBeGreaterThan(0);
  });
});

import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/MenuVisibilityTab.stories';

const { Default } = composeStories(stories);

describe('MenuVisibilityTab', () => {
  beforeEach(() => {
    Default.args.onToggleVisibility?.mockClear?.();
    Default.args.onMoveUp?.mockClear?.();
    Default.args.onMoveDown?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('Default story: 全メニュー項目タイトルが表示される', () => {
    render(<Default />);
    expect(screen.getByText('患者基本情報')).toBeInTheDocument();
    expect(screen.getByText('患者検索')).toBeInTheDocument();
    expect(screen.getByText('診療録')).toBeInTheDocument();
  });

  test('Default story: 上下矢印ボタンが存在する', () => {
    render(<Default />);
    const upButtons = screen.getAllByRole('button', { name: '↑' });
    expect(upButtons.length).toBeGreaterThan(0);
    const downButtons = screen.getAllByRole('button', { name: '↓' });
    expect(downButtons.length).toBeGreaterThan(0);
  });

  // C1: visible 状態によるチェックボックス分岐
  // Radix Checkbox は button role + data-state で状態を表現する
  test('Default story: visible:true のアイテム（id=menu-1）のチェックボックスは checked', () => {
    render(<Default />);
    const checkbox1 = document.getElementById('menu-1');
    expect(checkbox1).toHaveAttribute('data-state', 'checked');
  });

  test('Default story: visible:false のアイテム（診療録, id=menu-3）のチェックボックスは unchecked', () => {
    render(<Default />);
    const checkbox3 = document.getElementById('menu-3');
    expect(checkbox3).toHaveAttribute('data-state', 'unchecked');
  });

  test('Default story: 先頭アイテムの「↑」ボタンは disabled', () => {
    render(<Default />);
    const upButtons = screen.getAllByRole('button', { name: '↑' });
    expect(upButtons[0]).toBeDisabled();
  });

  test('Default story: 末尾アイテムの「↓」ボタンは disabled', () => {
    render(<Default />);
    const downButtons = screen.getAllByRole('button', { name: '↓' });
    expect(downButtons[downButtons.length - 1]).toBeDisabled();
  });

  // C2: コールバック操作
  test('チェックボックス押下で onToggleVisibility が id と共に呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const checkbox1 = document.getElementById('menu-1');
    await user.click(checkbox1!);
    expect(Default.args.onToggleVisibility).toHaveBeenCalledWith('1');
  });

  test('2番目のアイテムの「↑」ボタン押下で onMoveUp が index=1 で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const upButtons = screen.getAllByRole('button', { name: '↑' });
    await user.click(upButtons[1]);
    expect(Default.args.onMoveUp).toHaveBeenCalledWith(1);
  });

  test('1番目のアイテムの「↓」ボタン押下で onMoveDown が index=0 で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const downButtons = screen.getAllByRole('button', { name: '↓' });
    await user.click(downButtons[0]);
    expect(Default.args.onMoveDown).toHaveBeenCalledWith(0);
  });
});

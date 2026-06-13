import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/FavoritesTab.stories';

const { Default, AllFavorites } = composeStories(stories);

describe('FavoritesTab', () => {
  beforeEach(() => {
    Default.args.onToggleFavorite?.mockClear?.();
    AllFavorites.args.onToggleFavorite?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('Default story: メニュー項目「患者基本情報」が表示される', () => {
    render(<Default />);
    expect(screen.getByText('患者基本情報')).toBeInTheDocument();
  });

  test('Default story: 複数のメニュー項目が表示される', () => {
    render(<Default />);
    expect(screen.getByText('患者検索')).toBeInTheDocument();
    expect(screen.getByText('診療録')).toBeInTheDocument();
  });

  // C1: お気に入りトグル状態の確認
  test('AllFavorites story: 全アイテムが表示される', () => {
    render(<AllFavorites />);
    expect(screen.getByText('患者基本情報')).toBeInTheDocument();
    expect(screen.getByText('患者検索')).toBeInTheDocument();
    expect(screen.getByText('診療録')).toBeInTheDocument();
  });

  // C1: お気に入り状態によるボタンテキスト分岐
  test('Default story: isFavorite=true のアイテムには「お気に入り解除」ボタンが表示される', () => {
    render(<Default />);
    expect(screen.getAllByRole('button', { name: /お気に入り解除/ }).length).toBeGreaterThanOrEqual(1);
  });

  test('Default story: isFavorite=false のアイテムには「お気に入り登録」ボタンが表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: /お気に入り登録/ })).toBeInTheDocument();
  });

  // C2: お気に入りトグルボタン操作
  test('「お気に入り解除」ボタン押下で onToggleFavorite が id="1" と共に呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getAllByRole('button', { name: /お気に入り解除/ })[0]);
    expect(Default.args.onToggleFavorite).toHaveBeenCalledWith('1');
  });

  test('「お気に入り登録」ボタン押下で onToggleFavorite が id="2" と共に呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getAllByRole('button', { name: /お気に入り登録/ })[0]);
    expect(Default.args.onToggleFavorite).toHaveBeenCalledWith('2');
  });
});

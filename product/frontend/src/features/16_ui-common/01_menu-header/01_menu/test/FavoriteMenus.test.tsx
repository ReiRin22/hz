import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/FavoriteMenus.stories';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));

const { WithFavorites, Empty } = composeStories(stories);

describe('FavoriteMenus', () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
  });

  // C0: 全UI要素の存在確認
  test('WithFavorites story: 「患者基本情報」ボタンが表示される', () => {
    render(<WithFavorites />);
    expect(screen.getByRole('button', { name: /患者基本情報/ })).toBeInTheDocument();
  });

  test('WithFavorites story: 「お気に入り」ラベルが表示される', () => {
    render(<WithFavorites />);
    expect(screen.getByText('お気に入り')).toBeInTheDocument();
  });

  test('WithFavorites story: 全お気に入りアイテムが表示される', () => {
    render(<WithFavorites />);
    expect(screen.getByRole('button', { name: /患者基本情報/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /患者検索/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /診療録/ })).toBeInTheDocument();
  });

  // C1: favorites=[] のとき null レンダリング
  test('Empty story: favorites=[] のとき何もレンダリングされない', () => {
    const { container } = render(<Empty />);
    expect(container.firstChild).toBeNull();
  });

  // C2: クリックで router.push が呼ばれる
  test('「患者基本情報」ボタン押下で router.push が /patients で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithFavorites />);
    await user.click(screen.getByRole('button', { name: /患者基本情報/ }));
    expect(mockRouterPush).toHaveBeenCalledWith('/patients');
  });

  test('「患者検索」ボタン押下で router.push が /search で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithFavorites />);
    await user.click(screen.getByRole('button', { name: /患者検索/ }));
    expect(mockRouterPush).toHaveBeenCalledWith('/search');
  });
});

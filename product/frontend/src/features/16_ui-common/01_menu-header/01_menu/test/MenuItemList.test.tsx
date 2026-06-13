import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/MenuItemList.stories';

const mockRouterPush = vi.hoisted(() => vi.fn());
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: mockRouterPush }),
  usePathname: () => '/',
}));

const { Default, HiddenItems } = composeStories(stories);

describe('MenuItemList', () => {
  beforeEach(() => {
    mockRouterPush.mockClear();
  });

  // C0: 全UI要素の存在確認
  test('Default story: visible:true のアイテム「患者基本情報」が表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: /患者基本情報/ })).toBeInTheDocument();
  });

  test('Default story: 全通常アイテムが表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: /患者基本情報/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /患者検索/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /診療録/ })).toBeInTheDocument();
  });

  test('Default story: 部門メニュー「診療科」が表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: /診療科/ })).toBeInTheDocument();
  });

  // C1: visible=false のアイテムは非表示
  test('HiddenItems story: visible:false のアイテムは表示されない', () => {
    render(<HiddenItems />);
    // idx:1 (患者検索) が非表示
    expect(screen.queryByRole('button', { name: /患者検索/ })).not.toBeInTheDocument();
  });

  // C1: 部門メニューの展開/折りたたみ
  test('Default story: 部門メニュー「診療科」クリックで子メニューが展開される', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /診療科/ }));
    expect(screen.getByRole('button', { name: /内科/ })).toBeInTheDocument();
  });

  // C2: クリックで router.push が呼ばれる
  test('通常メニューアイテムクリックで router.push が url で呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /患者基本情報/ }));
    expect(mockRouterPush).toHaveBeenCalledWith('/patients');
  });

  test('部門子メニュー「内科」クリックで router.push が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: /診療科/ }));
    await user.click(screen.getByRole('button', { name: /内科/ }));
    expect(mockRouterPush).toHaveBeenCalledWith('/dept/naika');
  });
});

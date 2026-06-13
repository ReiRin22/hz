import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_schema-creation/molecules/TemplateSelectorPanel.stories';

const { Default, WithSelectedTemplate, WithFavorites } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Default.args.onBodyPartChange?.mockClear?.();
  Default.args.onTemplateSelect?.mockClear?.();
  Default.args.onFavoriteToggle?.mockClear?.();
  Default.args.onImageImport?.mockClear?.();
  WithSelectedTemplate.args.onFavoriteToggle?.mockClear?.();
  WithFavorites.args.onFavoriteToggle?.mockClear?.();
});

describe('TemplateSelectorPanel', () => {
  // C0: 基本レンダリング
  test('Default: テンプレートセクション見出しと画像取込ボタンが描画される', () => {
    render(<Default />);
    expect(screen.getByText('テンプレート')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /画像取込/ })).toBeInTheDocument();
  });

  test('Default: 部位選択ドロップダウンが描画される', () => {
    render(<Default />);
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  // C1: お気に入り状態の分岐（isFav true/false でタイトル属性が変わる）
  test('WithFavorites: お気に入り済みテンプレートのボタンに削除タイトルが付く', () => {
    render(<WithFavorites />);
    const removeBtns = screen.queryAllByTitle('お気に入りから削除');
    expect(removeBtns.length).toBeGreaterThan(0);
  });

  test('Default: お気に入りなしのテンプレートに追加タイトルが付く', () => {
    render(<Default />);
    const addBtns = screen.queryAllByTitle('お気に入りに追加');
    expect(addBtns.length).toBeGreaterThan(0);
  });

  // C2: コールバック操作
  test('テンプレートカード押下で onTemplateSelect が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const cards = screen.queryAllByTitle('お気に入りに追加');
    if (cards.length > 0) {
      // カード本体（parent）をクリック
      await user.click(cards[0].closest('[class*="cursor-pointer"]')!);
      expect(Default.args.onTemplateSelect).toHaveBeenCalled();
    }
  });

  test('お気に入りボタン押下で onFavoriteToggle が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const favBtns = screen.queryAllByTitle('お気に入りに追加');
    if (favBtns.length > 0) {
      await user.click(favBtns[0]);
      expect(Default.args.onFavoriteToggle).toHaveBeenCalled();
    }
  });
});

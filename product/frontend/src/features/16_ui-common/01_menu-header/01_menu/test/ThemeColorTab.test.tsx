import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/ThemeColorTab.stories';

const { BlueSelected, BlackSelected } = composeStories(stories);

describe('ThemeColorTab', () => {
  beforeEach(() => {
    BlueSelected.args.onThemeSelect?.mockClear?.();
    BlackSelected.args.onThemeSelect?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('BlueSelected story: 「ブルー」テーマが表示される', () => {
    render(<BlueSelected />);
    expect(screen.getByText('ブルー')).toBeInTheDocument();
  });

  test('BlueSelected story: 全8テーマカラーが表示される', () => {
    render(<BlueSelected />);
    expect(screen.getByText('ブルー')).toBeInTheDocument();
    expect(screen.getByText('グリーン')).toBeInTheDocument();
    expect(screen.getByText('パープル')).toBeInTheDocument();
    expect(screen.getByText('ピンク')).toBeInTheDocument();
    expect(screen.getByText('オレンジ')).toBeInTheDocument();
    expect(screen.getByText('レッド')).toBeInTheDocument();
    expect(screen.getByText('ホワイト')).toBeInTheDocument();
    expect(screen.getByText('ブラック')).toBeInTheDocument();
  });

  // C1: 選択中テーマの状態確認
  test('BlueSelected story: 選択中テーマのラベル「カラーテーマを選択」が表示される', () => {
    render(<BlueSelected />);
    expect(screen.getByText('カラーテーマを選択')).toBeInTheDocument();
  });

  test('BlackSelected story: 「ブラック」テーマが表示される', () => {
    render(<BlackSelected />);
    expect(screen.getByText('ブラック')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('「グリーン」ボタン押下で onThemeSelect が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<BlueSelected />);
    const buttons = screen.getAllByRole('button');
    const greenButton = buttons.find(btn => btn.textContent?.includes('グリーン'));
    await user.click(greenButton!);
    expect(BlueSelected.args.onThemeSelect).toHaveBeenCalledOnce();
    expect(BlueSelected.args.onThemeSelect).toHaveBeenCalledWith(
      expect.objectContaining({ value: 'green' })
    );
  });
});

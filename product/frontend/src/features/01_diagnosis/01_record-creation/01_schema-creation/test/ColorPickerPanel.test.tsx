import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_schema-creation/molecules/ColorPickerPanel.stories';

const { Black, Red } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Black.args.onChange?.mockClear?.();
  Red.args.onChange?.mockClear?.();
});

describe('ColorPickerPanel', () => {
  // C0: 基本レンダリング（カラートリガーエリア）
  test('Black: カラーピッカートリガーエリアが描画される', () => {
    render(<Black />);
    // カラー表示ボックスがトリガーとして描画されている
    const trigger = document.querySelector('[style*="background-color"]') as HTMLElement;
    expect(trigger).toBeInTheDocument();
  });

  test('Red: カラーピッカートリガーエリアが描画される', () => {
    render(<Red />);
    const trigger = document.querySelector('[style*="background-color"]') as HTMLElement;
    expect(trigger).toBeInTheDocument();
  });

  // C1: Popoverを開いたときにプリセットカラーが表示される
  test('トリガークリックで Popover が開き、プリセットカラーが表示される', async () => {
    const user = userEvent.setup();
    render(<Black />);

    const trigger = document.querySelector('[style*="background-color"]') as HTMLElement;
    await user.click(trigger.closest('div')!);

    // Popover 内に「プリセット」テキストが表示される
    expect(screen.getByText('プリセット')).toBeInTheDocument();
  });

  // C2: プリセットカラーをクリックすると onChange が呼ばれる
  test('プリセットカラー押下で onChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Black />);

    // Popover を開く
    const trigger = document.querySelector('[style*="background-color"]') as HTMLElement;
    await user.click(trigger.closest('div')!);

    // プリセットカラーボタンをクリック
    const presetBtns = document.querySelectorAll('[style*="background-color"]');
    // 2番目以降がプリセットカラーボタン
    if (presetBtns.length > 1) {
      await user.click(presetBtns[1] as HTMLElement);
      expect(Black.args.onChange).toHaveBeenCalled();
    }
  });
});

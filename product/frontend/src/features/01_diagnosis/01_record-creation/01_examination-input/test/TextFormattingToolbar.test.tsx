import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/TextFormattingToolbar.stories';

const { Default, WithActiveFormats, Disabled } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Default.args.onFormatApply?.mockClear?.();
  WithActiveFormats.args.onFormatApply?.mockClear?.();
});

describe('TextFormattingToolbar', () => {
  // C0: 基本レンダリング
  test('Default: 文字装飾ラベルと各フォーマットボタンが表示される', () => {
    render(<Default />);
    expect(screen.getByText('文字装飾:')).toBeInTheDocument();
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThanOrEqual(6);
  });

  // C1: disabled 分岐
  test('Disabled: 全ボタンが無効になる', () => {
    render(<Disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  // C2: 各フォーマットボタンのコールバック
  test('フォーマットボタン押下で onFormatApply が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    expect(Default.args.onFormatApply).toHaveBeenCalledOnce();
  });

  test('複数のフォーマットボタンを押下するとそれぞれ onFormatApply が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    const buttons = screen.getAllByRole('button');
    await user.click(buttons[0]);
    await user.click(buttons[1]);
    expect(Default.args.onFormatApply).toHaveBeenCalledTimes(2);
  });
});

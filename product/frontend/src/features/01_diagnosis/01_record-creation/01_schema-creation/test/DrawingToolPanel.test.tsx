import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_schema-creation/molecules/DrawingToolPanel.stories';

const { PenSelected, EraserSelected } = composeStories(stories);

beforeEach(() => {
  cleanup();
  PenSelected.args.onToolSelect?.mockClear?.();
  PenSelected.args.onColorChange?.mockClear?.();
  PenSelected.args.onWidthChange?.mockClear?.();
  EraserSelected.args.onToolSelect?.mockClear?.();
});

describe('DrawingToolPanel', () => {
  // C0: 基本レンダリング（ツールボタン一覧）
  test('PenSelected: 全ツールボタンが描画される', () => {
    render(<PenSelected />);
    expect(screen.getByTitle('ペン')).toBeInTheDocument();
    expect(screen.getByTitle('四角形')).toBeInTheDocument();
    expect(screen.getByTitle('円')).toBeInTheDocument();
    expect(screen.getByTitle('テキスト')).toBeInTheDocument();
    expect(screen.getByTitle('スプレー')).toBeInTheDocument();
    expect(screen.getByTitle('消しゴム')).toBeInTheDocument();
  });

  // C2: ツール選択コールバック
  test('ペンボタン押下で onToolSelect("pen") が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<EraserSelected />);
    await user.click(screen.getByTitle('ペン'));
    expect(EraserSelected.args.onToolSelect).toHaveBeenCalledWith('pen');
  });

  test('消しゴムボタン押下で onToolSelect("eraser") が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<PenSelected />);
    await user.click(screen.getByTitle('消しゴム'));
    expect(PenSelected.args.onToolSelect).toHaveBeenCalledWith('eraser');
  });

  test('四角形ボタン押下で onToolSelect("rectangle") が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<PenSelected />);
    await user.click(screen.getByTitle('四角形'));
    expect(PenSelected.args.onToolSelect).toHaveBeenCalledWith('rectangle');
  });
});

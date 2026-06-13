import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../stories/molecules/TempSaveDialogMolecule.stories';

const { Open, Closed, Empty } = composeStories(stories);

describe('TempSaveDialogMolecule', () => {
  beforeEach(() => {
    stories.default.args?.onOpenChange?.mockClear?.();
    stories.default.args?.onCountChange?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Open: ダイアログタイトルが表示される', () => {
    render(<Open />);
    expect(screen.getByText('一時保存データがあります')).toBeInTheDocument();
  });

  test('Open: count バッジが表示される', () => {
    render(<Open />);
    expect(screen.getByText('3件')).toBeInTheDocument();
  });

  // C1: open/closed 分岐
  test('Closed: isOpen=false のときダイアログが非表示', () => {
    render(<Closed />);
    expect(screen.queryByText('一時保存データがあります')).not.toBeInTheDocument();
  });

  test('Empty: count=0 でもダイアログが描画される', () => {
    render(<Empty />);
    expect(screen.getByText('一時保存データがあります')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('キャンセルボタン押下で onOpenChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Open />);

    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    expect(Open.args.onOpenChange).toHaveBeenCalledWith(false);
  });
});

import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../stories/molecules/StickyNotesDialogMolecule.stories';

const { Open, Closed } = composeStories(stories);

describe('StickyNotesDialogMolecule', () => {
  beforeEach(() => {
    stories.default.args?.onOpenChange?.mockClear?.();
    stories.default.args?.onCountChange?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Open: ダイアログタイトルが表示される', () => {
    render(<Open />);
    expect(screen.getByText('付箋')).toBeInTheDocument();
  });

  // C1: open/closed 分岐
  test('Closed: isOpen=false のときダイアログが非表示', () => {
    render(<Closed />);
    expect(screen.queryByText('付箋')).not.toBeInTheDocument();
  });

  // C2: コールバック操作
  test('閉じるボタン押下で onOpenChange(false) が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Open />);

    await user.click(screen.getByRole('button', { name: /閉じる/i }));

    expect(Open.args.onOpenChange).toHaveBeenCalledWith(false);
  });
});

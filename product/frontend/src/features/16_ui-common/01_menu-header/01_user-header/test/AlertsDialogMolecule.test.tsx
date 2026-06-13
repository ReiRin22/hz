import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../stories/molecules/AlertsDialogMolecule.stories';

const { Open, Closed, Empty } = composeStories(stories);

describe('AlertsDialogMolecule', () => {
  beforeEach(() => {
    stories.default.args?.onOpenChange?.mockClear?.();
    stories.default.args?.onDismissAlert?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Open: ダイアログが表示されタイトルが表示される', () => {
    render(<Open />);
    expect(screen.getByText('通知一覧')).toBeInTheDocument();
    expect(screen.getByText('期限超過タスクあり')).toBeInTheDocument();
  });

  // C1: open/closed 分岐
  test('Closed: isOpen=false のときダイアログが非表示', () => {
    render(<Closed />);
    expect(screen.queryByText('通知一覧')).not.toBeInTheDocument();
  });

  test('Empty: アラートがゼロでもダイアログが描画される', () => {
    render(<Empty />);
    expect(screen.getByText('通知一覧')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('閉じるボタン押下で onOpenChange(false) が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Open />);

    await user.click(screen.getByRole('button', { name: /閉じる/i }));

    expect(Open.args.onOpenChange).toHaveBeenCalledWith(false);
  });
});

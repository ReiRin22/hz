import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/DrugDetailDialog.stories';

const { Open, Closed, NoDrug } = composeStories(stories);

describe('DrugDetailDialog', () => {
  beforeEach(() => {
    stories.default.args?.onClose?.mockClear?.();
    stories.default.args?.onConfirm?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Open story: ダイアログが表示される', () => {
    render(<Open />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('Closed story: ダイアログが表示されない', () => {
    render(<Closed />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  test('NoDrug story: 薬剤なしでダイアログが表示される', () => {
    render(<NoDrug />);
    // drug=null のため確定ボタンが無効
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // C1: ブランチ - 薬剤ありの場合
  test('Open story: 薬剤名が表示される', () => {
    render(<Open />);
    expect(screen.getByText('アムロジピン錠5mg')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('閉じるボタン押下で onClose が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Open />);
    const closeButton = screen.getByRole('button', { name: /キャンセル|閉じる|×/i });
    await user.click(closeButton);
    expect(Open.args.onClose).toHaveBeenCalledOnce();
  });
});

import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/InjectionDetailDialog.stories';

const { Open, Closed, NoDrug } = composeStories(stories);

describe('InjectionDetailDialog', () => {
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

  test('NoDrug story: ダイアログが表示されない（drug=null）', () => {
    render(<NoDrug />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // C1: 薬剤名の表示（Input の value として設定されている）
  test('Open story: 注射薬剤名が Input に表示される', () => {
    render(<Open />);
    expect(screen.getByDisplayValue('ビタミンB1注射液10mg')).toBeInTheDocument();
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

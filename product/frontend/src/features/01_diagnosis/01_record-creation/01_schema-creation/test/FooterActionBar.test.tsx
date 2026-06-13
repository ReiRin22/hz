import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_schema-creation/molecules/FooterActionBar.stories';

const { Idle, Submitting } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Idle.args.onCancel?.mockClear?.();
  Idle.args.onConfirm?.mockClear?.();
  Submitting.args.onCancel?.mockClear?.();
  Submitting.args.onConfirm?.mockClear?.();
});

describe('FooterActionBar', () => {
  // C0: 基本レンダリング
  test('Idle: キャンセル・確定ボタンが有効な状態で描画される', () => {
    render(<Idle />);
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeEnabled();
    expect(screen.getByRole('button', { name: '確定' })).toBeEnabled();
  });

  // C1: isSubmitting 分岐
  test('Submitting: キャンセル・確定ボタンが disabled になる', () => {
    render(<Submitting />);
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeDisabled();
    expect(screen.getByRole('button', { name: '保存中...' })).toBeDisabled();
  });

  // C2: コールバック操作
  test('キャンセルボタン押下で onCancel が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Idle />);
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(Idle.args.onCancel).toHaveBeenCalledOnce();
  });

  test('確定ボタン押下で onConfirm が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Idle />);
    await user.click(screen.getByRole('button', { name: '確定' }));
    expect(Idle.args.onConfirm).toHaveBeenCalledOnce();
  });
});

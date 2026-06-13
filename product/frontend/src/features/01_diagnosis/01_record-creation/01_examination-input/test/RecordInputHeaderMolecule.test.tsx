import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/molecules/RecordInputHeaderMolecule.stories';

const { Editable, ConfirmDisabled, NotEditable, WithValidationErrors } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Editable.args.onSaveDraft?.mockClear?.();
  Editable.args.onConfirm?.mockClear?.();
  ConfirmDisabled.args.onSaveDraft?.mockClear?.();
  ConfirmDisabled.args.onConfirm?.mockClear?.();
});

describe('RecordInputHeaderMolecule', () => {
  // C0: 基本レンダリング
  test('Editable: タイトルと一時保存・確定ボタンが表示される', () => {
    render(<Editable />);
    expect(screen.getByText('記録入力')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /一時保存/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /確定/ })).toBeInTheDocument();
  });

  // C1: isEditable=false のとき両ボタンが無効
  test('NotEditable: 一時保存ボタンが無効になる', () => {
    render(<NotEditable />);
    expect(screen.getByRole('button', { name: /一時保存/ })).toBeDisabled();
  });

  test('NotEditable: 確定ボタンが無効になる', () => {
    render(<NotEditable />);
    expect(screen.getByRole('button', { name: /確定/ })).toBeDisabled();
  });

  // C1: confirmButtonDisabled=true のとき確定ボタンのみ無効
  test('ConfirmDisabled: 確定ボタンが無効になる', () => {
    render(<ConfirmDisabled />);
    expect(screen.getByRole('button', { name: /確定/ })).toBeDisabled();
  });

  test('ConfirmDisabled: 一時保存ボタンは有効のまま', () => {
    render(<ConfirmDisabled />);
    expect(screen.getByRole('button', { name: /一時保存/ })).toBeEnabled();
  });

  // C1: バリデーションエラーの表示
  test('WithValidationErrors: エラーメッセージが表示される', () => {
    render(<WithValidationErrors />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  // C2: コールバック
  test('一時保存ボタン押下で onSaveDraft が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Editable />);
    await user.click(screen.getByRole('button', { name: /一時保存/ }));
    expect(Editable.args.onSaveDraft).toHaveBeenCalledOnce();
  });

  test('確定ボタン押下で onConfirm が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Editable />);
    await user.click(screen.getByRole('button', { name: /確定/ }));
    expect(Editable.args.onConfirm).toHaveBeenCalledOnce();
  });
});

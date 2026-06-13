import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/PrintDialog.stories';

const { Open, SomeSelected, AllSelected } = composeStories(stories);

beforeEach(() => {
  stories.Open.args.onSelectAll?.mockClear?.();
  stories.Open.args.onToggleForm?.mockClear?.();
  stories.Open.args.onOutput?.mockClear?.();
  stories.Open.args.onClose?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('PrintDialog / Open', () => {
  test('ダイアログタイトルと患者名が表示される', () => {
    render(<Open />);
    expect(screen.getByText(/出力する帳票を選択/)).toBeInTheDocument();
    expect(screen.getByText(/山田 太郎/)).toBeInTheDocument();
  });

  test('帳票一覧が表示される', () => {
    render(<Open />);
    expect(screen.getByText('処方箋')).toBeInTheDocument();
    expect(screen.getByText('検体検査依頼書')).toBeInTheDocument();
    expect(screen.getByText('画像検査依頼書')).toBeInTheDocument();
  });

  test('閉じるボタン押下: onClose が呼ばれる', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Open onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /閉じる|キャンセル/ }));
    expect(onClose).toHaveBeenCalled();
  });

  test('全選択ボタン押下: onSelectAll が呼ばれる', async () => {
    const onSelectAll = vi.fn();
    const user = userEvent.setup();
    render(<Open onSelectAll={onSelectAll} />);
    await user.click(screen.getByRole('button', { name: /全選択|すべて選択/ }));
    expect(onSelectAll).toHaveBeenCalled();
  });
});

describe('PrintDialog / SomeSelected', () => {
  test('一部選択状態が表示される', () => {
    render(<SomeSelected />);
    expect(screen.getByText('処方箋')).toBeInTheDocument();
  });

  test('出力ボタン押下: onOutput が呼ばれる', async () => {
    const onOutput = vi.fn();
    const user = userEvent.setup();
    render(<SomeSelected onOutput={onOutput} />);
    await user.click(screen.getByRole('button', { name: /出力/ }));
    expect(onOutput).toHaveBeenCalled();
  });
});

describe('PrintDialog / AllSelected', () => {
  test('全選択状態で出力ボタンが有効', () => {
    render(<AllSelected />);
    expect(screen.getByRole('button', { name: /出力/ })).not.toBeDisabled();
  });
});

describe('PrintDialog / Open（チェックボックス操作）', () => {
  test('未選択状態: 出力ボタンが disabled', () => {
    render(<Open />);
    expect(screen.getByRole('button', { name: /出力/ })).toBeDisabled();
  });

  test('帳票チェックボックス押下: onToggleForm が formId で呼ばれる', async () => {
    const onToggleForm = vi.fn();
    const user = userEvent.setup();
    render(<Open onToggleForm={onToggleForm} />);
    const checkbox = screen.getAllByRole('checkbox')[0];
    await user.click(checkbox);
    expect(onToggleForm).toHaveBeenCalledWith('form-001');
  });
});

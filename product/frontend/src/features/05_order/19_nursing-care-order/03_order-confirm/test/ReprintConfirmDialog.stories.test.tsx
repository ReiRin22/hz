import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/ReprintConfirmDialog.stories';

const { Open, NoDiff } = composeStories(stories);

beforeEach(() => {
  stories.Open.args.onConfirmOnly?.mockClear?.();
  stories.Open.args.onReprint?.mockClear?.();
  stories.Open.args.onClose?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('ReprintConfirmDialog / Open', () => {
  test('ダイアログが表示される', () => {
    render(<Open />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('差分テキストが表示される', () => {
    render(<Open />);
    expect(screen.getByText(/アスピリン 100mg → アスピリン 200mg/)).toBeInTheDocument();
  });

  test('確定のみボタン押下: onConfirmOnly が呼ばれる', async () => {
    const onConfirmOnly = vi.fn();
    const user = userEvent.setup();
    render(<Open onConfirmOnly={onConfirmOnly} />);
    await user.click(screen.getByRole('button', { name: /確定のみ/ }));
    expect(onConfirmOnly).toHaveBeenCalled();
  });

  test('再印刷ボタン押下: onReprint が呼ばれる', async () => {
    const onReprint = vi.fn();
    const user = userEvent.setup();
    render(<Open onReprint={onReprint} />);
    await user.click(screen.getByRole('button', { name: /再印刷|再出力/ }));
    expect(onReprint).toHaveBeenCalled();
  });

  test('閉じるボタン押下: onClose が呼ばれる', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Open onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /閉じる|キャンセル/ }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('ReprintConfirmDialog / NoDiff', () => {
  test('差分なし: ダイアログが表示される', () => {
    render(<NoDiff />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  test('差分なし: 差分テキストが表示されない', () => {
    render(<NoDiff />);
    expect(screen.queryByText(/アスピリン/)).not.toBeInTheDocument();
  });
});

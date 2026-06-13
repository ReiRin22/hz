import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/OrderTypeSelectDialog.stories';

const { Open, Empty } = composeStories(stories);

beforeEach(() => {
  stories.Open.args.onSelect?.mockClear?.();
  stories.Open.args.onClose?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('OrderTypeSelectDialog / Open', () => {
  test('ダイアログタイトルが表示される', () => {
    render(<Open />);
    expect(screen.getByText('オーダー種別選択')).toBeInTheDocument();
  });

  test('オーダー種別一覧が表示される', () => {
    render(<Open />);
    expect(screen.getByText('投薬オーダー')).toBeInTheDocument();
    expect(screen.getByText('検体検査オーダー')).toBeInTheDocument();
    expect(screen.getByText('画像オーダー')).toBeInTheDocument();
    expect(screen.getByText('看護オーダー')).toBeInTheDocument();
  });

  test('オーダー種別押下: onSelect がオーダー種別オブジェクトで呼ばれる', async () => {
    const onSelect = vi.fn();
    const user = userEvent.setup();
    render(<Open onSelect={onSelect} />);
    await user.click(screen.getByText('投薬オーダー'));
    expect(onSelect).toHaveBeenCalledWith({
      id: 'MEDICATION',
      name: '投薬オーダー',
      route: '/order/medication',
    });
  });

  test('閉じるボタン押下: onClose が呼ばれる', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    render(<Open onClose={onClose} />);
    await user.click(screen.getByRole('button', { name: /閉じる|キャンセル/ }));
    expect(onClose).toHaveBeenCalled();
  });
});

describe('OrderTypeSelectDialog / Empty', () => {
  test('オーダー種別なし: 空状態が表示される', () => {
    render(<Empty />);
    expect(screen.getByText('オーダー種別選択')).toBeInTheDocument();
    expect(screen.queryByText('投薬オーダー')).not.toBeInTheDocument();
  });
});

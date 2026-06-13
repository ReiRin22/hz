import '@testing-library/jest-dom/vitest';
import { cleanup, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/PendingOrderRow.stories';

const { Default, LongDetail } = composeStories(stories);

beforeEach(() => {
  stories.Default.args.onEdit?.mockClear?.();
  stories.Default.args.onDelete?.mockClear?.();
});

afterEach(() => {
  cleanup();
});

describe('PendingOrderRow / Default', () => {
  test('オーダー種別名・詳細が表示される', () => {
    render(<Default />);
    expect(screen.getByText('投薬オーダー')).toBeInTheDocument();
    expect(screen.getByText('アスピリン 100mg 1錠/日')).toBeInTheDocument();
  });

  test('編集ボタン押下: onEdit が呼ばれる', async () => {
    const onEdit = vi.fn();
    const user = userEvent.setup();
    render(<Default onEdit={onEdit} />);
    await user.click(screen.getByRole('button', { name: /編集/ }));
    expect(onEdit).toHaveBeenCalledWith('order-001');
  });

  test('削除ボタン押下: onDelete が呼ばれる', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<Default onDelete={onDelete} />);
    await user.click(screen.getByRole('button', { name: /削除/ }));
    expect(onDelete).toHaveBeenCalledWith('order-001');
  });
});

describe('PendingOrderRow / LongDetail', () => {
  test('長い詳細テキストが表示される', () => {
    render(<LongDetail />);
    expect(screen.getByText(/血液一般/)).toBeInTheDocument();
  });
});

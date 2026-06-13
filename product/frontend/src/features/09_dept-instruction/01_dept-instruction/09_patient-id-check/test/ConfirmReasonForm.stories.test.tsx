import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/ConfirmReasonForm.stories';

const { Empty, Saving, WithError } = composeStories(stories);

describe('ConfirmReasonForm', () => {
  test('Empty: 保存ボタンが有効状態で表示される', () => {
    render(<Empty />);
    expect(screen.getByRole('button', { name: '保存' })).toBeEnabled();
  });

  test('Saving: 保存ボタンが「保存中...」で無効になる', () => {
    render(<Saving />);
    const button = screen.getByRole('button', { name: '保存中...' });
    expect(button).toBeDisabled();
  });

  test('WithError: エラーメッセージが表示される', () => {
    render(<WithError />);
    expect(
      screen.getByText('定型文を選択するか、自由記入欄に入力してください。'),
    ).toBeInTheDocument();
  });

  test('保存ボタン押下で onSave が呼ばれる', async () => {
    const onSave = vi.fn();
    const user = userEvent.setup();
    render(<Empty onSave={onSave} />);

    await user.click(screen.getByRole('button', { name: '保存' }));

    expect(onSave).toHaveBeenCalledOnce();
  });
});

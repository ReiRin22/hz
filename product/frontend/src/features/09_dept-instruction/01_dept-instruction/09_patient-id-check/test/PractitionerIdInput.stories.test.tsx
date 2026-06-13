import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import { describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/PractitionerIdInput.stories';

const { Empty, WithValue, WithError } = composeStories(stories);

describe('PractitionerIdInput', () => {
  test('Empty: 入力欄と登録ボタンが表示される', () => {
    render(<Empty />);
    expect(screen.getByPlaceholderText('例: ABC123')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '登録' })).toBeInTheDocument();
  });

  test('WithValue: 入力値が表示される', () => {
    render(<WithValue />);
    expect(screen.getByDisplayValue('ABC123')).toBeInTheDocument();
  });

  test('WithError: E001エラーメッセージが role=alert で表示される', () => {
    render(<WithError />);
    expect(screen.getByRole('alert')).toHaveTextContent('E001');
  });

  test('登録ボタン押下で onRegister が呼ばれる', async () => {
    const onRegister = vi.fn();
    const user = userEvent.setup();
    render(<Empty onRegister={onRegister} />);

    await user.click(screen.getByRole('button', { name: '登録' }));

    expect(onRegister).toHaveBeenCalledOnce();
  });

  test('入力変更で onChange が呼ばれる', async () => {
    const onChange = vi.fn();
    const user = userEvent.setup();
    render(<Empty onChange={onChange} />);

    await user.type(screen.getByPlaceholderText('例: ABC123'), 'A');

    expect(onChange).toHaveBeenCalled();
  });
});

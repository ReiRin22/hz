import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/MailFilterBar.stories';

const { Default, AllChecked } = composeStories(stories);

describe('MailFilterBar', () => {
  beforeEach(() => {
    Default.args.onComposeClick?.mockClear?.();
    Default.args.onShowReadChange?.mockClear?.();
    Default.args.onShowDeletedChange?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('Default story: 「開封済を表示」ラベルが表示される', () => {
    render(<Default />);
    expect(screen.getByText('開封済を表示')).toBeInTheDocument();
  });

  test('Default story: 「削除済を表示」ラベルが表示される', () => {
    render(<Default />);
    expect(screen.getByText('削除済を表示')).toBeInTheDocument();
  });

  test('Default story: 「新規」ボタンが表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: '新規' })).toBeInTheDocument();
  });

  test('Default story: 「返信」ボタンが表示される', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: '返信' })).toBeInTheDocument();
  });

  // C1: 状態による分岐確認
  test('Default story: selectedEmailId=null のとき「返信」ボタンが disabled', () => {
    render(<Default />);
    expect(screen.getByRole('button', { name: '返信' })).toBeDisabled();
  });

  test('AllChecked story: selectedEmailId があるとき「返信」ボタンが enabled', () => {
    render(<AllChecked />);
    expect(screen.getByRole('button', { name: '返信' })).toBeEnabled();
  });

  test('Default story: showRead=false のとき「開封済を表示」は unchecked', () => {
    render(<Default />);
    const showReadCheckbox = document.getElementById('show-read');
    expect(showReadCheckbox).toHaveAttribute('data-state', 'unchecked');
  });

  test('AllChecked story: showRead=true のとき「開封済を表示」は checked', () => {
    render(<AllChecked />);
    const showReadCheckbox = document.getElementById('show-read');
    expect(showReadCheckbox).toHaveAttribute('data-state', 'checked');
  });

  // C2: コールバック操作
  test('「新規」ボタン押下で onComposeClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(screen.getByRole('button', { name: '新規' }));
    expect(Default.args.onComposeClick).toHaveBeenCalledOnce();
  });

  test('「開封済を表示」チェックボックス押下で onShowReadChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(document.getElementById('show-read')!);
    expect(Default.args.onShowReadChange).toHaveBeenCalledOnce();
  });

  test('「削除済を表示」チェックボックス押下で onShowDeletedChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);
    await user.click(document.getElementById('show-deleted')!);
    expect(Default.args.onShowDeletedChange).toHaveBeenCalledOnce();
  });
});

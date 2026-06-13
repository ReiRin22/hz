import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/ComposeMail.stories';

const { Empty, Filled } = composeStories(stories);

describe('ComposeMail', () => {
  beforeEach(() => {
    Empty.args.onSend?.mockClear?.();
    Empty.args.onCancel?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('Empty story: 「新規メール作成」タイトルが表示される', () => {
    render(<Empty />);
    expect(screen.getByText('新規メール作成')).toBeInTheDocument();
  });

  test('Empty story: 「宛先」ラベルが表示される', () => {
    render(<Empty />);
    expect(screen.getByText('宛先')).toBeInTheDocument();
  });

  test('Empty story: 「件名」ラベルが表示される', () => {
    render(<Empty />);
    expect(screen.getByText('件名')).toBeInTheDocument();
  });

  test('Empty story: 「本文」ラベルが表示される', () => {
    render(<Empty />);
    expect(screen.getByText('本文')).toBeInTheDocument();
  });

  test('Empty story: 「送信」ボタンが存在する', () => {
    render(<Empty />);
    expect(screen.getByRole('button', { name: /送信/ })).toBeInTheDocument();
  });

  // C1: 入力済みの状態確認
  test('Filled story: 宛先「田中 一郎」が表示される', () => {
    render(<Filled />);
    expect(screen.getByDisplayValue('田中 一郎')).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('「送信」ボタン押下で onSend が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Empty />);
    await user.click(screen.getByRole('button', { name: /送信/ }));
    expect(Empty.args.onSend).toHaveBeenCalledOnce();
  });

  test('「キャンセル」ボタン押下で onCancel が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Empty />);
    await user.click(screen.getByRole('button', { name: 'キャンセル' }));
    expect(Empty.args.onCancel).toHaveBeenCalledOnce();
  });

  test('「一覧に戻る」ボタン押下で onCancel が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Empty />);
    await user.click(screen.getByRole('button', { name: /一覧に戻る/ }));
    expect(Empty.args.onCancel).toHaveBeenCalledOnce();
  });
});

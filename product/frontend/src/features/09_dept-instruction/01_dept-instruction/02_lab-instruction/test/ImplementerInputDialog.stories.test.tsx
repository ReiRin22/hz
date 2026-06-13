import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test, vi } from 'vitest';
import * as stories from '../stories/molecules/ImplementerInputDialog.stories';

const { Open } = composeStories(stories);

describe('ImplementerInputDialog / Open', () => {
  // C0: 基本レンダリング
  test('ダイアログタイトルが表示される', () => {
    render(<Open />);
    expect(screen.getByText('実施者入力（W3）')).toBeInTheDocument();
  });

  test('実施者フォームが表示される', () => {
    render(<Open />);
    expect(screen.getByText('実施者')).toBeInTheDocument();
  });

  // C1: 立ち会い者・実施場所・備考フィールドが表示される
  test('任意フィールドが表示される', () => {
    render(<Open />);
    expect(screen.getByText('立ち会い者（任意）')).toBeInTheDocument();
    expect(screen.getByText('実施場所（任意）')).toBeInTheDocument();
    expect(screen.getByText('備考（任意）')).toBeInTheDocument();
  });

  // C2: 保存ボタンが存在する
  test('保存ボタンが表示される', () => {
    render(<Open />);
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
  });
});

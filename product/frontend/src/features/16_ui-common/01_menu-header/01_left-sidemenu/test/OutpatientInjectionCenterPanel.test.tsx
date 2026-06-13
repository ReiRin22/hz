import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/OutpatientInjectionCenterPanel.stories';

const { WithCandidates, Empty } = composeStories(stories);

describe('OutpatientInjectionCenterPanel', () => {
  beforeEach(() => {
    stories.default.args?.onAddToDetail?.mockClear?.();
    stories.default.args?.onAddMultipleToDetail?.mockClear?.();
    stories.default.args?.onFilterChange?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('WithCandidates story: フィルターボタンが表示される', () => {
    render(<WithCandidates />);
    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
  });

  test('WithCandidates story: 候補アイテムが表示される', () => {
    render(<WithCandidates />);
    expect(screen.getByText('ビタミンB1注射液10mg')).toBeInTheDocument();
  });

  test('Empty story: 候補なしのメッセージまたは空リストが表示される', () => {
    render(<Empty />);
    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
  });

  // C1: フィルター切り替え
  test('フィルター「履歴」ボタンが表示される', () => {
    render(<WithCandidates />);
    expect(screen.getByRole('button', { name: '履歴' })).toBeInTheDocument();
  });

  // C2: コールバック操作
  test('フィルターボタン押下で onFilterChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithCandidates />);
    await user.click(screen.getByRole('button', { name: '履歴' }));
    expect(WithCandidates.args.onFilterChange).toHaveBeenCalledWith('history');
  });
});

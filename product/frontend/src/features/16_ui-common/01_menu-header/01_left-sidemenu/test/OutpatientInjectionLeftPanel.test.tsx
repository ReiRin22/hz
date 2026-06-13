import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import * as stories from '../stories/molecules/OutpatientInjectionLeftPanel.stories';

const { HistoryTab, SearchTab } = composeStories(stories);

describe('OutpatientInjectionLeftPanel', () => {
  beforeEach(() => {
    stories.default.args?.onAddCandidate?.mockClear?.();
    stories.default.args?.onAddMultipleCandidates?.mockClear?.();
    stories.default.args?.onAddToDetail?.mockClear?.();
    stories.default.args?.onAddMultipleToDetail?.mockClear?.();
    stories.default.args?.onSubTabChange?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('HistoryTab story: 画面が描画される', () => {
    render(<HistoryTab />);
    expect(document.body).toBeTruthy();
  });

  test('SearchTab story: 画面が描画される', () => {
    render(<SearchTab />);
    expect(document.body).toBeTruthy();
  });

  // C1: タブ分岐（TabsTrigger は tab role）
  test('HistoryTab story: 履歴タブが表示される', () => {
    render(<HistoryTab />);
    expect(screen.getByRole('tab', { name: /履歴/i })).toBeInTheDocument();
  });

  test('SearchTab story: 薬剤タブが表示される', () => {
    render(<SearchTab />);
    expect(screen.getByRole('tab', { name: /薬剤/i })).toBeInTheDocument();
  });

  // C2: サブタブ切り替え（TabsTrigger のクリックで onSubTabChange が呼ばれる）
  test('タブクリックで onSubTabChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<HistoryTab />);
    const drugTab = screen.getByRole('tab', { name: /薬剤/i });
    await user.click(drugTab);
    expect(HistoryTab.args.onSubTabChange).toHaveBeenCalled();
  });
});

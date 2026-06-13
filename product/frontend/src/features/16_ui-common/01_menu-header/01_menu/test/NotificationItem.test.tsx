import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/NotificationItem.stories';

const { InfoUnread, WarningExpanded, ErrorUnread, SuccessRead } = composeStories(stories);

describe('NotificationItem', () => {
  beforeEach(() => {
    InfoUnread.args.onToggleExpand?.mockClear?.();
    InfoUnread.args.onMarkAsRead?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('InfoUnread story: 通知タイトル「患者アレルギー情報更新」が表示される', () => {
    render(<InfoUnread />);
    expect(screen.getByText('患者アレルギー情報更新')).toBeInTheDocument();
  });

  test('InfoUnread story: 「新着」バッジが表示される（未読）', () => {
    render(<InfoUnread />);
    expect(screen.getByText('新着')).toBeInTheDocument();
  });

  test('InfoUnread story: タイムスタンプが表示される', () => {
    render(<InfoUnread />);
    expect(screen.getByText('2026-05-13 10:00')).toBeInTheDocument();
  });

  // C1: 展開/折りたたみの分岐
  test('WarningExpanded story: isExpanded=true のとき詳細メッセージが表示される', () => {
    render(<WarningExpanded />);
    expect(screen.getByText(/山田太郎 様のアレルギー情報が更新されました/)).toBeInTheDocument();
  });

  test('InfoUnread story: isExpanded=false のとき詳細メッセージが非表示', () => {
    render(<InfoUnread />);
    expect(screen.queryByText(/山田太郎 様のアレルギー情報が更新されました/)).not.toBeInTheDocument();
  });

  test('SuccessRead story: isRead=true のとき「新着」バッジが非表示', () => {
    render(<SuccessRead />);
    expect(screen.queryByText('新着')).not.toBeInTheDocument();
  });

  // C2: コールバック操作
  test('タイトル領域クリックで onToggleExpand が id と共に呼ばれる', async () => {
    const user = userEvent.setup();
    render(<InfoUnread />);
    const titleDiv = screen.getByText('患者アレルギー情報更新').closest('div[class*="flex"]');
    await user.click(titleDiv!);
    expect(InfoUnread.args.onToggleExpand).toHaveBeenCalledWith('notif-1');
  });

  test('既読ボタン（Check）クリックで onMarkAsRead が id と共に呼ばれる', async () => {
    const user = userEvent.setup();
    render(<InfoUnread />);
    // 未読のとき既読ボタン（Checkアイコン）が表示される
    const checkButton = screen.getAllByRole('button').find(btn => btn.className.includes('h-7'));
    await user.click(checkButton!);
    expect(InfoUnread.args.onMarkAsRead).toHaveBeenCalledWith('notif-1');
  });
});

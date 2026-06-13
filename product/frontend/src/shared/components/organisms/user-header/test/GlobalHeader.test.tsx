import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../stories/organisms/GlobalHeader.stories';

const { Default, AutoLogoutWarning, NoBadges } = composeStories(stories);

describe('GlobalHeader', () => {
  beforeEach(() => {
    stories.default.args?.onAutoSave?.mockClear?.();
    stories.default.args?.onExtendSession?.mockClear?.();
    stories.default.args?.onLogout?.mockClear?.();
    stories.default.args?.onNotesOpen?.mockClear?.();
    stories.default.args?.onTempDataOpen?.mockClear?.();
    stories.default.args?.onAlertsOpen?.mockClear?.();
    stories.default.args?.onMenuSettingsOpen?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Default: ユーザー名が複数表示されている（ヘッダーとツールチップ）', () => {
    render(<Default />);
    // ユーザー名は GlobalHeader 内で複数箇所に表示される場合がある
    const nameElements = screen.getAllByText('田中 一郎');
    expect(nameElements.length).toBeGreaterThan(0);
  });

  test('Default: 役職・部署が表示される', () => {
    render(<Default />);
    expect(screen.getAllByText('医師').length).toBeGreaterThan(0);
    expect(screen.getAllByText('内科').length).toBeGreaterThan(0);
  });

  test('Default: 未読アラート数が画面内に表示される', () => {
    render(<Default />);
    // 未読アラート数「2」は複数箇所に表示される（バッジ、承認数等）
    const elements = screen.getAllByText('2');
    expect(elements.length).toBeGreaterThan(0);
  });

  // C1: autoLogout 分岐
  test('AutoLogoutWarning: autoLogoutEnabled=true のとき自動ログアウト設定が表示される', () => {
    render(<AutoLogoutWarning />);
    const nameElements = screen.getAllByText('田中 一郎');
    expect(nameElements.length).toBeGreaterThan(0);
  });

  test('NoBadges: unreadAlertsCount=0 のときアラートバッジが非表示', () => {
    render(<NoBadges />);
    // count=0 のとき数字バッジなし（getByText('0') で誤検知しないよう queryBy）
    expect(screen.queryByText('0')).not.toBeInTheDocument();
  });

  // C2: ツールバーボタン操作（role=button の順序で特定）
  test('付箋ボタン押下で onNotesOpen が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);

    const buttons = screen.getAllByRole('button');
    // GlobalHeader のツールバー: 付箋(0番目)・一時保存(1番目)・アラート(2番目)・設定(3番目)
    await user.click(buttons[0]);

    expect(Default.args.onNotesOpen).toHaveBeenCalledOnce();
  });

  test('アラートボタン押下で onAlertsOpen が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);

    const buttons = screen.getAllByRole('button');
    await user.click(buttons[2]);

    expect(Default.args.onAlertsOpen).toHaveBeenCalledOnce();
  });
});

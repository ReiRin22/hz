import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../stories/organisms/SettingsPanel.stories';

const { Default, DarkModeEnabled, AllDisabled } = composeStories(stories);

describe('SettingsPanel', () => {
  beforeEach(() => {
    stories.default.args?.onDarkModeToggle?.mockClear?.();
    stories.default.args?.onAutoSaveToggle?.mockClear?.();
    stories.default.args?.onAlertsToggle?.mockClear?.();
    stories.default.args?.onAutoLogoutToggle?.mockClear?.();
    stories.default.args?.onAutoSave?.mockClear?.();
    stories.default.args?.onAutoLogoutTimeoutChange?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Default: ダークモード・自動保存・アラートのラベルが表示される', () => {
    render(<Default />);
    expect(screen.getByText('ダークモード')).toBeInTheDocument();
    expect(screen.getByText('1分間隔で自動保存')).toBeInTheDocument();
    expect(screen.getByText('薬剤相互作用・アレルギー警告')).toBeInTheDocument();
  });

  // C1: autoLogout 分岐
  test('DarkModeEnabled: autoLogoutEnabled=true のとき自動ログアウト時間が表示される', () => {
    render(<DarkModeEnabled />);
    expect(screen.getByText('自動ログアウト: 15分で有効')).toBeInTheDocument();
  });

  test('AllDisabled: 全設定が無効でも描画される', () => {
    render(<AllDisabled />);
    expect(screen.getByText('ダークモード')).toBeInTheDocument();
  });

  // C2: スイッチ操作（Switch は role=switch）
  test('ダークモードスイッチのトグルで onDarkModeToggle が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);

    const switches = screen.getAllByRole('switch');
    // SettingsPanel の最初のスイッチはダークモード
    await user.click(switches[0]);

    expect(Default.args.onDarkModeToggle).toHaveBeenCalledOnce();
  });

  test('自動保存スイッチのトグルで onAutoSaveToggle が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Default />);

    const switches = screen.getAllByRole('switch');
    // 2番目のスイッチは自動保存
    await user.click(switches[1]);

    expect(Default.args.onAutoSaveToggle).toHaveBeenCalledOnce();
  });
});

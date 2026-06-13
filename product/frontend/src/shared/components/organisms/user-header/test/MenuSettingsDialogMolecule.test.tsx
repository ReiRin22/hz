import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../stories/molecules/MenuSettingsDialogMolecule.stories';

const { Open, Closed, DarkMode } = composeStories(stories);

describe('MenuSettingsDialogMolecule', () => {
  beforeEach(() => {
    stories.default.args?.onOpenChange?.mockClear?.();
    stories.default.args?.onDarkModeToggle?.mockClear?.();
    stories.default.args?.onAutoSaveToggle?.mockClear?.();
    stories.default.args?.onAlertsToggle?.mockClear?.();
    stories.default.args?.onAutoLogoutToggle?.mockClear?.();
    stories.default.args?.onThemeColorChange?.mockClear?.();
    stories.default.args?.onAutoSave?.mockClear?.();
    stories.default.args?.onAutoLogoutTimeoutChange?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('Open: ダイアログタイトルが表示される', () => {
    render(<Open />);
    expect(screen.getByText('メニュー設定')).toBeInTheDocument();
  });

  // C1: open/closed 分岐
  test('Closed: isOpen=false のときダイアログが非表示', () => {
    render(<Closed />);
    expect(screen.queryByText('メニュー設定')).not.toBeInTheDocument();
  });

  test('DarkMode: darkMode=true の状態でも正常に描画される', () => {
    render(<DarkMode />);
    expect(screen.getByText('メニュー設定')).toBeInTheDocument();
  });

  // C2: キャンセル操作
  test('キャンセルボタン押下で onOpenChange が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Open />);

    await user.click(screen.getByRole('button', { name: 'キャンセル' }));

    expect(Open.args.onOpenChange).toHaveBeenCalledWith(false);
  });
});

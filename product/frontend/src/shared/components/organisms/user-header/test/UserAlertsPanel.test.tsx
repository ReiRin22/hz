import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { composeStories } from '@storybook/react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../stories/molecules/UserAlertsPanel.stories';

const { WithAlerts, Empty, AllDismissed } = composeStories(stories);

describe('UserAlertsPanel', () => {
  beforeEach(() => {
    stories.default.args?.onDismissAlert?.mockClear?.();
    WithAlerts.args?.onDismissAlert?.mockClear?.();
  });

  // C0: 基本レンダリング
  test('WithAlerts: アラートタイトルが表示される', () => {
    render(<WithAlerts />);
    expect(screen.getByText('期限超過タスクあり')).toBeInTheDocument();
    expect(screen.getByText('システムメンテナンス予定')).toBeInTheDocument();
    expect(screen.getByText('処方オーダー承認待ち')).toBeInTheDocument();
  });

  test('Empty: アラートがない場合も表示できる', () => {
    const { container } = render(<Empty />);
    expect(container).not.toBeEmptyDOMElement();
  });

  // C1: dismissed 分岐 — dismissed=true のアラートはフィルタリングされて非表示
  test('AllDismissed: dismissed=true のアラートはリストに表示されない', () => {
    render(<AllDismissed />);
    expect(screen.queryByText('期限超過タスクあり')).not.toBeInTheDocument();
    expect(screen.queryByText('システムメンテナンス予定')).not.toBeInTheDocument();
  });

  // C2: コールバック操作
  test('非表示ボタン（title="アラートを非表示"）押下で onDismissAlert が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<WithAlerts />);

    // title 属性で特定（ボタンにテキストなし、アイコンのみ）
    const dismissButtons = screen.getAllByTitle('アラートを非表示');
    await user.click(dismissButtons[0]);

    expect(WithAlerts.args.onDismissAlert).toHaveBeenCalledOnce();
    expect(WithAlerts.args.onDismissAlert).toHaveBeenCalledWith('alert-1');
  });
});

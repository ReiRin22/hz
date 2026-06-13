import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/organisms/DraggableCommentPopup.stories';

const { Open, Closed, EmptyComments } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Open.args.onClose?.mockClear?.();
  Open.args.onCommentSelect?.mockClear?.();
  Open.args.onCommentTabChange?.mockClear?.();
  Open.args.onMyCommentManagementOpen?.mockClear?.();
});

describe('DraggableCommentPopup', () => {
  // C1: isOpen=false のとき何も表示されない
  test('Closed: コンポーネントが描画されない', () => {
    const { container } = render(<Closed />);
    expect(container).toBeEmptyDOMElement();
  });

  // C0: 基本レンダリング
  test('Open: タブ（Myコメント・患者別・診療科）が表示される', () => {
    render(<Open />);
    expect(screen.getByRole('tab', { name: 'Myコメント' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '患者別' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '診療科' })).toBeInTheDocument();
  });

  test('Open: コメント一覧が表示される', () => {
    render(<Open />);
    expect(screen.getByText('次回フォローアップ必要')).toBeInTheDocument();
    expect(screen.getByText('アレルギー確認済み')).toBeInTheDocument();
  });

  // C1: コメントなしのとき空コンテンツでもタブ構造は描画される
  test('EmptyComments: コメントがなくてもタブが表示される', () => {
    render(<EmptyComments />);
    expect(screen.getByRole('tab', { name: 'Myコメント' })).toBeInTheDocument();
  });

  // C2: 閉じるボタン
  test('閉じるボタン押下で onClose が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Open />);
    // ×ボタンはTitle+Buttonエリア
    const closeButton = screen.getByRole('button', { name: /閉じる|×|close/i });
    await user.click(closeButton);
    expect(Open.args.onClose).toHaveBeenCalledOnce();
  });
});

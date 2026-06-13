import { describe, test, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom';
import { composeStories } from '@storybook/react';
import { render, screen, cleanup } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import * as stories from '../../../../../../test/stories/01_diagnosis/01_record-creation/01_examination-input/organisms/MyCommentManagementDialog.stories';

const { Open, Closed, EmptyComments } = composeStories(stories);

beforeEach(() => {
  cleanup();
  Open.args.onOpenChange?.mockClear?.();
  Open.args.onSaveComment?.mockClear?.();
  Open.args.onDeleteComment?.mockClear?.();
});

describe('MyCommentManagementDialog', () => {
  // C0: 基本レンダリング
  test('Open: ダイアログが表示されコメント一覧が描画される', () => {
    render(<Open />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('次回フォローアップ必要')).toBeInTheDocument();
    expect(screen.getByText('アレルギー確認済み（ペニシリン）')).toBeInTheDocument();
  });

  // C1: open=false のとき非表示
  test('Closed: ダイアログが表示されない', () => {
    render(<Closed />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  // C1: コメントなし
  test('EmptyComments: コメントなしのとき新規追加フォームが表示される', () => {
    render(<EmptyComments />);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  // C2: 新規コメント追加
  test('新規コメント入力後に保存ボタン押下で onSaveComment が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Open />);
    const textarea = screen.getByRole('textbox');
    await user.click(textarea);
    await user.type(textarea, 'テストコメント');
    const saveButton = screen.getByRole('button', { name: /保存|追加/i });
    await user.click(saveButton);
    expect(Open.args.onSaveComment).toHaveBeenCalled();
  });
});

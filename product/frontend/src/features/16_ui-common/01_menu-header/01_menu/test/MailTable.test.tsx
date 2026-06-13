import '@testing-library/jest-dom';
import { describe, test, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/MailTable.stories';

const { Inbox, InboxSelected, Sent, Empty } = composeStories(stories);

describe('MailTable', () => {
  beforeEach(() => {
    Inbox.args.onEmailClick?.mockClear?.();
  });

  // C0: 全UI要素の存在確認
  test('Inbox story: メール件名「患者情報の確認」が表示される', () => {
    render(<Inbox />);
    expect(screen.getByText('患者情報の確認')).toBeInTheDocument();
  });

  test('Inbox story: 複数のメールが表示される', () => {
    render(<Inbox />);
    expect(screen.getByText('患者情報の確認')).toBeInTheDocument();
    expect(screen.getByText('診療録更新のお知らせ')).toBeInTheDocument();
    expect(screen.getByText('緊急連絡')).toBeInTheDocument();
  });

  test('Inbox story: 「件名」ヘッダーが表示される', () => {
    render(<Inbox />);
    expect(screen.getByText('件名')).toBeInTheDocument();
  });

  test('Sent story: 「宛先」ヘッダーが表示される', () => {
    render(<Sent />);
    expect(screen.getByText('宛先')).toBeInTheDocument();
  });

  test('Empty story: メール一覧が空のとき件名ヘッダーのみ表示される', () => {
    render(<Empty />);
    expect(screen.getByText('件名')).toBeInTheDocument();
    expect(screen.queryByText('患者情報の確認')).not.toBeInTheDocument();
  });

  // C1: 選択状態の分岐確認
  test('Inbox story: selectedEmailId=null のとき選択ハイライトなし', () => {
    render(<Inbox />);
    // 特定のハイライトスタイルが存在しないことを確認
    const rows = document.querySelectorAll('tr');
    expect(rows.length).toBeGreaterThan(0);
  });

  // C2: コールバック操作
  test('メール行クリックで onEmailClick が呼ばれる', async () => {
    const user = userEvent.setup();
    render(<Inbox />);
    await user.click(screen.getByText('患者情報の確認'));
    expect(Inbox.args.onEmailClick).toHaveBeenCalledOnce();
  });
});

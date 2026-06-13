import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/MailPreview.stories';

const { InboxSelected, SentSelected, NoSelection } = composeStories(stories);

describe('MailPreview', () => {
  // C0: 全UI要素の存在確認
  test('InboxSelected story: メールの件名「患者情報の確認について」が表示される', () => {
    render(<InboxSelected />);
    expect(screen.getByText('患者情報の確認について')).toBeInTheDocument();
  });

  test('InboxSelected story: 差出人「田中 一郎」が表示される', () => {
    render(<InboxSelected />);
    expect(screen.getByText(/差出人.*田中 一郎/)).toBeInTheDocument();
  });

  test('InboxSelected story: メール本文が表示される', () => {
    render(<InboxSelected />);
    expect(screen.getByText(/患者 山田太郎 様の診療記録について/)).toBeInTheDocument();
  });

  // C1: 状態による分岐確認
  test('NoSelection story: メール未選択時は「メールを選択してください」が表示される', () => {
    render(<NoSelection />);
    expect(screen.getByText('メールを選択してください')).toBeInTheDocument();
  });

  test('SentSelected story: mode=sent のとき宛先が表示される', () => {
    render(<SentSelected />);
    expect(screen.getByText(/宛先.*鈴木 美香/)).toBeInTheDocument();
  });
});

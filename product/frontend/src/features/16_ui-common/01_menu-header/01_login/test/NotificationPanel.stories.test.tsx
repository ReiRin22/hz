import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import { describe, expect, test } from 'vitest';
import * as stories from '../stories/molecules/NotificationPanel.stories';

const { Default } = composeStories(stories);

describe('NotificationPanel stories', () => {
  // C0: 基本レンダリング
  test('システムメンテナンスセクションが表示される', () => {
    render(<Default />);
    expect(screen.getByText('システムメンテナンス')).toBeInTheDocument();
  });

  // C0: 院内掲示板セクション
  test('院内掲示板セクションが表示される', () => {
    render(<Default />);
    expect(screen.getByText('院内掲示板')).toBeInTheDocument();
  });

  // C0: メンテナンス通知項目が表示される
  test('定期メンテナンスの通知が表示される', () => {
    render(<Default />);
    expect(screen.getByText('定期メンテナンス')).toBeInTheDocument();
  });

  // C0: 掲示板記事が表示される
  test('院内掲示板の記事が表示される', () => {
    render(<Default />);
    expect(screen.getByText('新型インフルエンザ対応について')).toBeInTheDocument();
  });
});

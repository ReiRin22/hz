import '@testing-library/jest-dom';
import { describe, test, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { composeStories } from '@storybook/react';
import * as stories from '../stories/molecules/DoctorBadges.stories';

const { WithUnapproved, AllApproved, BlackTheme } = composeStories(stories);

describe('DoctorBadges', () => {
  // C0: 全UI要素の存在確認
  test('WithUnapproved story: 医師名「田中 一郎」が表示される', () => {
    render(<WithUnapproved />);
    expect(screen.getByText('田中 一郎')).toBeInTheDocument();
  });

  test('WithUnapproved story: 全医師名が表示される', () => {
    render(<WithUnapproved />);
    expect(screen.getByText('田中 一郎')).toBeInTheDocument();
    expect(screen.getByText('鈴木 美香')).toBeInTheDocument();
    expect(screen.getByText('佐藤 健二')).toBeInTheDocument();
  });

  test('WithUnapproved story: 「医師別未承認:」ラベルが表示される', () => {
    render(<WithUnapproved />);
    expect(screen.getByText('医師別未承認:')).toBeInTheDocument();
  });

  // C1: 未承認件数によるバッジの分岐
  test('WithUnapproved story: 未承認件数3のバッジが表示される', () => {
    render(<WithUnapproved />);
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  test('WithUnapproved story: 未承認件数1のバッジが表示される', () => {
    render(<WithUnapproved />);
    expect(screen.getByText('1')).toBeInTheDocument();
  });

  test('AllApproved story: 未承認件数0のバッジが表示される', () => {
    render(<AllApproved />);
    const badges = screen.getAllByText('0');
    expect(badges.length).toBeGreaterThan(0);
  });

  test('BlackTheme story: 医師名「田中 一郎」が表示される', () => {
    render(<BlackTheme />);
    expect(screen.getByText('田中 一郎')).toBeInTheDocument();
  });
});

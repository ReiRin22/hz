import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { BulletinBoard } from '../components/molecules/BulletinBoard';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('BulletinBoard stories', () => {
  test('掲示板タイトルが表示される', () => {
    render(<BulletinBoard theme={blueTheme} />);
    expect(screen.getByText('掲示板')).toBeInTheDocument();
  });

  test('院内停電お知らせが表示される', () => {
    render(<BulletinBoard theme={blueTheme} />);
    expect(screen.getByText('10/27 院内停電のお知らせ')).toBeInTheDocument();
  });
});

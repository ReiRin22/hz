import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { MessageMemo } from '../components/molecules/MessageMemo';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('MessageMemo stories', () => {
  test('伝言メモタイトルが表示される', () => {
    render(<MessageMemo theme={blueTheme} />);
    expect(screen.getByText('伝言メモ（医師宛通達）')).toBeInTheDocument();
  });

  test('伝言メモの1件目が表示される', () => {
    render(<MessageMemo theme={blueTheme} />);
    expect(screen.getByText('看護部：患者ID12345 採血追加確認願い')).toBeInTheDocument();
  });
});

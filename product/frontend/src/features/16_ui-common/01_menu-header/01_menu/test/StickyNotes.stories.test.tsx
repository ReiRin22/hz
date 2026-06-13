import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { StickyNotes } from '../components/molecules/StickyNotes';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('StickyNotes stories', () => {
  test('付箋タイトルが表示される', () => {
    render(<StickyNotes theme={blueTheme} />);
    expect(screen.getByText('付箋')).toBeInTheDocument();
  });

  test('緊急連絡付箋が表示される', () => {
    render(<StickyNotes theme={blueTheme} />);
    expect(screen.getByText('緊急連絡')).toBeInTheDocument();
  });
});

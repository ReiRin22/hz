import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { BedOccupancyChart } from '../components/molecules/BedOccupancyChart';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('BedOccupancyChart stories', () => {
  test('病床稼働状況チャートタイトルが表示される', () => {
    render(<BedOccupancyChart theme={blueTheme} />);
    expect(screen.getByText('病床稼働状況チャート')).toBeInTheDocument();
  });

  test('平均稼働率テキストが表示される', () => {
    render(<BedOccupancyChart theme={blueTheme} />);
    expect(screen.getByText(/平均稼働率/)).toBeInTheDocument();
  });
});

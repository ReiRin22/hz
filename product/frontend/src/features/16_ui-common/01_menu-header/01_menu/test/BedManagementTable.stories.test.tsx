import { render, screen } from '@testing-library/react';
import { describe, expect, test } from 'vitest';
import { BedManagementTable } from '../components/molecules/BedManagementTable';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('BedManagementTable stories', () => {
  test('病床管理表タイトルが表示される', () => {
    render(<BedManagementTable theme={blueTheme} />);
    expect(screen.getByText('病床管理表')).toBeInTheDocument();
  });

  test('病棟ヘッダーが表示される', () => {
    render(<BedManagementTable theme={blueTheme} />);
    expect(screen.getByText('病棟')).toBeInTheDocument();
  });

  test('一般病棟の行が表示される', () => {
    render(<BedManagementTable theme={blueTheme} />);
    expect(screen.getByText('一般病棟')).toBeInTheDocument();
  });
});

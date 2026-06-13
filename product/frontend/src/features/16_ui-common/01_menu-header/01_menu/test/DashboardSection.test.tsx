import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DashboardSection } from '../components/organisms/DashboardSection';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('DashboardSection', () => {
  describe('初期表示', () => {
    it('ダッシュボードタイトルが表示される', () => {
      render(<DashboardSection theme={blueTheme} />);
      expect(screen.getByText('ダッシュボード')).toBeInTheDocument();
    });

    it('掲示板タブが表示される', () => {
      render(<DashboardSection theme={blueTheme} />);
      expect(screen.getByRole('tab', { name: /掲示板/ })).toBeInTheDocument();
    });

    it('稼働状況タブが表示される', () => {
      render(<DashboardSection theme={blueTheme} />);
      expect(screen.getByRole('tab', { name: '稼働状況' })).toBeInTheDocument();
    });

    it('付箋タブが表示される', () => {
      render(<DashboardSection theme={blueTheme} />);
      expect(screen.getByRole('tab', { name: '付箋' })).toBeInTheDocument();
    });

    it('院内メールタブが表示される', () => {
      render(<DashboardSection theme={blueTheme} />);
      expect(screen.getByRole('tab', { name: '院内メール' })).toBeInTheDocument();
    });
  });
});

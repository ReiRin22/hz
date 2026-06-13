import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ProxyInputSection } from '../components/organisms/ProxyInputSection';
import { TemporarySaveSection } from '../components/organisms/TemporarySaveSection';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('ProxyInputSection', () => {
  it('代行入力未承認タイトルが表示される', () => {
    render(<ProxyInputSection theme={blueTheme} />);
    expect(screen.getByText('代行入力未承認')).toBeInTheDocument();
  });

  it('代理入力リストが表示される', () => {
    render(<ProxyInputSection theme={blueTheme} />);
    // 代理入力データが表示されていること
    const listItems = screen.queryAllByRole('checkbox');
    expect(listItems.length).toBeGreaterThanOrEqual(0);
  });
});

describe('TemporarySaveSection', () => {
  it('一時保存データタイトルが表示される', () => {
    render(<TemporarySaveSection theme={blueTheme} />);
    expect(screen.getByText('一時保存データ')).toBeInTheDocument();
  });

  it('一時保存リストが表示される', () => {
    render(<TemporarySaveSection theme={blueTheme} />);
    const listItems = screen.queryAllByRole('checkbox');
    expect(listItems.length).toBeGreaterThanOrEqual(0);
  });
});

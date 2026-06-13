import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { InternalMail } from '../components/organisms/InternalMail';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

describe('InternalMail', () => {
  describe('初期表示', () => {
    it('院内メールタイトルが表示される', () => {
      render(<InternalMail theme={blueTheme} />);
      expect(screen.getByText('院内メール')).toBeInTheDocument();
    });

    it('受信タブが表示される', () => {
      render(<InternalMail theme={blueTheme} />);
      expect(screen.getByRole('tab', { name: /受信/ })).toBeInTheDocument();
    });

    it('送信タブが表示される', () => {
      render(<InternalMail theme={blueTheme} />);
      expect(screen.getByRole('tab', { name: /送信/ })).toBeInTheDocument();
    });

    it('新規ボタンが表示される', () => {
      render(<InternalMail theme={blueTheme} />);
      expect(screen.getByRole('button', { name: '新規' })).toBeInTheDocument();
    });
  });
});

import type { Meta, StoryObj } from '@storybook/react';
import { MailPreview } from '../../components/molecules/MailPreview';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const mockEmail = {
  id: '1',
  subject: '患者情報の確認について',
  sender: '田中 一郎',
  date: '12/19 15:27',
  content: '患者 山田太郎 様の診療記録について確認をお願いします。',
  isRead: false,
  isDeleted: false,
};

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/MailPreview',
  component: MailPreview,
  tags: ['autodocs'],
} satisfies Meta<typeof MailPreview>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InboxSelected: Story = {
  args: { selectedEmail: mockEmail, mode: 'inbox', theme: blueTheme },
};

export const SentSelected: Story = {
  args: {
    selectedEmail: { ...mockEmail, id: 's1', recipient: '鈴木 美香', sender: undefined },
    mode: 'sent',
    theme: blueTheme,
  },
};

export const WithEmail: Story = {
  args: { selectedEmail: mockEmail, mode: 'inbox', theme: blueTheme },
};

export const WithEmailSent: Story = {
  args: {
    selectedEmail: { ...mockEmail, id: 's1', recipient: '鈴木 美香', sender: undefined },
    mode: 'sent',
    theme: blueTheme,
  },
};

export const NoSelection: Story = {
  args: { selectedEmail: null, mode: 'inbox', theme: blueTheme },
};

export const BlackTheme: Story = {
  args: { selectedEmail: mockEmail, mode: 'inbox', theme: blackTheme },
};

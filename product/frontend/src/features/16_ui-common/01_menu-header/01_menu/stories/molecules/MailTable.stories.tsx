import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MailTable } from '../../components/molecules/MailTable';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const mockEmails = [
  { id: '1', subject: '患者情報の確認', sender: '田中 一郎', date: '12/19 15:27', content: '本文', isRead: false, isDeleted: false },
  { id: '2', subject: '診療録更新のお知らせ', sender: '鈴木 美香', date: '12/19 14:57', content: '本文', isRead: false, isDeleted: false },
  { id: '3', subject: '緊急連絡', sender: '佐藤 健二', date: '12/19 14:27', content: '本文', isRead: true, isDeleted: false },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/MailTable',
  component: MailTable,
  tags: ['autodocs'],
  argTypes: {
    onEmailClick: { action: 'email-clicked' },
  },
} satisfies Meta<typeof MailTable>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inbox: Story = {
  args: { emails: mockEmails, selectedEmailId: null, mode: 'inbox', onEmailClick: fn(), theme: blueTheme },
};

export const InboxSelected: Story = {
  args: { emails: mockEmails, selectedEmailId: '2', mode: 'inbox', onEmailClick: fn(), theme: blueTheme },
};

export const Sent: Story = {
  args: { emails: mockEmails, selectedEmailId: null, mode: 'sent', onEmailClick: fn(), theme: blueTheme },
};

export const InboxWithSelection: Story = {
  args: { emails: mockEmails, selectedEmailId: '2', mode: 'inbox', onEmailClick: fn(), theme: blueTheme },
};

export const Empty: Story = {
  args: { emails: [], selectedEmailId: null, mode: 'inbox', onEmailClick: fn(), theme: blueTheme },
};

export const BlackTheme: Story = {
  args: { emails: mockEmails, selectedEmailId: null, mode: 'inbox', onEmailClick: fn(), theme: blackTheme },
};

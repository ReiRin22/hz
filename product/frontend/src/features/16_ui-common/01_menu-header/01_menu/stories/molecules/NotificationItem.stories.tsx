import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NotificationItem } from '../../components/molecules/NotificationItem';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };

const mockNotificationInfo = { id: 'notif-1', title: '患者アレルギー情報更新', message: '山田太郎 様のアレルギー情報が更新されました。', timestamp: '2026-05-13 10:00', isRead: false, type: 'info' as const };
const mockNotificationWarning = { id: 'notif-2', title: '患者アレルギー情報更新', message: '山田太郎 様のアレルギー情報が更新されました。', timestamp: '2026-05-13 10:00', isRead: false, type: 'warning' as const };
const mockNotificationError = { id: 'n3', title: '緊急アラート', message: '患者 田中花子 のバイタルに異常値を検出しました。', timestamp: '2026-05-20 10:15', isRead: false, type: 'error' as const };
const mockNotificationSuccess = { id: 'n4', title: '患者検査結果通知', message: '患者 山田太郎 の血液検査結果が登録されました。', timestamp: '2026-05-20 14:30', isRead: true, type: 'success' as const };

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/NotificationItem',
  component: NotificationItem,
  tags: ['autodocs'],
  argTypes: {
    onToggleExpand: { action: 'expand-toggled' },
    onMarkAsRead: { action: 'marked-as-read' },
  },
} satisfies Meta<typeof NotificationItem>;
export default meta;
type Story = StoryObj<typeof meta>;

export const InfoUnread: Story = {
  args: { notification: mockNotificationInfo, isExpanded: false, theme: blueTheme, onToggleExpand: fn(), onMarkAsRead: fn() },
};

export const InfoExpanded: Story = {
  args: { notification: mockNotificationInfo, isExpanded: true, theme: blueTheme, onToggleExpand: fn(), onMarkAsRead: fn() },
};

export const Warning: Story = {
  args: { notification: mockNotificationWarning, isExpanded: false, theme: blueTheme, onToggleExpand: fn(), onMarkAsRead: fn() },
};

export const WarningExpanded: Story = {
  args: { notification: mockNotificationWarning, isExpanded: true, theme: blueTheme, onToggleExpand: fn(), onMarkAsRead: fn() },
};

export const Error: Story = {
  args: { notification: mockNotificationError, isExpanded: false, theme: blueTheme, onToggleExpand: fn(), onMarkAsRead: fn() },
};

export const SuccessRead: Story = {
  args: { notification: mockNotificationSuccess, isExpanded: false, theme: blueTheme, onToggleExpand: fn(), onMarkAsRead: fn() },
};

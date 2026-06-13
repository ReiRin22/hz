import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { NotificationDialog } from '../../components/molecules/NotificationDialog';

const blueTheme = { name: 'ブルー', value: 'blue', primary: '#3B82F6', secondary: '#DBEAFE' };
const blackTheme = { name: 'ブラック', value: 'black', primary: '#9CA3AF', secondary: '#0D0D0D' };

const mockNotifications = [
  { id: 'n1', title: '患者アレルギー情報更新', message: '山田太郎 様のアレルギー情報が更新されました。', timestamp: '2026-05-22 09:00', isRead: false, type: 'warning' as const },
  { id: 'n2', title: 'システムメンテナンス予定', message: '2026/05/30 02:00〜04:00 にメンテナンスを実施します。', timestamp: '2026-05-21 18:00', isRead: false, type: 'info' as const },
  { id: 'n3', title: '患者検査結果通知', message: '患者 山田太郎 の血液検査結果が登録されました。', timestamp: '2026-05-20 14:30', isRead: true, type: 'success' as const },
  { id: 'n4', title: '緊急アラート', message: '患者 田中花子 のバイタルに異常値を検出しました。', timestamp: '2026-05-20 10:15', isRead: false, type: 'error' as const },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_menu/molecules/NotificationDialog',
  component: NotificationDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onOpenChange: { action: 'open-changed' },
    onMarkAsRead: { action: 'marked-as-read' },
    onMarkAllAsRead: { action: 'all-marked-as-read' },
    onToggleExpand: { action: 'expand-toggled' },
  },
} satisfies Meta<typeof NotificationDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    notifications: mockNotifications,
    expandedNotifications: new Set<string>(),
    unreadCount: 3,
    theme: blueTheme,
    onOpenChange: fn(),
    onMarkAsRead: fn(),
    onMarkAllAsRead: fn(),
    onToggleExpand: fn(),
  },
};

export const Closed: Story = {
  args: {
    open: false,
    notifications: mockNotifications,
    expandedNotifications: new Set<string>(),
    unreadCount: 3,
    theme: blueTheme,
    onOpenChange: fn(),
    onMarkAsRead: fn(),
    onMarkAllAsRead: fn(),
    onToggleExpand: fn(),
  },
};

export const AllRead: Story = {
  args: {
    open: true,
    notifications: mockNotifications.map((n) => ({ ...n, isRead: true })),
    expandedNotifications: new Set<string>(),
    unreadCount: 0,
    theme: blueTheme,
    onOpenChange: fn(),
    onMarkAsRead: fn(),
    onMarkAllAsRead: fn(),
    onToggleExpand: fn(),
  },
};

export const WithExpandedItem: Story = {
  args: {
    open: true,
    notifications: mockNotifications,
    expandedNotifications: new Set(['n1', 'n2']),
    unreadCount: 3,
    theme: blueTheme,
    onOpenChange: fn(),
    onMarkAsRead: fn(),
    onMarkAllAsRead: fn(),
    onToggleExpand: fn(),
  },
};

export const BlackTheme: Story = {
  args: {
    open: true,
    notifications: mockNotifications,
    expandedNotifications: new Set<string>(),
    unreadCount: 3,
    theme: blackTheme,
    onOpenChange: fn(),
    onMarkAsRead: fn(),
    onMarkAllAsRead: fn(),
    onToggleExpand: fn(),
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { GlobalHeader } from '../../components/organisms/GlobalHeader';

const mockUser = {
  id: 'D0001',
  name: '田中 一郎',
  role: '医師',
  department: '内科',
  loginTime: '08:30',
};

const mockAlerts = [
  {
    id: 'alert-1',
    type: 'warning' as const,
    title: '期限超過タスクあり',
    message: '本日期限のタスクが3件あります。',
    priority: 'high' as const,
    timestamp: '2026-05-14T09:00:00',
    dismissed: false,
    userId: 'D0001',
  },
  {
    id: 'alert-2',
    type: 'system' as const,
    title: 'システムメンテナンス予定',
    message: '2026/05/20 02:00〜04:00 にメンテナンスを実施します。',
    priority: 'medium' as const,
    timestamp: '2026-05-13T18:00:00',
    dismissed: false,
    userId: 'D0001',
  },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/organisms/GlobalHeader',
  component: GlobalHeader,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onAutoSave: fn(),
    onExtendSession: fn(),
    onLogout: fn(),
    onNotesOpen: fn(),
    onTempDataOpen: fn(),
    onAlertsOpen: fn(),
    onMenuSettingsOpen: fn(),
  },
} satisfies Meta<typeof GlobalHeader>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    currentUser: mockUser,
    userAlerts: mockAlerts,
    darkMode: false,
    autoSaveEnabled: true,
    alertsEnabled: true,
    autoLogoutEnabled: false,
    autoLogoutTimeout: 30,
    themeColor: 'blue',
    stickyNotesCount: 4,
    tempDataCount: 3,
    unreadAlertsCount: 2,
  },
};

export const AutoLogoutWarning: Story = {
  args: {
    ...Default.args,
    autoLogoutEnabled: true,
    isAutoLogoutWarningVisible: true,
    autoLogoutRemainingTime: 120,
  },
};

export const NoBadges: Story = {
  args: {
    ...Default.args,
    stickyNotesCount: 0,
    tempDataCount: 0,
    unreadAlertsCount: 0,
    userAlerts: [],
  },
};

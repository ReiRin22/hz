import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UserAlertsPanel } from '../../components/molecules/UserAlertsPanel';

const mockAlerts = [
  {
    id: 'alert-1',
    type: 'warning' as const,
    title: '期限超過タスクあり',
    message: '本日期限のタスクが3件あります。確認してください。',
    priority: 'high' as const,
    timestamp: '2026-05-14T09:00:00',
    dismissed: false,
    userId: 'user-001',
  },
  {
    id: 'alert-2',
    type: 'system' as const,
    title: 'システムメンテナンス予定',
    message: '2026/05/20 02:00〜04:00 にシステムメンテナンスを実施します。',
    priority: 'medium' as const,
    timestamp: '2026-05-13T18:00:00',
    dismissed: false,
    userId: 'user-001',
  },
  {
    id: 'alert-3',
    type: 'task' as const,
    title: '処方オーダー承認待ち',
    message: '山田太郎さんの処方オーダーが承認待ちです。',
    priority: 'critical' as const,
    timestamp: '2026-05-14T10:30:00',
    dismissed: false,
    userId: 'user-001',
  },
];

const dismissedAlerts = mockAlerts.map((a) => ({ ...a, dismissed: true }));

const mockUser = { name: '田中 医師', id: 'user-001' };

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/molecules/UserAlertsPanel',
  component: UserAlertsPanel,
  tags: ['autodocs'],
  args: {
    onDismissAlert: fn(),
  },
} satisfies Meta<typeof UserAlertsPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithAlerts: Story = {
  args: {
    alerts: mockAlerts,
    currentUser: mockUser,
  },
};

export const Empty: Story = {
  args: {
    alerts: [],
    currentUser: mockUser,
  },
};

export const AllDismissed: Story = {
  args: {
    alerts: dismissedAlerts,
    currentUser: mockUser,
  },
};

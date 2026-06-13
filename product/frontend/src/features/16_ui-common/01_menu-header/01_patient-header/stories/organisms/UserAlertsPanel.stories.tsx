import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { UserAlertsPanel } from '../../components/organisms/UserAlertsPanel';

const sampleAlerts = [
  {
    id: 'alert-001',
    type: 'system',
    title: 'システムメンテナンス',
    message: '本日22:00〜翌2:00にメンテナンスを実施します',
    timestamp: '2024-01-15T10:00:00',
    isRead: false,
    priority: 'high',
  },
  {
    id: 'alert-002',
    type: 'patient',
    title: '検査結果通知',
    message: '山田 太郎 様の血液検査結果が届きました',
    timestamp: '2024-01-15T09:30:00',
    isRead: true,
    priority: 'normal',
  },
];

const sampleUser = {
  id: 'user-001',
  name: '佐藤 医師',
  role: 'doctor',
};

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/UserAlertsPanel',
  component: UserAlertsPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onDismissAlert: fn(),
  },
} satisfies Meta<typeof UserAlertsPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithAlerts: Story = {
  args: {
    alerts: sampleAlerts,
    currentUser: sampleUser,
  },
};

export const NoAlerts: Story = {
  args: {
    alerts: [],
    currentUser: sampleUser,
  },
};

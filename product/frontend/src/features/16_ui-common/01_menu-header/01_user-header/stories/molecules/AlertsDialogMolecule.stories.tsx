import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AlertsDialogMolecule } from '../../components/molecules/AlertsDialogMolecule';

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
    dismissed: true,
    userId: 'user-001',
  },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_user-header/molecules/AlertsDialogMolecule',
  component: AlertsDialogMolecule,
  tags: ['autodocs'],
  args: {
    onOpenChange: fn(),
    onDismissAlert: fn(),
  },
} satisfies Meta<typeof AlertsDialogMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    userAlerts: mockAlerts,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    userAlerts: mockAlerts,
  },
};

export const Empty: Story = {
  args: {
    isOpen: true,
    userAlerts: [],
  },
};

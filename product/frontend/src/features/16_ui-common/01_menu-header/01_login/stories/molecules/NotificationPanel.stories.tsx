import type { Meta, StoryObj } from '@storybook/react';
import { NotificationPanel } from '../../components/molecules/NotificationPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_login/molecules/NotificationPanel',
  component: NotificationPanel,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
} satisfies Meta<typeof NotificationPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

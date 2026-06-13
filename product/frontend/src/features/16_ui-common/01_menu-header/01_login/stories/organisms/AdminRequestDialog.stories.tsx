import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AdminRequestDialog } from '../../components/organisms/AdminRequestDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_login/organisms/AdminRequestDialog',
  component: AdminRequestDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof AdminRequestDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { isOpen: true },
};

export const Closed: Story = {
  args: { isOpen: false },
};

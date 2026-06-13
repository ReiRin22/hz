import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PasswordExpiredDialog } from '../../components/organisms/PasswordExpiredDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_login/organisms/PasswordExpiredDialog',
  component: PasswordExpiredDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onClose: fn(),
    onResetPassword: fn(),
  },
} satisfies Meta<typeof PasswordExpiredDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { isOpen: true },
};

export const Closed: Story = {
  args: { isOpen: false },
};

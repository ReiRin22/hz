import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PasswordResetDialog } from '../../components/organisms/PasswordResetDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_login/organisms/PasswordResetDialog',
  component: PasswordResetDialog,
  tags: ['autodocs'],
  parameters: { layout: 'centered' },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof PasswordResetDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: { isOpen: true },
};

export const Closed: Story = {
  args: { isOpen: false },
};

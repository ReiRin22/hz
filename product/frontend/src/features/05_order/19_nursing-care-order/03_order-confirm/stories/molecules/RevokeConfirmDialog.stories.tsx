import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { RevokeConfirmDialog } from '../../components/molecules/RevokeConfirmDialog';

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/molecules/RevokeConfirmDialog',
  component: RevokeConfirmDialog,
  tags: ['autodocs'],
  args: {
    onConfirm: fn(),
    onClose: fn(),
    open: true,
  },
} satisfies Meta<typeof RevokeConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const NormalUser: Story = {
  args: {
    isSubstituteUser: false,
  },
};

export const SubstituteUser: Story = {
  args: {
    isSubstituteUser: true,
  },
};

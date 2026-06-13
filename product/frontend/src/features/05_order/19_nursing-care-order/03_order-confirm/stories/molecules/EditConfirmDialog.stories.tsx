import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { EditConfirmDialog } from '../../components/molecules/EditConfirmDialog';

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/molecules/EditConfirmDialog',
  component: EditConfirmDialog,
  tags: ['autodocs'],
  args: {
    onConfirm: fn(),
    onClose: fn(),
    open: true,
  },
} satisfies Meta<typeof EditConfirmDialog>;
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

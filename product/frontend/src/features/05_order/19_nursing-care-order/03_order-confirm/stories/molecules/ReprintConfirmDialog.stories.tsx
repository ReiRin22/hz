import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ReprintConfirmDialog } from '../../components/molecules/ReprintConfirmDialog';

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/molecules/ReprintConfirmDialog',
  component: ReprintConfirmDialog,
  tags: ['autodocs'],
  args: {
    onConfirmOnly: fn(),
    onReprint: fn(),
    onClose: fn(),
    open: true,
  },
} satisfies Meta<typeof ReprintConfirmDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    orderDiff: 'アスピリン 100mg → アスピリン 200mg',
  },
};

export const NoDiff: Story = {
  args: {
    orderDiff: '',
  },
};

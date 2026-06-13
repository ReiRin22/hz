import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ConfirmedOrderRow } from '../../components/molecules/ConfirmedOrderRow';

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/molecules/ConfirmedOrderRow',
  component: ConfirmedOrderRow,
  tags: ['autodocs'],
  args: {
    onEdit: fn(),
    onRevoke: fn(),
  },
} satisfies Meta<typeof ConfirmedOrderRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {
  args: {
    order: {
      id: 'order-003',
      type: 'imaging',
      typeName: '投薬オーダー',
      detail: 'アスピリン 100mg 1錠/日',
      confirmedAt: '2026-05-10T14:00:00Z',
      status: 'ordered',
      isRevoked: false,
    },
  },
};

export const Revoked: Story = {
  args: {
    order: {
      id: 'order-004',
      type: 'imaging',
      typeName: '画像オーダー',
      detail: '胸部X線（正面）',
      confirmedAt: '2026-05-10T14:00:00Z',
      status: 'ordered',
      isRevoked: true,
    },
  },
};

export const WithDeptStatus: Story = {
  args: {
    order: {
      id: 'order-005',
      type: 'lab',
      typeName: '検体検査オーダー',
      detail: '血液一般',
      confirmedAt: '2026-05-10T14:00:00Z',
      status: 'accepted',
      isRevoked: false,
      deptInstructionStatus: 'received',
    },
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { OrderTypeSelectDialog } from '../../components/molecules/OrderTypeSelectDialog';
import type { OrderTypeViewModel } from '../../types/order-confirm.types';

const ORDER_TYPES: OrderTypeViewModel[] = [
  { id: 'MEDICATION', name: '投薬オーダー', route: '/order/medication' },
  { id: 'LAB', name: '検体検査オーダー', route: '/order/lab' },
  { id: 'IMAGING', name: '画像オーダー', route: '/order/imaging' },
  { id: 'NURSING', name: '看護オーダー', route: '/order/nursing' },
];

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/molecules/OrderTypeSelectDialog',
  component: OrderTypeSelectDialog,
  tags: ['autodocs'],
  args: {
    onSelect: fn(),
    onClose: fn(),
  },
} satisfies Meta<typeof OrderTypeSelectDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    orderTypes: ORDER_TYPES,
  },
};

export const Empty: Story = {
  args: {
    open: true,
    orderTypes: [],
  },
};

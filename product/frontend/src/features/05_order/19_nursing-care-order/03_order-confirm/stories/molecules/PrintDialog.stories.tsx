import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PrintDialog } from '../../components/molecules/PrintDialog';
import type { FormViewModel } from '../../types/order-confirm.types';

const ALL_FORMS: FormViewModel[] = [
  { id: 'form-001', name: '処方箋', description: '投薬指示書', relatedOrderIds: ['order-001'] },
  { id: 'form-002', name: '検体検査依頼書', description: '検査オーダー依頼', relatedOrderIds: ['order-002'] },
  { id: 'form-003', name: '画像検査依頼書', description: '画像検査依頼', relatedOrderIds: ['order-003'] },
];

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/molecules/PrintDialog',
  component: PrintDialog,
  tags: ['autodocs'],
  args: {
    onSelectAll: fn(),
    onToggleForm: fn(),
    onOutput: fn(),
    onClose: fn(),
    patientName: '山田 太郎',
    patientId: 'P001',
    allForms: ALL_FORMS,
  },
} satisfies Meta<typeof PrintDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    open: true,
    selectedForms: [],
  },
};

export const SomeSelected: Story = {
  args: {
    open: true,
    selectedForms: [ALL_FORMS[0]],
  },
};

export const AllSelected: Story = {
  args: {
    open: true,
    selectedForms: ALL_FORMS,
  },
};

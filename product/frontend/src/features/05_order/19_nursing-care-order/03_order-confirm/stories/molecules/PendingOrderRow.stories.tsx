import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PendingOrderRow } from '../../components/molecules/PendingOrderRow';

const meta = {
  title: '05_order/19_nursing-care-order/03_order-confirm/molecules/PendingOrderRow',
  component: PendingOrderRow,
  tags: ['autodocs'],
  args: {
    onEdit: fn(),
    onDelete: fn(),
  },
} satisfies Meta<typeof PendingOrderRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    order: {
      id: 'order-001',
      type: 'prescription',
      typeName: '投薬オーダー',
      detail: 'アスピリン 100mg 1錠/日',
      addedAt: '2026-05-11T09:00:00Z',
    },
  },
};

export const LongDetail: Story = {
  args: {
    order: {
      id: 'order-002',
      type: 'general',
      typeName: '汎用オーダー',
      detail: '血液一般・生化学・肝機能・腎機能・電解質・凝固能・血糖・HbA1c・尿検査（長文詳細情報のテスト）',
      addedAt: '2026-05-11T09:05:00Z',
    },
  },
};

export const LabWithSubItems: Story = {
  args: {
    order: {
      id: 'order-003',
      type: 'lab',
      typeName: '検体検査オーダー',
      detail: '',
      addedAt: '2026-05-11T09:10:00Z',
      specimenSubItems: [
        { id: 'sub-01', testName: '血算（CBC）', orderCode: 'CBC001', specimenType: '血液' },
        { id: 'sub-02', testName: '生化学', orderCode: 'BIO001', specimenType: '血液', priority: 'urgent' },
      ],
    },
  },
};

export const WithScheduledAt: Story = {
  args: {
    order: {
      id: 'order-004',
      type: 'imaging',
      typeName: '画像検査オーダー',
      detail: '胸部X線（正面）',
      addedAt: '2026-05-11T09:15:00Z',
      scheduledAt: '2026-05-13T14:30:00Z',
    },
  },
};

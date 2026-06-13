import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenHistoryList } from '../../components/molecules/SpecimenHistoryList';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/molecules/SpecimenHistoryList',
  component: SpecimenHistoryList,
  tags: ['autodocs'],
  args: {
    onAddItem: fn(),
    onSubTabChange: fn(),
  },
} satisfies Meta<typeof SpecimenHistoryList>;
export default meta;
type Story = StoryObj<typeof meta>;

const SAMPLE_HISTORY = [
  {
    id: 'hist-001',
    date: '2025-04-01',
    testName: '血算（CBC）',
    orderCode: 'CBC',
    specimenType: 'blood' as const,
    status: 'confirmed',
    confirmedAt: '2025-04-01T09:00:00Z',
    confirmedBy: 'Dr. 鈴木',
  },
  {
    id: 'hist-002',
    date: '2025-04-02',
    testName: '尿一般',
    orderCode: 'UA',
    specimenType: 'urine' as const,
    status: 'confirmed',
    confirmedAt: '2025-04-02T10:00:00Z',
    confirmedBy: 'Dr. 田中',
  },
];

export const Default: Story = {
  args: {
    historyData: SAMPLE_HISTORY,
    confirmedOrderCodes: [],
  },
};

export const Empty: Story = {
  args: {
    historyData: [],
    confirmedOrderCodes: [],
  },
};

export const WithConfirmedCodes: Story = {
  args: {
    historyData: SAMPLE_HISTORY,
    confirmedOrderCodes: ['CBC'],
  },
};

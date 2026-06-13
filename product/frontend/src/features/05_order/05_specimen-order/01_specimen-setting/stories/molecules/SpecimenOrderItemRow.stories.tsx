import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenOrderItemRow } from '../../components/molecules/SpecimenOrderItemRow';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/molecules/SpecimenOrderItemRow',
  component: SpecimenOrderItemRow,
  tags: ['autodocs'],
  args: {
    onRemove: fn(),
  },
} satisfies Meta<typeof SpecimenOrderItemRow>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    item: {
      id: 'item-001',
      specimenType: 'blood',
      testName: '血算（CBC）',
      orderCode: 'CBC',
    },
  },
};

export const Urgent: Story = {
  args: {
    item: {
      id: 'item-002',
      specimenType: 'urine',
      testName: '尿一般',
      orderCode: 'UA',
      priority: 'urgent',
    },
  },
};

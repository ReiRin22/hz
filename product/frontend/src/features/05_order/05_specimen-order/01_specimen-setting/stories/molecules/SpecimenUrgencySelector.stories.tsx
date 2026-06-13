import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenUrgencySelector } from '../../components/molecules/SpecimenUrgencySelector';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/molecules/SpecimenUrgencySelector',
  component: SpecimenUrgencySelector,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof SpecimenUrgencySelector>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Normal: Story = {
  args: {
    value: 'normal',
  },
};

export const Urgent: Story = {
  args: {
    value: 'urgent',
  },
};

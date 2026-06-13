import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenTypeSelector } from '../../components/molecules/SpecimenTypeSelector';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/molecules/SpecimenTypeSelector',
  component: SpecimenTypeSelector,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof SpecimenTypeSelector>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Unselected: Story = {
  args: {
    value: undefined,
  },
};

export const BloodSelected: Story = {
  args: {
    value: 'blood',
  },
};

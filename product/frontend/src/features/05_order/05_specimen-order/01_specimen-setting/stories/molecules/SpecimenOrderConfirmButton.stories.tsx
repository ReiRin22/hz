import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { SpecimenOrderConfirmButton } from '../../components/molecules/SpecimenOrderConfirmButton';

const meta = {
  title: '05_order/05_specimen-order/01_specimen-setting/molecules/SpecimenOrderConfirmButton',
  component: SpecimenOrderConfirmButton,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof SpecimenOrderConfirmButton>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Enabled: Story = {
  args: {
    isLoading: false,
    disabled: false,
  },
};

export const Disabled: Story = {
  args: {
    isLoading: false,
    disabled: true,
  },
};

export const Loading: Story = {
  args: {
    isLoading: true,
    disabled: false,
  },
};

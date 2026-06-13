import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ConfirmerRadioGroup } from '@/features/09_dept-instruction/01_dept-instruction/09_patient-id-check/components/molecules/ConfirmerRadioGroup';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/molecules/ConfirmerRadioGroup',
  component: ConfirmerRadioGroup,
  tags: ['autodocs'],
  args: {
    onChange: fn(),
  },
} satisfies Meta<typeof ConfirmerRadioGroup>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Person: Story = {
  args: {
    value: 'PERSON',
  },
};

export const Proxy: Story = {
  args: {
    value: 'PROXY',
  },
};

export const Other: Story = {
  args: {
    value: 'OTHER',
  },
};

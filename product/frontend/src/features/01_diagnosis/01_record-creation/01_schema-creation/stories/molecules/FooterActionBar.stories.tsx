import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import FooterActionBar from '../../components/molecules/FooterActionBar';

const meta = {
  title: '01_diagnosis/01_record-creation/01_schema-creation/molecules/FooterActionBar',
  component: FooterActionBar,
  tags: ['autodocs'],
  args: {
    onCancel: fn(),
    onConfirm: fn(),
  },
} satisfies Meta<typeof FooterActionBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Idle: Story = {
  args: { isSubmitting: false },
};

export const Submitting: Story = {
  args: { isSubmitting: true },
};

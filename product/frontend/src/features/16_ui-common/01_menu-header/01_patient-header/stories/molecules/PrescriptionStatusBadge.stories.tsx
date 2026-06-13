import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PrescriptionStatusBadge } from '../../components/molecules/PrescriptionStatusBadge';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/PrescriptionStatusBadge',
  component: PrescriptionStatusBadge,
  tags: ['autodocs'],
  args: {
    onClick: fn(),
  },
} satisfies Meta<typeof PrescriptionStatusBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Electronic: Story = {
  args: {
    status: 'electronic',
  },
};

export const Paper: Story = {
  args: {
    status: 'paper',
  },
};

export const Disconnected: Story = {
  args: {
    status: 'disconnected',
  },
};

export const NoClickHandler: Story = {
  args: {
    status: 'electronic',
  },
};

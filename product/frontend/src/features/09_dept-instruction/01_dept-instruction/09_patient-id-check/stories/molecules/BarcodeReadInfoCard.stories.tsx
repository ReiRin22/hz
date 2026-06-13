import type { Meta, StoryObj } from '@storybook/react';
import { BarcodeReadInfoCard } from '@/features/09_dept-instruction/01_dept-instruction/09_patient-id-check/components/molecules/BarcodeReadInfoCard';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/molecules/BarcodeReadInfoCard',
  component: BarcodeReadInfoCard,
  tags: ['autodocs'],
} satisfies Meta<typeof BarcodeReadInfoCard>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {
  args: {
    status: 'waiting',
  },
};

export const Ok: Story = {
  args: {
    status: 'ok',
    scannedValue: 'PT-12345678',
  },
};

export const Ng: Story = {
  args: {
    status: 'ng',
    scannedValue: 'PT-99999999',
    expectedValue: 'PT-12345678',
  },
};

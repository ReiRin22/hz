import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PrescriptionSettingsDialog } from '../../components/organisms/PrescriptionSettingsDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/PrescriptionSettingsDialog',
  component: PrescriptionSettingsDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
    onStatusChange: fn(),
  },
} satisfies Meta<typeof PrescriptionSettingsDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    patientId: 'P001234',
    patientName: '山田 太郎',
    currentStatus: 'electronic',
  },
};

export const PaperStatus: Story = {
  args: {
    isOpen: true,
    patientId: 'P001234',
    patientName: '山田 太郎',
    currentStatus: 'paper',
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    patientId: 'P001234',
    patientName: '山田 太郎',
    currentStatus: 'electronic',
  },
};

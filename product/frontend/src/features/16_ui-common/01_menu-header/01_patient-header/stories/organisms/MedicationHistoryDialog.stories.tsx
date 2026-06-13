import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MedicationHistoryDialog } from '../../components/organisms/MedicationHistoryDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/MedicationHistoryDialog',
  component: MedicationHistoryDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof MedicationHistoryDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    patientName: '山田 太郎',
    patientId: 'P001234',
    patientAllergies: ['ペニシリン'],
    medicationHistory: [],
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    patientName: '山田 太郎',
    patientId: 'P001234',
    patientAllergies: [],
    medicationHistory: [],
  },
};

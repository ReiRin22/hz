import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { MedicalInfoSharingDialog } from '../../components/organisms/MedicalInfoSharingDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/MedicalInfoSharingDialog',
  component: MedicalInfoSharingDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
    onDataChange: fn(),
  },
} satisfies Meta<typeof MedicalInfoSharingDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    patientId: 'P001234',
    patientName: '山田 太郎',
    currentData: {
      status: 'full-consent',
      consentDate: '2024-01-15',
      expiryDate: '2025-01-15',
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: true,
        diagnosticImages: true,
        labResults: true,
        referralLetters: true,
      },
    },
  },
};

export const NoConsent: Story = {
  args: {
    isOpen: true,
    patientId: 'P001234',
    patientName: '山田 太郎',
    currentData: {
      status: 'no-consent',
    },
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    patientId: 'P001234',
    patientName: '山田 太郎',
    currentData: { status: 'full-consent' },
  },
};

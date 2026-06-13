import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientStatusBarMolecule } from '../../components/molecules/PatientStatusBarMolecule';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/PatientStatusBarMolecule',
  component: PatientStatusBarMolecule,
  tags: ['autodocs'],
  args: {
    onPrescriptionClick: fn(),
    onMedicalInfoSharingClick: fn(),
  },
} satisfies Meta<typeof PatientStatusBarMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Electronic: Story = {
  args: {
    prescriptionStatus: 'electronic',
    medicalInfoSharing: {
      status: 'full-consent',
      consentDate: '2024-01-15',
    },
    isPrivacyMode: false,
  },
};

export const Paper: Story = {
  args: {
    prescriptionStatus: 'paper',
    medicalInfoSharing: {
      status: 'partial-consent',
    },
    isPrivacyMode: false,
  },
};

export const PrivacyMode: Story = {
  args: {
    prescriptionStatus: 'disconnected',
    medicalInfoSharing: {
      status: 'no-consent',
    },
    isPrivacyMode: true,
  },
};

import type { Meta, StoryObj } from '@storybook/react';
import { MedicalInfoSharingBadge } from '../../components/molecules/MedicalInfoSharingBadge';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/MedicalInfoSharingBadge',
  component: MedicalInfoSharingBadge,
  tags: ['autodocs'],
} satisfies Meta<typeof MedicalInfoSharingBadge>;
export default meta;
type Story = StoryObj<typeof meta>;

export const FullConsent: Story = {
  args: {
    data: {
      status: 'full-consent',
      consentDate: '2024-01-15',
      expiryDate: '2025-01-15',
      lastUpdated: '2024-01-15',
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: true,
        diagnosticImages: true,
        labResults: true,
        referralLetters: true,
      },
    },
    isPrivacyMode: false,
  },
};

export const PartialConsent: Story = {
  args: {
    data: {
      status: 'partial-consent',
      consentDate: '2024-01-15',
      details: {
        emergencyMedicalInfo: true,
        prescriptionHistory: false,
        diagnosticImages: false,
      },
    },
    isPrivacyMode: false,
  },
};

export const NoConsent: Story = {
  args: {
    data: {
      status: 'no-consent',
      lastUpdated: '2024-01-15',
    },
    isPrivacyMode: false,
  },
};

export const PrivacyMode: Story = {
  args: {
    data: {
      status: 'full-consent',
      consentDate: '2024-01-15',
    },
    isPrivacyMode: true,
  },
};

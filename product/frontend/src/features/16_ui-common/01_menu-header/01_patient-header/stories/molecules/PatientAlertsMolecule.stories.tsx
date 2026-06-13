import type { Meta, StoryObj } from '@storybook/react';
import { PatientAlertsMolecule } from '../../components/molecules/PatientAlertsMolecule';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/PatientAlertsMolecule',
  component: PatientAlertsMolecule,
  tags: ['autodocs'],
} satisfies Meta<typeof PatientAlertsMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithAllAlerts: Story = {
  args: {
    allergies: ['ペニシリン', 'セフェム系', 'NSAIDs'],
    infections: ['MRSA', 'B型肝炎'],
    radiationExposure: { dose: 15.2, unit: 'mSv', level: 'moderate' },
  },
};

export const AllergyOnly: Story = {
  args: {
    allergies: ['ペニシリン'],
    infections: [],
  },
};

export const InfectionOnly: Story = {
  args: {
    allergies: [],
    infections: ['MRSA'],
  },
};

export const HighRadiation: Story = {
  args: {
    allergies: [],
    infections: [],
    radiationExposure: { dose: 85.0, unit: 'mSv', level: 'high' },
  },
};

export const NoAlerts: Story = {
  args: {
    allergies: [],
    infections: [],
  },
};

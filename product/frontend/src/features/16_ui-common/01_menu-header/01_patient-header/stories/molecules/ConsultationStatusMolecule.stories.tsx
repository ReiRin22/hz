import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { ConsultationStatusMolecule } from '../../components/molecules/ConsultationStatusMolecule';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/ConsultationStatusMolecule',
  component: ConsultationStatusMolecule,
  tags: ['autodocs'],
  args: {
    onConsultationToggle: fn(),
  },
} satisfies Meta<typeof ConsultationStatusMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Waiting: Story = {
  args: {
    consultationStatus: 'waiting',
    isConsultationStarted: false,
  },
};

export const InProgress: Story = {
  args: {
    consultationStatus: 'in-progress',
    isConsultationStarted: true,
  },
};

export const Completed: Story = {
  args: {
    consultationStatus: 'completed',
    isConsultationStarted: false,
  },
};

export const Postponed: Story = {
  args: {
    consultationStatus: 'postponed',
    isConsultationStarted: false,
  },
};

export const Cancelled: Story = {
  args: {
    consultationStatus: 'cancelled',
    isConsultationStarted: false,
  },
};

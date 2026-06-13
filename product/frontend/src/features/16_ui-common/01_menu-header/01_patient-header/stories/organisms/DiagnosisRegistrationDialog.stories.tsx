import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { DiagnosisRegistrationDialog } from '../../components/organisms/DiagnosisRegistrationDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/DiagnosisRegistrationDialog',
  component: DiagnosisRegistrationDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof DiagnosisRegistrationDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    patientName: '山田 太郎',
    patientId: 'P001234',
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    patientName: '山田 太郎',
    patientId: 'P001234',
  },
};

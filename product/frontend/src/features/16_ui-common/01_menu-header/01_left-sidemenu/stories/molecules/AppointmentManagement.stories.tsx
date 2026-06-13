import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentManagement } from '../../components/molecules/AppointmentManagement';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/AppointmentManagement',
  component: AppointmentManagement,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof AppointmentManagement>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithPatient: Story = {
  args: {
    currentPatient: {
      id: 'p001',
      name: '田中太郎',
      age: 65,
      gender: 'male',
      patientNumber: 'P-001234',
      visitDate: '2026-05-14',
    },
  },
};

export const WithoutPatient: Story = {
  args: {},
};

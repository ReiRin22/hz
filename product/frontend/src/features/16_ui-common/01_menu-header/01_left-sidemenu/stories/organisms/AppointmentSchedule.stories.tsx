import type { Meta, StoryObj } from '@storybook/react';
import { AppointmentSchedule } from '../../components/organisms/AppointmentSchedule';

const today = new Date().toISOString().split('T')[0];
const sampleAppointments = [
  {
    id: 'a1',
    title: '定期診察',
    startTime: '09:00',
    endTime: '09:30',
    date: today,
    patientName: '田中太郎',
    type: 'consultation' as const,
    status: 'confirmed' as const,
  },
  {
    id: 'a2',
    title: '処置',
    startTime: '10:00',
    endTime: '10:30',
    date: today,
    patientName: '佐藤花子',
    type: 'procedure' as const,
    status: 'tentative' as const,
  },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/AppointmentSchedule',
  component: AppointmentSchedule,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onAppointmentCreate: { action: 'appointment-created' },
    onAppointmentUpdate: { action: 'appointment-updated' },
    onAppointmentDelete: { action: 'appointment-deleted' },
  },
} satisfies Meta<typeof AppointmentSchedule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithAppointments: Story = {
  args: {
    selectedDate: new Date(),
    appointments: sampleAppointments,
    onAppointmentCreate: () => {},
    onAppointmentUpdate: () => {},
    onAppointmentDelete: () => {},
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

export const Empty: Story = {
  args: {
    selectedDate: new Date(),
    appointments: [],
    onAppointmentCreate: () => {},
    onAppointmentUpdate: () => {},
    onAppointmentDelete: () => {},
  },
};

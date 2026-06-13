import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { AppointmentCalendar } from '../../components/molecules/AppointmentCalendar';

const today = new Date().toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

const sampleAppointments = [
  {
    id: '1',
    title: '定期診察',
    startTime: '09:00',
    endTime: '09:30',
    date: today,
    patientName: '田中太郎',
    type: 'consultation' as const,
    status: 'confirmed' as const,
  },
  {
    id: '2',
    title: '血圧測定',
    startTime: '10:00',
    endTime: '10:30',
    date: tomorrow,
    patientName: '佐藤花子',
    type: 'procedure' as const,
    status: 'tentative' as const,
  },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/AppointmentCalendar',
  component: AppointmentCalendar,
  tags: ['autodocs'],
  args: {
    onDateSelect: fn(),
  },
} satisfies Meta<typeof AppointmentCalendar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    selectedDate: new Date(),
    appointments: sampleAppointments,
  },
};

export const NoAppointments: Story = {
  args: {
    selectedDate: new Date(),
    appointments: [],
  },
};

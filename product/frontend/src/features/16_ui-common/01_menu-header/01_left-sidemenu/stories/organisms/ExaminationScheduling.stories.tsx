import type { Meta, StoryObj } from '@storybook/react';
import { ExaminationScheduling } from '../../components/organisms/ExaminationScheduling';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/organisms/ExaminationScheduling',
  component: ExaminationScheduling,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  argTypes: {
    onBack: { action: 'back' },
    onDateSelected: { action: 'date-selected' },
  },
} satisfies Meta<typeof ExaminationScheduling>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithPatient: Story = {
  args: {
    onBack: () => {},
    currentPatient: {
      id: 'p001',
      name: '田中太郎',
      age: 65,
      gender: 'male',
      patientNumber: 'P-001234',
      visitDate: '2026-05-14',
    },
    onDateSelected: () => {},
    selectedOrderForExamination: null,
  },
};

export const WithSelectedOrder: Story = {
  args: {
    onBack: () => {},
    currentPatient: {
      id: 'p001',
      name: '田中太郎',
      age: 65,
      gender: 'male',
      patientNumber: 'P-001234',
      visitDate: '2026-05-14',
    },
    onDateSelected: () => {},
    selectedOrderForExamination: 'order-ct-001',
  },
};

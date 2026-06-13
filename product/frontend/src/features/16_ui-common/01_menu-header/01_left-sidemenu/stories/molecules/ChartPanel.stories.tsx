import type { Meta, StoryObj } from '@storybook/react';
import { ChartPanel } from '../../components/molecules/ChartPanel';

const meta = {
  title: '16_ui-common/01_menu-header/01_left-sidemenu/molecules/ChartPanel',
  component: ChartPanel,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ChartPanel>;
export default meta;
type Story = StoryObj<typeof meta>;

export const MalePatient: Story = {
  args: {
    currentPatient: {
      id: 'p001',
      name: '田中太郎',
      age: 65,
      gender: 'male',
      patientNumber: 'P-001234',
      visitDate: '2026-05-14',
      allergies: ['ペニシリン'],
    },
  },
};

export const FemalePatient: Story = {
  args: {
    currentPatient: {
      id: 'p002',
      name: '佐藤花子',
      age: 42,
      gender: 'female',
      patientNumber: 'P-005678',
      visitDate: '2026-05-14',
    },
  },
};

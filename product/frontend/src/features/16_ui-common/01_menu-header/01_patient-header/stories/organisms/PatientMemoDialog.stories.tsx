import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientMemoDialog } from '../../components/organisms/PatientMemoDialog';

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/PatientMemoDialog',
  component: PatientMemoDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
    onSave: fn(),
  },
} satisfies Meta<typeof PatientMemoDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    patientId: 'P001234',
    patientName: '山田 太郎',
    memos: [],
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    patientId: 'P001234',
    patientName: '山田 太郎',
    memos: [],
  },
};

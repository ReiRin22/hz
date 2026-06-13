import type { Meta, StoryObj } from '@storybook/react';
import { PatientIdCheckSection } from '@/features/09_dept-instruction/01_dept-instruction/09_patient-id-check/components/molecules/PatientIdCheckSection';

const meta = {
  title: '09_dept-instruction/01_dept-instruction/09_patient-id-check/molecules/PatientIdCheckSection',
  component: PatientIdCheckSection,
  tags: ['autodocs'],
  args: {
    title: '患者確認',
    sectionType: 'patient',
    children: <div className="text-sm text-gray-500">子要素</div>,
  },
} satisfies Meta<typeof PatientIdCheckSection>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Pending: Story = {
  args: {
    status: 'pending',
  },
};

export const Ok: Story = {
  args: {
    status: 'ok',
    timestamp: '14:32:10',
  },
};

export const Ng: Story = {
  args: {
    status: 'ng',
  },
};

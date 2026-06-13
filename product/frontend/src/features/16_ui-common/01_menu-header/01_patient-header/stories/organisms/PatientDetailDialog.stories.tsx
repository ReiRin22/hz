import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientDetailDialog } from '../../components/organisms/PatientDetailDialog';

const samplePatient = {
  patientId: 'P001234',
  name: '山田 太郎',
  kana: 'ヤマダ タロウ',
  birthDate: '1965年8月15日',
  gender: '男性',
  age: 59,
  bloodType: 'A+',
  department: '内科',
  ward: '3病棟',
  room: '302号室',
  bed: '302-A',
  doctor: '佐藤 医師',
  phone: '03-1234-5678',
  address: '東京都千代田区 1-1-1',
  emergencyContact: {
    name: '山田 花子',
    relationship: '配偶者',
    phone: '090-1234-5678',
  },
  insurance: {
    type: '社会保険',
    number: '12345678',
    expiryDate: '2025-12-31',
    burden: '3割',
  },
  allergies: ['ペニシリン'],
  infections: [],
  diagnoses: ['本態性高血圧症', '2型糖尿病'],
  admissionDate: '2024-01-10',
  notes: '高齢者のため転倒注意',
};

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/PatientDetailDialog',
  component: PatientDetailDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
  },
} satisfies Meta<typeof PatientDetailDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    patient: samplePatient,
    latestTestResults: [],
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    patient: samplePatient,
    latestTestResults: [],
  },
};

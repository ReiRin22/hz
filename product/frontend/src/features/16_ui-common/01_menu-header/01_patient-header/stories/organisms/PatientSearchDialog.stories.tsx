import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientSearchDialog } from '../../components/organisms/PatientSearchDialog';
import type { PatientViewModel } from '../../types/patient-header.type';

const mockPatients: PatientViewModel[] = [
  {
    patientId: 'P001234',
    name: '山田 太郎',
    kana: 'ヤマダ タロウ',
    birthDate: '1965年8月15日',
    gender: '男性',
    age: 59,
    department: '内科',
    ward: '3病棟',
    room: '302号室',
    doctor: '佐藤 医師',
    allergies: [],
    infections: [],
    consultationStatus: 'waiting',
    prescriptionStatus: 'electronic',
    isNewPatient: false,
    medicalInfoSharing: { status: 'full-consent' },
    insurance: { type: '社会保険', number: '12345678', burden: '3割' },
  },
  {
    patientId: 'P005678',
    name: '鈴木 花子',
    kana: 'スズキ ハナコ',
    birthDate: '1980年3月20日',
    gender: '女性',
    age: 44,
    department: '外科',
    ward: '2病棟',
    room: '201号室',
    doctor: '田中 医師',
    allergies: ['ペニシリン'],
    infections: [],
    consultationStatus: 'completed',
    prescriptionStatus: 'paper',
    isNewPatient: false,
    medicalInfoSharing: { status: 'partial-consent' },
    insurance: { type: '国民健康保険', number: '87654321', burden: '3割' },
  },
];

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/PatientSearchDialog',
  component: PatientSearchDialog,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    onClose: fn(),
    onPatientSelect: fn(),
  },
} satisfies Meta<typeof PatientSearchDialog>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Open: Story = {
  args: {
    isOpen: true,
    onSearch: async (_query: string) => mockPatients,
  },
};

export const Closed: Story = {
  args: {
    isOpen: false,
    onSearch: async (_query: string) => [],
  },
};

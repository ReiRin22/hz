import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PrivacyModePanelMolecule } from '../../components/molecules/PrivacyModePanelMolecule';
import type { PatientViewModel } from '../../types/patient-header.type';

const samplePatient: PatientViewModel = {
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
  admissionType: 'inpatient',
  isNewPatient: false,
  medicalInfoSharing: {
    status: 'full-consent',
    consentDate: '2024-01-15',
  },
  insurance: {
    type: '社会保険',
    number: '12345678',
    burden: '3割',
  },
};

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/PrivacyModePanelMolecule',
  component: PrivacyModePanelMolecule,
  tags: ['autodocs'],
  args: {
    onConsultationToggle: fn(),
    onPrescriptionClick: fn(),
    onMedicalInfoSharingClick: fn(),
  },
} satisfies Meta<typeof PrivacyModePanelMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    patient: samplePatient,
    isConsultationStarted: false,
  },
};

export const ConsultationStarted: Story = {
  args: {
    patient: { ...samplePatient, consultationStatus: 'in-progress' },
    isConsultationStarted: true,
  },
};

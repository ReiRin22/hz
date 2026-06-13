import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientInfoGridMolecule } from '../../components/molecules/PatientInfoGridMolecule';
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
  allergies: ['ペニシリン'],
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
  title: '16_ui-common/01_menu-header/01_patient-header/molecules/PatientInfoGridMolecule',
  component: PatientInfoGridMolecule,
  tags: ['autodocs'],
  args: {
    onAdmissionTypeToggle: fn(),
    onConsultationToggle: fn(),
    onMemoClick: fn(),
    onProxyInputClick: fn(),
    onPrescriptionClick: fn(),
    onMedicalInfoSharingClick: fn(),
  },
} satisfies Meta<typeof PatientInfoGridMolecule>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Inpatient: Story = {
  args: {
    patient: samplePatient,
    admissionType: 'inpatient',
    isConsultationStarted: false,
    orderingPhysician: '佐藤 医師',
  },
};

export const Outpatient: Story = {
  args: {
    patient: { ...samplePatient, admissionType: 'outpatient' },
    admissionType: 'outpatient',
    isConsultationStarted: true,
    orderingPhysician: null,
  },
};

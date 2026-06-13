import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { PatientHeaderOrganism } from '../../components/organisms/PatientHeaderOrganism';
import type { PatientHeaderResponse } from '@/front_bff_shared/types/response/patient-header.response.type';

const BFF_BASE_URL = '';

const mockPatientHeader: PatientHeaderResponse = {
  patientId: 'P001234',
  name: '山田 太郎',
  kana: 'ヤマダ タロウ',
  birthDate: '1965-08-15',
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
  admissionType: 'outpatient',
  isNewPatient: false,
  medicalInfoSharing: {
    status: 'full-consent',
    consentDate: '2024-01-15',
    expiryDate: '2025-01-15',
    details: {
      emergencyMedicalInfo: true,
      prescriptionHistory: true,
      diagnosticImages: true,
      labResults: true,
      referralLetters: true,
    },
  },
  insurance: { type: '社会保険', number: '12345678', burden: '3割' },
};

const mockNewPatientHeader: PatientHeaderResponse = {
  ...mockPatientHeader,
  patientId: 'P999001',
  name: '新 患者',
  kana: 'シン カンジャ',
  isNewPatient: true,
  allergies: [],
  infections: ['MRSA'],
};

export const commonHandlers = [
  http.get(`${BFF_BASE_URL}/api/patients/:patientId/header`, () =>
    HttpResponse.json(mockPatientHeader)
  ),
  http.put(`${BFF_BASE_URL}/api/patients/:patientId/prescription-status`, () =>
    new HttpResponse(null, { status: 200 })
  ),
  http.put(`${BFF_BASE_URL}/api/patients/:patientId/medical-info-sharing`, () =>
    new HttpResponse(null, { status: 200 })
  ),
  http.get(`${BFF_BASE_URL}/api/patients/search`, () =>
    HttpResponse.json({ patients: [mockPatientHeader], total: 1 })
  ),
];

export const newPatientHandlers = [
  http.get(`${BFF_BASE_URL}/api/patients/:patientId/header`, () =>
    HttpResponse.json(mockNewPatientHeader)
  ),
  http.put(`${BFF_BASE_URL}/api/patients/:patientId/prescription-status`, () =>
    new HttpResponse(null, { status: 200 })
  ),
  http.put(`${BFF_BASE_URL}/api/patients/:patientId/medical-info-sharing`, () =>
    new HttpResponse(null, { status: 200 })
  ),
  http.get(`${BFF_BASE_URL}/api/patients/search`, () =>
    HttpResponse.json({ patients: [mockPatientHeader, mockNewPatientHeader], total: 2 })
  ),
];

export const errorHandlers = [
  http.get(`${BFF_BASE_URL}/api/patients/:patientId/header`, () =>
    HttpResponse.json({ message: '患者情報の取得に失敗しました' }, { status: 500 })
  ),
];

const meta = {
  title: '16_ui-common/01_menu-header/01_patient-header/organisms/PatientHeaderOrganism',
  component: PatientHeaderOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
} satisfies Meta<typeof PatientHeaderOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NewPatient: Story = {
  parameters: {
    msw: { handlers: newPatientHandlers },
  },
};

export const LoadError: Story = {
  parameters: {
    msw: { handlers: errorHandlers },
  },
};

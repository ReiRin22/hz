import type { Meta, StoryObj } from '@storybook/react';
import { http, HttpResponse } from 'msw';
import { ReceptionPatientListOrganism } from '../../components/organisms/ReceptionPatientListOrganism';

const BFF_BASE = '';

const YAMADA_PATIENT = {
  id: 'patient-yamada',
  category: '当日',
  type: '初診',
  receptionTime: '09:00',
  appointmentSlot: '09:00-1',
  patientId: 'P001',
  name: '山田 太郎',
  kana: 'ヤマダ タロウ',
  birthDate: '1980-01-15',
  gender: '男',
  age: 46,
  medicalCategory: '内科',
  memo: '',
  multiDepartment: false,
  remarks: '',
  status: {
    consultation: null,
    prescription: null,
    injection: null,
    treatment: null,
    specimen: null,
    bacteria: null,
    pathology: null,
    physiology: null,
    endoscopy: null,
    imaging: null,
    rehabilitation: null,
    dialysis: null,
    surgery: null,
    guidance: null,
  },
  paymentComplete: false,
  consultationComplete: false,
  isReservation: false,
  doctorId: 'doctor1',
  departmentId: 'department1',
  date: new Date().toISOString().slice(0, 10),
};

export const commonHandlers = [
  http.get(`${BFF_BASE}/bff/reception-patients`, () =>
    HttpResponse.json({
      patients: [YAMADA_PATIENT],
      stats: { consulted: 0, recepted: 1, target: 1 },
    }),
  ),
];

export const emptyHandlers = [
  http.get(`${BFF_BASE}/bff/reception-patients`, () =>
    HttpResponse.json({ patients: [], stats: { consulted: 0, recepted: 0, target: 0 } }),
  ),
];

export const fetchErrorHandlers = [
  http.get(`${BFF_BASE}/bff/reception-patients`, () =>
    HttpResponse.json({ message: 'Internal Server Error' }, { status: 500 }),
  ),
];

const meta = {
  title: '01_diagnosis/06_patient-list/01_patient-list/organisms/ReceptionPatientListOrganism',
  component: ReceptionPatientListOrganism,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    msw: { handlers: commonHandlers },
  },
} satisfies Meta<typeof ReceptionPatientListOrganism>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithData: Story = {};

export const Empty: Story = {
  parameters: {
    msw: { handlers: emptyHandlers },
  },
};

export const FetchError: Story = {
  parameters: {
    msw: { handlers: fetchErrorHandlers },
  },
};

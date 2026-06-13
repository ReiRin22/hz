import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { PatientList } from '../../components/molecules/PatientList';
import type { Patient, FilterState, Department } from '../../types/receptionPatientList.types';

const DEPARTMENTS: Department[] = [
  { id: 'department1', name: '内科' },
  { id: 'department2', name: '外科' },
];

const BASE_FILTERS: FilterState = {
  date: '2026-05-22',
  showCompleted: false,
  showReservations: false,
  doctorIds: ['doctor1'],
  departmentId: 'department1',
};

const NULL_STATUS = {
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
} as const;

const YAMADA: Patient = {
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
  status: { ...NULL_STATUS },
  paymentComplete: false,
  consultationComplete: false,
  isReservation: false,
  doctorId: 'doctor1',
  departmentId: 'department1',
  date: '2026-05-22',
};

const SUZUKI_RESERVATION: Patient = {
  id: 'patient-suzuki',
  category: '当日',
  type: '再診',
  receptionTime: '',
  appointmentSlot: '10:00-1',
  patientId: 'P002',
  name: '鈴木 花子',
  kana: 'スズキ ハナコ',
  birthDate: '1975-05-20',
  gender: '女',
  age: 51,
  medicalCategory: '内科',
  memo: '',
  multiDepartment: false,
  remarks: '',
  status: { ...NULL_STATUS },
  paymentComplete: false,
  consultationComplete: false,
  isReservation: true,
  doctorId: 'doctor1',
  departmentId: 'department1',
  date: '2026-05-22',
};

const meta = {
  title: '01_diagnosis/06_patient-list/01_patient-list/molecules/PatientList',
  component: PatientList,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen' },
  args: {
    filters: BASE_FILTERS,
    calledPatients: new Set<string>(),
    currentDoctorId: 'doctor1',
    departments: DEPARTMENTS,
    onCallPatient: fn(),
    onPatientClick: fn(),
    onCancelConsultation: fn(),
  },
} satisfies Meta<typeof PatientList>;
export default meta;
type Story = StoryObj<typeof meta>;

export const WithPatients: Story = {
  args: {
    patients: [YAMADA, SUZUKI_RESERVATION],
  },
};

export const Empty: Story = {
  args: {
    patients: [],
  },
};

export const CalledPatient: Story = {
  args: {
    patients: [YAMADA],
    calledPatients: new Set(['patient-yamada']),
  },
};

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test, vi } from 'vitest';
import { PatientList } from '../components/molecules/PatientList';
import type { Patient, FilterState, Department } from '../types/receptionPatientList.types';

const DEPARTMENTS: Department[] = [
  { id: 'dept1', name: '内科' },
];
const DEFAULT_FILTERS: FilterState = {
  date: '2026-05-08',
  showCompleted: false,
  showReservations: true,
  departmentId: 'dept1',
  doctorIds: ['doctor1'],
};
const STATUS_NONE = {
  consultation: null, prescription: null, injection: null, treatment: null,
  specimen: null, bacteria: null, pathology: null, physiology: null,
  endoscopy: null, imaging: null, rehabilitation: null, dialysis: null,
  surgery: null, guidance: null,
} as const;

const BASE_PATIENT: Patient = {
  id: 'p1', category: '再診', type: '再診', receptionTime: '09:00',
  appointmentSlot: '09:00', patientId: '000001', name: '山田 太郎',
  kana: 'ヤマダ タロウ', birthDate: '1960-04-15', gender: '男', age: 65,
  medicalCategory: '内科', memo: '', multiDepartment: false, remarks: '',
  status: { ...STATUS_NONE, consultation: false }, paymentComplete: false,
  consultationComplete: false, isReservation: false, doctorId: 'doctor1',
  departmentId: 'dept1', date: '2026-05-08',
};

describe('PatientList – キャンセル診察ダイアログ', () => {
  test('診察終了済み・キャンセル可能セルをクリックするとダイアログが表示される', async () => {
    const user = userEvent.setup();
    const cancelablePatient: Patient = {
      ...BASE_PATIENT,
      id: 'p-cancel',
      status: { ...STATUS_NONE, consultation: true },
      paymentComplete: false,
      doctorId: 'doctor1',
    };
    render(
      <PatientList
        patients={[cancelablePatient]}
        filters={{ ...DEFAULT_FILTERS, showCompleted: true }}
        calledPatients={new Set()}
        currentDoctorId="doctor1"
        departments={DEPARTMENTS}
        onCallPatient={vi.fn()}
        onPatientClick={vi.fn()}
        onCancelConsultation={vi.fn()}
      />,
    );
    // isCancelable=true の td には title='診察終了を取り消しますか？' が付く
    const cancelableCell = screen.getByTitle('診察終了を取り消しますか？');
    await user.click(cancelableCell);
    expect(screen.getByRole('alertdialog')).toBeInTheDocument();
  });

  test('ダイアログの確定ボタンで onCancelConsultation が呼ばれる', async () => {
    const onCancelConsultation = vi.fn();
    const user = userEvent.setup();
    const cancelablePatient: Patient = {
      ...BASE_PATIENT,
      id: 'p-cancel2',
      status: { ...STATUS_NONE, consultation: true },
      paymentComplete: false,
      doctorId: 'doctor1',
    };
    render(
      <PatientList
        patients={[cancelablePatient]}
        filters={{ ...DEFAULT_FILTERS, showCompleted: true }}
        calledPatients={new Set()}
        currentDoctorId="doctor1"
        departments={DEPARTMENTS}
        onCallPatient={vi.fn()}
        onPatientClick={vi.fn()}
        onCancelConsultation={onCancelConsultation}
      />,
    );
    const cancelableCell = screen.getByTitle('診察終了を取り消しますか？');
    await user.click(cancelableCell);
    // ダイアログが開いたら「取り消す」ボタンを押す
    const confirmBtn = screen.getByRole('button', { name: /取り消す/ });
    await user.click(confirmBtn);
    expect(onCancelConsultation).toHaveBeenCalledWith('p-cancel2');
  });
});

describe('PatientList – ソート', () => {
  test('受付時刻ヘッダーをクリックしても患者リストが壊れない', async () => {
    const user = userEvent.setup();
    render(
      <PatientList
        patients={[BASE_PATIENT]}
        filters={DEFAULT_FILTERS}
        calledPatients={new Set()}
        currentDoctorId="doctor1"
        departments={DEPARTMENTS}
        onCallPatient={vi.fn()}
        onPatientClick={vi.fn()}
        onCancelConsultation={vi.fn()}
      />,
    );
    const header = screen.getByText('受付時間');
    await user.click(header);
    await user.click(header);
    expect(screen.getByText('山田 太郎')).toBeInTheDocument();
  });
});

describe('PatientList – 複数科', () => {
  test('multiDepartment=true の患者は「有」ラベルが表示される', () => {
    const p: Patient = { ...BASE_PATIENT, id: 'p-multi', multiDepartment: true };
    render(
      <PatientList
        patients={[p]}
        filters={DEFAULT_FILTERS}
        calledPatients={new Set()}
        currentDoctorId="doctor1"
        departments={DEPARTMENTS}
        onCallPatient={vi.fn()}
        onPatientClick={vi.fn()}
        onCancelConsultation={vi.fn()}
      />,
    );
    expect(screen.getByText('有')).toBeInTheDocument();
  });
});

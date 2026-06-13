import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReceptionPatientsService } from '../reception-patients.service';
import { ReceptionPatientsClient } from '../reception-patients.client';
import type { UpstreamReceptionPatient } from '../types/reception-patients.type';

function makeClient(overrides: Partial<ReceptionPatientsClient> = {}): ReceptionPatientsClient {
  return {
    fetchReceptionPatients: vi.fn(),
    ...overrides,
  } as unknown as ReceptionPatientsClient;
}

const MOCK_PATIENT: UpstreamReceptionPatient = {
  id: '1',
  category: '当日',
  type: '初診',
  receptionTime: '09:15',
  appointmentSlot: '',
  patientId: 'P001',
  name: '山田 太郎',
  kana: 'ヤマダ タロウ',
  birthDate: '1978-04-15',
  gender: '男',
  age: 45,
  medicalCategory: '保険',
  memo: '高血圧',
  multiDepartment: false,
  remarks: '',
  status: {
    consultation: false,
    prescription: null,
    injection: null,
    treatment: null,
    specimen: 0,
    bacteria: 0,
    pathology: 0,
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
};

describe('ReceptionPatientsService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常: receptionTime あり・isReservation false の患者は recepted にカウントされる', async () => {
    const client = makeClient({ fetchReceptionPatients: vi.fn().mockResolvedValue([MOCK_PATIENT]) });
    const service = new ReceptionPatientsService(client);

    const result = await service.getReceptionPatients('2026-04-30');

    expect(result.stats.recepted).toBe(1);
  });

  it('正常: consultation true の患者は consulted にカウントされる', async () => {
    const consultedPatient: UpstreamReceptionPatient = {
      ...MOCK_PATIENT,
      id: '2',
      status: { ...MOCK_PATIENT.status, consultation: true },
    };
    const client = makeClient({ fetchReceptionPatients: vi.fn().mockResolvedValue([consultedPatient]) });
    const service = new ReceptionPatientsService(client);

    const result = await service.getReceptionPatients('2026-04-30');

    expect(result.stats.consulted).toBe(1);
  });

  it('正常（空配列）: { patients: [], stats: { consulted: 0, recepted: 0, target: 0 } } を返す', async () => {
    const client = makeClient({ fetchReceptionPatients: vi.fn().mockResolvedValue([]) });
    const service = new ReceptionPatientsService(client);

    const result = await service.getReceptionPatients('2026-04-30');

    expect(result).toEqual({ patients: [], stats: { consulted: 0, recepted: 0, target: 0 } });
  });

  it('異常: Client が例外を投げた場合、エラーを伝播させる', async () => {
    const client = makeClient({
      fetchReceptionPatients: vi.fn().mockRejectedValue(new Error('BE unreachable')),
    });
    const service = new ReceptionPatientsService(client);

    await expect(service.getReceptionPatients('2026-04-30')).rejects.toThrow('BE unreachable');
  });
});

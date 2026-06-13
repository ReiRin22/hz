import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ReceptionPatientsController } from '../reception-patients.controller';
import { ReceptionPatientsService } from '../reception-patients.service';
import type { GetReceptionPatientsResponse } from '../types/reception-patients.api.response';

function makeService(overrides: Partial<ReceptionPatientsService> = {}): ReceptionPatientsService {
  return {
    getReceptionPatients: vi.fn(),
    ...overrides,
  } as unknown as ReceptionPatientsService;
}

const MOCK_RESPONSE: GetReceptionPatientsResponse = {
  patients: [
    {
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
      date: '2026-04-30',
    },
  ],
  stats: { consulted: 0, recepted: 1, target: 1 },
};

describe('ReceptionPatientsController', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('正常: Service が GetReceptionPatientsResponse を返した場合、そのレスポンスをそのまま返す', async () => {
    const service = makeService({ getReceptionPatients: vi.fn().mockResolvedValue(MOCK_RESPONSE) });
    const controller = new ReceptionPatientsController(service);

    const result = await controller.getReceptionPatients('2026-04-30');

    expect(result.patients.at(0)?.id).toBe('1');
  });

  it('正常: stats が Service から受け取った値をそのまま返す', async () => {
    const service = makeService({ getReceptionPatients: vi.fn().mockResolvedValue(MOCK_RESPONSE) });
    const controller = new ReceptionPatientsController(service);

    const result = await controller.getReceptionPatients('2026-04-30');

    expect(result.stats.target).toBe(1);
  });

  it('異常: Service が例外を投げた場合、エラーを伝播させる', async () => {
    const service = makeService({
      getReceptionPatients: vi.fn().mockRejectedValue(new Error('service error')),
    });
    const controller = new ReceptionPatientsController(service);

    await expect(controller.getReceptionPatients('2026-04-30')).rejects.toThrow('service error');
  });
});

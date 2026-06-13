import { Injectable, NotFoundException } from '@nestjs/common';
import type {
  UpstreamExaminationReservation,
  UpstreamExaminationEquipment,
} from './types/examination-reservations.type';
import type {
  CreateExaminationReservationRequest,
  UpdateExaminationReservationRequest,
} from './types/examination-reservations.api.request';

// TODO: 上流 API 実装後に差し替え
const MOCK_EQUIPMENT: UpstreamExaminationEquipment[] = [
  { equipmentId: 'CT1', equipmentName: 'CT室', equipmentType: 'CT', slotCapacity: 3 },
  { equipmentId: 'MRI1', equipmentName: 'MRI室', equipmentType: 'MRI', slotCapacity: 3 },
  { equipmentId: 'US1', equipmentName: 'エコー室', equipmentType: 'US', slotCapacity: 3 },
];

// TODO: 上流 API 実装後に差し替え
const MOCK_RESERVATIONS: UpstreamExaminationReservation[] = [
  {
    reservationId: 'r001',
    patientId: 'P12345',
    patientName: '田中花子',
    examType: '胸部CT',
    startTime: '09:00',
    endTime: '09:15',
    date: '2026-01-08',
    equipmentId: 'CT1',
    status: 'scheduled',
    notes: '造影剤使用',
    doctorId: 'D001',
    doctorName: '医師 001',
    checkedIn: true,
  },
  {
    reservationId: 'r002',
    patientId: 'P67890',
    patientName: '佐藤太郎',
    examType: '腹部CT',
    startTime: '09:00',
    endTime: '09:20',
    date: '2026-01-08',
    equipmentId: 'CT1',
    status: 'scheduled',
    checkedIn: true,
  },
  {
    reservationId: 'r003',
    patientId: 'P11111',
    patientName: '山田次郎',
    examType: '造影CT',
    startTime: '09:00',
    endTime: '09:30',
    date: '2026-01-08',
    equipmentId: 'CT1',
    status: 'scheduled',
    notes: '腎機能チェック済み',
  },
  {
    reservationId: 'r004',
    patientId: 'P22222',
    patientName: '鈴木美智子',
    examType: '胸部CT',
    startTime: '10:30',
    endTime: '10:45',
    date: '2026-01-08',
    equipmentId: 'CT1',
    status: 'scheduled',
    checkedIn: true,
  },
  {
    reservationId: 'r005',
    patientId: 'P33333',
    patientName: '高橋健一',
    examType: '頭部CT',
    startTime: '10:30',
    endTime: '10:45',
    date: '2026-01-08',
    equipmentId: 'CT1',
    status: 'scheduled',
  },
  {
    reservationId: 'r006',
    patientId: 'P44444',
    patientName: '渡辺聡子',
    examType: '腹部CT',
    startTime: '14:00',
    endTime: '14:20',
    date: '2026-01-08',
    equipmentId: 'CT1',
    status: 'scheduled',
  },
  {
    reservationId: 'r007',
    patientId: 'P55555',
    patientName: '伊藤雅子',
    examType: '頭部MRI',
    startTime: '09:00',
    endTime: '09:45',
    date: '2026-01-09',
    equipmentId: 'MRI1',
    status: 'scheduled',
  },
  {
    reservationId: 'r008',
    patientId: 'P66666',
    patientName: '小林正男',
    examType: '腰椎MRI',
    startTime: '09:00',
    endTime: '10:00',
    date: '2026-01-09',
    equipmentId: 'MRI1',
    status: 'scheduled',
  },
  {
    reservationId: 'r009',
    patientId: 'P77777',
    patientName: '加藤修',
    examType: '胸部CT',
    startTime: '11:00',
    endTime: '11:15',
    date: '2026-01-09',
    equipmentId: 'CT1',
    status: 'scheduled',
  },
  {
    reservationId: 'r010',
    patientId: 'P88888',
    patientName: '木村優子',
    examType: '腹部CT',
    startTime: '11:00',
    endTime: '11:20',
    date: '2026-01-09',
    equipmentId: 'CT1',
    status: 'scheduled',
  },
  {
    reservationId: 'schedule-pr_001',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '胸部CT',
    startTime: '10:00',
    endTime: '10:15',
    date: '2026-01-09',
    equipmentId: 'CT1',
    status: 'scheduled',
  },
  {
    reservationId: 'schedule-pr_002',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '頭部MRI',
    startTime: '14:00',
    endTime: '14:45',
    date: '2026-01-10',
    equipmentId: 'MRI1',
    status: 'scheduled',
  },
  {
    reservationId: 'schedule-pr_003',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '腹部エコー',
    startTime: '11:00',
    endTime: '11:30',
    date: '2026-01-11',
    equipmentId: 'US1',
    status: 'scheduled',
  },
  {
    reservationId: 'pr_undecided_001',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '胸部CT',
    startTime: '未定',
    endTime: '未定',
    date: '未定',
    equipmentId: 'CT1',
    status: 'scheduled',
  },
  {
    reservationId: 'pr_undecided_002',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '造影CT',
    startTime: '未定',
    endTime: '未定',
    date: '未定',
    equipmentId: 'CT1',
    status: 'scheduled',
    notes: '造影剤アレルギーチェック必要',
  },
  {
    reservationId: 'pr_undecided_003',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '腹部CT',
    startTime: '未定',
    endTime: '未定',
    date: '未定',
    equipmentId: 'CT1',
    status: 'scheduled',
  },
  {
    reservationId: 'pr_undecided_004',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '頭部MRI',
    startTime: '未定',
    endTime: '未定',
    date: '未定',
    equipmentId: 'MRI1',
    status: 'scheduled',
  },
  {
    reservationId: 'pr_undecided_005',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '腰椎MRI',
    startTime: '未定',
    endTime: '未定',
    date: '未定',
    equipmentId: 'MRI1',
    status: 'scheduled',
  },
  {
    reservationId: 'pr_undecided_009',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '腹部エコー',
    startTime: '未定',
    endTime: '未定',
    date: '未定',
    equipmentId: 'US1',
    status: 'scheduled',
  },
  {
    reservationId: 'pr_undecided_010',
    patientId: 'P001',
    patientName: '山田太郎',
    examType: '心エコー',
    startTime: '未定',
    endTime: '未定',
    date: '未定',
    equipmentId: 'US1',
    status: 'scheduled',
  },
];

@Injectable()
export class ExaminationReservationsClient {
  /**
   * 機器別・日付範囲の予約一覧を取得する（週間スケジュール用）
   * TODO: axios.get(`${UPSTREAM_BASE_URL}/examination-reservations?equipmentId=...&startDate=...&endDate=...`) に差し替え
   */
  async fetchReservations(): Promise<UpstreamExaminationReservation[]> {
    // TODO: 上流 API 実装後に差し替え
    return MOCK_RESERVATIONS;
  }

  /**
   * 患者別の予約一覧を取得する
   * TODO: axios.get(`${UPSTREAM_BASE_URL}/patients/${patientId}/examination-reservations`) に差し替え
   */
  async fetchPatientReservations(
    patientId: string,
  ): Promise<UpstreamExaminationReservation[]> {
    // TODO: 上流 API 実装後に差し替え
    return MOCK_RESERVATIONS.filter((r) => r.patientId === patientId);
  }

  /**
   * 新規予約を作成する
   * TODO: axios.post(`${UPSTREAM_BASE_URL}/patients/${patientId}/examination-reservations`) に差し替え
   */
  async createReservation(
    patientId: string,
    data: CreateExaminationReservationRequest,
  ): Promise<UpstreamExaminationReservation> {
    // TODO: 上流 API 実装後に差し替え（現状はリクエスト内容をそのままレスポンスとして返却）
    return {
      reservationId: `r${Date.now()}`,
      patientId,
      patientName: data.patientName,
      examType: data.examType,
      startTime: data.startTime,
      endTime: data.endTime,
      date: data.date,
      equipmentId: data.equipment,
      status: 'scheduled',
      ...(data.notes !== undefined && { notes: data.notes }),
      doctorId: data.doctorId,
      doctorName: data.doctorName,
    };
  }

  /**
   * 予約の日時を更新する（日時確定・日時編集）
   * TODO: axios.put(`${UPSTREAM_BASE_URL}/patients/${patientId}/examination-reservations/${reservationId}`) に差し替え
   */
  async updateReservation(
    patientId: string,
    reservationId: string,
    data: UpdateExaminationReservationRequest,
  ): Promise<UpstreamExaminationReservation> {
    // TODO: 上流 API 実装後に差し替え（現状はモックから該当予約を取得して日時を上書きして返却）
    const existing = MOCK_RESERVATIONS.find(
      (r) => r.reservationId === reservationId && r.patientId === patientId,
    );
    if (!existing) {
      throw new NotFoundException(
        `Reservation not found: reservationId=${reservationId}, patientId=${patientId}`,
      );
    }
    return {
      ...existing,
      date: data.date,
      startTime: data.startTime,
      endTime: data.endTime,
    };
  }

  /**
   * 検査室一覧・定員情報を取得する
   * TODO: axios.get(`${UPSTREAM_BASE_URL}/examination-equipment`) に差し替え
   */
  async fetchEquipment(): Promise<UpstreamExaminationEquipment[]> {
    // TODO: 上流 API 実装後に差し替え
    return MOCK_EQUIPMENT;
  }
}

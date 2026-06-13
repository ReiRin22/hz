/** BFF 内部型（上流 API との受け渡し用） */

/** 日時未確定状態を表すリテラル型 */
export type Undecided = '未定';

export interface UpstreamExaminationReservation {
  reservationId: string;
  patientId: string;
  patientName: string;
  examType: string;
  /** HH:mm 形式、または日時未確定の場合は '未定' */
  startTime: string | Undecided;
  /** HH:mm 形式、または日時未確定の場合は '未定' */
  endTime: string | Undecided;
  /** YYYY-MM-DD 形式、または日時未確定の場合は '未定' */
  date: string | Undecided;
  equipmentId: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  doctorId?: string;
  doctorName?: string;
  checkedIn?: boolean;
}

export interface UpstreamExaminationEquipment {
  equipmentId: string;
  equipmentName: string;
  equipmentType: string;
  slotCapacity: number;
}

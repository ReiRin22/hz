export interface ExaminationReservationResponse {
  id: string;
  patientId: string;
  patientName: string;
  examType: string;
  startTime: string;
  endTime: string;
  date: string;
  equipment: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
  doctorId?: string;
  doctorName?: string;
  checkedIn?: boolean;
}

export interface ExaminationEquipmentResponse {
  id: string;
  name: string;
  type: string;
  capacity: number;
}

export interface GetExaminationReservationsResponse {
  reservations: ExaminationReservationResponse[];
}

export interface GetExaminationEquipmentResponse {
  equipment: ExaminationEquipmentResponse[];
}

export interface CreateExaminationReservationResponse {
  reservation: ExaminationReservationResponse;
}

export interface UpdateExaminationReservationResponse {
  reservation: ExaminationReservationResponse;
}

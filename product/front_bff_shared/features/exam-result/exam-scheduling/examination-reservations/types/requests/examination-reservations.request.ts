export interface CreateExaminationReservationRequest {
  patientName: string;
  examType: string;
  startTime: string;
  endTime: string;
  date: string;
  equipment: string;
  notes?: string;
  doctorId: string;
  doctorName: string;
}

export interface UpdateExaminationReservationRequest {
  date: string;
  startTime: string;
  endTime: string;
}

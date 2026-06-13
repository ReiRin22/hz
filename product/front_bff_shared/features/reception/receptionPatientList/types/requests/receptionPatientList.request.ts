export interface GetReceptionPatientsRequest {
  date: string;
  departmentId?: string;
  doctorIds?: string;
  showCompleted?: boolean;
  showReservations?: boolean;
}

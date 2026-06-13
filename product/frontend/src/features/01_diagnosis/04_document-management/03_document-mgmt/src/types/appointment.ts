export interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  patientName?: string;
  type?: 'consultation' | 'procedure' | 'follow-up';
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

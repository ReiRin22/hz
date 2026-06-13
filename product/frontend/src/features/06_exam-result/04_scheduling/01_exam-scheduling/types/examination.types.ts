export interface ExaminationReservation {
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

export interface UnifiedReservation {
  id: string;
  type: 'examination' | 'appointment';
  patientId: string;
  patientName: string;
  date: string;
  startTime: string;
  endTime: string;
  examType?: string;
  equipment?: string;
  title?: string;
  targetResource?: string;
  doctorId?: string;
  doctorName?: string;
  status?: 'scheduled' | 'in-progress' | 'completed' | 'cancelled' | 'confirmed' | 'tentative';
  notes?: string;
  checkedIn?: boolean;
}

export interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

export interface ExaminationSchedulingProps {
  onBack?: () => void;
  currentPatient?: CurrentPatient;
  orderId?: string;
}

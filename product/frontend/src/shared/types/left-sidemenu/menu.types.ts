import { LucideIcon } from 'lucide-react';

export interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
  allergies?: string[];
}

export interface MenuSubItem {
  id: string;
  label: string;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  subItems?: MenuSubItem[];
}

export interface SetData {
  id: string;
  name: string;
  description: string;
  items: string[];
}

export interface OrderItem {
  id: string;
  name: string;
  type: string;
}

export type OrderSetType = 'my-set' | 'composite-set';
export type OrderTypeKey = 'prescription' | 'injection' | 'lab';
export type ViewType = 'order' | 'patient' | 'appointment' | 'chart' | 'testAppointment' | 'receptionList' | 'results';

export interface AddSetOrdersPayload {
  id: string;
  name: string;
  items: string[];
  type: OrderSetType;
}

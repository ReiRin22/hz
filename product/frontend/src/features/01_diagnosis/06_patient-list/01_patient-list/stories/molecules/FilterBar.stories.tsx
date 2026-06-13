import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { FilterBar } from '../../components/molecules/FilterBar';
import type { FilterState, Doctor, Department, ReceptionStats } from '../../types/receptionPatientList.types';

const DOCTORS: Doctor[] = [
  { id: 'doctor1', name: '田中 太郎', departmentIds: ['department1', 'department2'], mainDepartmentId: 'department1' },
  { id: 'doctor2', name: '佐藤 花子', departmentIds: ['department2'], mainDepartmentId: 'department2' },
];

const DEPARTMENTS: Department[] = [
  { id: 'department1', name: '内科' },
  { id: 'department2', name: '外科' },
];

const BASE_FILTERS: FilterState = {
  date: '2026-05-22',
  showCompleted: false,
  showReservations: false,
  doctorIds: ['doctor1'],
  departmentId: 'department1',
};

const DEFAULT_STATS: ReceptionStats = {
  consulted: 5,
  recepted: 12,
  target: 15,
};

const meta = {
  title: '01_diagnosis/06_patient-list/01_patient-list/molecules/FilterBar',
  component: FilterBar,
  tags: ['autodocs'],
  args: {
    onFilterChange: fn(),
    doctors: DOCTORS,
    departments: DEPARTMENTS,
  },
} satisfies Meta<typeof FilterBar>;
export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    filters: BASE_FILTERS,
    stats: DEFAULT_STATS,
  },
};

export const AllDepartments: Story = {
  args: {
    filters: { ...BASE_FILTERS, departmentId: 'all' },
    stats: { consulted: 10, recepted: 22, target: 30 },
  },
};

export const ShowCompleted: Story = {
  args: {
    filters: { ...BASE_FILTERS, showCompleted: true },
    stats: DEFAULT_STATS,
  },
};

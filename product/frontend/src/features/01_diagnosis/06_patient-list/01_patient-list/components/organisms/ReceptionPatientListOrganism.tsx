'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { FilterBar } from '../molecules/FilterBar';
import { PatientList } from '../molecules/PatientList';
import { ja } from '@/shared/i18n/ja';
import type {
  Patient,
  FilterState,
  Doctor,
  Department,
  ReceptionStats,
} from '../../types/receptionPatientList.types';
import { useReceptionPatients } from '../../hooks/useReceptionPatients';

const t = ja.reception.receptionPatientList.receptionPatientListFeature;

// TODO: BFF API 実装後に認証情報から取得する
const CURRENT_USER: Doctor = {
  id: 'doctor1',
  name: '田中 太郎',
  departmentIds: ['department1', 'department2', 'department3'],
  mainDepartmentId: 'department1',
};

// TODO: BFF API 実装後に /api/doctors から取得する
const MOCK_DOCTORS: Doctor[] = [
  { id: 'doctor1', name: '田中 太郎', departmentIds: ['department1', 'department2', 'department3'], mainDepartmentId: 'department1' },
  { id: 'doctor2', name: '佐藤 花子', departmentIds: ['department2'], mainDepartmentId: 'department2' },
  { id: 'doctor3', name: '鈴木 一郎', departmentIds: ['department1'], mainDepartmentId: 'department1' },
  { id: 'doctor4', name: '山田 美咲', departmentIds: ['department3'], mainDepartmentId: 'department3' },
  { id: 'doctor5', name: '高橋 健一', departmentIds: ['department2'], mainDepartmentId: 'department2' },
  { id: 'doctor6', name: '伊藤 さくら', departmentIds: ['department4'], mainDepartmentId: 'department4' },
];

// TODO: BFF API 実装後に /api/departments から取得する
const MOCK_DEPARTMENTS: Department[] = [
  { id: 'department1', name: '内科' },
  { id: 'department2', name: '外科' },
  { id: 'department3', name: '整形外科' },
  { id: 'department4', name: '小児科' },
];

export function ReceptionPatientListOrganism() {
  const router = useRouter();

  const [filters, setFilters] = useState<FilterState>(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return {
      date: today,
      showCompleted: false,
      showReservations: false,
      departmentId: CURRENT_USER.mainDepartmentId,
      doctorIds: [CURRENT_USER.id],
    };
  });

  const { patients, setPatients, isLoading, fetchError } = useReceptionPatients(filters.date);
  const [calledPatients, setCalledPatients] = useState<Set<string>>(new Set());

  const computeStats = useCallback(
    (allPatients: Patient[], currentFilters: FilterState): ReceptionStats => {
      const target = allPatients.filter((p) => {
        if (p.date !== currentFilters.date) return false;
        if (!currentFilters.doctorIds.includes(p.doctorId)) return false;
        if (currentFilters.departmentId !== 'all' && p.departmentId !== currentFilters.departmentId) return false;
        return true;
      });
      return {
        consulted: target.filter((p) => p.status.consultation === true).length,
        recepted: target.filter((p) => !!p.receptionTime && !p.isReservation).length,
        target: target.length,
      };
    },
    []
  );

  const handleCallPatient = (patientId: string) => {
    // TODO: BFF API 実装後に POST /api/reception-patients/:id/call を呼び出す
    setCalledPatients((prev) => new Set(prev).add(patientId));
  };

  const handlePatientClick = (patient: Patient) => {
    router.push(`/karte/${patient.patientId}`);
  };

  const handleCancelConsultation = (patientId: string) => {
    // TODO: BFF API 実装後に PUT /api/reception-patients/:id/cancel-consultation を呼び出す
    setPatients((prev) =>
      prev.map((p) =>
        p.id === patientId
          ? { ...p, status: { ...p.status, consultation: false } }
          : p
      )
    );
  };

  const stats = computeStats(patients, filters);

  if (isLoading) {
    return <div role="status" aria-live="polite">{t.loading}</div>;
  }

  if (fetchError) {
    return <div role="alert" aria-live="assertive" className="text-destructive text-sm p-4">{fetchError}</div>;
  }

  return (
    <>
      <FilterBar
        filters={filters}
        onFilterChange={setFilters}
        doctors={MOCK_DOCTORS}
        departments={MOCK_DEPARTMENTS}
        stats={stats}
      />
      <PatientList
        patients={patients}
        filters={filters}
        calledPatients={calledPatients}
        currentDoctorId={CURRENT_USER.id}
        departments={MOCK_DEPARTMENTS}
        onCallPatient={handleCallPatient}
        onPatientClick={handlePatientClick}
        onCancelConsultation={handleCancelConsultation}
      />
    </>
  );
}

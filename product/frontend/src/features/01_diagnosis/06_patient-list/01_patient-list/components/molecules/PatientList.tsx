'use client';

import { useMemo, useState } from 'react';
import { ChevronUp, ChevronDown, Users } from 'lucide-react';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/shared/components/atoms/alert-dialog';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/components/atoms/tooltip';
import { ja } from '@/shared/i18n/ja';
import type {
  Patient,
  FilterState,
  SortColumn,
  SortDirection,
  Department,
} from '../../types/receptionPatientList.types';

const t = ja.reception.receptionPatientList.patientList;

interface PatientListProps {
  patients: Patient[];
  filters: FilterState;
  calledPatients: Set<string>;
  currentDoctorId: string;
  departments: Department[];
  onCallPatient: (patientId: string) => void;
  onPatientClick: (patient: Patient) => void;
  onCancelConsultation: (patientId: string) => void;
}

function getSortValue(patient: Patient, column: SortColumn, departments: Department[]): string | number {
  switch (column) {
    case 'category': return patient.category;
    case 'type': return patient.type;
    case 'receptionTime': return patient.receptionTime ?? '';
    case 'appointmentSlot': return patient.appointmentSlot ?? '';
    case 'patientId': return patient.patientId;
    case 'name': return patient.name;
    case 'kana': return patient.kana;
    case 'birthDate': return patient.birthDate;
    case 'gender': return patient.gender;
    case 'age': return patient.age;
    case 'department': return departments.find((d) => d.id === patient.departmentId)?.name ?? '';
    case 'medicalCategory': return patient.medicalCategory;
    case 'memo': return patient.memo;
    case 'multiDepartment': return patient.multiDepartment ? 1 : 0;
    case 'remarks': return patient.remarks;
    case 'consultation': return patient.status.consultation === null ? 0 : patient.status.consultation ? 2 : 1;
    case 'prescription': return patient.status.prescription === null ? 0 : patient.status.prescription ? 2 : 1;
    case 'injection': return patient.status.injection === null ? 0 : patient.status.injection ? 2 : 1;
    case 'treatment': return patient.status.treatment === null ? 0 : patient.status.treatment ? 2 : 1;
    case 'specimen': return patient.status.specimen ?? 0;
    case 'bacteria': return patient.status.bacteria ?? 0;
    case 'pathology': return patient.status.pathology ?? 0;
    case 'physiology': return patient.status.physiology === null ? 0 : patient.status.physiology ? 2 : 1;
    case 'endoscopy': return patient.status.endoscopy === null ? 0 : patient.status.endoscopy ? 2 : 1;
    case 'imaging': return patient.status.imaging === null ? 0 : patient.status.imaging ? 2 : 1;
    case 'rehabilitation': return patient.status.rehabilitation === null ? 0 : patient.status.rehabilitation ? 2 : 1;
    case 'dialysis': return patient.status.dialysis === null ? 0 : patient.status.dialysis ? 2 : 1;
    case 'surgery': return patient.status.surgery === null ? 0 : patient.status.surgery ? 2 : 1;
    case 'guidance': return patient.status.guidance === null ? 0 : patient.status.guidance ? 2 : 1;
    case 'paymentComplete': return patient.paymentComplete ? 1 : 0;
    default: return '';
  }
}

type PatientWithDuplicate = Patient & { hasDuplicateName: boolean };

interface SortableHeaderProps {
  column: SortColumn;
  children: React.ReactNode;
  className?: string;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

function SortableHeader({ column, children, className = '', sortColumn, sortDirection, onSort }: SortableHeaderProps) {
  return (
    <th className={`px-3 py-2 text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none ${className}`} onClick={() => onSort(column)}>
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {sortColumn === column &&
          (sortDirection === 'asc' ? (
            <ChevronUp className="w-3 h-3" />
          ) : (
            <ChevronDown className="w-3 h-3" />
          ))}
      </div>
    </th>
  );
}

interface SmallSortableHeaderProps {
  column: SortColumn;
  children: React.ReactNode;
  sortColumn: SortColumn;
  sortDirection: SortDirection;
  onSort: (column: SortColumn) => void;
}

function SmallSortableHeader({ column, children, sortColumn, sortDirection, onSort }: SmallSortableHeaderProps) {
  return (
    <th className="px-1 py-1 text-center text-xs text-gray-600 cursor-pointer hover:bg-gray-100 select-none" onClick={() => onSort(column)}>
      <div className="flex items-center justify-center gap-0.5">
        <span>{children}</span>
        {sortColumn === column &&
          (sortDirection === 'asc' ? (
            <ChevronUp className="w-2 h-2" />
          ) : (
            <ChevronDown className="w-2 h-2" />
          ))}
      </div>
    </th>
  );
}

function renderBoolStatus(status: boolean | null): string {
  if (status === null) return '';
  return status ? '●' : '○';
}

function renderSpecimenStatus(status: number | null): string {
  if (status === null || status === 0) return '';
  if (status === 1) return '○';
  if (status === 2) return '△';
  return '●';
}

function formatBirthDate(birthDate: string): string {
  return birthDate.replace(/-/g, '/');
}

export function PatientList({
  patients,
  filters,
  calledPatients,
  currentDoctorId,
  departments,
  onCallPatient,
  onPatientClick,
  onCancelConsultation,
}: PatientListProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn>('appointmentSlot');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [cancelDialogPatient, setCancelDialogPatient] = useState<Patient | null>(null);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const filteredPatients = useMemo((): PatientWithDuplicate[] => {
    const filtered = patients.filter((patient) => {
      if (patient.date !== filters.date) return false;
      if (!filters.doctorIds.includes(patient.doctorId)) return false;
      if (filters.departmentId !== 'all' && patient.departmentId !== filters.departmentId) return false;
      if (!filters.showCompleted && patient.status.consultation === true) return false;
      if (!filters.showReservations && patient.isReservation) return false;
      return true;
    });

    const nameCountMap = new Map<string, number>();
    filtered.forEach((p) => nameCountMap.set(p.name, (nameCountMap.get(p.name) ?? 0) + 1));

    const withDuplicateFlag = filtered.map((p) => ({
      ...p,
      hasDuplicateName: (nameCountMap.get(p.name) ?? 0) > 1,
    }));

    return withDuplicateFlag.sort((a, b) => {
      if (sortColumn === 'appointmentSlot') {
        const aSlot = a.appointmentSlot ?? '';
        const bSlot = b.appointmentSlot ?? '';
        if (!aSlot && !bSlot) return 0;
        if (!aSlot) return 1;
        if (!bSlot) return -1;
        const aTime = aSlot.split('-')[0] ?? '';
        const bTime = bSlot.split('-')[0] ?? '';
        if (aTime !== bTime) {
          const cmp = aTime.localeCompare(bTime);
          return sortDirection === 'asc' ? cmp : -cmp;
        }
        const aOrder = parseInt(aSlot.split('-')[1] ?? '0');
        const bOrder = parseInt(bSlot.split('-')[1] ?? '0');
        const cmp = aOrder - bOrder;
        return sortDirection === 'asc' ? cmp : -cmp;
      }

      const aVal = getSortValue(a, sortColumn, departments);
      const bVal = getSortValue(b, sortColumn, departments);
      if (aVal === '' && bVal === '') return 0;
      if (aVal === '') return 1;
      if (bVal === '') return -1;
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortDirection === 'asc' ? aVal - bVal : bVal - aVal;
      }
      const cmp = String(aVal).localeCompare(String(bVal), 'ja');
      return sortDirection === 'asc' ? cmp : -cmp;
    });
  }, [patients, filters, sortColumn, sortDirection, departments]);

  const handleConsultationClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    if (
      patient.status.consultation === true &&
      patient.doctorId === currentDoctorId &&
      !patient.paymentComplete
    ) {
      setCancelDialogPatient(patient);
    }
  };

  const handleConsultationKeyDown = (e: React.KeyboardEvent, patient: Patient) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.stopPropagation();
      if (
        patient.status.consultation === true &&
        patient.doctorId === currentDoctorId &&
        !patient.paymentComplete
      ) {
        setCancelDialogPatient(patient);
      }
    }
  };

  const confirmCancelConsultation = () => {
    if (cancelDialogPatient) {
      onCancelConsultation(cancelDialogPatient.id);
      toast.success(t.cancelSuccessToast(cancelDialogPatient.name));
      setCancelDialogPatient(null);
    }
  };

  return (
    <TooltipProvider>
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <SortableHeader column="category" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.category}</SortableHeader>
                <SortableHeader column="type" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.type}</SortableHeader>
                <SortableHeader column="receptionTime" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.receptionTime}</SortableHeader>
                <SortableHeader column="appointmentSlot" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.appointmentSlot}</SortableHeader>
                <th className="px-3 py-2 text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none text-center">{t.columns.callBtn}</th>
                <SortableHeader column="patientId" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.patientId}</SortableHeader>
                <SortableHeader column="name" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 flex-shrink-0" />
                    <span>{t.columns.name}</span>
                  </div>
                </SortableHeader>
                <SortableHeader column="kana" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.kana}</SortableHeader>
                <SortableHeader column="gender" className="text-center" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.gender}</SortableHeader>
                <SortableHeader column="birthDate" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.birthDate}</SortableHeader>
                <SortableHeader column="age" className="text-right" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.age}</SortableHeader>
                <SortableHeader column="department" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.department}</SortableHeader>
                <SortableHeader column="medicalCategory" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.medicalCategory}</SortableHeader>
                <SortableHeader column="memo" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.memo}</SortableHeader>
                <SortableHeader column="multiDepartment" className="text-center" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.multiDepartment}</SortableHeader>
                <SortableHeader column="remarks" className="text-left" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.remarks}</SortableHeader>
                <SmallSortableHeader column="consultation" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.consultation}</SmallSortableHeader>
                <SmallSortableHeader column="prescription" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.prescription}</SmallSortableHeader>
                <SmallSortableHeader column="injection" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.injection}</SmallSortableHeader>
                <SmallSortableHeader column="treatment" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.treatment}</SmallSortableHeader>
                <SmallSortableHeader column="specimen" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.specimen}</SmallSortableHeader>
                <SmallSortableHeader column="bacteria" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.bacteria}</SmallSortableHeader>
                <SmallSortableHeader column="pathology" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.pathology}</SmallSortableHeader>
                <SmallSortableHeader column="physiology" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.physiology}</SmallSortableHeader>
                <SmallSortableHeader column="endoscopy" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.endoscopy}</SmallSortableHeader>
                <SmallSortableHeader column="imaging" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.imaging}</SmallSortableHeader>
                <SmallSortableHeader column="rehabilitation" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.rehabilitation}</SmallSortableHeader>
                <SmallSortableHeader column="dialysis" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.dialysis}</SmallSortableHeader>
                <SmallSortableHeader column="surgery" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.surgery}</SmallSortableHeader>
                <SmallSortableHeader column="guidance" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.guidance}</SmallSortableHeader>
                <SortableHeader column="paymentComplete" className="text-center" sortColumn={sortColumn} sortDirection={sortDirection} onSort={handleSort}>{t.columns.paymentComplete}</SortableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={31} className="px-3 py-8 text-center text-gray-500">
                    {t.noData}
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => {
                  const isReservationOnly = patient.isReservation && !patient.receptionTime;
                  const rowClass = [
                    'border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors',
                    patient.status.consultation === true ? 'bg-gray-50 text-gray-500' : '',
                    calledPatients.has(patient.id) ? 'bg-yellow-50' : '',
                    patient.hasDuplicateName ? 'bg-orange-50' : '',
                  ]
                    .filter(Boolean)
                    .join(' ');

                  const reservationTextClass = isReservationOnly ? 'text-orange-600' : '';

                  const isCancelable =
                    patient.status.consultation === true &&
                    patient.doctorId === currentDoctorId &&
                    !patient.paymentComplete;

                  return (
                    <tr
                      key={patient.id}
                      className={rowClass}
                      tabIndex={0}
                      onDoubleClick={() => onPatientClick(patient)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') onPatientClick(patient);
                      }}
                    >
                      <td className="px-3 py-2 whitespace-nowrap">{patient.category}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {!patient.isReservation && patient.receptionTime ? patient.type : ''}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{patient.receptionTime}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{patient.appointmentSlot}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        {patient.receptionTime && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onCallPatient(patient.id);
                            }}
                            className={
                              calledPatients.has(patient.id)
                                ? 'px-2 py-1 text-xs rounded border transition-colors bg-blue-100 text-blue-700 border-blue-300'
                                : 'px-2 py-1 text-xs rounded border transition-colors bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                            }
                            title={t.callBtnLabel}
                          >
                            {t.callBtnLabel}
                          </button>
                        )}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${reservationTextClass}`}>
                        {patient.patientId}
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${reservationTextClass}`}>
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 flex-shrink-0">
                            {patient.hasDuplicateName && (
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Users className="w-4 h-4 text-orange-600" />
                                </TooltipTrigger>
                                <TooltipContent>
                                  <p>{t.duplicateNameTooltip}</p>
                                </TooltipContent>
                              </Tooltip>
                            )}
                          </div>
                          <span>{patient.name}</span>
                        </div>
                      </td>
                      <td className={`px-3 py-2 whitespace-nowrap ${reservationTextClass}`}>
                        {patient.kana}
                      </td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">{patient.gender}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{formatBirthDate(patient.birthDate)}</td>
                      <td className="px-3 py-2 text-right whitespace-nowrap">{patient.age}</td>
                      <td className="px-3 py-2 whitespace-nowrap">
                        {departments.find((d) => d.id === patient.departmentId)?.name ?? ''}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{patient.medicalCategory}</td>
                      <td className="px-3 py-2 whitespace-nowrap">{patient.memo}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        {patient.multiDepartment ? t.multiDepartmentYes : ''}
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">{patient.remarks}</td>
                      <td
                        className={
                          isCancelable
                            ? 'px-1 py-2 text-center cursor-pointer hover:bg-red-100'
                            : 'px-1 py-2 text-center'
                        }
                        onClick={(e) => handleConsultationClick(e, patient)}
                        onKeyDown={(e) => handleConsultationKeyDown(e, patient)}
                        tabIndex={isCancelable ? 0 : undefined}
                        title={isCancelable ? t.cancelConsultationTitle : undefined}
                      >
                        {renderBoolStatus(patient.status.consultation)}
                      </td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.prescription)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.injection)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.treatment)}</td>
                      <td className="px-1 py-2 text-center">{renderSpecimenStatus(patient.status.specimen)}</td>
                      <td className="px-1 py-2 text-center">{renderSpecimenStatus(patient.status.bacteria)}</td>
                      <td className="px-1 py-2 text-center">{renderSpecimenStatus(patient.status.pathology)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.physiology)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.endoscopy)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.imaging)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.rehabilitation)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.dialysis)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.surgery)}</td>
                      <td className="px-1 py-2 text-center">{renderBoolStatus(patient.status.guidance)}</td>
                      <td className="px-3 py-2 text-center whitespace-nowrap">
                        {patient.paymentComplete ? t.paymentDone : ''}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog
        open={!!cancelDialogPatient}
        onOpenChange={(open) => !open && setCancelDialogPatient(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.cancelConsultationTitle}</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelDialogPatient && t.cancelConsultationDesc(cancelDialogPatient.name)}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancelBtn}</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelConsultation}>
              {t.confirmCancelBtn}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}

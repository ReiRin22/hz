'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { format, parseISO } from 'date-fns';
import { ja as jaLocale } from 'date-fns/locale';
import { ja } from '@/shared/i18n/ja';
import type { FilterState, Doctor, Department, ReceptionStats } from '../../types/receptionPatientList.types';

const t = ja.reception.receptionPatientList.filterBar;

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  doctors: Doctor[];
  departments: Department[];
  stats: ReceptionStats;
}

export function FilterBar({ filters, onFilterChange, doctors, departments, stats }: FilterBarProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [showDepartmentList, setShowDepartmentList] = useState(false);
  const doctorRef = useRef<HTMLDivElement>(null);
  const departmentRef = useRef<HTMLDivElement>(null);

  const availableDoctors =
    filters.departmentId === 'all'
      ? doctors
      : doctors.filter((d) => d.departmentIds.includes(filters.departmentId));

  const selectedDepartment = departments.find((d) => d.id === filters.departmentId);

  const getSelectedDoctorsDisplay = () => {
    if (filters.doctorIds.length === 0) return '未選択';
    return filters.doctorIds
      .map((id) => doctors.find((d) => d.id === id)?.name)
      .filter(Boolean)
      .join('、');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (doctorRef.current && !doctorRef.current.contains(event.target as Node)) {
        setShowDoctorList(false);
      }
      if (departmentRef.current && !departmentRef.current.contains(event.target as Node)) {
        setShowDepartmentList(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onFilterChange({ ...filters, date: format(date, 'yyyy-MM-dd') });
      setShowCalendar(false);
    }
  };

  const handleDoctorToggle = (doctorId: string) => {
    const newDoctorIds = filters.doctorIds.includes(doctorId)
      ? filters.doctorIds.filter((id) => id !== doctorId)
      : [...filters.doctorIds, doctorId];
    if (newDoctorIds.length === 0) return;
    onFilterChange({ ...filters, doctorIds: newDoctorIds });
  };

  const handleDepartmentSelect = (departmentId: string) => {
    onFilterChange({ ...filters, departmentId });
    setShowDepartmentList(false);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* 診察日 */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">{t.dateLabel}</label>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm">
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span>{format(parseISO(filters.date), 'yyyy/MM/dd')}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={parseISO(filters.date)}
                onSelect={handleDateSelect}
                locale={jaLocale}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 診察済含む */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={(e) => onFilterChange({ ...filters, showCompleted: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{t.showCompletedLabel}</span>
          </label>
        </div>

        {/* 予約含む */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showReservations}
              onChange={(e) => onFilterChange({ ...filters, showReservations: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">{t.showReservationsLabel}</span>
          </label>
        </div>

        {/* 診療科 */}
        <div className="relative flex items-center gap-2" ref={departmentRef}>
          <label className="text-sm text-gray-700">{t.departmentLabel}</label>
          <button
            onClick={() => setShowDepartmentList(!showDepartmentList)}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
          >
            <span className="flex-1 text-left">
              {filters.departmentId === 'all' ? t.departmentAll : selectedDepartment?.name}
            </span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showDepartmentList && (
            <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 right-0">
              <button
                onClick={() => handleDepartmentSelect('all')}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 whitespace-nowrap text-sm ${
                  filters.departmentId === 'all' ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                {t.departmentAll}
              </button>
              {departments.map((department) => (
                <button
                  key={department.id}
                  onClick={() => handleDepartmentSelect(department.id)}
                  className={`w-full text-left px-3 py-2 hover:bg-gray-50 whitespace-nowrap text-sm ${
                    department.id === filters.departmentId ? 'bg-blue-50 text-blue-700' : ''
                  }`}
                >
                  {department.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* 診察医 */}
        <div className="relative flex items-center gap-2" ref={doctorRef}>
          <label className="text-sm text-gray-700">{t.doctorLabel}</label>
          <button
            onClick={() => setShowDoctorList(!showDoctorList)}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm min-w-[120px]"
          >
            <span className="flex-1 text-left">{getSelectedDoctorsDisplay()}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showDoctorList && (
            <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[180px] right-0">
              {availableDoctors.map((doctor) => (
                <label
                  key={doctor.id}
                  className={`flex items-center gap-2 px-3 py-2 hover:bg-gray-50 cursor-pointer text-sm ${
                    filters.doctorIds.includes(doctor.id) ? 'bg-blue-50' : ''
                  }`}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={filters.doctorIds.includes(doctor.id)}
                    onChange={() => handleDoctorToggle(doctor.id)}
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className={filters.doctorIds.includes(doctor.id) ? 'text-blue-700' : ''}>
                    {doctor.name}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* 統計 */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-sm text-gray-900">
            {t.statsConsultedLabel}:{' '}
            <span className="font-medium">{stats.consulted}</span>
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-900">
            {t.statsReceptedLabel}:{' '}
            <span className="font-medium">{stats.recepted}</span>
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-900">
            {t.statsTargetLabel}:{' '}
            <span className="font-medium">{stats.target}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

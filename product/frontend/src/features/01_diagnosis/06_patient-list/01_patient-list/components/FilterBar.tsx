import React, { useState, useRef, useEffect } from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import { FilterState, Patient, currentUser } from '../REC020';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { format } from 'date-fns';
import { ja } from 'date-fns/locale';

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  patients: Patient[];
}

const doctors = [
  { id: 'doctor1', name: '田中 太郎', departmentIds: ['department1', 'department2', 'department3'], mainDepartmentId: 'department1' },
  { id: 'doctor2', name: '佐藤 花子', departmentIds: ['department2'], mainDepartmentId: 'department2' },
  { id: 'doctor3', name: '鈴木 一郎', departmentIds: ['department1'], mainDepartmentId: 'department1' },
  { id: 'doctor4', name: '山田 美咲', departmentIds: ['department3'], mainDepartmentId: 'department3' },
  { id: 'doctor5', name: '高橋 健一', departmentIds: ['department2'], mainDepartmentId: 'department2' },
  { id: 'doctor6', name: '伊藤 さくら', departmentIds: ['department4'], mainDepartmentId: 'department4' },
];

const departments = [
  { id: 'department1', name: '内科' },
  { id: 'department2', name: '外科' },
  { id: 'department3', name: '整形外科' },
  { id: 'department4', name: '小児科' },
];

export function FilterBar({ filters, onFilterChange, patients }: FilterBarProps) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDoctorList, setShowDoctorList] = useState(false);
  const [showDepartmentList, setShowDepartmentList] = useState(false);
  const doctorRef = useRef<HTMLDivElement>(null);
  const departmentRef = useRef<HTMLDivElement>(null);
  
  // 診療科が「全て」の場合は全医師、そうでなければ選択された診療科の医師のみ
  const availableDoctors = filters.departmentId === 'all' 
    ? doctors 
    : doctors.filter(d => d.departmentIds.includes(filters.departmentId));

  const selectedDepartment = departments.find(d => d.id === filters.departmentId);
  
  // 選択中の医師名を表示用に取得
  const getSelectedDoctorsDisplay = () => {
    if (filters.doctorIds.length === 0) return '未選択';
    const selectedNames = filters.doctorIds
      .map(id => doctors.find(d => d.id === id)?.name)
      .filter(Boolean);
    return selectedNames.join('、');
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
      const formattedDate = format(date, 'yyyy-MM-dd');
      onFilterChange({ ...filters, date: formattedDate });
      setShowCalendar(false);
    }
  };

  const handleDoctorToggle = (doctorId: string) => {
    const newDoctorIds = filters.doctorIds.includes(doctorId)
      ? filters.doctorIds.filter(id => id !== doctorId)
      : [...filters.doctorIds, doctorId];
    
    // 最低1人は選択されている必要がある
    if (newDoctorIds.length === 0) return;
    
    onFilterChange({ ...filters, doctorIds: newDoctorIds });
  };

  const handleDepartmentSelect = (departmentId: string) => {
    onFilterChange({ 
      ...filters, 
      departmentId
    });
    setShowDepartmentList(false);
  };

  // 患者数の統計を計算
  const todayPatients = patients.filter(p => {
    // 日付フィルタ
    if (p.date !== filters.date) return false;
    
    // 診察医フィルタ（複数医師対応）
    if (!filters.doctorIds.includes(p.doctorId)) return false;
    
    // 診療科フィルタ（「全て」の場合はスキップ）
    if (filters.departmentId !== 'all' && p.departmentId !== filters.departmentId) return false;
    
    return true;
  });
  
  const completedCount = todayPatients.filter(p => p.status.consultation === true).length;
  const receivedCount = todayPatients.filter(p => p.receptionTime && !p.isReservation).length;
  const totalCount = todayPatients.length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-4">
      <div className="flex flex-wrap gap-4 items-center">
        {/* 診察日 */}
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-700">診察日</label>
          <Popover open={showCalendar} onOpenChange={setShowCalendar}>
            <PopoverTrigger asChild>
              <button
                className="flex items-center gap-2 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
              >
                <CalendarIcon className="w-4 h-4 text-gray-500" />
                <span>
                  {format(new Date(filters.date), 'yyyy/MM/dd')}
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={new Date(filters.date)}
                onSelect={handleDateSelect}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* 診察済 */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showCompleted}
              onChange={(e) => onFilterChange({ ...filters, showCompleted: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">診察済含む</span>
          </label>
        </div>

        {/* 予約 */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={filters.showReservations}
              onChange={(e) => onFilterChange({ ...filters, showReservations: e.target.checked })}
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm">予約含む</span>
          </label>
        </div>

        {/* 診療科 */}
        <div className="relative flex items-center gap-2" ref={departmentRef}>
          <label className="text-sm text-gray-700">診療科</label>
          <button
            onClick={() => setShowDepartmentList(!showDepartmentList)}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm"
          >
            <span className="flex-1 text-left">{filters.departmentId === 'all' ? 'すべて' : selectedDepartment?.name}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showDepartmentList && (
            <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10"
              style={{ left: 'auto', right: 0 }}
            >
              <button
                onClick={() => handleDepartmentSelect('all')}
                className={`w-full text-left px-3 py-2 hover:bg-gray-50 whitespace-nowrap text-sm ${
                  filters.departmentId === 'all' ? 'bg-blue-50 text-blue-700' : ''
                }`}
              >
                すべて
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
          <label className="text-sm text-gray-700">診察医</label>
          <button
            onClick={() => setShowDoctorList(!showDoctorList)}
            className="flex items-center gap-1 px-2 py-1 border border-gray-300 rounded-md bg-white hover:bg-gray-50 text-sm min-w-[120px]"
          >
            <span className="flex-1 text-left">{getSelectedDoctorsDisplay()}</span>
            <ChevronDown className="w-4 h-4 text-gray-500" />
          </button>
          {showDoctorList && (
            <div className="absolute top-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-10 min-w-[180px]"
              style={{ left: 'auto', right: 0 }}
            >
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

        {/* 患者数統計 */}
        <div className="ml-auto flex items-center gap-2 px-3 py-1 bg-gray-50 rounded-md border border-gray-200">
          <span className="text-sm text-gray-900">
            診察済み患者: <span className="font-medium">{completedCount}</span>
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-900">
            受付済み患者: <span className="font-medium">{receivedCount}</span>
          </span>
          <span className="text-gray-400">/</span>
          <span className="text-sm text-gray-900">
            当日対象: <span className="font-medium">{totalCount}</span>
          </span>
        </div>
      </div>
    </div>
  );
}
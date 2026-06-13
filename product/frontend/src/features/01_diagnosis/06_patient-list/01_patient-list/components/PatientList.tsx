import React, { useMemo, useState } from 'react';
import { Patient, FilterState, currentUser } from '../REC020';
import { ChevronUp, ChevronDown, Users } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/components/atoms/tooltip';
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
import { toast } from 'sonner';

interface PatientListProps {
  patients: Patient[];
  filters: FilterState;
  calledPatients: Set<string>;
  onCallPatient: (patientId: string) => void;
  onPatientClick: (patient: Patient) => void;
  onCancelConsultation: (patientId: string) => void;
}

const departments = [
  { id: 'department1', name: '内科' },
  { id: 'department2', name: '外科' },
  { id: 'department3', name: '整形外科' },
  { id: 'department4', name: '小児科' },
];

type SortColumn = 
  | 'category' | 'type' | 'receptionTime' | 'appointmentSlot' 
  | 'patientId' | 'name' | 'kana' | 'birthDate' | 'gender' | 'age' 
  | 'department' | 'medicalCategory' | 'memo' | 'multiDepartment' | 'remarks'
  | 'consultation' | 'prescription' | 'injection' | 'treatment'
  | 'specimen' | 'bacteria' | 'pathology' | 'physiology'
  | 'endoscopy' | 'imaging' | 'rehabilitation' | 'dialysis'
  | 'surgery' | 'guidance' | 'paymentComplete';

type SortDirection = 'asc' | 'desc';

export function PatientList({ patients, filters, calledPatients, onCallPatient, onPatientClick, onCancelConsultation }: PatientListProps) {
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

  const getSortValue = (patient: Patient, column: SortColumn): any => {
    switch (column) {
      case 'category': return patient.category;
      case 'type': return patient.type;
      case 'receptionTime': return patient.receptionTime || '';
      case 'appointmentSlot': return patient.appointmentSlot || '';
      case 'patientId': return patient.patientId;
      case 'name': return patient.name;
      case 'kana': return patient.kana;
      case 'birthDate': return patient.birthDate;
      case 'gender': return patient.gender;
      case 'age': return patient.age;
      case 'department': return departments.find(d => d.id === patient.departmentId)?.name || '';
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
  };

  const filteredPatients = useMemo(() => {
    const filtered = patients.filter(patient => {
      // 日付フィルタ
      if (patient.date !== filters.date) return false;
      
      // 診察医フィルタ（複数医師対応）
      if (!filters.doctorIds.includes(patient.doctorId)) return false;
      
      // 診療科フィルタ（「全て」の場合はスキップ）
      if (filters.departmentId !== 'all' && patient.departmentId !== filters.departmentId) return false;
      
      // 診察済みフィルタ（診察ステータスが●の場合）
      if (!filters.showCompleted && patient.status.consultation === true) return false;
      
      // 予約フィルタ（未受付の予約患者）
      if (!filters.showReservations && patient.isReservation) return false;
      
      return true;
    });

    // 同姓同名患者を検出するマップを作成
    const nameCountMap = new Map<string, number>();
    filtered.forEach(patient => {
      const count = nameCountMap.get(patient.name) || 0;
      nameCountMap.set(patient.name, count + 1);
    });

    // 同姓同名フラグを持つデータを返す
    const patientsWithDuplicateFlag = filtered.map(patient => ({
      ...patient,
      hasDuplicateName: (nameCountMap.get(patient.name) || 0) > 1
    }));

    // ソート処理
    return patientsWithDuplicateFlag.sort((a, b) => {
      let aValue = getSortValue(a, sortColumn);
      let bValue = getSortValue(b, sortColumn);

      // 予約時間の特別処理
      if (sortColumn === 'appointmentSlot') {
        const aAppointment = a.appointmentSlot || '';
        const bAppointment = b.appointmentSlot || '';
        
        if (!aAppointment && !bAppointment) return 0;
        if (!aAppointment) return 1;
        if (!bAppointment) return -1;
        
        const aTime = aAppointment.split('-')[0];
        const bTime = bAppointment.split('-')[0];
        
        if (aTime !== bTime) {
          const comparison = aTime.localeCompare(bTime);
          return sortDirection === 'asc' ? comparison : -comparison;
        }
        
        const aOrder = parseInt(aAppointment.split('-')[1] || '0');
        const bOrder = parseInt(bAppointment.split('-')[1] || '0');
        const comparison = aOrder - bOrder;
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // 空文字列の処理
      if (aValue === '' && bValue === '') return 0;
      if (aValue === '') return 1;
      if (bValue === '') return -1;

      // 数値の比較
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        const comparison = aValue - bValue;
        return sortDirection === 'asc' ? comparison : -comparison;
      }

      // 文字列の比較
      const comparison = String(aValue).localeCompare(String(bValue), 'ja');
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [patients, filters, sortColumn, sortDirection]);

  const renderStatusIcon = (status: boolean | null) => {
    if (status === null) return ''; // オーダーなし
    if (status === false) return '○'; // オーダーあり・未実施
    return '●'; // 実施済
  };

  const renderTestStatusIcon = (status: number | null) => {
    if (status === null || status === 0) return ''; // オーダーなし
    if (status === 1) return '○'; // オーダーあり・未実施
    if (status === 2) return '△'; // 検査中
    return '●'; // 実施済
  };

  const formatBirthDate = (birthDate: string) => {
    // YYYY-MM-DD形式をYYYY/MM/DD形式に変換
    return birthDate.replace(/-/g, '/');
  };

  const SortableHeader = ({ column, children, className = '' }: { column: SortColumn; children: React.ReactNode; className?: string }) => (
    <th
      className={`px-3 py-2 text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none ${className}`}
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center gap-1">
        <span>{children}</span>
        {sortColumn === column && (
          sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
        )}
      </div>
    </th>
  );

  const SmallSortableHeader = ({ column, children }: { column: SortColumn; children: React.ReactNode }) => (
    <th
      className="px-1 py-1 text-center text-xs text-gray-600 cursor-pointer hover:bg-gray-100 select-none"
      onClick={() => handleSort(column)}
    >
      <div className="flex items-center justify-center gap-0.5">
        <span>{children}</span>
        {sortColumn === column && (
          sortDirection === 'asc' ? <ChevronUp className="w-2 h-2" /> : <ChevronDown className="w-2 h-2" />
        )}
      </div>
    </th>
  );

  // 診察終了取り消し処理
  const handleConsultationClick = (e: React.MouseEvent, patient: Patient) => {
    e.stopPropagation();
    
    // 診察済み（●）で、かつログイン中の医師が診察医で、かつ会計未完了の場合のみ
    if (patient.status.consultation === true && 
        patient.doctorId === currentUser.doctorId &&
        !patient.paymentComplete) {
      setCancelDialogPatient(patient);
    }
  };

  const confirmCancelConsultation = () => {
    if (cancelDialogPatient) {
      onCancelConsultation(cancelDialogPatient.id);
      toast.success(`${cancelDialogPatient.name}さんの診察終了を取り消しました`);
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
                <SortableHeader column="category" className="text-left">区分</SortableHeader>
                <SortableHeader column="type" className="text-left">種別</SortableHeader>
                <SortableHeader column="receptionTime" className="text-left">受付時間</SortableHeader>
                <SortableHeader column="appointmentSlot" className="text-left">予約時間</SortableHeader>
                <th className="px-3 py-2 text-center text-gray-700 whitespace-nowrap">呼出</th>
                <SortableHeader column="patientId" className="text-left">ID</SortableHeader>
                <th
                  className="px-3 py-2 text-left text-gray-700 whitespace-nowrap cursor-pointer hover:bg-gray-100 select-none"
                  onClick={() => handleSort('name')}
                >
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 flex-shrink-0"></div>
                      <span>氏名</span>
                    </div>
                    {sortColumn === 'name' && (
                      sortDirection === 'asc' ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />
                    )}
                  </div>
                </th>
                <SortableHeader column="kana" className="text-left">カナ</SortableHeader>
                <SortableHeader column="gender" className="text-center">性別</SortableHeader>
                <SortableHeader column="birthDate" className="text-left">生年月日</SortableHeader>
                <SortableHeader column="age" className="text-right">年齢</SortableHeader>
                <SortableHeader column="department" className="text-left">診療科</SortableHeader>
                <SortableHeader column="medicalCategory" className="text-left">診療区分</SortableHeader>
                <SortableHeader column="memo" className="text-left">診療メモ</SortableHeader>
                <SortableHeader column="multiDepartment" className="text-center">併科</SortableHeader>
                <SortableHeader column="remarks" className="text-left">備考</SortableHeader>
                <SmallSortableHeader column="consultation">診察</SmallSortableHeader>
                <SmallSortableHeader column="prescription">処方</SmallSortableHeader>
                <SmallSortableHeader column="injection">注射</SmallSortableHeader>
                <SmallSortableHeader column="treatment">処置</SmallSortableHeader>
                <SmallSortableHeader column="specimen">検体</SmallSortableHeader>
                <SmallSortableHeader column="bacteria">細菌</SmallSortableHeader>
                <SmallSortableHeader column="pathology">病理</SmallSortableHeader>
                <SmallSortableHeader column="physiology">生理</SmallSortableHeader>
                <SmallSortableHeader column="endoscopy">内視</SmallSortableHeader>
                <SmallSortableHeader column="imaging">画像</SmallSortableHeader>
                <SmallSortableHeader column="rehabilitation">リハ</SmallSortableHeader>
                <SmallSortableHeader column="dialysis">透析</SmallSortableHeader>
                <SmallSortableHeader column="surgery">手術</SmallSortableHeader>
                <SmallSortableHeader column="guidance">指導</SmallSortableHeader>
                <SortableHeader column="paymentComplete" className="text-center">会計</SortableHeader>
              </tr>
            </thead>
            <tbody>
              {filteredPatients.length === 0 ? (
                <tr>
                  <td colSpan={31} className="px-3 py-8 text-center text-gray-500">
                    該当する患者がいません
                  </td>
                </tr>
              ) : (
                filteredPatients.map((patient) => (
                  <tr 
                    key={patient.id}
                    className={`border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                      patient.status.consultation === true ? 'bg-gray-50 text-gray-500' : ''
                    } ${calledPatients.has(patient.id) ? 'bg-yellow-50' : ''} ${
                      patient.hasDuplicateName ? 'bg-orange-50' : ''
                    }`}
                    onClick={() => onPatientClick(patient)}
                  >
                    <td className="px-3 py-2 whitespace-nowrap">{patient.category}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {!patient.isReservation && patient.receptionTime ? patient.type : ''}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{patient.receptionTime}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{patient.appointmentSlot}</td>
                    <td className="px-3 py-2 text-center">
                      {patient.receptionTime && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onCallPatient(patient.id);
                          }}
                          className={`px-2 py-1 text-xs rounded border transition-colors ${
                            calledPatients.has(patient.id) 
                              ? 'bg-blue-100 text-blue-700 border-blue-300' 
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                          title="患者を呼び出す"
                        >
                          呼出
                        </button>
                      )}
                    </td>
                    <td className={`px-3 py-2 whitespace-nowrap ${
                      patient.isReservation && !patient.receptionTime ? 'text-orange-600' : ''
                    }`}>{patient.patientId}</td>
                    <td className={`px-3 py-2 whitespace-nowrap ${
                      patient.isReservation && !patient.receptionTime ? 'text-orange-600' : ''
                    }`}>
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 flex-shrink-0">
                          {patient.hasDuplicateName && (
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Users 
                                  className="w-4 h-4 text-orange-600" 
                                />
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>同姓同名の患者がいます</p>
                              </TooltipContent>
                            </Tooltip>
                          )}
                        </div>
                        <span>{patient.name}</span>
                      </div>
                    </td>
                    <td className={`px-3 py-2 whitespace-nowrap ${
                      patient.isReservation && !patient.receptionTime ? 'text-orange-600' : ''
                    }`}>{patient.kana}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">{patient.gender}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{formatBirthDate(patient.birthDate)}</td>
                    <td className="px-3 py-2 text-right whitespace-nowrap">{patient.age}</td>
                    <td className="px-3 py-2 whitespace-nowrap">
                      {departments.find(d => d.id === patient.departmentId)?.name || ''}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{patient.medicalCategory}</td>
                    <td className="px-3 py-2 whitespace-nowrap">{patient.memo}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {patient.multiDepartment ? '有' : ''}
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap">{patient.remarks}</td>
                    <td 
                      className={`px-1 py-2 text-center ${
                        patient.status.consultation === true && 
                        patient.doctorId === currentUser.doctorId &&
                        !patient.paymentComplete
                          ? 'cursor-pointer hover:bg-red-100'
                          : ''
                      }`}
                      onClick={(e) => handleConsultationClick(e, patient)}
                      title={
                        patient.status.consultation === true && 
                        patient.doctorId === currentUser.doctorId &&
                        !patient.paymentComplete
                          ? '診察終了を取り消す'
                          : ''
                      }
                    >
                      {patient.status.consultation === null ? '' : patient.status.consultation ? '●' : '○'}
                    </td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.prescription)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.injection)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.treatment)}</td>
                    <td className="px-1 py-2 text-center">{renderTestStatusIcon(patient.status.specimen)}</td>
                    <td className="px-1 py-2 text-center">{renderTestStatusIcon(patient.status.bacteria)}</td>
                    <td className="px-1 py-2 text-center">{renderTestStatusIcon(patient.status.pathology)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.physiology)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.endoscopy)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.imaging)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.rehabilitation)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.dialysis)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.surgery)}</td>
                    <td className="px-1 py-2 text-center">{renderStatusIcon(patient.status.guidance)}</td>
                    <td className="px-3 py-2 text-center whitespace-nowrap">
                      {patient.paymentComplete ? '済' : ''}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <AlertDialog open={!!cancelDialogPatient} onOpenChange={(open) => !open && setCancelDialogPatient(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>診察終了を取り消しますか？</AlertDialogTitle>
            <AlertDialogDescription>
              {cancelDialogPatient?.name}さんの診察終了を取り消し、未実施（○）に戻します。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>キャンセル</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancelConsultation}>取り消す</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </TooltipProvider>
  );
}
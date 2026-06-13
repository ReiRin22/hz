import { Button } from '@shared/components/atoms/button';
import { Badge } from '@shared/components/atoms/badge';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/atoms/table';
import { CalendarIcon, Plus, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import { useState } from 'react';

interface TreatmentStatus {
  consultation: boolean;
  prescription: boolean;
  injection: boolean;
  treatment: boolean;
  specimen: boolean;
  physiology: boolean;
  endoscopy: boolean;
  imaging: boolean;
  rehabilitation: boolean;
  surgery: boolean;
  guidance: boolean;
  hospitalization: boolean;
}

interface MedicalAppointment {
  id: string;
  patientName: string;
  nameKana: string;
  patientNo: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  department: string;
  doctor: string;
  medicalMemo: string;
  multiDepartment: string;
  remarks: string;
  medicalHistory: string;
  status: '予約済' | '未予約' | '受付待ち' | '受付済';
  dailyMemo: string;
  treatmentStatus: TreatmentStatus;
  birthDate: string;
  phone1: string;
  phone2: string;
  phone3: string;
  slotNotReserved?: boolean; // 枠未取得フラグ
  consultationType?: '初診' | '再診'; // 診療区分
  medicalCategory?: string; // 診療区分（予約推薦、急患など）
  reservationComment?: string; // 予約コメント
}

interface ExamAppointment {
  id: string;
  patientName: string;
  nameKana: string;
  patientNo: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  examType: string;
  doctor: string;
  multiDepartment: string;
  remarks: string;
  medicalHistory: string;
  status: '予約済' | '未予約' | '受付待ち' | '受付済';
  dailyMemo: string;
  treatmentStatus: TreatmentStatus;
  birthDate: string;
  phone1: string;
  phone2: string;
  phone3: string;
}

interface UnifiedAppointment {
  id: string;
  patientName: string;
  nameKana: string;
  patientNo: string;
  age: number;
  gender: string;
  date: string;
  time: string;
  type: '診療のみ' | '検査のみ' | '診療かつ検査';
  medicalInfo?: {
    id: string;
    department: string;
    doctor: string;
    status: string;
    medicalMemo: string;
    slotNotReserved?: boolean; // 枠未取得フラグ
    consultationType?: '初診' | '再診'; // 診療区分
    medicalCategory?: string; // 診療区分（予約推薦、急患など）
    reservationComment?: string; // 予約コメント
  };
  examInfo?: {
    id: string;
    examType: string;
    doctor: string;
    status: string;
  };
  multiDepartment: string;
  remarks: string;
  medicalHistory: string;
  status: '予約済' | '未予約' | '受付待ち' | '受付済';
  dailyMemo: string;
  treatmentStatus: TreatmentStatus;
  birthDate: string;
  phone1: string;
  phone2: string;
  phone3: string;
}

interface UnifiedAppointmentsProps {
  medicalAppointments: MedicalAppointment[];
  examAppointments: ExamAppointment[];
  onMedicalReception: (appointmentId: string, patientName: string, department: string, doctor: string) => void;
  onExamReception: (appointmentId: string, patientName: string, examType: string, doctor: string) => void;
  onOpenAppointment?: () => void;
}

export function UnifiedAppointments({ 
  medicalAppointments, 
  examAppointments, 
  onMedicalReception, 
  onExamReception,
  onOpenAppointment
}: UnifiedAppointmentsProps) {
  
  // 診療予約と検査予約を統合する関数
  const createUnifiedAppointments = (): UnifiedAppointment[] => {
    const unified: UnifiedAppointment[] = [];
    const processedKeys = new Set<string>();

    // 診療予約をベースに処理
    medicalAppointments.forEach(medical => {
      const key = `${medical.patientName}-${medical.date}-${medical.time}`;
      
      // 同じ患者・日付・時間の検査予約を探す
      const matchingExam = examAppointments.find(exam => 
        exam.patientName === medical.patientName &&
        exam.date === medical.date &&
        exam.time === medical.time
      );

      if (matchingExam) {
        // 診療かつ検査の場合
        unified.push({
          id: `unified-${medical.id}-${matchingExam.id}`,
          patientName: medical.patientName,
          nameKana: medical.nameKana,
          patientNo: medical.patientNo,
          age: medical.age,
          gender: medical.gender,
          date: medical.date,
          time: medical.time,
          type: '診療かつ検査',
          medicalInfo: {
            id: medical.id,
            department: medical.department,
            doctor: medical.doctor,
            status: medical.status,
            medicalMemo: medical.medicalMemo,
            slotNotReserved: medical.slotNotReserved,
            consultationType: medical.consultationType,
            medicalCategory: medical.medicalCategory,
            reservationComment: medical.reservationComment
          },
          examInfo: {
            id: matchingExam.id,
            examType: matchingExam.examType,
            doctor: matchingExam.doctor,
            status: matchingExam.status
          },
          multiDepartment: medical.multiDepartment,
          remarks: medical.remarks,
          medicalHistory: medical.medicalHistory,
          status: medical.status === '受付済' || matchingExam.status === '受付済' 
            ? '受付済' 
            : medical.status === '受付待ち' || matchingExam.status === '受付待ち'
            ? '受付待ち'
            : '予約済',
          dailyMemo: medical.dailyMemo || matchingExam.dailyMemo,
          treatmentStatus: medical.treatmentStatus,
          birthDate: medical.birthDate,
          phone1: medical.phone1,
          phone2: medical.phone2,
          phone3: medical.phone3
        });
        processedKeys.add(key);
        processedKeys.add(`${matchingExam.patientName}-${matchingExam.date}-${matchingExam.time}`);
      } else {
        // 診療のみの場合
        unified.push({
          id: medical.id,
          patientName: medical.patientName,
          nameKana: medical.nameKana,
          patientNo: medical.patientNo,
          age: medical.age,
          gender: medical.gender,
          date: medical.date,
          time: medical.time,
          type: '診療のみ',
          medicalInfo: {
            id: medical.id,
            department: medical.department,
            doctor: medical.doctor,
            status: medical.status,
            medicalMemo: medical.medicalMemo,
            slotNotReserved: medical.slotNotReserved,
            consultationType: medical.consultationType,
            medicalCategory: medical.medicalCategory,
            reservationComment: medical.reservationComment
          },
          multiDepartment: medical.multiDepartment,
          remarks: medical.remarks,
          medicalHistory: medical.medicalHistory,
          status: medical.status,
          dailyMemo: medical.dailyMemo,
          treatmentStatus: medical.treatmentStatus,
          birthDate: medical.birthDate,
          phone1: medical.phone1,
          phone2: medical.phone2,
          phone3: medical.phone3
        });
        processedKeys.add(key);
      }
    });

    // 検査のみの予約を追加（まだ処理されていないもの）
    examAppointments.forEach(exam => {
      const key = `${exam.patientName}-${exam.date}-${exam.time}`;
      
      if (!processedKeys.has(key)) {
        unified.push({
          id: exam.id,
          patientName: exam.patientName,
          nameKana: exam.nameKana,
          patientNo: exam.patientNo,
          age: exam.age,
          gender: exam.gender,
          date: exam.date,
          time: exam.time,
          type: '検査のみ',
          examInfo: {
            id: exam.id,
            examType: exam.examType,
            doctor: exam.doctor,
            status: exam.status
          },
          multiDepartment: exam.multiDepartment,
          remarks: exam.remarks,
          medicalHistory: exam.medicalHistory,
          status: exam.status,
          dailyMemo: exam.dailyMemo,
          treatmentStatus: exam.treatmentStatus,
          birthDate: exam.birthDate,
          phone1: exam.phone1,
          phone2: exam.phone2,
          phone3: exam.phone3
        });
      }
    });

    // 時間順にソート
    return unified.sort((a, b) => a.time.localeCompare(b.time));
  };

  const unifiedAppointments = createUnifiedAppointments();

  // 同姓同名患者を検出する関数
  const getDuplicateNames = (appointments: UnifiedAppointment[]) => {
    const nameCount = appointments.reduce((acc, appointment) => {
      acc[appointment.patientName] = (acc[appointment.patientName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(nameCount)
      .filter(([name, count]) => count > 1)
      .map(([name]) => name);
  };

  const duplicateNames = getDuplicateNames(unifiedAppointments);

  const getStatusVariant = (status: string) => {
    switch (status) {
      case '予約済':
        return 'default';
      case '受付待ち':
        return 'destructive';
      case '受付済':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handleReception = (appointment: UnifiedAppointment) => {
    if (appointment.type === '診療のみ' && appointment.medicalInfo) {
      onMedicalReception(
        appointment.medicalInfo.id,
        appointment.patientName,
        appointment.medicalInfo.department,
        appointment.medicalInfo.doctor
      );
    } else if (appointment.type === '検査のみ' && appointment.examInfo) {
      onExamReception(
        appointment.examInfo.id,
        appointment.patientName,
        appointment.examInfo.examType,
        appointment.examInfo.doctor
      );
    } else if (appointment.type === '診療かつ検査') {
      // 診療と検査の両方がある場合は、診療を優先して受付処理
      if (appointment.medicalInfo) {
        onMedicalReception(
          appointment.medicalInfo.id,
          appointment.patientName,
          appointment.medicalInfo.department,
          appointment.medicalInfo.doctor
        );
      }
    }
  };

  const getDepartmentInfo = (appointment: UnifiedAppointment) => {
    if (appointment.medicalInfo) {
      return appointment.medicalInfo.department;
    }
    return '検査科';
  };

  const getDoctorInfo = (appointment: UnifiedAppointment) => {
    if (appointment.medicalInfo) {
      return appointment.medicalInfo.doctor;
    }
    if (appointment.examInfo) {
      return appointment.examInfo.doctor;
    }
    return '';
  };

  const getMedicalMemo = (appointment: UnifiedAppointment) => {
    if (appointment.medicalInfo?.medicalMemo) {
      return appointment.medicalInfo.medicalMemo;
    }
    if (appointment.examInfo?.examType) {
      return appointment.examInfo.examType;
    }
    return '';
  };

  // オーダー状況のチェックボックス表示用のヘルパー関数
  const renderTreatmentStatus = (treatmentStatus: TreatmentStatus) => {
    const treatments = [
      { key: 'consultation', label: '診察' },
      { key: 'prescription', label: '処方' },
      { key: 'injection', label: '注射' },
      { key: 'treatment', label: '処置' },
      { key: 'specimen', label: '検体' },
      { key: 'physiology', label: '生理' },
      { key: 'endoscopy', label: '内視' },
      { key: 'imaging', label: '画像' },
      { key: 'rehabilitation', label: 'リハ' },
      { key: 'surgery', label: '手術' },
      { key: 'guidance', label: '指導' },
      { key: 'hospitalization', label: '入院' }
    ];

    return (
      <div className="grid grid-cols-4 gap-1 text-xs">
        {treatments.map(({ key, label }) => (
          <div key={key} className="flex items-center gap-1">
            <Checkbox 
              id={`${key}`}
              checked={treatmentStatus[key as keyof TreatmentStatus]}
              disabled
              className="h-3 w-3"
            />
            <label htmlFor={`${key}`} className="text-xs">{label}</label>
          </div>
        ))}
      </div>
    );
  };

  // ソート状態を管理
  const [sortConfig, setSortConfig] = useState<{
    key: string | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  // ソート処理
  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // ソートアイコンを表示
  const getSortIcon = (columnKey: string) => {
    if (sortConfig.key !== columnKey) {
      return <ArrowUpDown className="h-3 w-3 ml-1 inline opacity-30" />;
    }
    return sortConfig.direction === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1 inline" />
      : <ArrowDown className="h-3 w-3 ml-1 inline" />;
  };

  // ソートされた予約リストを取得
  const getSortedAppointments = () => {
    const appointments = createUnifiedAppointments();
    
    if (!sortConfig.key) {
      // デフォルトは時間順
      return appointments;
    }

    const sorted = [...appointments].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'nameKana':
          aValue = a.nameKana;
          bValue = b.nameKana;
          break;
        case 'time':
          aValue = a.time;
          bValue = b.time;
          break;
        case 'patientNo':
          aValue = a.patientNo;
          bValue = b.patientNo;
          break;
        case 'age':
          aValue = a.age;
          bValue = b.age;
          break;
        case 'department':
          aValue = getDepartmentInfo(a);
          bValue = getDepartmentInfo(b);
          break;
        case 'doctor':
          aValue = getDoctorInfo(a);
          bValue = getDoctorInfo(b);
          break;
        case 'birthDate':
          aValue = a.birthDate;
          bValue = b.birthDate;
          break;
        case 'consultationType':
          aValue = a.medicalInfo?.consultationType || '';
          bValue = b.medicalInfo?.consultationType || '';
          break;
        case 'medicalCategory':
          aValue = a.medicalInfo?.medicalCategory || '';
          bValue = b.medicalInfo?.medicalCategory || '';
          break;
        case 'slotNotReserved':
          aValue = a.medicalInfo?.slotNotReserved ? 1 : 0;
          bValue = b.medicalInfo?.slotNotReserved ? 1 : 0;
          break;
        // オーダー状況のソート（チェックされている項目数でソート）
        case 'treatmentStatus':
          const aCount = Object.values(a.treatmentStatus).filter(Boolean).length;
          const bCount = Object.values(b.treatmentStatus).filter(Boolean).length;
          aValue = aCount;
          bValue = bCount;
          break;
        // 画像オーダーのソート
        case 'imaging':
          aValue = a.treatmentStatus.imaging ? 1 : 0;
          bValue = b.treatmentStatus.imaging ? 1 : 0;
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortConfig.direction === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' 
          ? aValue - bValue
          : bValue - aValue;
      }

      return 0;
    });

    return sorted;
  };

  const sortedAppointments = getSortedAppointments();

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3>予約状況</h3>
        <Button
          onClick={onOpenAppointment}
          className="bg-yellow-100 hover:bg-yellow-200 text-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          予約
        </Button>
      </div>

      <div className="border rounded-md overflow-auto" style={{ maxHeight: 'calc(50vh - 120px)' }}>
        <Table>
          <TableHeader>
            <TableRow className="bg-background">
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('consultationType')}
              >
                初再{getSortIcon('consultationType')}
              </TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">予約日</TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('time')}
              >
                予約時{getSortIcon('time')}
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('patientNo')}
              >
                ID{getSortIcon('patientNo')}
              </TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">氏名</TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('nameKana')}
              >
                カナ{getSortIcon('nameKana')}
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('age')}
              >
                年齢{getSortIcon('age')}
              </TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">性別</TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('department')}
              >
                科{getSortIcon('department')}
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('medicalCategory')}
              >
                区分{getSortIcon('medicalCategory')}
              </TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">メモ</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">コメント</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">併科</TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('doctor')}
              >
                医師{getSortIcon('doctor')}
              </TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">備考</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">珍前</TableHead>
              <TableHead 
                className="text-xs min-w-[200px] cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('treatmentStatus')}
              >
                オーダー状況{getSortIcon('treatmentStatus')}
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('birthDate')}
              >
                生年月日{getSortIcon('birthDate')}
              </TableHead>
              <TableHead 
                className="text-xs cursor-pointer hover:bg-muted/50 bg-background sticky top-0 z-10"
                onClick={() => handleSort('slotNotReserved')}
              >
                枠未{getSortIcon('slotNotReserved')}
              </TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">受付</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">変更</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">削除</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">電話１</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">電話２</TableHead>
              <TableHead className="text-xs bg-background sticky top-0 z-10">電話３</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAppointments.map((appointment) => (
              <TableRow key={appointment.id}>
                <TableCell className="text-xs">{appointment.medicalInfo?.consultationType || '-'}</TableCell>
                <TableCell className="text-xs">{appointment.date}</TableCell>
                <TableCell className="text-xs">{appointment.time}</TableCell>
                <TableCell className="text-xs">{appointment.patientNo}</TableCell>
                <TableCell className="text-xs font-medium">
                  {duplicateNames.includes(appointment.patientName) ? (
                    <span className="flex items-center gap-1">
                      {appointment.patientName}
                      <span className="text-red-500">!</span>
                    </span>
                  ) : (
                    appointment.patientName
                  )}
                </TableCell>
                <TableCell className="text-xs">{appointment.nameKana}</TableCell>
                <TableCell className="text-xs">{appointment.age}</TableCell>
                <TableCell className="text-xs">{appointment.gender}</TableCell>
                <TableCell className="text-xs">{getDepartmentInfo(appointment)}</TableCell>
                <TableCell className="text-xs">{appointment.medicalInfo?.medicalCategory || '-'}</TableCell>
                <TableCell className="text-xs max-w-24">
                  <div className="truncate" title={getMedicalMemo(appointment)}>
                    {getMedicalMemo(appointment) || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-xs max-w-24">
                  <div className="truncate" title={appointment.medicalInfo?.reservationComment}>
                    {appointment.medicalInfo?.reservationComment || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-xs">{appointment.multiDepartment || '-'}</TableCell>
                <TableCell className="text-xs">{getDoctorInfo(appointment)}</TableCell>
                <TableCell className="text-xs max-w-20">
                  <div className="truncate" title={appointment.remarks}>
                    {appointment.remarks || '-'}
                  </div>
                </TableCell>
                <TableCell className="text-xs max-w-20">
                  <div className="truncate" title={appointment.medicalHistory}>
                    {appointment.medicalHistory || '-'}
                  </div>
                </TableCell>
                <TableCell className="min-w-[200px]">
                  {renderTreatmentStatus(appointment.treatmentStatus)}
                </TableCell>
                <TableCell className="text-xs">{appointment.birthDate}</TableCell>
                <TableCell className="text-xs">
                  {appointment.medicalInfo?.slotNotReserved ? '枠未取得' : ''}
                </TableCell>
                <TableCell>
                  {(appointment.status === '予約済' || appointment.status === '受付待ち') && (
                    <Button
                      onClick={() => handleReception(appointment)}
                      size="sm"
                      className="text-xs h-7"
                    >
                      受付
                    </Button>
                  )}
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="text-xs h-7"
                  >
                    変更
                  </Button>
                </TableCell>
                <TableCell>
                  <Button
                    size="sm"
                    className="text-xs h-7"
                  >
                    削除
                  </Button>
                </TableCell>
                <TableCell className="text-xs">{appointment.phone1 || '-'}</TableCell>
                <TableCell className="text-xs">{appointment.phone2 || '-'}</TableCell>
                <TableCell className="text-xs">{appointment.phone3 || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
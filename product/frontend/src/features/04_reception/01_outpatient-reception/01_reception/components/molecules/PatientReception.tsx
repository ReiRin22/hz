import { Button } from '@shared/components/atoms/button';
import { Badge } from '@shared/components/atoms/badge';
import { Checkbox } from '@shared/components/atoms/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@shared/components/atoms/table';
import { Card, CardContent, CardHeader, CardTitle } from '@shared/components/atoms/card';
import { Separator } from '@shared/components/atoms/separator';
import { Stethoscope, FileText, ClipboardList, Edit, Plus, Calendar, Users, Printer, X, Upload, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
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

interface Patient {
  id: string;
  receptionNo?: string; // 受付番号
  name: string;
  nameKana: string;
  patientNo: string;
  age: number;
  gender: string;
  department: string;
  doctor: string;
  medicalMemo: string;
  multiDepartment: string;
  insuranceConfirmDate: string;
  remarks: string;
  medicalHistory: string;
  status: '受付済';
  hospitalStatus: 'waiting_for_consultation' | 'waiting_for_examination' | 'waiting_for_results';
  order: number;
  receptionTime: string;
  appointmentTime: string;
  receptionDate: string;
  dailyMemo: string;
  treatmentStatus: TreatmentStatus;
  accounting: string;
  birthDate: string;
  consultationType: '初診' | '再診';
  hasPostExamConsultation: boolean;
  receptionist: string;
  medicalCategory?: string; // 診療区分（予約推薦、急患など）
  reservationComment?: string; // 予約コメント
  receptionCategory?: string; // 受付区分（紹介、健診、当日）
}

interface PatientReceptionProps {
  patients: Patient[];
  onMoveToConsultation?: (patientId: string) => void;
  onMoveToResults?: (patientId: string) => void;
  onMoveToExamination?: (patientId: string) => void;
  onQuestionnaireInput?: (patientId: string) => void;
  onOpenWalkInReception?: () => void;
  onPrint?: (patientId: string) => void;
  onCancel?: (patientId: string) => void;
  onDocumentUpload?: (patientId: string) => void;
}

export function PatientReception({ 
  patients, 
  onMoveToConsultation,
  onMoveToResults,
  onMoveToExamination,
  onQuestionnaireInput,
  onOpenWalkInReception,
  onPrint,
  onCancel,
  onDocumentUpload
}: PatientReceptionProps) {
  
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

  // ソートされた患者リストを取得
  const getSortedPatients = () => {
    const sorted = [...patients];
    
    if (!sortConfig.key) {
      // デフォルトは受付時間順
      return sorted.sort((a, b) => a.receptionTime.localeCompare(b.receptionTime));
    }

    sorted.sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortConfig.key) {
        case 'receptionNo':
          aValue = a.receptionNo || '';
          bValue = b.receptionNo || '';
          break;
        case 'nameKana':
          aValue = a.nameKana;
          bValue = b.nameKana;
          break;
        case 'receptionTime':
          aValue = a.receptionTime;
          bValue = b.receptionTime;
          break;
        case 'appointmentTime':
          aValue = a.appointmentTime === '-' ? '' : a.appointmentTime;
          bValue = b.appointmentTime === '-' ? '' : b.appointmentTime;
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
          aValue = a.department;
          bValue = b.department;
          break;
        case 'doctor':
          aValue = a.doctor;
          bValue = b.doctor;
          break;
        case 'accounting':
          aValue = a.accounting;
          bValue = b.accounting;
          break;
        case 'birthDate':
          aValue = a.birthDate;
          bValue = b.birthDate;
          break;
        case 'consultationType':
          aValue = a.consultationType;
          bValue = b.consultationType;
          break;
        case 'medicalCategory':
          aValue = a.medicalCategory || '';
          bValue = b.medicalCategory || '';
          break;
        // 実施状況のソート（チェックされている項目数でソート）
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

  const sortedPatients = getSortedPatients();

  // 同姓同名患者を検出する関数
  const getDuplicateNames = (patients: Patient[]) => {
    const nameCount = patients.reduce((acc, patient) => {
      acc[patient.name] = (acc[patient.name] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(nameCount)
      .filter(([name, count]) => count > 1)
      .map(([name]) => name);
  };

  const duplicateNames = getDuplicateNames(patients);

  const getStatusBadgeVariant = (hospitalStatus: string) => {
    switch (hospitalStatus) {
      case 'waiting_for_consultation':
        return 'destructive';
      case 'waiting_for_examination':
        return 'secondary';
      case 'waiting_for_results':
        return 'outline';
      default:
        return 'default';
    }
  };

  const getStatusText = (hospitalStatus: string) => {
    switch (hospitalStatus) {
      case 'waiting_for_consultation':
        return '診察待ち';
      case 'waiting_for_examination':
        return '予診待ち';
      case 'waiting_for_results':
        return '結果待ち';
      default:
        return '不明';
    }
  };

  // 実施状況のチェックボックス表示用のヘルパー関数
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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3>受付状況</h3>
        <Button
          onClick={onOpenWalkInReception}
          className="bg-pink-200 hover:bg-pink-300 text-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          当日受付
        </Button>
      </div>

      {/* 統合テーブル */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            <span>受付済み患者一覧 ({patients.length})</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {patients.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              受付済みの患者はいません
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('receptionNo')}
                    >
                      受付№{getSortIcon('receptionNo')}
                    </TableHead>
                    <TableHead className="text-xs">受付区</TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('consultationType')}
                    >
                      初再{getSortIcon('consultationType')}
                    </TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('receptionTime')}
                    >
                      受付時{getSortIcon('receptionTime')}
                    </TableHead>
                    <TableHead className="text-xs">予約日</TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('appointmentTime')}
                    >
                      予約時{getSortIcon('appointmentTime')}
                    </TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('patientNo')}
                    >
                      ID{getSortIcon('patientNo')}
                    </TableHead>
                    <TableHead className="text-xs">氏名</TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('nameKana')}
                    >
                      カナ{getSortIcon('nameKana')}
                    </TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('age')}
                    >
                      年齢{getSortIcon('age')}
                    </TableHead>
                    <TableHead className="text-xs">性別</TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('department')}
                    >
                      科{getSortIcon('department')}
                    </TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('medicalCategory')}
                    >
                      区分{getSortIcon('medicalCategory')}
                    </TableHead>
                    <TableHead className="text-xs">診療メモ</TableHead>
                    <TableHead className="text-xs">予約メモ</TableHead>
                    <TableHead className="text-xs">併科</TableHead>
                    <TableHead className="text-xs">保険日</TableHead>
                    <TableHead className="text-xs">備考</TableHead>
                    <TableHead className="text-xs">問診</TableHead>
                    <TableHead className="text-xs">診前</TableHead>
                    <TableHead 
                      className="text-xs min-w-[200px] cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('treatmentStatus')}
                    >
                      実施状況{getSortIcon('treatmentStatus')}
                    </TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('accounting')}
                    >
                      会計{getSortIcon('accounting')}
                    </TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('birthDate')}
                    >
                      生年月日{getSortIcon('birthDate')}
                    </TableHead>
                    <TableHead 
                      className="text-xs cursor-pointer hover:bg-muted/50"
                      onClick={() => handleSort('doctor')}
                    >
                      医師{getSortIcon('doctor')}
                    </TableHead>
                    <TableHead className="text-xs">受付者</TableHead>
                    <TableHead className="text-xs">印刷</TableHead>
                    <TableHead className="text-xs">取消</TableHead>
                    <TableHead className="text-xs">書類</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="text-xs">{patient.receptionNo || '-'}</TableCell>
                      <TableCell className="text-xs">{patient.receptionCategory || '-'}</TableCell>
                      <TableCell className="text-xs">{patient.consultationType}</TableCell>
                      <TableCell className="text-xs">{patient.receptionTime}</TableCell>
                      <TableCell className="text-xs">
                        {patient.appointmentTime === '-' ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          patient.receptionDate
                        )}
                      </TableCell>
                      <TableCell className="text-xs">
                        {patient.appointmentTime === '-' ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          patient.appointmentTime
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{patient.patientNo}</TableCell>
                      <TableCell className="text-xs font-medium">
                        {duplicateNames.includes(patient.name) ? (
                          <span className="flex items-center gap-1">
                            {patient.name}
                            <span className="text-red-500">!</span>
                          </span>
                        ) : (
                          patient.name
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{patient.nameKana}</TableCell>
                      <TableCell className="text-xs">{patient.age}</TableCell>
                      <TableCell className="text-xs">{patient.gender}</TableCell>
                      <TableCell className="text-xs">{patient.department}</TableCell>
                      <TableCell className="text-xs">{patient.medicalCategory || '-'}</TableCell>
                      <TableCell className="text-xs max-w-24">
                        <div className="truncate" title={patient.medicalMemo}>
                          {patient.medicalMemo || '-'}
                        </div>
                      </TableCell>
                      <TableCell className="text-xs">{patient.reservationComment || '-'}</TableCell>
                      <TableCell className="text-xs">{patient.multiDepartment || '-'}</TableCell>
                      <TableCell className="text-xs">{patient.insuranceConfirmDate}</TableCell>
                      <TableCell className="text-xs max-w-20">
                        <div className="truncate" title={patient.remarks}>
                          {patient.remarks || '-'}
                        </div>
                      </TableCell>
                      <TableCell>
                        {patient.hospitalStatus === 'waiting_for_examination' && (
                          <Button
                            onClick={() => onQuestionnaireInput?.(patient.id)}
                            size="sm"
                            variant="outline"
                            className="flex items-center gap-1 text-xs h-7"
                          >
                            <Upload className="h-3 w-3" />
                            問診アップロード
                          </Button>
                        )}
                      </TableCell>
                      <TableCell className="text-xs">{patient.hasPostExamConsultation ? '有' : '-'}</TableCell>
                      <TableCell className="min-w-[200px]">
                        {renderTreatmentStatus(patient.treatmentStatus)}
                      </TableCell>
                      <TableCell className="text-xs">{patient.accounting}</TableCell>
                      <TableCell className="text-xs">{patient.birthDate}</TableCell>
                      <TableCell className="text-xs">{patient.doctor}</TableCell>
                      <TableCell className="text-xs">{patient.receptionist}</TableCell>
                      <TableCell>
                        <Button
                          onClick={() => onPrint?.(patient.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-xs h-7"
                        >
                          <Printer className="h-3 w-3" />
                          印刷
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => onCancel?.(patient.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-xs h-7 text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                          取消
                        </Button>
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => onDocumentUpload?.(patient.id)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1 text-xs h-7"
                        >
                          <Upload className="h-3 w-3" />
                          書類取込
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
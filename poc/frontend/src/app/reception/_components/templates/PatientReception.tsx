import { Button } from '../atoms/button';
import { Badge } from '../atoms/badge';
import { Checkbox } from '../atoms/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../atoms/table';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/card';
import { Separator } from '../atoms/separator';
import { Stethoscope, FileText, ClipboardList, Edit, Plus, Calendar, Users, Printer, X, Upload } from 'lucide-react';

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

  // 受付時間順にソートされた患者リスト
  const sortedPatients = patients.sort((a, b) => a.receptionTime.localeCompare(b.receptionTime));

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
                    <TableHead className="text-xs">受付区分</TableHead>
                    <TableHead className="text-xs">初再区分</TableHead>
                    <TableHead className="text-xs">受付時間</TableHead>
                    <TableHead className="text-xs">予約時間</TableHead>
                    <TableHead className="text-xs">ステータス</TableHead>
                    <TableHead className="text-xs">患者ID</TableHead>
                    <TableHead className="text-xs">氏名</TableHead>
                    <TableHead className="text-xs">カナ</TableHead>
                    <TableHead className="text-xs">年齢</TableHead>
                    <TableHead className="text-xs">性別</TableHead>
                    <TableHead className="text-xs">診療科</TableHead>
                    <TableHead className="text-xs">診療区分</TableHead>
                    <TableHead className="text-xs">診療メモ</TableHead>
                    <TableHead className="text-xs">予約コメント</TableHead>
                    <TableHead className="text-xs">併科受診</TableHead>
                    <TableHead className="text-xs">保険確認日</TableHead>
                    <TableHead className="text-xs">備考</TableHead>
                    <TableHead className="text-xs">問診アップロード</TableHead>
                    <TableHead className="text-xs">診前</TableHead>
                    <TableHead className="text-xs min-w-[200px]">実施状況</TableHead>
                    <TableHead className="text-xs">会計</TableHead>
                    <TableHead className="text-xs">生年月日</TableHead>
                    <TableHead className="text-xs">主治医</TableHead>
                    <TableHead className="text-xs">受付者</TableHead>
                    <TableHead className="text-xs">印刷</TableHead>
                    <TableHead className="text-xs">取消</TableHead>
                    <TableHead className="text-xs">書類取込</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedPatients.map((patient) => (
                    <TableRow key={patient.id}>
                      <TableCell className="text-xs">{patient.receptionCategory || '-'}</TableCell>
                      <TableCell className="text-xs">{patient.consultationType}</TableCell>
                      <TableCell className="text-xs">{patient.receptionTime}</TableCell>
                      <TableCell className="text-xs">
                        {patient.appointmentTime === '-' ? (
                          <span className="text-muted-foreground">-</span>
                        ) : (
                          patient.appointmentTime
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(patient.hospitalStatus)}>
                          {getStatusText(patient.hospitalStatus)}
                        </Badge>
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
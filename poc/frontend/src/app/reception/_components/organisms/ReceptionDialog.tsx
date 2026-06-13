import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../atoms/dialog';
import { Button } from '../atoms/button';
import { Input } from '../atoms/input';
import { Label } from '../atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../atoms/select';
import { RadioGroup, RadioGroupItem } from '../atoms/radio-group';
import { Textarea } from '../atoms/textarea';
import { X, CalendarIcon } from 'lucide-react';
import { AppointmentSchedulerDialog } from './AppointmentSchedulerDialog';

interface ReceptionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule: (data: any) => void;
  onReception: (data: any) => void;
}

export function ReceptionDialog({ isOpen, onClose, onSchedule, onReception }: ReceptionDialogProps) {
  const [formData, setFormData] = useState({
    id: '',
    birthDate: '',
    age: '',
    name: '',
    insurance: '',
    department: '',
    departmentCode: '1',
    examinationRoom: '内科診察室',
    doctor: '',
    lastVisitDate: '',
    consultationType: '初診',
    appointmentDate: '',
    appointmentTime: '',
    receptionCategory: '',
    medicalCategory: '',
    medicalMemo: '',
    reservationComment: ''
  });

  const [isSchedulerDialogOpen, setIsSchedulerDialogOpen] = useState(false);

  // 医師データ
  const doctors = [
    { name: '田中医師', department: '内科' },
    { name: '山田医師', department: '内科' },
    { name: '鈴木医師', department: '皮膚科' },
    { name: '佐藤医師', department: '産婦人科' },
    { name: '高橋医師', department: '整形外科' }
  ];

  // 診療区分データ
  const medicalCategories = [
    { value: 'yoyaku-suisen', label: '予約推薦' },
    { value: 'kyukan', label: '急患' },
    { value: 'kyushin-taiou', label: '急診対応' },
    { value: 'kensa-nomi', label: '検査のみ' },
    { value: 'rihabiri-suisen', label: 'リハビリ推薦' },
    { value: 'kinkyu-rihabiri', label: '緊急時リハビリ' },
    { value: 'hoshasen-shinryo', label: '放射線診療' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // 医師が変更された場合、日付と時間をリセット
      if (field === 'doctor') {
        newData.appointmentDate = '';
        newData.appointmentTime = '';
      }
      
      // 日付が変更された場合、時間をリセット
      if (field === 'appointmentDate') {
        newData.appointmentTime = '';
      }
      
      return newData;
    });
  };

  // 診療日時決定ダイアログを開く
  const handleOpenScheduler = () => {
    if (!formData.doctor) {
      alert('先に医師を選択してください。');
      return;
    }
    setIsSchedulerDialogOpen(true);
  };

  // 診療日時決定ダイアログからの選択を処理
  const handleSchedulerSelection = (date: string, time: string) => {
    setFormData(prev => ({
      ...prev,
      appointmentDate: date,
      appointmentTime: time
    }));
  };

  const handleSchedule = () => {
    // 必須項目のチェック
    if (!formData.name) {
      alert('患者名を入力してください。');
      return;
    }
    if (!formData.appointmentDate) {
      alert('診察日を選択してください。');
      return;
    }
    if (!formData.appointmentTime) {
      alert('診察時間を選択してください。');
      return;
    }
    if (!formData.doctor) {
      alert('担当医を選択してください。');
      return;
    }
    if (!formData.department) {
      alert('診療科を入力してください。');
      return;
    }

    const combinedDateTime = `${formData.appointmentDate} ${formData.appointmentTime}`;
    onSchedule({ ...formData, appointmentDateTime: combinedDateTime });
    onClose();
  };

  const handleReception = () => {
    // 必須項目のチェック
    if (!formData.name) {
      alert('患者名を入力してください。');
      return;
    }
    if (!formData.department) {
      alert('診療科を入力してください。');
      return;
    }
    if (!formData.doctor) {
      alert('担当医を選択してください。');
      return;
    }

    const combinedDateTime = formData.appointmentDate && formData.appointmentTime 
      ? `${formData.appointmentDate} ${formData.appointmentTime}` 
      : '';
    onReception({ ...formData, appointmentDateTime: combinedDateTime });
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  const handleIdSearch = () => {
    // ID検索のロジック（デモ用）
    console.log('ID検索を実行します');
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl w-[90vw] max-h-[90vh] p-0 overflow-hidden">
          <div className="flex flex-col h-full max-h-[90vh]">
            <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
              <DialogTitle className="flex items-center justify-between">
                予約
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="h-4 w-4" />
                </Button>
              </DialogTitle>
            </DialogHeader>

            {/* スクロール可能なフォーム部分 */}
            <div className="flex-1 overflow-y-auto min-h-0">
              <div className="p-6 space-y-3">
                {/* ID行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">患者ID</Label>
                  <Input
                    value={formData.id}
                    onChange={(e) => handleInputChange('id', e.target.value)}
                    className="flex-1"
                    placeholder="IDを入力"
                  />
                  <Button variant="outline" size="sm" onClick={handleIdSearch} className="flex-shrink-0">
                    検索
                  </Button>
                </div>

                {/* 氏名行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-green-100 p-2 text-center rounded text-sm flex-shrink-0">氏名</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="flex-1"
                    placeholder="患者名を入力"
                  />
                </div>

                {/* 生年月日行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-green-100 p-2 text-center rounded text-sm flex-shrink-0">生年月日</Label>
                  <Input
                    value={formData.birthDate}
                    onChange={(e) => handleInputChange('birthDate', e.target.value)}
                    className="flex-1"
                    placeholder="YYYY/MM/DD"
                  />
                  <Input
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    className="w-16 flex-shrink-0"
                    placeholder="年齢"
                  />
                </div>

                {/* 保険行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">保険</Label>
                  <Input
                    value={formData.insurance}
                    onChange={(e) => handleInputChange('insurance', e.target.value)}
                    className="flex-1"
                    placeholder="保険情報を入力"
                  />
                </div>

                {/* 診療科行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">診療科</Label>
                  <Input
                    value={formData.departmentCode}
                    onChange={(e) => handleInputChange('departmentCode', e.target.value)}
                    className="w-16 flex-shrink-0"
                  />
                  <Input
                    value={formData.department}
                    onChange={(e) => handleInputChange('department', e.target.value)}
                    className="flex-1"
                    placeholder="診療科を入力"
                  />
                </div>

                {/* 診察室行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">診察室</Label>
                  <Input
                    value={formData.examinationRoom}
                    onChange={(e) => handleInputChange('examinationRoom', e.target.value)}
                    className="flex-1"
                  />
                </div>

                {/* 主治医行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">主治医</Label>
                  <Select value={formData.doctor} onValueChange={(value) => handleInputChange('doctor', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="医師を選択してください" />
                    </SelectTrigger>
                    <SelectContent>
                      {doctors.map((doctor) => (
                        <SelectItem key={doctor.name} value={doctor.name}>
                          {doctor.name} ({doctor.department})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 最終診察日行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-green-100 p-2 text-center rounded text-sm flex-shrink-0">最終診察日</Label>
                  <Input
                    value={formData.lastVisitDate}
                    onChange={(e) => handleInputChange('lastVisitDate', e.target.value)}
                    className="flex-1"
                    placeholder="YYYY/MM/DD"
                  />
                </div>

                {/* 初再区分行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">初再区分</Label>
                  <RadioGroup
                    value={formData.consultationType}
                    onValueChange={(value) => handleInputChange('consultationType', value)}
                    className="flex gap-4"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="初診" id="first-visit" />
                      <Label htmlFor="first-visit">初診</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="再診" id="return-visit" />
                      <Label htmlFor="return-visit">再診</Label>
                    </div>
                  </RadioGroup>
                </div>

                {/* 診察日時行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">診察日時</Label>
                  <Button
                    variant="outline"
                    className="flex-1 justify-start text-left"
                    onClick={handleOpenScheduler}
                    disabled={!formData.doctor}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.appointmentDate && formData.appointmentTime 
                      ? `${formData.appointmentDate} ${formData.appointmentTime}` 
                      : formData.doctor 
                        ? "診療スケジュールから日時を選択" 
                        : "先に医師を選択してください"
                    }
                  </Button>
                </div>

                {/* 受付区分行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">受付区分</Label>
                  <Select value={formData.receptionCategory} onValueChange={(value) => handleInputChange('receptionCategory', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="▼" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="通常">通常</SelectItem>
                      <SelectItem value="緊急">緊急</SelectItem>
                      <SelectItem value="予約">予約</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 診療区分行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">診療区分</Label>
                  <Select value={formData.medicalCategory} onValueChange={(value) => handleInputChange('medicalCategory', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="▼" />
                    </SelectTrigger>
                    <SelectContent>
                      {medicalCategories.map((category) => (
                        <SelectItem key={category.value} value={category.value}>
                          {category.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* 診療メモ行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">診療メモ</Label>
                  <Select value={formData.medicalMemo} onValueChange={(value) => handleInputChange('medicalMemo', value)}>
                    <SelectTrigger className="flex-1">
                      <SelectValue placeholder="▼" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="定期検診">定期検診</SelectItem>
                      <SelectItem value="急性症状">急性症状</SelectItem>
                      <SelectItem value="フォローアップ">フォローアップ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* 予約コメント行 */}
                <div className="flex items-center gap-4">
                  <Label className="w-20 bg-yellow-100 p-2 text-center rounded text-sm flex-shrink-0">予約コメント</Label>
                  <Textarea
                    value={formData.reservationComment}
                    onChange={(e) => handleInputChange('reservationComment', e.target.value)}
                    className="flex-1"
                    placeholder="予約コメントを入力"
                  />
                </div>
              </div>
            </div>

            {/* 下部ボタン（固定） */}
            <div className="flex justify-center gap-4 p-4 border-t flex-shrink-0 bg-white">
              <Button
                variant="outline"
                className="bg-yellow-100 hover:bg-yellow-200 text-gray-800 px-8"
                onClick={handleSchedule}
                disabled={!formData.name || !formData.appointmentDate || !formData.appointmentTime || !formData.doctor || !formData.department}
              >
                予約
              </Button>
              <Button
                variant="outline"
                className="bg-blue-100 hover:bg-blue-200 text-gray-800 px-8"
                onClick={handleCancel}
              >
                キャンセル
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* 診療日時決定ダイアログ */}
      <AppointmentSchedulerDialog
        isOpen={isSchedulerDialogOpen}
        onClose={() => setIsSchedulerDialogOpen(false)}
        onSelectDateTime={handleSchedulerSelection}
        doctor={formData.doctor}
      />
    </>
  );
}
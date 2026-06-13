import { useState, useEffect } from 'react';
import { Plus, Printer } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/shared/components/atoms/dialog';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Appointment } from './AppointmentManagement';
import { toast } from 'sonner';

// 祝日判定のためのヘルパー関数
const isHoliday = (date: Date): boolean => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  // 2024年の主要祝日（簡略版）
  const holidays2024 = [
    '1/1', '1/8', '2/11', '2/12', '2/23', '3/20', '4/29', '5/3', '5/4', '5/5', '5/6',
    '7/15', '8/11', '8/12', '9/16', '9/23', '10/14', '11/3', '11/4', '11/23', '12/23'
  ];
  
  // 2025年の主要祝日（簡略版）
  const holidays2025 = [
    '1/1', '1/13', '2/11', '2/23', '2/24', '3/20', '4/29', '5/3', '5/4', '5/5', '5/6',
    '7/21', '8/11', '9/15', '9/23', '10/13', '11/3', '11/23', '11/24', '12/23'
  ];
  
  const dateStr = `${month}/${day}`;
  
  if (year === 2024) {
    return holidays2024.includes(dateStr);
  } else if (year === 2025) {
    return holidays2025.includes(dateStr);
  }
  
  return false;
};

// 日付の色を決定するヘルパー関数
const getDateColor = (date: Date): string => {
  const dayOfWeek = date.getDay();
  
  if (isHoliday(date) || dayOfWeek === 0) { // 祝日または日曜日
    return 'text-red-600';
  } else if (dayOfWeek === 6) { // 土曜日
    return 'text-blue-600';
  }
  
  return 'text-foreground';
};

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface AppointmentScheduleProps {
  selectedDate: Date;
  appointments: Appointment[];
  onAppointmentCreate: (appointment: Omit<Appointment, 'id'>) => void;
  onAppointmentUpdate: (appointment: Appointment) => void;
  onAppointmentDelete: (appointmentId: string) => void;
  currentPatient?: CurrentPatient;
}

interface NewAppointmentForm {
  title: string;
  startTime: string;
  endTime: string;
  patientName: string;
  type: 'consultation' | 'procedure' | 'follow-up';
  notes: string;
  selectedDate: string;
}

export function AppointmentSchedule({
  selectedDate,
  appointments,
  onAppointmentCreate,
  onAppointmentUpdate,
  onAppointmentDelete,
  currentPatient
}: AppointmentScheduleProps) {
  const [isNewAppointmentOpen, setIsNewAppointmentOpen] = useState(false);
  const [isEditAppointmentOpen, setIsEditAppointmentOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [editAppointmentForm, setEditAppointmentForm] = useState<NewAppointmentForm>({
    title: '',
    startTime: '',
    endTime: '',
    patientName: '',
    type: 'consultation',
    notes: '',
    selectedDate: ''
  });
  const [newAppointmentForm, setNewAppointmentForm] = useState<NewAppointmentForm>({
    title: '',
    startTime: '',
    endTime: '',
    patientName: currentPatient?.name || '',
    type: 'consultation',
    notes: '',
    selectedDate: selectedDate.toISOString().split('T')[0]
  });

  // selectedDateが変わった時にフォームの日付も更新
  useEffect(() => {
    setNewAppointmentForm(prev => ({
      ...prev,
      selectedDate: selectedDate.toISOString().split('T')[0]
    }));
  }, [selectedDate]);

  // 時間スロットの生成（9:00-17:00、30分刻み）
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 17; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  // 1週間分の日付を生成（選択した日付を最左に）
  const generateWeekDates = () => {
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  // 特定の日の予約を取得
  const getDayAppointments = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return appointments.filter(apt => apt.date === dateStr);
  };

  // 時間スロットと日付の組み合わせでの状態を取得
  const getSlotStatus = (timeSlot: string, date: Date) => {
    const dayAppointments = getDayAppointments(date);
    const slotAppointment = dayAppointments.find(apt => 
      apt.startTime <= timeSlot && timeSlot < apt.endTime
    );
    
    if (slotAppointment) {
      return { status: 'occupied', appointment: slotAppointment };
    }
    return { status: 'available', appointment: null };
  };

  // 新規予約の作成
  const handleCreateAppointment = () => {
    if (!newAppointmentForm.title || !newAppointmentForm.startTime || !newAppointmentForm.endTime) {
      toast.error('必須項目を入力してください');
      return;
    }

    const appointment: Omit<Appointment, 'id'> = {
      title: newAppointmentForm.title,
      startTime: newAppointmentForm.startTime,
      endTime: newAppointmentForm.endTime,
      patientName: newAppointmentForm.patientName,
      type: newAppointmentForm.type,
      date: newAppointmentForm.selectedDate,
      status: 'confirmed'
    };

    onAppointmentCreate(appointment);
    setNewAppointmentForm({
      title: '',
      startTime: '',
      endTime: '',
      patientName: currentPatient?.name || '',
      type: 'consultation',
      notes: '',
      selectedDate: selectedDate.toISOString().split('T')[0]
    });
    setIsNewAppointmentOpen(false);
    toast.success('予約を作成しました');
  };

  // 予約の編集開始
  const handleEditAppointment = (appointment: Appointment) => {
    setEditAppointmentForm({
      title: appointment.title,
      startTime: appointment.startTime,
      endTime: appointment.endTime,
      patientName: appointment.patientName || '',
      type: appointment.type || 'consultation',
      notes: '',
      selectedDate: appointment.date
    });
    setSelectedAppointment(appointment);
    setIsEditAppointmentOpen(true);
  };

  // 予約の更新
  const handleUpdateAppointment = () => {
    if (!editAppointmentForm.title || !editAppointmentForm.startTime || !editAppointmentForm.endTime || !selectedAppointment) {
      toast.error('必須項目を入力してください');
      return;
    }

    const updatedAppointment: Appointment = {
      ...selectedAppointment,
      title: editAppointmentForm.title,
      startTime: editAppointmentForm.startTime,
      endTime: editAppointmentForm.endTime,
      patientName: editAppointmentForm.patientName,
      type: editAppointmentForm.type,
      date: editAppointmentForm.selectedDate
    };

    onAppointmentUpdate(updatedAppointment);
    setIsEditAppointmentOpen(false);
    setSelectedAppointment(null);
    toast.success('予約を更新しました');
  };

  // 予約の削除
  const handleDeleteAppointment = (appointmentId: string) => {
    onAppointmentDelete(appointmentId);
    setSelectedAppointment(null);
    toast.success('予約を削除しました');
  };

  const timeSlots = generateTimeSlots();
  const weekDates = generateWeekDates();

  return (
    <div className="flex flex-col h-full">
      {/* ヘッダー */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div>
          <h1 className="text-xl font-medium">予約管理</h1>
          <p className="text-sm text-muted-foreground">
            {selectedDate.getFullYear()}年{selectedDate.getMonth() + 1}月{selectedDate.getDate()}日
            ({['日', '月', '火', '水', '木', '金', '土'][selectedDate.getDay()]}) から1週間
          </p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.print()}
          >
            <Printer className="w-4 h-4 mr-2" />
            印刷
          </Button>
          
          <Dialog open={isNewAppointmentOpen} onOpenChange={setIsNewAppointmentOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                新規予約
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>新規予約作成</DialogTitle>
                <DialogDescription>
                  新しい予約を作成します。必要な情報を入力してください。
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">件名 *</Label>
                  <Input
                    id="title"
                    value={newAppointmentForm.title}
                    onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="例：定期診察"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime">開始時間 *</Label>
                    <Select
                      value={newAppointmentForm.startTime}
                      onValueChange={(value) => setNewAppointmentForm(prev => ({ ...prev, startTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="endTime">終了時間 *</Label>
                    <Select
                      value={newAppointmentForm.endTime}
                      onValueChange={(value) => setNewAppointmentForm(prev => ({ ...prev, endTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="選択" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map(slot => (
                          <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="selectedDate">日付</Label>
                  <Input
                    id="selectedDate"
                    type="date"
                    value={newAppointmentForm.selectedDate}
                    onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, selectedDate: e.target.value }))}
                  />
                </div>
                
                <div>
                  <Label htmlFor="patientName">患者名</Label>
                  <Input
                    id="patientName"
                    value={newAppointmentForm.patientName}
                    onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, patientName: e.target.value }))}
                    placeholder="例：田中太郎"
                  />
                </div>
                
                <div>
                  <Label htmlFor="type">種別</Label>
                  <Select
                    value={newAppointmentForm.type}
                    onValueChange={(value: 'consultation' | 'procedure' | 'follow-up') => 
                      setNewAppointmentForm(prev => ({ ...prev, type: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="consultation">診察</SelectItem>
                      <SelectItem value="procedure">処置</SelectItem>
                      <SelectItem value="follow-up">フォローアップ</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="notes">備考</Label>
                  <Textarea
                    id="notes"
                    value={newAppointmentForm.notes}
                    onChange={(e) => setNewAppointmentForm(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="特記事項があれば入力"
                    rows={3}
                  />
                </div>
                
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setIsNewAppointmentOpen(false)}>
                    キャンセル
                  </Button>
                  <Button onClick={handleCreateAppointment}>
                    作成
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* スケジュール表 */}
      <div className="flex-1">
        {/* 週間ヘッダー */}
        <div className="sticky top-0 bg-background border-b border-border z-10">
          <div className="grid grid-cols-8" style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}>
            {/* 時間軸ヘッダー */}
            <div className="px-2 py-3 border-r border-border text-center">
              <span className="text-xs text-muted-foreground">時間</span>
            </div>
            
            {/* 日付ヘッダー */}
            {weekDates.map((date, index) => {
              const isToday = new Date().toDateString() === date.toDateString();
              const dateColor = getDateColor(date);
              const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
              
              return (
                <div
                  key={index}
                  className={`
                    px-10 py-3 text-center border-r border-border last:border-r-0
                    ${isToday ? 'bg-primary text-primary-foreground' : ''}
                  `}
                >
                  <div className={`text-sm ${isToday ? 'text-primary-foreground' : dateColor}`}>
                    {date.getMonth() + 1}/{date.getDate()}({dayNames[date.getDay()]})
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* スケジュールグリッド */}
        <div>
          {timeSlots.map((timeSlot) => (
            <div key={timeSlot} className="grid grid-cols-8 border-b border-border h-12" style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}>
              {/* 時間軸 */}
              <div className="px-2 flex items-center justify-center text-xs text-muted-foreground border-r border-border">
                {timeSlot}
              </div>
              
              {/* 各日のセル */}
              {weekDates.map((date, dateIndex) => {
                const { status, appointment } = getSlotStatus(timeSlot, date);
                
                return (
                  <div
                    key={dateIndex}
                    className={`
                      px-6 py-2 border-r border-border last:border-r-0 cursor-pointer transition-colors text-sm
                      ${status === 'available' 
                        ? 'hover:bg-accent hover:text-accent-foreground' 
                        : appointment?.startTime === timeSlot 
                          ? 'bg-chart-2 text-foreground' 
                          : 'bg-muted text-muted-foreground'
                      }
                    `}
                    onClick={() => {
                      if (status === 'available') {
                        setNewAppointmentForm(prev => ({ 
                          ...prev, 
                          startTime: timeSlot,
                          selectedDate: date.toISOString().split('T')[0],
                          patientName: currentPatient?.name || prev.patientName
                        }));
                        setIsNewAppointmentOpen(true);
                      } else if (appointment) {
                        setSelectedAppointment(appointment);
                      }
                    }}
                  >
                    {status === 'available' ? (
                      <span className="text-xs text-muted-foreground">空き</span>
                    ) : appointment?.startTime === timeSlot ? (
                      <div className="truncate">
                        <div className="text-xs truncate">{appointment.title}</div>
                        {appointment.patientName && (
                          <div className="text-xs text-muted-foreground truncate">
                            {appointment.patientName}
                          </div>
                        )}
                      </div>
                    ) : null}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* 予約詳細ダイアログ */}
      {selectedAppointment && !isEditAppointmentOpen && (
        <Dialog open={!!selectedAppointment} onOpenChange={() => setSelectedAppointment(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>予約詳細</DialogTitle>
              <DialogDescription>
                選択した予約の詳細情報を表示しています。
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>件名</Label>
                <div className="text-sm">{selectedAppointment.title}</div>
              </div>
              
              <div>
                <Label>時間</Label>
                <div className="text-sm">
                  {selectedAppointment.startTime} - {selectedAppointment.endTime}
                </div>
              </div>
              
              {selectedAppointment.patientName && (
                <div>
                  <Label>患者名</Label>
                  <div className="text-sm">{selectedAppointment.patientName}</div>
                </div>
              )}
              
              <div>
                <Label>種別</Label>
                <div className="text-sm">
                  {selectedAppointment.type === 'consultation' && '診察'}
                  {selectedAppointment.type === 'procedure' && '処置'}
                  {selectedAppointment.type === 'follow-up' && 'フォローアップ'}
                </div>
              </div>
              
              <div className="flex justify-end gap-2">
                <Button 
                  variant="destructive" 
                  onClick={() => handleDeleteAppointment(selectedAppointment.id)}
                >
                  削除
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => handleEditAppointment(selectedAppointment)}
                >
                  編集
                </Button>
                <Button variant="outline" onClick={() => setSelectedAppointment(null)}>
                  閉じる
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* 予約編集ダイアログ */}
      <Dialog open={isEditAppointmentOpen} onOpenChange={setIsEditAppointmentOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>予約編集</DialogTitle>
            <DialogDescription>
              予約の情報を変更します。必要な項目を編集してください。
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-title">件名 *</Label>
              <Input
                id="edit-title"
                value={editAppointmentForm.title}
                onChange={(e) => setEditAppointmentForm(prev => ({ ...prev, title: e.target.value }))}
                placeholder="例：定期診察"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-startTime">開始時間 *</Label>
                <Select
                  value={editAppointmentForm.startTime}
                  onValueChange={(value) => setEditAppointmentForm(prev => ({ ...prev, startTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="edit-endTime">終了時間 *</Label>
                <Select
                  value={editAppointmentForm.endTime}
                  onValueChange={(value) => setEditAppointmentForm(prev => ({ ...prev, endTime: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="選択" />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(slot => (
                      <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div>
              <Label htmlFor="edit-selectedDate">日付</Label>
              <Input
                id="edit-selectedDate"
                type="date"
                value={editAppointmentForm.selectedDate}
                onChange={(e) => setEditAppointmentForm(prev => ({ ...prev, selectedDate: e.target.value }))}
              />
            </div>
            
            <div>
              <Label htmlFor="edit-patientName">患者名</Label>
              <Input
                id="edit-patientName"
                value={editAppointmentForm.patientName}
                onChange={(e) => setEditAppointmentForm(prev => ({ ...prev, patientName: e.target.value }))}
                placeholder="例：田中太郎"
              />
            </div>
            
            <div>
              <Label htmlFor="edit-type">種別</Label>
              <Select
                value={editAppointmentForm.type}
                onValueChange={(value: 'consultation' | 'procedure' | 'follow-up') => 
                  setEditAppointmentForm(prev => ({ ...prev, type: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="consultation">診察</SelectItem>
                  <SelectItem value="procedure">処置</SelectItem>
                  <SelectItem value="follow-up">フォローアップ</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setIsEditAppointmentOpen(false)}>
                キャンセル
              </Button>
              <Button onClick={handleUpdateAppointment}>
                更新
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

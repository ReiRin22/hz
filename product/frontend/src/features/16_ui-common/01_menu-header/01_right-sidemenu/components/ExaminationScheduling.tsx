// [SCOPE-OUT: ETC005] 関連機能追加時にコメントアウトを解除する
import { useState } from 'react';
import { Button } from '@/shared/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/atoms/dialog';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Badge } from '@/shared/components/atoms/badge';
import { Card } from '@/shared/components/atoms/card';
import { CalendarDays, Clock, User, ChevronLeft, ChevronRight, Monitor, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface ExaminationReservation {
  id: string;
  patientId: string;
  patientName: string;
  examType: string;
  startTime: string;
  endTime: string;
  date: string;
  equipment: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  orderNumber: string;
  notes?: string;
  doctorId?: string;
  doctorName?: string;
}

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface ExaminationSchedulingProps {
  onBack?: () => void;
  currentPatient?: CurrentPatient;
  onDateSelected?: (date: string) => void; // 日付選択時のコールバック
  selectedOrderForExamination?: string | null; // 選択されたオーダーID
}

export function ExaminationScheduling({ onBack, currentPatient, onDateSelected, selectedOrderForExamination }: ExaminationSchedulingProps) {
  const [selectedEquipment, setSelectedEquipment] = useState('CT1');
  const [currentMonth, setCurrentMonth] = useState(new Date('2024-01-15'));
  const [selectedDate, setSelectedDate] = useState(new Date('2024-01-15'));
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [editingReservation, setEditingReservation] = useState<ExaminationReservation | null>(null);
  const [activeHistoryTab, setActiveHistoryTab] = useState('current');
  
  // 予約データ（実際の実装では外部から取得）
  const [reservations, setReservations] = useState<ExaminationReservation[]>([
    // CT1室の予約
    {
      id: 'r001',
      patientId: 'P12345',
      patientName: '田中花子',
      examType: '胸部CT',
      startTime: '09:00',
      endTime: '09:30',
      date: '2024-01-15',
      equipment: 'CT1',
      status: 'completed',
      orderNumber: 'ORD-2024-001',
      notes: '造影剤使用',
      doctorId: 'D001',
      doctorName: '医師 001'
    },
    {
      id: 'r002',
      patientId: 'P67890',
      patientName: '佐藤太郎',
      examType: '腹部CT',
      startTime: '10:30',
      endTime: '11:00',
      date: '2024-01-15',
      equipment: 'CT1',
      status: 'in-progress',
      orderNumber: 'ORD-2024-002'
    },
    {
      id: 'r003',
      patientId: 'P11111',
      patientName: '山田次郎',
      examType: '造影CT',
      startTime: '13:30',
      endTime: '14:15',
      date: '2024-01-15',
      equipment: 'CT1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-005',
      notes: '腎機能チェック済み'
    },
    {
      id: 'r004',
      patientId: 'P22222',
      patientName: '鈴木美智子',
      examType: '胸部CT',
      startTime: '15:00',
      endTime: '15:30',
      date: '2024-01-15',
      equipment: 'CT1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-007'
    },

    // CT2室の予約
    {
      id: 'r005',
      patientId: 'P33333',
      patientName: '高橋健一',
      examType: '頭部CT',
      startTime: '09:30',
      endTime: '10:00',
      date: '2024-01-15',
      equipment: 'CT2',
      status: 'completed',
      orderNumber: 'ORD-2024-003'
    },
    {
      id: 'r006',
      patientId: 'P44444',
      patientName: '渡辺聡子',
      examType: '腹部CT',
      startTime: '14:00',
      endTime: '14:30',
      date: '2024-01-15',
      equipment: 'CT2',
      status: 'scheduled',
      orderNumber: 'ORD-2024-006'
    },

    // MRI1室の予約
    {
      id: 'r007',
      patientId: 'P55555',
      patientName: '伊藤雅子',
      examType: '頭部MRI',
      startTime: '10:00',
      endTime: '10:45',
      date: '2024-01-15',
      equipment: 'MRI1',
      status: 'completed',
      orderNumber: 'ORD-2024-004'
    },
    {
      id: 'r008',
      patientId: 'P66666',
      patientName: '小林正男',
      examType: '腰椎MRI',
      startTime: '14:00',
      endTime: '14:45',
      date: '2024-01-15',
      equipment: 'MRI1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-008',
      notes: 'ペースメーカー確認済み'
    },
    {
      id: 'r009',
      patientId: 'P77777',
      patientName: '加藤真一',
      examType: '膝MRI',
      startTime: '15:30',
      endTime: '16:15',
      date: '2024-01-15',
      equipment: 'MRI1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-009'
    },

    // 翌日の予約（月曜日 - 2024-01-15、火曜日 - 2024-01-16）
    {
      id: 'r010',
      patientId: 'P88888',
      patientName: '松本花音',
      examType: '胸部CT',
      startTime: '09:00',
      endTime: '09:30',
      date: '2024-01-16',
      equipment: 'CT1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-010'
    },
    {
      id: 'r011',
      patientId: 'P99999',
      patientName: '清水光男',
      examType: '頭部MRI',
      startTime: '10:00',
      endTime: '10:45',
      date: '2024-01-16',
      equipment: 'MRI1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-011'
    },
    {
      id: 'r012',
      patientId: 'P00001',
      patientName: '中村智恵',
      examType: '造影CT',
      startTime: '14:00',
      endTime: '14:45',
      date: '2024-01-16',
      equipment: 'CT1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-012',
      notes: 'アレルギー歴なし'
    },

    // 水曜日（2024-01-17）の予約
    {
      id: 'r013',
      patientId: 'P00002',
      patientName: '森田健太',
      examType: '胸部X線',
      startTime: '11:00',
      endTime: '11:15',
      date: '2024-01-17',
      equipment: 'XR1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-013'
    },
    {
      id: 'r014',
      patientId: 'P00003',
      patientName: '岡田美穂',
      examType: '腹部エコー',
      startTime: '13:00',
      endTime: '13:30',
      date: '2024-01-17',
      equipment: 'US1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-014',
      notes: '空腹状態確認済み'
    },
    {
      id: 'r015',
      patientId: 'P00004',
      patientName: '藤田敏夫',
      examType: '頭部CT',
      startTime: '15:30',
      endTime: '16:00',
      date: '2024-01-17',
      equipment: 'CT2',
      status: 'scheduled',
      orderNumber: 'ORD-2024-015'
    },

    // 木曜日（2024-01-18）の予約
    {
      id: 'r016',
      patientId: 'P00005',
      patientName: '石川和子',
      examType: '心エコー',
      startTime: '10:30',
      endTime: '11:00',
      date: '2024-01-18',
      equipment: 'US2',
      status: 'scheduled',
      orderNumber: 'ORD-2024-016'
    },
    {
      id: 'r017',
      patientId: 'P00006',
      patientName: '山口直樹',
      examType: '腰椎MRI',
      startTime: '14:30',
      endTime: '15:15',
      date: '2024-01-18',
      equipment: 'MRI2',
      status: 'scheduled',
      orderNumber: 'ORD-2024-017'
    },

    // 金曜日（2024-01-19）の予約
    {
      id: 'r018',
      patientId: 'P00007',
      patientName: '橋本真理',
      examType: '胸部CT',
      startTime: '09:30',
      endTime: '10:00',
      date: '2024-01-19',
      equipment: 'CT1',
      status: 'scheduled',
      orderNumber: 'ORD-2024-018'
    },
    {
      id: 'r019',
      patientId: 'P00008',
      patientName: '木村正志',
      examType: '腹部X線',
      startTime: '12:00',
      endTime: '12:15',
      date: '2024-01-19',
      equipment: 'XR2',
      status: 'scheduled',
      orderNumber: 'ORD-2024-019'
    },
    {
      id: 'r020',
      patientId: 'P00009',
      patientName: '斎藤由美',
      examType: '膝MRI',
      startTime: '16:00',
      endTime: '16:45',
      date: '2024-01-19',
      equipment: 'MRI1',
      status: 'cancelled',
      orderNumber: 'ORD-2024-020',
      notes: '患者都合によりキャンセル'
    }
  ]);

  // 現在の患者の予約履歴データ（実際には外部から取得）
  const [patientReservations, setPatientReservations] = useState<ExaminationReservation[]>([
    // 未来の予約
    {
      id: 'pr001',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '医師 001',
      startTime: '09:00',
      endTime: '09:30',
      date: '2023-10-13',
      equipment: 'DOCTOR',
      status: 'scheduled',
      orderNumber: '',
      doctorId: 'D001',
      doctorName: '医師 001'
    },
    {
      id: 'pr002',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '医師 001',
      startTime: '14:00',
      endTime: '14:30',
      date: '2023-10-12',
      equipment: 'DOCTOR',
      status: 'scheduled',
      orderNumber: '',
      doctorId: 'D001',
      doctorName: '医師 001'
    },
    {
      id: 'pr003',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: 'リハビリ(PT)',
      startTime: '10:30',
      endTime: '11:15',
      date: '2023-10-05',
      equipment: 'PT1',
      status: 'completed',
      orderNumber: ''
    },
    {
      id: 'pr004',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: 'CT',
      startTime: '12:00',
      endTime: '12:30',
      date: '2023-07-14',
      equipment: 'CT1',
      status: 'completed',
      orderNumber: ''
    },
    {
      id: 'pr005',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: 'CT',
      startTime: '12:00',
      endTime: '12:30',
      date: '2023-07-13',
      equipment: 'CT1',
      status: 'completed',
      orderNumber: ''
    },
    {
      id: 'pr006',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '医師 001',
      startTime: '09:30',
      endTime: '10:00',
      date: '2023-07-12',
      equipment: 'DOCTOR',
      status: 'completed',
      orderNumber: '',
      doctorId: 'D001',
      doctorName: '医師 001'
    },
    {
      id: 'pr007',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '腹部エコー',
      startTime: '09:30',
      endTime: '10:00',
      date: '2022-03-17',
      equipment: 'US1',
      status: 'completed',
      orderNumber: ''
    },
    {
      id: 'pr008',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '医師 001',
      startTime: '未定',
      endTime: '未定',
      date: '2021-03-01',
      equipment: 'DOCTOR',
      status: 'cancelled',
      orderNumber: '',
      doctorId: 'D001',
      doctorName: '医師 001'
    },
    {
      id: 'pr009',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: 'リハビリ(OT)',
      startTime: '未定',
      endTime: '未定',
      date: '2021-03-01',
      equipment: 'OT1',
      status: 'cancelled',
      orderNumber: ''
    },
    {
      id: 'pr010',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '医師 001',
      startTime: '未定',
      endTime: '未定',
      date: '2021-02-24',
      equipment: 'DOCTOR',
      status: 'cancelled',
      orderNumber: '',
      doctorId: 'D001',
      doctorName: '医師 001'
    },
    {
      id: 'pr011',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '医師 001',
      startTime: '未定',
      endTime: '未定',
      date: '2021-02-01',
      equipment: 'DOCTOR',
      status: 'cancelled',
      orderNumber: '',
      doctorId: 'D001',
      doctorName: '医師 001'
    },
    {
      id: 'pr012',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: 'CT',
      startTime: '10:30',
      endTime: '11:00',
      date: '2021-01-16',
      equipment: 'CT1',
      status: 'completed',
      orderNumber: ''
    },
    {
      id: 'pr013',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: 'MRI',
      startTime: '13:30',
      endTime: '14:30',
      date: '2021-01-16',
      equipment: 'MRI1',
      status: 'completed',
      orderNumber: ''
    },
    {
      id: 'pr014',
      patientId: currentPatient?.id || 'p001',
      patientName: currentPatient?.name || '山田太郎',
      examType: '医師 003',
      startTime: '未定',
      endTime: '未定',
      date: '2018-12-03',
      equipment: 'DOCTOR',
      status: 'cancelled',
      orderNumber: '',
      doctorId: 'D003',
      doctorName: '医師 003'
    }
  ]);

  // フォーム状態
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    examType: '',
    orderNumber: '',
    startTime: '',
    duration: '30',
    notes: '',
    doctorId: '',
    doctorName: ''
  });

  // 医師リスト
  const doctorList = [
    { id: 'D001', name: '医師 001' },
    { id: 'D002', name: '医師 002' },
    { id: 'D003', name: '医師 003' },
    { id: 'D004', name: '医師 004' },
    { id: 'D005', name: '医師 005' }
  ];

  // 検査機器リスト
  const equipmentList = [
    { id: 'CT1', name: 'CT1室', type: 'CT' },
    { id: 'CT2', name: 'CT2室', type: 'CT' },
    { id: 'MRI1', name: 'MRI1室', type: 'MRI' },
    { id: 'MRI2', name: 'MRI2室', type: 'MRI' },
    { id: 'XR1', name: 'X線室1', type: 'XR' },
    { id: 'XR2', name: 'X線室2', type: 'XR' },
    { id: 'US1', name: 'エコー室1', type: 'US' },
    { id: 'US2', name: 'エコー室2', type: 'US' }
  ];

  // 時間スロット（9:00-17:00、30分間隔）
  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(9 + i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  // 週の日付を取得（月曜日スタート）
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1); // 月曜日を週の始まりに
    start.setDate(diff);
    
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(selectedDate);

  // 月移動
  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  // カレンダーの日付を生成
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay()); // 日曜日から開始
    
    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay())); // 土曜日まで
    
    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }
    
    return days;
  };

  // 日付の予約状況を取得
  const getDateReservationStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayReservations = reservations.filter(r => r.date === dateStr);
    
    if (dayReservations.length === 0) return 'empty';
    if (dayReservations.length >= 8) return 'full'; // 満枠の基準
    return 'partial';
  };

  // 日付のスタイルクラスを取得
  const getDateClassName = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const isToday = date.getTime() === today.getTime();
    const isSelected = date.getTime() === selectedDate.getTime();
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const status = getDateReservationStatus(date);
    
    let baseClass = 'w-8 h-8 rounded-lg cursor-pointer transition-colors text-center flex items-center justify-center relative';
    
    if (isSelected) {
      baseClass += ' bg-primary text-primary-foreground';
    } else if (isToday) {
      baseClass += ' border-2 border-primary text-primary';
    } else if (!isCurrentMonth) {
      baseClass += ' text-muted-foreground';
    } else if (status === 'full') {
      baseClass += ' bg-destructive text-destructive-foreground';
    } else {
      baseClass += ' text-foreground hover:bg-accent hover:text-accent-foreground';
    }
    
    return baseClass;
  };

  // 予約ドットの表示
  const renderReservationDot = (date: Date) => {
    const status = getDateReservationStatus(date);
    if (status === 'empty' || status === 'full') return null;
    
    return (
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-chart-2 rounded-full"></div>
    );
  };

  // 指定日時の予約を取得
  const getReservationForSlot = (date: string, time: string) => {
    return reservations.find(r => 
      r.date === date && 
      r.equipment === selectedEquipment && 
      r.startTime === time
    );
  };

  // スロットクリック処理
  const handleSlotClick = (date: string, time: string) => {
    const existingReservation = getReservationForSlot(date, time);
    
    if (existingReservation) {
      // 既存予約の編集
      setEditingReservation(existingReservation);
      setFormData({
        patientId: existingReservation.patientId,
        patientName: existingReservation.patientName,
        examType: existingReservation.examType,
        orderNumber: existingReservation.orderNumber,
        startTime: existingReservation.startTime,
        duration: '30', // 実際は終了時間から計算
        notes: existingReservation.notes || '',
        doctorId: existingReservation.doctorId || '',
        doctorName: existingReservation.doctorName || ''
      });
    } else {
      // 新規予約
      setEditingReservation(null);
      setSelectedSlot({ date, time });
      // 検体オーダーから遷移してきた場合は患者情報を事前入力
      setFormData({
        patientId: selectedOrderForExamination && currentPatient ? currentPatient.patientNumber : '',
        patientName: selectedOrderForExamination && currentPatient ? currentPatient.name : '',
        examType: '',
        orderNumber: '',
        startTime: time,
        duration: '30',
        notes: '',
        doctorId: '',
        doctorName: ''
      });
    }
    setDialogOpen(true);
  };

  // 予約保存
  const handleSaveReservation = () => {
    if (!formData.patientId || !formData.patientName || !formData.examType) {
      toast.error('必須項目を入力してください');
      return;
    }

    const duration = parseInt(formData.duration);
    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(startHour, startMinute + duration, 0);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    // 採取日を取得（予約日）
    const reservationDate = editingReservation ? editingReservation.date : selectedSlot!.date;

    if (editingReservation) {
      // 既存予約の更新
      setReservations(prev => prev.map(r => 
        r.id === editingReservation.id 
          ? {
              ...r,
              patientId: formData.patientId,
              patientName: formData.patientName,
              examType: formData.examType,
              orderNumber: formData.orderNumber,
              startTime: formData.startTime,
              endTime: endTimeStr,
              notes: formData.notes,
              doctorId: formData.doctorId,
              doctorName: formData.doctorName
            }
          : r
      ));
      toast.success('予約を更新しました');
    } else {
      // 新規予約作成
      const newReservation: ExaminationReservation = {
        id: `r${Date.now()}`,
        patientId: formData.patientId,
        patientName: formData.patientName,
        examType: formData.examType,
        startTime: formData.startTime,
        endTime: endTimeStr,
        date: selectedSlot!.date,
        equipment: selectedEquipment,
        status: 'scheduled',
        orderNumber: formData.orderNumber,
        notes: formData.notes,
        doctorId: formData.doctorId,
        doctorName: formData.doctorName
      };
      
      setReservations(prev => [...prev, newReservation]);
      toast.success('予約を作成しました');
    }

    // 検体オーダーの採取日を更新するために日付を返す
    if (selectedOrderForExamination && onDateSelected) {
      onDateSelected(reservationDate);
    }

    setDialogOpen(false);
    setEditingReservation(null);
    setSelectedSlot(null);
  };

  // 予約削除
  const handleDeleteReservation = () => {
    if (editingReservation) {
      setReservations(prev => prev.filter(r => r.id !== editingReservation.id));
      toast.success('予約を削除しました');
      setDialogOpen(false);
      setEditingReservation(null);
    }
  };

  // ステータス色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-green-100 text-green-800 border-green-200';
      case 'completed': return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  // ステータス表示名
  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'scheduled': return '予約済';
      case 'in-progress': return '実施中';
      case 'completed': return '完了';
      case 'cancelled': return 'キャンセル';
      default: return '不明';
    }
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  // 患者予約履歴のフィルタリング
  const getFilteredPatientReservations = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    return patientReservations.filter(reservation => {
      const reservationDate = new Date(reservation.date);
      reservationDate.setHours(0, 0, 0, 0);
      
      switch (activeHistoryTab) {
        case 'current':
          return reservationDate >= today && reservation.status !== 'cancelled';
        case 'history':
          return reservationDate < today && reservation.status !== 'cancelled';
        case 'cancelled':
          return reservation.status === 'cancelled';
        default:
          return true;
      }
    }).sort((a, b) => {
      // 日付でソート（未来の予約は昇順、過去の予約は降順）
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (activeHistoryTab === 'current') {
        return dateA.getTime() - dateB.getTime(); // 昇順
      } else {
        return dateB.getTime() - dateA.getTime(); // 降順
      }
    });
  };

  const filteredPatientReservations = getFilteredPatientReservations();

  return (
    <div className="flex-1 flex bg-background overflow-hidden">
      {/* 左ペイン: 月カレンダー */}
      <div className="w-64 border-r border-border bg-background flex flex-col">
        {/* ヘッダー */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2 mb-4">
            {onBack && (
              <Button variant="outline" size="sm" onClick={onBack}>
                ← 戻る
              </Button>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-600" />
            <h1 className="font-medium">検査予約</h1>
          </div>
        </div>

        {/* 検査機器選択 */}
        <div className="border-b border-border p-4">
          <Label className="text-sm mb-2 block">検査機器</Label>
          <Select value={selectedEquipment} onValueChange={setSelectedEquipment}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {equipmentList.map(equipment => (
                <SelectItem key={equipment.id} value={equipment.id}>
                  {equipment.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 月カレンダー */}
        <div className="flex-1 p-4">
          {/* カレンダーヘッダー */}
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('prev')}
              className="p-1"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <h2 className="font-medium">
              {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
            </h2>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigateMonth('next')}
              className="p-1"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          {/* 曜日ヘッダー */}
          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDays.map((day) => (
              <div
                key={day}
                className="h-8 flex items-center justify-center text-sm text-muted-foreground"
              >
                {day}
              </div>
            ))}
          </div>

          {/* カレンダー日付 */}
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date, index) => (
              <div
                key={index}
                className={getDateClassName(date)}
                onClick={() => setSelectedDate(date)}
              >
                {date.getDate()}
                {renderReservationDot(date)}
              </div>
            ))}
          </div>

          {/* 凡例 */}
          <div className="mt-6 space-y-2">
            <div className="text-sm text-muted-foreground mb-2">予約状況</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 border-2 border-primary rounded"></div>
              <span>今日</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-chart-2 rounded-full"></div>
              <span>予約あり</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-destructive rounded"></div>
              <span>満枠</span>
            </div>
          </div>
        </div>
      </div>

      {/* 中央ペイン: 週間スケジュール */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* 週ヘッダー */}
        <div className="border-b border-border p-3 bg-muted/30">
          <div className="flex items-center justify-center">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-4 h-4" />
              <span className="font-medium">
                {weekDates[0].getMonth() + 1}月{weekDates[0].getDate()}日 - {weekDates[6].getMonth() + 1}月{weekDates[6].getDate()}日 ({weekDates[0].getFullYear()}年)
              </span>
              <span className="text-sm text-muted-foreground ml-2">
                {equipmentList.find(e => e.id === selectedEquipment)?.name}
              </span>
            </div>
          </div>
        </div>

        {/* カレンダーグリッド */}
        <div className="flex-1 overflow-auto p-4">
          <Card className="overflow-hidden">
            <div className="grid grid-cols-8 border-b border-border bg-muted/50">
              {/* 時間軸ヘッダー */}
              <div className="p-3 text-center font-medium border-r border-border">
                <Clock className="w-4 h-4 mx-auto mb-1" />
                時間
              </div>
              
              {/* 日付ヘッダー */}
              {weekDates.map((date, index) => {
                const dayNames = ['月', '火', '水', '木', '金', '土', '日'];
                const isWeekend = index >= 5;
                const isSelected = date.getTime() === selectedDate.getTime();
                
                return (
                  <div 
                    key={date.toISOString()} 
                    className={`p-3 text-center border-r border-border last:border-r-0 cursor-pointer ${
                      isSelected ? 'bg-primary/10' : isWeekend ? 'bg-red-50' : ''
                    }`}
                    onClick={() => setSelectedDate(date)}
                  >
                    <div className={`font-medium ${
                      isSelected ? 'text-primary' : isWeekend ? 'text-red-600' : ''
                    }`}>
                      {dayNames[index]}
                    </div>
                    <div className={`text-sm ${
                      isSelected ? 'text-primary' : isWeekend ? 'text-red-600' : 'text-muted-foreground'
                    }`}>
                      {date.getMonth() + 1}/{date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 時間スロット */}
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="grid grid-cols-8 border-b border-border last:border-b-0">
                {/* 時間ラベル */}
                <div className="p-2 text-center border-r border-border bg-muted/30 flex items-center justify-center">
                  <span className="text-sm font-medium">{timeSlot}</span>
                </div>
                
                {/* 日付列 */}
                {weekDates.map((date, dayIndex) => {
                  const dateStr = date.toISOString().split('T')[0];
                  const reservation = getReservationForSlot(dateStr, timeSlot);
                  const isWeekend = dayIndex >= 5;
                  
                  return (
                    <div 
                      key={`${dateStr}-${timeSlot}`}
                      className={`h-16 border-r border-border last:border-r-0 cursor-pointer hover:bg-accent/50 ${
                        isWeekend ? 'bg-red-50/30' : ''
                      }`}
                      onClick={() => handleSlotClick(dateStr, timeSlot)}
                    >
                      {reservation ? (
                        <div className={`h-full p-1 ${getStatusColor(reservation.status)} rounded-sm m-1 border`}>
                          <div className="text-xs font-medium truncate">
                            {reservation.patientName}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            {reservation.examType}
                          </div>
                          <div className="text-xs truncate">
                            ID: {reservation.patientId}
                          </div>
                        </div>
                      ) : (
                        <div className="h-full flex items-center justify-center text-muted-foreground/50">
                          <Plus className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* 右ペイン: 患者予約履歴 */}
      <div className="w-96 border-l border-border bg-background flex flex-col">
        {/* ヘッダー */}
        <div className="border-b border-border p-4">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            <h2 className="font-medium">患者予約一覧</h2>
          </div>
          {currentPatient && (
            <div className="mt-2 text-sm text-muted-foreground">
              {currentPatient.name} (ID: {currentPatient.patientNumber})
            </div>
          )}
        </div>

        {/* タブ */}
        <div className="border-b border-border bg-muted/30">
          <div className="flex">
            <button
              className={`px-4 py-2 text-sm border-r border-border flex-1 flex items-center justify-center gap-2 ${
                activeHistoryTab === 'current' 
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
              onClick={() => setActiveHistoryTab('current')}
            >
              📅 予約を開く
            </button>
            <button
              className={`px-4 py-2 text-sm border-r border-border flex-1 flex items-center justify-center gap-2 ${
                activeHistoryTab === 'history' 
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
              onClick={() => setActiveHistoryTab('history')}
            >
              📋 予約変更履歴
            </button>
            <button
              className={`px-4 py-2 text-sm flex-1 flex items-center justify-center gap-2 ${
                activeHistoryTab === 'cancelled' 
                  ? 'bg-blue-50 text-blue-700 border-b-2 border-blue-600' 
                  : 'text-muted-foreground hover:bg-accent/50'
              }`}
              onClick={() => setActiveHistoryTab('cancelled')}
            >
              ❌ 中止予約参照
            </button>
          </div>
        </div>

        {/* 予約履歴テーブル */}
        <div className="flex-1 overflow-auto">
          <div className="border-b border-border bg-muted/50 sticky top-0">
            <div className="grid grid-cols-4 gap-1 p-2 text-sm font-medium">
              <div className="text-center">予約日</div>
              <div className="text-center">予約開始時間</div>
              <div className="text-center">予約終了時間</div>
              <div className="text-center">予約対象</div>
            </div>
          </div>
          
          <div className="divide-y divide-border">
            {filteredPatientReservations.map((reservation, index) => {
              // 行の背景色を設定（未来・現在・過去で色分け）
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              const reservationDate = new Date(reservation.date);
              reservationDate.setHours(0, 0, 0, 0);
              
              let rowClass = 'grid grid-cols-4 gap-1 p-2 text-sm hover:bg-accent/30';
              
              if (reservation.status === 'cancelled') {
                rowClass += ' bg-red-50';
              } else if (reservationDate.getTime() === today.getTime()) {
                rowClass += ' bg-yellow-50'; // 今日
              } else if (reservationDate > today) {
                rowClass += ' bg-blue-50'; // 未来
              } else {
                rowClass += ' bg-gray-50'; // 過去
              }
              
              // 日付フォーマット
              const formatDate = (dateStr: string) => {
                const date = new Date(dateStr);
                const year = date.getFullYear();
                const month = date.getMonth() + 1;
                const day = date.getDate();
                const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
                const dayName = dayNames[date.getDay()];
                return `${year}/${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}(${dayName})`;
              };
              
              return (
                <div key={reservation.id} className={rowClass}>
                  <div className="text-center text-xs">
                    {formatDate(reservation.date)}
                  </div>
                  <div className="text-center text-xs">
                    {reservation.startTime}
                  </div>
                  <div className="text-center text-xs">
                    {reservation.endTime}
                  </div>
                  <div className="text-center text-xs">
                    {reservation.examType}
                  </div>
                </div>
              );
            })}
            
            {filteredPatientReservations.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                {activeHistoryTab === 'current' && '今後の予約はありません'}
                {activeHistoryTab === 'history' && '過去の予約履歴はありません'}
                {activeHistoryTab === 'cancelled' && 'キャンセルされた予約はありません'}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 予約作成・編集ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              {editingReservation ? '予約編集' : '新規予約作成'}
            </DialogTitle>
            <DialogDescription>
              {editingReservation 
                ? '既存の予約内容を編集できます。' 
                : '検査予約の詳細情報を入力してください。'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {/* 基本情報 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="patientId">患者ID *</Label>
                <Input
                  id="patientId"
                  value={formData.patientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                  placeholder="P12345"
                />
              </div>
              <div>
                <Label htmlFor="patientName">患者名 *</Label>
                <Input
                  id="patientName"
                  value={formData.patientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientName: e.target.value }))}
                  placeholder="山田太郎"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="examType">検査種別 *</Label>
                <Select value={formData.examType} onValueChange={(value) => setFormData(prev => ({ ...prev, examType: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="選択してください" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="胸部CT">胸部CT</SelectItem>
                    <SelectItem value="腹部CT">腹部CT</SelectItem>
                    <SelectItem value="頭部CT">頭部CT</SelectItem>
                    <SelectItem value="造影CT">造影CT</SelectItem>
                    <SelectItem value="頭部MRI">頭部MRI</SelectItem>
                    <SelectItem value="腰椎MRI">腰椎MRI</SelectItem>
                    <SelectItem value="膝MRI">膝MRI</SelectItem>
                    <SelectItem value="胸部X線">胸部X線</SelectItem>
                    <SelectItem value="腹部X線">腹部X線</SelectItem>
                    <SelectItem value="腹部エコー">腹部エコー</SelectItem>
                    <SelectItem value="心エコー">心エコー</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="orderNumber">オーダー番号</Label>
                <Input
                  id="orderNumber"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, orderNumber: e.target.value }))}
                  placeholder="ORD-2024-001"
                />
              </div>
            </div>

            {/* 時間設定 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="startTime">開始時間</Label>
                <Select value={formData.startTime} onValueChange={(value) => setFormData(prev => ({ ...prev, startTime: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map(time => (
                      <SelectItem key={time} value={time}>{time}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="duration">所要時間（分）</Label>
                <Select value={formData.duration} onValueChange={(value) => setFormData(prev => ({ ...prev, duration: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="15">15分</SelectItem>
                    <SelectItem value="30">30分</SelectItem>
                    <SelectItem value="45">45分</SelectItem>
                    <SelectItem value="60">60分</SelectItem>
                    <SelectItem value="90">90分</SelectItem>
                    <SelectItem value="120">120分</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* 医師選択 */}
            <div>
              <Label htmlFor="doctorId">担当医師</Label>
              <Select 
                value={formData.doctorId} 
                onValueChange={(value) => {
                  const selectedDoctor = doctorList.find(d => d.id === value);
                  setFormData(prev => ({ 
                    ...prev, 
                    doctorId: value,
                    doctorName: selectedDoctor?.name || ''
                  }));
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="医師を選択してください" />
                </SelectTrigger>
                <SelectContent>
                  {doctorList.map(doctor => (
                    <SelectItem key={doctor.id} value={doctor.id}>
                      {doctor.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* 備考 */}
            <div>
              <Label htmlFor="notes">備考・特記事項</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                placeholder="造影剤使用、禁食指示など"
                rows={2}
              />
            </div>

            {/* 現在の予約情報表示 */}
            {editingReservation && (
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">現在のステータス</span>
                  <Badge className={getStatusColor(editingReservation.status)}>
                    {getStatusLabel(editingReservation.status)}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground">
                  機器: {equipmentList.find(e => e.id === editingReservation.equipment)?.name} | 
                  日時: {editingReservation.date} {editingReservation.startTime}-{editingReservation.endTime}
                </div>
              </div>
            )}

            {/* アクションボタン */}
            <div className="flex gap-2 pt-2">
              <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                キャンセル
              </Button>
              {editingReservation && (
                <Button variant="destructive" onClick={handleDeleteReservation} className="flex-1">
                  削除
                </Button>
              )}
              <Button onClick={handleSaveReservation} className="flex-1">
                {editingReservation ? '更新' : '作成'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
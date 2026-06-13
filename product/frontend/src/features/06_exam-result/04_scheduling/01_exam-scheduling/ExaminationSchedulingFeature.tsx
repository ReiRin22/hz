'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';

const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';
import { Button } from '@/shared/components/atoms/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/atoms/dialog';
import { Input } from '@/shared/components/atoms/input';
import { Label } from '@/shared/components/atoms/label';
import { Textarea } from '@/shared/components/atoms/textarea';
import { Badge } from '@/shared/components/atoms/badge';
import { Card } from '@/shared/components/atoms/card';
import {
  Calendar,
  Clock,
  X,
  Monitor,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { toast } from 'sonner';
import { PatientReservationList } from './components/molecules/PatientReservationList';
import { ja } from '@/shared/i18n/ja';
import type {
  ExaminationReservation,
  CurrentPatient,
  ExaminationSchedulingProps,
} from './types/examination.types';
import type { ExaminationEquipmentResponse } from '@/front_bff_shared/features/exam-result/exam-scheduling/examination-reservations/types/responses/examination-reservations.response';

const t = ja.examination.examinationScheduling;

const doctorList = [
  { id: 'D001', name: '医師 001' },
  { id: 'D002', name: '医師 002' },
  { id: 'D003', name: '医師 003' },
  { id: 'D004', name: '医師 004' },
  { id: 'D005', name: '医師 005' },
];

const durationMap: Record<string, number> = {
  胸部CT: 15,
  腹部CT: 20,
  頭部CT: 15,
  造影CT: 30,
  頭部MRI: 45,
  腰椎MRI: 60,
  膝MRI: 45,
  胸部X線: 10,
  腹部X線: 10,
  腹部エコー: 30,
  心エコー: 30,
};

const getExamDuration = (examType: string): number => durationMap[examType] ?? 30;

export function ExaminationSchedulingFeature({ onBack, currentPatient, orderId }: ExaminationSchedulingProps) {
  const router = useRouter();
  const [selectedEquipment, setSelectedEquipment] = useState('CT1');
  const [equipmentList, setEquipmentList] = useState<ExaminationEquipmentResponse[]>([
    { id: 'CT1', name: 'CT室', type: 'CT', capacity: 3 },
    { id: 'MRI1', name: 'MRI室', type: 'MRI', capacity: 3 },
    { id: 'US1', name: 'エコー室', type: 'US', capacity: 3 },
  ]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; time: string } | null>(null);
  const [editingReservation, setEditingReservation] = useState<ExaminationReservation | null>(null);

  const [editingPatientReservation, setEditingPatientReservation] = useState<ExaminationReservation | null>(null);
  const [editPatientDate, setEditPatientDate] = useState('');
  const [editPatientTime, setEditPatientTime] = useState('');
  const [isEditingDateUndecided, setIsEditingDateUndecided] = useState(false);
  const [confirmScheduleDialog, setConfirmScheduleDialog] = useState<{
    open: boolean;
    date: string;
    time: string;
    reservation: ExaminationReservation | null;
  }>({ open: false, date: '', time: '', reservation: null });

  const [expandedEquipment, setExpandedEquipment] = useState<string | null>(null);
  const [selectedUndecidedReservation, setSelectedUndecidedReservation] =
    useState<ExaminationReservation | null>(null);

  const getUndecidedCountByEquipment = (equipmentId: string) => {
    return patientReservations.filter(
      (reservation) =>
        reservation.equipment === equipmentId &&
        reservation.date === '未定' &&
        reservation.startTime === '未定',
    ).length;
  };

  const getUndecidedReservationsByEquipment = (equipmentId: string) => {
    return patientReservations.filter(
      (reservation) =>
        reservation.equipment === equipmentId &&
        reservation.date === '未定' &&
        reservation.startTime === '未定',
    );
  };

  const [reservations, setReservations] = useState<ExaminationReservation[]>([]);

  const [patientReservations, setPatientReservations] = useState<ExaminationReservation[]>([]);

  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    examType: '',
    startTime: '',
    duration: '30',
    notes: '',
    doctorId: '',
    doctorName: '',
  });

  const timeSlots = Array.from({ length: 16 }, (_, i) => {
    const hour = Math.floor(9 + i / 2);
    const minute = (i % 2) * 30;
    return `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
  });

  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    const diff = start.getDate() - day + (day === 0 ? -6 : 1);
    start.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    });
  };

  const weekDates = getWeekDates(selectedDate);

  // 検査室一覧・定員を取得
  useEffect(() => {
    const fetchEquipment = async () => {
      try {
        const res = await fetch(`${BFF_BASE_URL}/bff/examination-equipment`, { cache: 'no-store' });
        if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        const data = await res.json() as { equipment: ExaminationEquipmentResponse[] };
        setEquipmentList(data.equipment);
      } catch (e) {
        console.error('検査室情報の取得に失敗しました', e);
      }
    };
    fetchEquipment();
  }, []);

  // 週間スケジュール用 予約一覧を取得（機器・週が変わるたびに再取得）
  const fetchReservations = useCallback(async () => {
    const startDate = weekDates[0].toISOString().split('T')[0];
    const endDate = weekDates[6].toISOString().split('T')[0];
    try {
      const res = await fetch(
        `${BFF_BASE_URL}/bff/examination-reservations?equipmentId=${selectedEquipment}&startDate=${startDate}&endDate=${endDate}`,
        { cache: 'no-store' },
      );
      if (!res.ok) throw new Error(`BFF error: ${res.status}`);
      const data = await res.json() as { reservations: ExaminationReservation[] };
      setReservations(data.reservations);
    } catch (e) {
      console.error('予約一覧の取得に失敗しました', e);
    }
  }, [selectedEquipment, weekDates[0].toISOString()]);  // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  // 患者別 予約一覧を取得
  useEffect(() => {
    if (!currentPatient?.id) return;
    const fetchPatientReservations = async () => {
      try {
        const res = await fetch(
          `${BFF_BASE_URL}/bff/patients/${currentPatient.id}/examination-reservations`,
          { cache: 'no-store' },
        );
        if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        const data = await res.json() as { reservations: ExaminationReservation[] };
        setPatientReservations(data.reservations);
      } catch (e) {
        console.error('患者予約一覧の取得に失敗しました', e);
      }
    };
    fetchPatientReservations();
  }, [currentPatient?.id]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newMonth = new Date(currentMonth);
    if (direction === 'prev') {
      newMonth.setMonth(newMonth.getMonth() - 1);
    } else {
      newMonth.setMonth(newMonth.getMonth() + 1);
    }
    setCurrentMonth(newMonth);
  };

  const jumpToFuture = (months: number) => {
    const newMonth = new Date();
    newMonth.setMonth(newMonth.getMonth() + months);
    setCurrentMonth(newMonth);
    setSelectedDate(newMonth);
  };

  const jumpToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const endDate = new Date(lastDay);
    endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()));

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      days.push(new Date(date));
    }

    return days;
  };

  const getDateReservationStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayReservations = reservations.filter((r) => r.date === dateStr);

    if (dayReservations.length === 0) return 'empty';
    if (dayReservations.length >= 8) return 'full';
    return 'partial';
  };

  const getDateClassName = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isToday = date.getTime() === today.getTime();
    const isSelected = date.getTime() === selectedDate.getTime();
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const status = getDateReservationStatus(date);

    const base = 'w-8 h-8 rounded-lg cursor-pointer transition-colors text-center flex items-center justify-center relative';

    if (isSelected) return `${base} bg-primary text-primary-foreground`;
    if (isToday) return `${base} border-2 border-primary text-primary`;
    if (!isCurrentMonth) return `${base} text-muted-foreground`;
    if (status === 'full') return `${base} bg-destructive text-destructive-foreground`;
    return `${base} text-foreground hover:bg-accent hover:text-accent-foreground`;
  };

  const renderReservationDot = (date: Date) => {
    const status = getDateReservationStatus(date);
    if (status === 'empty' || status === 'full') return null;

    return <div className="absolute bottom-0 right-0 w-2 h-2 bg-chart-2 rounded-full" />;
  };

  const getReservationForSlot = (date: string, time: string) => {
    return reservations.find(
      (r) => r.date === date && r.equipment === selectedEquipment && r.startTime === time,
    );
  };

  const getSlotCapacity = (_timeSlot: string, _date: Date): number => {
    return equipmentList.find((e) => e.id === selectedEquipment)?.capacity ?? 3;
  };

  const getSlotReservations = (timeSlot: string, date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return reservations.filter(
      (r) => r.date === dateStr && r.equipment === selectedEquipment && r.startTime === timeSlot,
    );
  };

  const getSlotStatus = (timeSlot: string, date: Date) => {
    const slotReservations = getSlotReservations(timeSlot, date);
    const bookedCount = slotReservations.length;
    const slotCapacity = getSlotCapacity(timeSlot, date);

    return {
      bookedCount,
      totalCapacity: slotCapacity,
      isAvailable: bookedCount < slotCapacity,
      reservations: slotReservations,
    };
  };

  const handleSlotClick = (date: string, time: string) => {
    const existingReservation = getReservationForSlot(date, time);

    if (existingReservation) {
      setEditingReservation(existingReservation);
      setFormData({
        patientId: existingReservation.patientId,
        patientName: existingReservation.patientName,
        examType: existingReservation.examType,
        startTime: existingReservation.startTime,
        duration: '30',
        notes: existingReservation.notes || '',
        doctorId: existingReservation.doctorId || '',
        doctorName: existingReservation.doctorName || '',
      });
      setDialogOpen(true);
    } else {
      if (selectedUndecidedReservation) {
        setConfirmScheduleDialog({
          open: true,
          date,
          time,
          reservation: selectedUndecidedReservation,
        });
      } else {
        setEditingReservation(null);
        setSelectedSlot({ date, time });

        const currentEquipment = equipmentList.find((eq) => eq.id === selectedEquipment);
        let defaultExamType = '胸部CT';

        if (currentEquipment?.type === 'CT') {
          defaultExamType = '胸部CT';
        } else if (currentEquipment?.type === 'MRI') {
          defaultExamType = '頭部MRI';
        } else if (currentEquipment?.type === 'US') {
          defaultExamType = '腹部エコー';
        }

        const defaultDuration = getExamDuration(defaultExamType);

        setFormData({
          patientId: currentPatient?.id || '',
          patientName: currentPatient?.name || '',
          examType: defaultExamType,
          startTime: time,
          duration: defaultDuration.toString(),
          notes: '',
          doctorId: 'D001',
          doctorName: '医師 001',
        });

        setDialogOpen(true);
      }
    }
  };

  const handleConfirmSchedule = async () => {
    const { date, time, reservation } = confirmScheduleDialog;
    if (!reservation) return;

    const duration = getExamDuration(reservation.examType);
    const [startHour, startMinute] = time.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(startHour, startMinute + duration, 0);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    try {
      const res = await fetch(
        `${BFF_BASE_URL}/bff/patients/${currentPatient?.id ?? 'P001'}/examination-reservations/${reservation.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date, startTime: time, endTime: endTimeStr }),
        },
      );
      if (!res.ok) throw new Error(`BFF error: ${res.status}`);
    } catch (e) {
      console.error('予約日時確定の BFF 送信に失敗しました', e);
      toast.error(t.toast.requiredFields);
      return;
    }

    const confirmedReservation: ExaminationReservation = {
      ...reservation,
      date,
      startTime: time,
      endTime: endTimeStr,
    };

    setPatientReservations((prev) =>
      prev.map((r) => (r.id === reservation.id ? confirmedReservation : r)),
    );

    setReservations((prev) => {
      const exists = prev.some((r) => r.id === reservation.id);
      if (exists) {
        return prev.map((r) => (r.id === reservation.id ? confirmedReservation : r));
      } else {
        return [...prev, confirmedReservation];
      }
    });

    toast.success(t.toast.scheduleConfirmed(reservation.examType, date, time));

    setConfirmScheduleDialog({ open: false, date: '', time: '', reservation: null });
    setSelectedUndecidedReservation(null);
  };

  const handleSaveReservation = async () => {
    if (!formData.examType || !formData.startTime || !formData.doctorId) {
      toast.error(t.toast.requiredFields);
      return;
    }

    const duration = parseInt(formData.duration);
    const [startHour, startMinute] = formData.startTime.split(':').map(Number);
    const endTime = new Date();
    endTime.setHours(startHour, startMinute + duration, 0);
    const endTimeStr = `${endTime.getHours().toString().padStart(2, '0')}:${endTime.getMinutes().toString().padStart(2, '0')}`;

    if (editingReservation) {
      const updatedReservation = {
        ...editingReservation,
        patientId: currentPatient?.id || formData.patientId,
        patientName: currentPatient?.name || formData.patientName,
        examType: formData.examType,
        startTime: formData.startTime,
        endTime: endTimeStr,
        notes: formData.notes,
        doctorId: formData.doctorId,
        doctorName: formData.doctorName,
      };

      setReservations((prev) =>
        prev.map((r) => (r.id === editingReservation.id ? updatedReservation : r)),
      );

      setPatientReservations((prev) =>
        prev.map((r) => (r.id === editingReservation.id ? updatedReservation : r)),
      );

      toast.success(t.toast.reservationUpdated);
    } else {
      const newReservation: ExaminationReservation = {
        id: selectedUndecidedReservation?.id || `r${Date.now()}`,
        patientId: currentPatient?.id || formData.patientId,
        patientName: currentPatient?.name || formData.patientName,
        examType: formData.examType,
        startTime: formData.startTime,
        endTime: endTimeStr,
        date: selectedSlot!.date,
        equipment: selectedEquipment,
        status: 'scheduled',
        notes: formData.notes,
        doctorId: formData.doctorId,
        doctorName: formData.doctorName,
      };

      if (selectedUndecidedReservation) {
        try {
          const res = await fetch(
            `${BFF_BASE_URL}/bff/patients/${currentPatient?.id ?? 'P001'}/examination-reservations/${selectedUndecidedReservation.id}`,
            {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ date: selectedSlot!.date, startTime: formData.startTime, endTime: endTimeStr }),
            },
          );
          if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        } catch (e) {
          console.error('予約日時確定の BFF 送信に失敗しました', e);
          toast.error(t.toast.requiredFields);
          return;
        }

        setPatientReservations((prev) =>
          prev.map((r) => (r.id === selectedUndecidedReservation.id ? newReservation : r)),
        );

        setReservations((prev) => {
          const exists = prev.some((r) => r.id === selectedUndecidedReservation.id);
          if (exists) {
            return prev.map((r) => (r.id === selectedUndecidedReservation.id ? newReservation : r));
          } else {
            return [...prev, newReservation];
          }
        });

        toast.success(t.toast.reservationCreatedConfirmed(formData.examType, selectedSlot!.date, formData.startTime));
      } else {
        try {
          const res = await fetch(
            `${BFF_BASE_URL}/bff/patients/${currentPatient?.id ?? 'P001'}/examination-reservations`,
            {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                patientName: currentPatient?.name ?? formData.patientName,
                examType: formData.examType,
                startTime: formData.startTime,
                endTime: endTimeStr,
                date: selectedSlot!.date,
                equipment: selectedEquipment,
                notes: formData.notes,
                doctorId: formData.doctorId,
                doctorName: formData.doctorName,
              }),
            },
          );
          if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        } catch (e) {
          console.error('予約作成の BFF 送信に失敗しました', e);
          toast.error(t.toast.requiredFields);
          return;
        }

        setReservations((prev) => [...prev, newReservation]);
        setPatientReservations((prev) => [...prev, newReservation]);
        toast.success(t.toast.reservationCreated);
        const params = new URLSearchParams({ scheduledDate: selectedSlot!.date, scheduledTime: formData.startTime });
        if (orderId) params.set('updatedOrderId', orderId);
        router.push(`/karte/P001?${params.toString()}`);
        return;
      }
    }

    setDialogOpen(false);
    setEditingReservation(null);
    setSelectedSlot(null);
    setSelectedUndecidedReservation(null);
  };

  const handleDeleteReservation = () => {
    if (editingReservation) {
      setReservations((prev) => prev.filter((r) => r.id !== editingReservation.id));
      toast.success(t.toast.reservationDeleted);
      setDialogOpen(false);
      setEditingReservation(null);
    }
  };

  const calendarDays = generateCalendarDays();
  const weekDayNames = t.weekDayNames;
  const gridDayNames = t.gridDayNames;

  const handleCancelEditPatientReservation = () => {
    setEditingPatientReservation(null);
    setEditPatientDate('');
    setEditPatientTime('');
    setIsEditingDateUndecided(false);
  };

  const handleSaveEditPatientReservation = async () => {
    if (!editingPatientReservation) return;

    const newDate = isEditingDateUndecided ? '未定' : editPatientDate;
    const newStartTime = isEditingDateUndecided ? '未定' : editPatientTime;
    const newEndTime = isEditingDateUndecided ? '未定' : editPatientTime;

    try {
      const res = await fetch(
        `${BFF_BASE_URL}/bff/patients/${currentPatient?.id ?? 'P001'}/examination-reservations/${editingPatientReservation.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: newDate, startTime: newStartTime, endTime: newEndTime }),
        },
      );
      if (!res.ok) throw new Error(`BFF error: ${res.status}`);
    } catch (e) {
      console.error('予約日時更新の BFF 送信に失敗しました', e);
      toast.error(t.toast.requiredFields);
      return;
    }

    setPatientReservations((prev) =>
      prev.map((r) =>
        r.id === editingPatientReservation.id
          ? { ...r, date: newDate, startTime: newStartTime, endTime: newEndTime }
          : r,
      ),
    );
    setEditingPatientReservation(null);
    setEditPatientDate('');
    setEditPatientTime('');
    setIsEditingDateUndecided(false);
    toast.success(t.toast.editDateSaved);
  };

  const handleDateSelection = (date: Date) => {
    if (editingPatientReservation) {
      const dateStr = date.toISOString().split('T')[0];
      setEditPatientDate(dateStr);
    } else {
      setSelectedDate(date);
    }
  };

  return (
    <div className="flex-1 flex bg-background overflow-hidden">
      {/* 左ペイン: 月カレンダー */}
      <div className="w-64 border-r border-border bg-background flex flex-col">
        {/* ヘッダー */}
        <div className="border-b border-border p-4">
          {onBack && (
            <div className="flex items-center gap-2 mb-4">
              <Button variant="outline" size="sm" onClick={onBack}>
                {t.backBtn}
              </Button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <Monitor className="w-5 h-5 text-blue-600" />
            <h1 className="font-medium">{t.title}</h1>
          </div>
        </div>

        {/* 検査室一覧 */}
        <div className="border-b border-border">
          <div className="p-3 bg-muted/30">
            <h3 className="text-sm font-medium">{t.equipmentSection}</h3>
          </div>
          <div className="max-h-96 overflow-y-auto">
            {equipmentList.map((equipment) => {
              const undecidedCount = getUndecidedCountByEquipment(equipment.id);
              const undecidedReservations = getUndecidedReservationsByEquipment(equipment.id);
              const isSelected = selectedEquipment === equipment.id;
              const isExpanded = expandedEquipment === equipment.id;

              return (
                <div key={equipment.id} className="border-b border-border last:border-b-0">
                  <div className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => setSelectedEquipment(equipment.id)}
                      className={`w-full px-4 py-3 flex items-center justify-between hover:bg-accent/50 transition-colors ${isSelected ? 'bg-primary/10' : ''}`}
                    >
                      <div className="flex items-center gap-2">
                        <Monitor className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={`text-sm ${isSelected ? 'font-medium text-primary' : ''}`}>
                          {equipment.name}
                        </span>
                      </div>
                    </button>

                    {undecidedCount > 0 && (
                      <button
                        type="button"
                        onClick={() => setExpandedEquipment(isExpanded ? null : equipment.id)}
                        className="w-full px-4 py-2 flex items-center justify-between hover:bg-accent/30 transition-colors border-t border-border/50"
                      >
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{t.undecidedLabel}</span>
                          <Badge variant="destructive">{t.undecidedBadge(undecidedCount)}</Badge>
                        </div>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>
                    )}
                  </div>

                  {isExpanded && undecidedReservations.length > 0 && (
                    <div className="bg-muted/20 divide-y divide-border">
                      {undecidedReservations.map((reservation) => {
                        const isReservationSelected = selectedUndecidedReservation?.id === reservation.id;

                        return (
                          <button
                            key={reservation.id}
                            type="button"
                            onClick={() => {
                              setSelectedUndecidedReservation(isReservationSelected ? null : reservation);
                            }}
                            className={`w-full px-6 py-2.5 text-left hover:bg-accent/50 transition-colors ${isReservationSelected ? 'bg-blue-100' : ''}`}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${isReservationSelected ? 'bg-blue-600' : 'bg-orange-500'}`} />
                              <div className="flex-1 min-w-0">
                                <div className={`text-sm font-medium ${isReservationSelected ? 'text-blue-900' : 'text-foreground'}`}>
                                  {reservation.examType}
                                </div>
                                <div className="text-xs text-muted-foreground mt-0.5">
                                  {reservation.patientName}
                                </div>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* 月カレンダー */}
        <div className="flex-1 p-4 overflow-y-auto">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="sm" onClick={() => navigateMonth('prev')} className="p-1">
              <ChevronLeft className="w-4 h-4" />
            </Button>

            <h2 className="font-medium">
              {t.calendarMonthLabel(currentMonth.getFullYear(), currentMonth.getMonth() + 1)}
            </h2>

            <Button variant="ghost" size="sm" onClick={() => navigateMonth('next')} className="p-1">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>

          <div className="mb-4 space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" size="sm" onClick={jumpToToday} className="text-xs">
                {t.calendarToday}
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToFuture(1)} className="text-xs">
                {t.calendar1Month}
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToFuture(3)} className="text-xs">
                {t.calendar3Months}
              </Button>
              <Button variant="outline" size="sm" onClick={() => jumpToFuture(6)} className="text-xs">
                {t.calendar6Months}
              </Button>
            </div>
            <Button variant="outline" size="sm" onClick={() => jumpToFuture(12)} className="w-full text-xs">
              {t.calendar12Months}
            </Button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {weekDayNames.map((day) => (
              <div key={day} className="h-8 flex items-center justify-center text-sm text-muted-foreground">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((date) => (
              <div
                key={date.toISOString()}
                className={getDateClassName(date)}
                role="button"
                tabIndex={0}
                onClick={() => handleDateSelection(date)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleDateSelection(date);
                }}
              >
                {date.getDate()}
                {renderReservationDot(date)}
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-2">
            <div className="text-sm text-muted-foreground mb-2">{t.calendarLegendTitle}</div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 border-2 border-primary rounded" />
              <span>{t.calendarLegendToday}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-chart-2 rounded-full" />
              <span>{t.calendarLegendPartial}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <div className="w-3 h-3 bg-destructive rounded" />
              <span>{t.calendarLegendFull}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 中央ペイン: 週間スケジュール */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <div className="border-b border-border p-3 bg-muted/30">
          <div className="flex items-center justify-center gap-2">
            <CalendarDays className="w-4 h-4" />
            <span className="font-medium">
              {t.weekRangeLabel(
                `${weekDates[0].getMonth() + 1}月${weekDates[0].getDate()}日`,
                `${weekDates[6].getMonth() + 1}月${weekDates[6].getDate()}日`,
                String(weekDates[0].getFullYear()),
              )}
            </span>
            <span className="text-sm text-muted-foreground ml-2">
              {equipmentList.find((e) => e.id === selectedEquipment)?.name}
            </span>
          </div>

          <div className="mt-2 flex items-center justify-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded" />
              <span className="text-muted-foreground">{t.slotAvailabilityLegend.empty}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-blue-100 border border-gray-300 rounded" />
              <span className="text-muted-foreground">{t.slotAvailabilityLegend.low}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-yellow-100 border border-gray-300 rounded" />
              <span className="text-muted-foreground">{t.slotAvailabilityLegend.mid}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-4 bg-red-100 border border-gray-300 rounded" />
              <span className="text-muted-foreground">{t.slotAvailabilityLegend.full}</span>
            </div>
          </div>

          {selectedUndecidedReservation && (
            <div className="mt-2 p-2 bg-blue-100 border border-blue-300 rounded-lg flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-pulse" />
                <span className="text-sm font-medium text-blue-900">
                  {t.undecidedBanner(selectedUndecidedReservation.examType)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedUndecidedReservation(null)}
                className="p-1 hover:bg-blue-200 rounded transition-colors"
                aria-label={t.cancelUndecidedSelection}
              >
                <X className="w-4 h-4 text-blue-900" />
              </button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto p-4">
          <Card className="overflow-hidden">
            <div
              className="grid border-b border-border bg-muted/50"
              style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}
            >
              <div className="p-3 text-center font-medium border-r border-border">
                <Clock className="w-4 h-4 mx-auto mb-1" />
                {t.timeAxisLabel}
              </div>

              {weekDates.map((date, index) => {
                const isWeekend = index >= 5;
                const isSelected = date.getTime() === selectedDate.getTime();

                return (
                  <div
                    key={date.toISOString()}
                    className={`p-3 text-center border-r border-border last:border-r-0 cursor-pointer ${isSelected ? 'bg-primary/10' : ''} ${isWeekend ? 'bg-red-50' : ''}`}
                    role="button"
                    tabIndex={0}
                    onClick={() => handleDateSelection(date)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') handleDateSelection(date);
                    }}
                  >
                    <div className={`font-medium ${isSelected ? 'text-primary' : ''} ${isWeekend ? 'text-red-600' : ''}`}>
                      {gridDayNames[index]}
                    </div>
                    <div className={`text-sm text-muted-foreground ${isSelected ? 'text-primary' : ''} ${isWeekend ? 'text-red-600' : ''}`}>
                      {date.getMonth() + 1}/{date.getDate()}
                    </div>
                  </div>
                );
              })}
            </div>

            {timeSlots.map((timeSlot) => (
              <div
                key={timeSlot}
                className="grid border-b border-border last:border-b-0"
                style={{ gridTemplateColumns: '64px repeat(7, 1fr)' }}
              >
                <div className="p-2 text-center border-r border-border bg-muted/30 flex items-center justify-center min-h-[4rem]">
                  <span className="text-sm font-medium">{timeSlot}</span>
                </div>

                {weekDates.map((date) => {
                  const { bookedCount, totalCapacity, isAvailable, reservations: slotReservations } =
                    getSlotStatus(timeSlot, date);

                  let slotBg = '';
                  if (!isAvailable) {
                    slotBg = 'bg-red-100 hover:opacity-80';
                  } else if (bookedCount > 0) {
                    const percentage = bookedCount / totalCapacity;
                    if (percentage >= 0.7) {
                      slotBg = 'bg-yellow-100';
                    } else if (percentage >= 0.3) {
                      slotBg = 'bg-blue-100';
                    }
                  }

                  const dateStr = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;

                  return (
                    <div
                      key={date.toISOString()}
                      className={`px-2 py-1 border-r border-border last:border-r-0 cursor-pointer transition-colors min-h-[4rem] hover:bg-accent/50 ${slotBg}`}
                      role="button"
                      tabIndex={0}
                      onClick={() => handleSlotClick(dateStr, timeSlot)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') handleSlotClick(dateStr, timeSlot);
                      }}
                    >
                      <div className="h-full flex flex-col gap-1">
                        {slotReservations.slice(0, 3).map((reservation) => (
                          <div
                            key={reservation.id}
                            className="bg-white border border-blue-300 rounded px-2 py-1 hover:bg-blue-50 transition-colors"
                            role="button"
                            tabIndex={0}
                            onClick={(e) => {
                              e.stopPropagation();
                              setEditingReservation(reservation);
                              setFormData({
                                patientId: reservation.patientId,
                                patientName: reservation.patientName,
                                examType: reservation.examType,
                                startTime: reservation.startTime,
                                duration: '30',
                                notes: reservation.notes || '',
                                doctorId: reservation.doctorId || '',
                                doctorName: reservation.doctorName || '',
                              });
                              setDialogOpen(true);
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.stopPropagation();
                                setEditingReservation(reservation);
                                setFormData({
                                  patientId: reservation.patientId,
                                  patientName: reservation.patientName,
                                  examType: reservation.examType,
                                  startTime: reservation.startTime,
                                  duration: '30',
                                  notes: reservation.notes || '',
                                  doctorId: reservation.doctorId || '',
                                  doctorName: reservation.doctorName || '',
                                });
                                setDialogOpen(true);
                              }
                            }}
                          >
                            <div className="text-xs font-medium truncate">
                              {reservation.patientName}
                            </div>
                            <div className="text-xs text-blue-600 truncate">
                              {reservation.examType}
                            </div>
                            {reservation.checkedIn && (
                              <div className="text-xs text-green-600 font-medium truncate">
                                {t.reservationCheckedIn}
                              </div>
                            )}
                          </div>
                        ))}

                        <div className={`text-xs text-right text-muted-foreground ${bookedCount === 0 ? 'mt-auto' : ''}`}>
                          {bookedCount}/{totalCapacity}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </Card>
        </div>
      </div>

      {/* 右ペイン: 患者予約一覧 */}
      <PatientReservationList
        currentPatient={currentPatient}
        examinationReservations={patientReservations.map((r) => ({
          ...r,
          type: 'examination' as const,
        }))}
        appointmentReservations={[]}
        showType="examination"
      />

      {/* 予約日時確定の確認ダイアログ */}
      {confirmScheduleDialog.open && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-[450px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="confirm-schedule-dialog-title"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 id="confirm-schedule-dialog-title" className="font-medium">{t.confirmScheduleDialog.title}</h3>
            </div>

            <div className="mb-6">
              <p className="text-sm mb-4">{t.confirmScheduleDialog.description}</p>

              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-[80px]">{t.confirmScheduleDialog.examTypeLabel}</span>
                  <span className="text-sm font-medium">
                    {confirmScheduleDialog.reservation?.examType}
                  </span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-[80px]">{t.confirmScheduleDialog.dateLabel}</span>
                  <span className="text-sm font-medium">{confirmScheduleDialog.date}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-[80px]">{t.confirmScheduleDialog.timeLabel}</span>
                  <span className="text-sm font-medium">{confirmScheduleDialog.time}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-sm font-medium text-muted-foreground min-w-[80px]">{t.confirmScheduleDialog.durationLabel}</span>
                  <span className="text-sm font-medium">
                    {confirmScheduleDialog.reservation
                      ? getExamDuration(confirmScheduleDialog.reservation.examType)
                      : '-'}
                    {t.confirmScheduleDialog.durationUnit}
                  </span>
                </div>
                {confirmScheduleDialog.reservation?.notes && (
                  <div className="flex items-start gap-2">
                    <span className="text-sm font-medium text-muted-foreground min-w-[80px]">{t.confirmScheduleDialog.notesLabel}</span>
                    <span className="text-sm font-medium">
                      {confirmScheduleDialog.reservation.notes}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={() =>
                  setConfirmScheduleDialog({ open: false, date: '', time: '', reservation: null })
                }
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                {t.confirmScheduleDialog.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
              >
                {t.confirmScheduleDialog.confirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 予約作成・編集ダイアログ */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-blue-600" />
              {editingReservation ? t.reservationDialog.editTitle : t.reservationDialog.addTitle}
            </DialogTitle>
            <DialogDescription>
              {editingReservation
                ? t.reservationDialog.editDescription
                : t.reservationDialog.addDescription}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {editingReservation ? (
              <>
                <div className="p-4 bg-muted/30 rounded-lg space-y-3">
                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {t.reservationDialog.examTypeSectionTitle}
                    </div>
                    <div className="text-base">
                      {editingReservation.examType}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {t.reservationDialog.doctorSectionTitle}
                    </div>
                    <div className="text-base">
                      {editingReservation.doctorName || t.reservationDialog.doctorDefault}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {t.reservationDialog.timeSectionTitle}
                    </div>
                    <div className="text-base">
                      {editingReservation.startTime}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {t.reservationDialog.durationSectionTitle}
                    </div>
                    <div className="text-base">
                      {getExamDuration(editingReservation.examType)}
                      {t.reservationDialog.durationUnit}
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium text-muted-foreground mb-1">
                      {t.reservationDialog.notesSectionTitle}
                    </div>
                    <div className="text-base">
                      {editingReservation.notes || t.reservationDialog.notesEmpty}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button onClick={() => setDialogOpen(false)}>{t.reservationDialog.backBtn}</Button>
                </div>
              </>
            ) : (
              <>
                <div>
                  <Label htmlFor="reservationDate">{t.reservationDialog.reservationDateLabel}</Label>
                  <Input
                    id="reservationDate"
                    value={selectedSlot?.date || ''}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="examType">{t.reservationDialog.examTypeLabel}</Label>
                  <Input
                    id="examType"
                    value={formData.examType}
                    disabled
                    className="bg-muted"
                  />
                </div>

                <div>
                  <Label htmlFor="doctorId">{t.reservationDialog.doctorLabel}</Label>
                  <Select
                    value={formData.doctorId}
                    onValueChange={(value) => {
                      const selectedDoctor = doctorList.find((d) => d.id === value);
                      setFormData((prev) => ({
                        ...prev,
                        doctorId: value,
                        doctorName: selectedDoctor?.name || '',
                      }));
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t.reservationDialog.doctorPlaceholder} />
                    </SelectTrigger>
                    <SelectContent>
                      {doctorList.map((doctor) => (
                        <SelectItem key={doctor.id} value={doctor.id}>
                          {doctor.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="startTime">{t.reservationDialog.startTimeLabel}</Label>
                    <Select
                      value={formData.startTime}
                      onValueChange={(value) => setFormData((prev) => ({ ...prev, startTime: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t.reservationDialog.startTimePlaceholder} />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="duration">{t.reservationDialog.durationLabel}</Label>
                    <Input
                      id="duration"
                      value={formData.examType ? `${getExamDuration(formData.examType)}${t.reservationDialog.durationUnit}` : '-'}
                      disabled
                      className="bg-muted"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="notes">{t.reservationDialog.notesLabel}</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
                    placeholder={t.reservationDialog.notesPlaceholder}
                    rows={3}
                  />
                </div>

                <div className="flex gap-2 pt-2">
                  <Button variant="outline" onClick={() => setDialogOpen(false)} className="flex-1">
                    {t.reservationDialog.cancelBtn}
                  </Button>
                  <Button onClick={handleSaveReservation} className="flex-1">
                    {t.reservationDialog.confirmBtn}
                  </Button>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 患者予約編集モーダル */}
      {editingPatientReservation && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-[500px] max-h-[80vh] overflow-y-auto"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-patient-reservation-dialog-title"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 id="edit-patient-reservation-dialog-title" className="font-medium">{t.editPatientReservationModal.title}</h3>
            </div>

            <div className="space-y-4">
              <div className="p-3 bg-muted/30 rounded-lg">
                <div className="text-sm">
                  <div className="font-medium">
                    {editingPatientReservation.equipment === 'DOCTOR'
                      ? editingPatientReservation.examType
                      : `${editingPatientReservation.examType}(${editingPatientReservation.equipment})`}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <input
                  type="checkbox"
                  id="dateUndecidedEditExam"
                  checked={isEditingDateUndecided}
                  onChange={(e) => setIsEditingDateUndecided(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="dateUndecidedEditExam" className="text-sm cursor-pointer">
                  {t.editPatientReservationModal.dateUndecidedCheckbox}
                </label>
              </div>

              {!isEditingDateUndecided && (
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t.editPatientReservationModal.dateLabel}
                    </label>
                    <input
                      type="date"
                      value={editPatientDate}
                      onChange={(e) => setEditPatientDate(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1">
                      {t.editPatientReservationModal.timeLabel}
                    </label>
                    <select
                      value={editPatientTime}
                      onChange={(e) => setEditPatientTime(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-md"
                    >
                      <option value="">{t.editPatientReservationModal.timeDefaultOption}</option>
                      {Array.from({ length: 17 }, (_, i) => {
                        const hour = Math.floor(9 + i / 2);
                        const minute = (i % 2) * 30;
                        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
                        return (
                          <option key={timeStr} value={timeStr}>
                            {timeStr}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                </div>
              )}

              {isEditingDateUndecided && (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    {t.editPatientReservationModal.dateUndecidedMessage}
                  </p>
                </div>
              )}
            </div>

            <div className="flex gap-2 justify-end mt-6">
              <button
                type="button"
                onClick={handleCancelEditPatientReservation}
                className="px-4 py-2 border border-border rounded hover:bg-muted transition-colors"
              >
                {t.editPatientReservationModal.cancelBtn}
              </button>
              <button
                type="button"
                onClick={handleSaveEditPatientReservation}
                disabled={!isEditingDateUndecided && (!editPatientDate || !editPatientTime)}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t.editPatientReservationModal.saveBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

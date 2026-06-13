import { useState } from 'react';
import { AppointmentCalendar } from './AppointmentCalendar';
import { AppointmentSchedule } from '../organisms/AppointmentSchedule';
import type { CurrentPatient } from '../../../types/order.types';

export interface Appointment {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  date: string;
  patientName?: string;
  type?: 'consultation' | 'procedure' | 'follow-up';
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

interface AppointmentManagementProps {
  currentPatient?: CurrentPatient;
}

export function AppointmentManagement({ currentPatient }: AppointmentManagementProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  // 今日の日付を取得
  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  const dayAfterStr = dayAfter.toISOString().split('T')[0];

  const [appointments, setAppointments] = useState<Appointment[]>([
    // 今日の予約
    {
      id: '1',
      title: '定期診察',
      startTime: '09:00',
      endTime: '09:30',
      date: todayStr,
      patientName: '田中太郎',
      type: 'consultation',
      status: 'confirmed'
    },
    {
      id: '2',
      title: '血圧測定',
      startTime: '09:30',
      endTime: '10:00',
      date: todayStr,
      patientName: '佐藤花子',
      type: 'procedure',
      status: 'confirmed'
    },
    {
      id: '3',
      title: '初診',
      startTime: '10:30',
      endTime: '11:00',
      date: todayStr,
      patientName: '山田次郎',
      type: 'consultation',
      status: 'confirmed'
    },
    {
      id: '4',
      title: '検査結果説明',
      startTime: '14:00',
      endTime: '14:30',
      date: todayStr,
      patientName: '鈴木一郎',
      type: 'follow-up',
      status: 'confirmed'
    },
    {
      id: '5',
      title: 'フォローアップ診察',
      startTime: '15:30',
      endTime: '16:00',
      date: todayStr,
      patientName: '高橋美子',
      type: 'follow-up',
      status: 'confirmed'
    },
    
    // 明日の予約
    {
      id: '6',
      title: '定期診察',
      startTime: '09:00',
      endTime: '09:30',
      date: tomorrowStr,
      patientName: '伊藤博',
      type: 'consultation',
      status: 'confirmed'
    },
    {
      id: '7',
      title: '注射',
      startTime: '11:00',
      endTime: '11:30',
      date: tomorrowStr,
      patientName: '渡辺恵子',
      type: 'procedure',
      status: 'confirmed'
    },
    {
      id: '8',
      title: '術後チェック',
      startTime: '13:00',
      endTime: '14:00',
      date: tomorrowStr,
      patientName: '小林健太',
      type: 'follow-up',
      status: 'confirmed'
    },
    
    // 明後日の予約
    {
      id: '9',
      title: '健康診断',
      startTime: '10:00',
      endTime: '11:00',
      date: dayAfterStr,
      patientName: '中村聡',
      type: 'procedure',
      status: 'confirmed'
    },
    {
      id: '10',
      title: '再診',
      startTime: '14:30',
      endTime: '15:00',
      date: dayAfterStr,
      patientName: '木村優子',
      type: 'consultation',
      status: 'confirmed'
    }
  ]);

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  const handleAppointmentCreate = (appointment: Omit<Appointment, 'id'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: `${Date.now()}-${Math.random()}`
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const handleAppointmentUpdate = (appointment: Appointment) => {
    setAppointments(prev => 
      prev.map(apt => apt.id === appointment.id ? appointment : apt)
    );
  };

  const handleAppointmentDelete = (appointmentId: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== appointmentId));
  };

  return (
    <div className="flex h-screen bg-background">
      {/* 左ペイン: カレンダー */}
      <div className="w-75 border-r border-border bg-card"> {/* 300px */}
        <AppointmentCalendar
          selectedDate={selectedDate}
          onDateSelect={handleDateSelect}
          appointments={appointments}
        />
      </div>

      {/* 右ペイン: スケジュール表 */}
      <div className="w-950 bg-background"> {/* 450px + 500px = 950px */}
        <AppointmentSchedule
          selectedDate={selectedDate}
          appointments={appointments}
          onAppointmentCreate={handleAppointmentCreate}
          onAppointmentUpdate={handleAppointmentUpdate}
          onAppointmentDelete={handleAppointmentDelete}
          currentPatient={currentPatient}
        />
      </div>
    </div>
  );
}
import { useState } from 'react';
import { AppointmentCalendar } from './AppointmentCalendar';
import { AppointmentSchedule } from './AppointmentSchedule';

export function AppointmentView() {
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* 左ペイン: カレンダー */}
      <AppointmentCalendar 
        selectedDate={selectedDate}
        onDateSelect={handleDateSelect}
      />
      
      {/* 右ペイン: スケジュール表 */}
      <AppointmentSchedule selectedDate={selectedDate} />
    </div>
  );
}
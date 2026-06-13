// [SCOPE-OUT: ETC005] 関連機能追加時にコメントアウトを解除する
import { useState } from 'react';
import { AppointmentCalendar } from '../../molecules/right-sidemenu/AppointmentCalendar';
import { AppointmentSchedule } from '../../molecules/right-sidemenu/AppointmentSchedule';

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
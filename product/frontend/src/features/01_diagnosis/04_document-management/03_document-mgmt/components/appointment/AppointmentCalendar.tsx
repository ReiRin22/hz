import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Appointment } from '../../src/types/appointment';

interface AppointmentCalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  appointments: Appointment[];
}

export function AppointmentCalendar({ 
  selectedDate, 
  onDateSelect, 
  appointments 
}: AppointmentCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // 月の移動
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
  const getDateAppointmentStatus = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    const dayAppointments = appointments.filter(apt => apt.date === dateStr);
    
    if (dayAppointments.length === 0) return 'empty';
    if (dayAppointments.length >= 6) return 'full'; // 満枠の基準
    return 'partial';
  };

  // 日付のスタイルクラスを取得
  const getDateClassName = (date: Date) => {
    const isToday = date.getTime() === today.getTime();
    const isSelected = date.getTime() === selectedDate.getTime();
    const isCurrentMonth = date.getMonth() === currentMonth.getMonth();
    const status = getDateAppointmentStatus(date);
    
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
  const renderAppointmentDot = (date: Date) => {
    const status = getDateAppointmentStatus(date);
    if (status === 'empty' || status === 'full') return null;
    
    return (
      <div className="absolute bottom-0 right-0 w-2 h-2 bg-chart-2 rounded-full"></div>
    );
  };

  const calendarDays = generateCalendarDays();
  const weekDays = ['日', '月', '火', '水', '木', '金', '土'];

  return (
    <div className="p-4">
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
            onClick={() => onDateSelect(date)}
          >
            {date.getDate()}
            {renderAppointmentDot(date)}
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
  );
}

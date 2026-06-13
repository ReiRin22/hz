import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@shared/components/atoms/card";
import { Button } from "@shared/components/atoms/button";
import { Badge } from "@shared/components/atoms/badge";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";

interface MedicalRecord {
  id: string;
  date: string;
  time: string;
  type: "progress" | "nursing" | "prescription" | "test";
  title: string;
  content: string;
  author: string;
}

interface MedicalCalendarProps {
  records: MedicalRecord[];
  onDateSelect?: (date: string) => void;
  selectedDate?: string;
}

export function MedicalCalendar({ records, onDateSelect, selectedDate }: MedicalCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // 今日の日付をYYYY/MM/DD形式で取得
  const today = new Date().toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).replace(/\//g, '/');

  // 記録がある日付のセットを作成
  const recordDates = new Set(records.map(record => record.date));

  // 指定された月のカレンダーデータを生成
  const generateCalendarData = (year: number, month: number) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days = [];
    const current = new Date(startDate);

    while (current <= lastDay || current.getDay() !== 0) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // 月の表示用データを生成
  const getMonthData = (monthOffset: number) => {
    const targetDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const monthName = targetDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long' });
    const days = generateCalendarData(year, month);

    return { year, month, monthName, days };
  };

  // 日付クリック処理
  const handleDateClick = (date: Date) => {
    const dateString = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');
    
    if (onDateSelect) {
      onDateSelect(dateString);
    }
  };

  // 日付のスタイルを取得
  const getDateStyle = (date: Date, month: number) => {
    const dateString = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');

    const isCurrentMonth = date.getMonth() === month;
    const isToday = dateString === today;
    const hasRecord = recordDates.has(dateString);
    const isSelected = dateString === selectedDate;

    let className = "w-7 h-7 rounded-md text-xs font-medium transition-all duration-200 cursor-pointer flex items-center justify-center hover:scale-105 ";

    if (!isCurrentMonth) {
      className += "text-muted-foreground opacity-40 ";
    }

    if (isSelected) {
      className += "medical-primary text-white shadow-md ring-2 ring-blue-200 ";
    } else if (isToday) {
      className += "bg-blue-50 text-blue-700 border-2 border-blue-400 font-bold shadow-sm ";
    } else if (hasRecord) {
      className += "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100 font-medium ";
    } else if (isCurrentMonth) {
      className += "hover:bg-gray-50 text-gray-700 ";
    } else {
      className += "hover:bg-gray-25 ";
    }

    return className;
  };

  // 前の月へ
  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  // 次の月へ
  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  // 曜日ヘッダー
  const weekdays = ['日', '月', '火', '水', '木', '金', '土'];

  // 3か月分のデータを取得
  const months = [-1, 0, 1].map(offset => getMonthData(offset));

  return (
    <Card className="h-fit">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2 text-lg">
            <Calendar className="w-5 h-5 medical-text-primary" />
            <span>診療カレンダー</span>
          </CardTitle>
          <div className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousMonth}
              className="w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextMonth}
              className="w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        {/* 凡例 */}
        <div className="grid grid-cols-3 gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-50 border-2 border-blue-400 rounded"></div>
            <span className="text-muted-foreground">今日</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-50 border border-green-200 rounded"></div>
            <span className="text-muted-foreground">記録</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 medical-primary rounded"></div>
            <span className="text-muted-foreground">選択</span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {months.map((monthData, monthIndex) => (
          <div key={`${monthData.year}-${monthData.month}`} className="space-y-3">
            <div className="text-sm font-semibold text-center medical-text-primary bg-gradient-to-r from-blue-50 to-blue-50 py-1 rounded-md">
              {monthData.monthName}
            </div>
            
            {/* 曜日ヘッダー */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {weekdays.map((day, index) => (
                <div key={day} className={`text-xs text-center py-1 font-medium ${
                  index === 0 ? 'text-red-500' : index === 6 ? 'text-blue-500' : 'text-muted-foreground'
                }`}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* カレンダーグリッド */}
            <div className="grid grid-cols-7 gap-1">
              {monthData.days.map((date, dateIndex) => (
                <div
                  key={dateIndex}
                  className={getDateStyle(date, monthData.month)}
                  onClick={() => handleDateClick(date)}
                  title={`${date.toLocaleDateString('ja-JP')}${recordDates.has(date.toLocaleDateString('ja-JP', {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  }).replace(/\//g, '/')) ? ' - 記録あり' : ''}`}
                >
                  {date.getDate()}
                </div>
              ))}
            </div>
          </div>
        ))}
        
        {/* 記録数サマリー */}
        <div className="pt-4 border-t">
          <div className="text-xs text-muted-foreground text-center">
            総記録数: <Badge variant="secondary" className="ml-1">{records.length}件</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../atoms/dialog';
import { Button } from '../atoms/button';
import { Calendar } from '../atoms/calendar';
import { Badge } from '../atoms/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../atoms/card';
import { Separator } from '../atoms/separator';
import { ScrollArea } from '../atoms/scroll-area';
import { X, Clock, Users, CheckCircle } from 'lucide-react';

interface TimeSlot {
  time: string;
  available: boolean;
  patientName?: string;
  patientId?: string;
  type?: 'appointment' | 'blocked';
}

interface AppointmentSchedulerDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDateTime: (date: string, time: string) => void;
  doctor: string;
}

export function AppointmentSchedulerDialog({ 
  isOpen, 
  onClose, 
  onSelectDateTime, 
  doctor 
}: AppointmentSchedulerDialogProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedDateString, setSelectedDateString] = useState<string>('');

  // 医師の予約スケジュールデータ（実際の実装では API から取得）
  const [scheduleData] = useState(() => {
    const today = new Date();
    const schedules: Record<string, TimeSlot[]> = {};
    
    // 1ヶ月分のスケジュールを生成
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      const dateKey = date.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/');
      
      // 平日のスケジュール（土日は休み）
      const dayOfWeek = date.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        schedules[dateKey] = [];
        continue;
      }
      
      const timeSlots: TimeSlot[] = [];
      
      // 午前の時間枠（9:00-12:00）
      const morningSlots = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30'];
      morningSlots.forEach(time => {
        const random = Math.random();
        if (random < 0.3) {
          // 30%の確率で予約済み
          timeSlots.push({
            time,
            available: false,
            patientName: `患者${Math.floor(Math.random() * 100)}`,
            patientId: `P${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            type: 'appointment'
          });
        } else if (random < 0.4) {
          // 10%の確率でブロック（休憩など）
          timeSlots.push({
            time,
            available: false,
            type: 'blocked'
          });
        } else {
          // 空き時間
          timeSlots.push({
            time,
            available: true
          });
        }
      });
      
      // 午後の時間枠（14:00-17:00）
      const afternoonSlots = ['14:00', '14:30', '15:00', '15:30', '16:00', '16:30'];
      afternoonSlots.forEach(time => {
        const random = Math.random();
        if (random < 0.4) {
          // 40%の確率で予約済み
          timeSlots.push({
            time,
            available: false,
            patientName: `患者${Math.floor(Math.random() * 100)}`,
            patientId: `P${String(Math.floor(Math.random() * 1000)).padStart(3, '0')}`,
            type: 'appointment'
          });
        } else if (random < 0.5) {
          // 10%の確率でブロック
          timeSlots.push({
            time,
            available: false,
            type: 'blocked'
          });
        } else {
          // 空き時間
          timeSlots.push({
            time,
            available: true
          });
        }
      });
      
      schedules[dateKey] = timeSlots.sort((a, b) => a.time.localeCompare(b.time));
    }
    
    return schedules;
  });

  useEffect(() => {
    if (selectedDate) {
      const dateString = selectedDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).replace(/\//g, '/');
      setSelectedDateString(dateString);
    }
  }, [selectedDate]);

  // 日付ごとの予約状況を取得
  const getDateAvailability = (date: Date) => {
    const dateKey = date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).replace(/\//g, '/');
    
    const slots = scheduleData[dateKey] || [];
    const availableSlots = slots.filter(slot => slot.available);
    const totalSlots = slots.length;
    
    return {
      available: availableSlots.length,
      total: totalSlots,
      hasSlots: totalSlots > 0
    };
  };

  // 選択された日の予約リストを取得
  const getSelectedDateSchedule = () => {
    return scheduleData[selectedDateString] || [];
  };

  // 日時選択ハンドラー
  const handleTimeSlotSelect = (timeSlot: TimeSlot) => {
    if (!timeSlot.available) return;
    
    onSelectDateTime(selectedDateString, timeSlot.time);
    onClose();
  };

  // カレンダーの日付セルをカスタマイズ
  const customDayContent = (date: Date) => {
    const availability = getDateAvailability(date);
    const isToday = date.toDateString() === new Date().toDateString();
    
    return (
      <div className="relative w-full h-full flex flex-col items-center justify-center p-0.5">
        <span className={`text-xs ${isToday ? 'font-bold' : ''}`}>
          {date.getDate()}
        </span>
        {availability.hasSlots && (
          <div className="text-xs mt-0.5 w-full flex justify-center">
            {availability.available > 0 ? (
              <Badge variant="secondary" className="px-0.5 py-0 text-xs bg-green-100 text-green-800 min-w-0 text-center leading-none scale-75">
                {availability.available}
              </Badge>
            ) : (
              <Badge variant="secondary" className="px-0.5 py-0 text-xs bg-red-100 text-red-800 min-w-0 leading-none scale-75">
                満
              </Badge>
            )}
          </div>
        )}
        {!availability.hasSlots && (
          <div className="text-xs mt-0.5 w-full flex justify-center">
            <Badge variant="secondary" className="px-0.5 py-0 text-xs bg-gray-100 text-gray-500 min-w-0 leading-none scale-75">
              休
            </Badge>
          </div>
        )}
      </div>
    );
  };

  const selectedSchedule = getSelectedDateSchedule();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-[75vw] max-w-3xl h-[75vh] max-h-[500px] p-0 overflow-hidden">
        <div className="flex flex-col h-full">
          <DialogHeader className="px-3 py-2 border-b flex-shrink-0">
            <DialogTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span className="truncate text-sm">診療日時決定 - {doctor}</span>
              </div>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </DialogTitle>
          </DialogHeader>

          <div className="flex flex-1 min-h-0">
            {/* 左側：カレンダー（40%） */}
            <div className="w-2/5 p-3 border-r overflow-y-auto">
              <div className="mb-2">
                <h3 className="text-sm font-medium mb-1">診療日を選択</h3>
                <p className="text-xs text-muted-foreground">
                  空き枠数が表示されます
                </p>
              </div>
              
              <div className="flex justify-center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  className="rounded-md border w-fit scale-90"
                  classNames={{
                    day: "h-8 w-8 p-0 font-normal aria-selected:opacity-100 text-xs",
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                    day_outside: "text-muted-foreground opacity-50",
                    day_disabled: "text-muted-foreground opacity-50",
                    month: "space-y-1",
                    table: "w-full border-collapse",
                    head_row: "flex",
                    head_cell: "text-muted-foreground rounded-md w-8 font-normal text-xs",
                    row: "flex w-full mt-1",
                    cell: "relative p-0 text-center text-sm focus-within:relative focus-within:z-20 [&:has([aria-selected])]:bg-accent [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected].day-range-end)]:rounded-r-md",
                  }}
                  components={{
                    DayContent: ({ date }) => customDayContent(date)
                  }}
                  disabled={(date) => {
                    const dayOfWeek = date.getDay();
                    return dayOfWeek === 0 || dayOfWeek === 6 || date < new Date();
                  }}
                />
              </div>
              
              <div className="mt-2 text-xs text-muted-foreground">
                <div className="flex flex-wrap gap-1 justify-center">
                  <div className="flex items-center gap-1">
                    <Badge className="px-1 py-0 text-xs bg-green-100 text-green-800 scale-75">空き</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="px-1 py-0 text-xs bg-red-100 text-red-800 scale-75">満枠</Badge>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className="px-1 py-0 text-xs bg-gray-100 text-gray-500 scale-75">休診</Badge>
                  </div>
                </div>
              </div>
            </div>

            {/* 右側：時間スロットリスト（60%） */}
            <div className="w-3/5 flex flex-col min-h-0">
              <div className="p-3 border-b flex-shrink-0">
                <h3 className="text-sm font-medium mb-1">
                  {selectedDate ? (
                    selectedDate.toLocaleDateString('ja-JP', {
                      month: 'long',
                      day: 'numeric',
                      weekday: 'short'
                    })
                  ) : (
                    '日付を選択'
                  )}の診療予定
                </h3>
                {selectedSchedule.length > 0 && (
                  <p className="text-xs text-muted-foreground">
                    空いている時間帯をクリック
                  </p>
                )}
              </div>

              <ScrollArea className="flex-1">
                <div className="p-3">
                  {selectedSchedule.length === 0 ? (
                    <div className="text-center py-6">
                      <Users className="mx-auto h-6 w-6 text-muted-foreground mb-2" />
                      <h4 className="text-sm font-medium text-muted-foreground mb-1">
                        予定がありません
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {selectedDate && (selectedDate.getDay() === 0 || selectedDate?.getDay() === 6)
                          ? '休診日です' 
                          : '診療予定がありません'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {/* 午前の予定 */}
                      <Card>
                        <CardHeader className="py-1 px-2">
                          <CardTitle className="text-xs">午前（9:00-12:00）</CardTitle>
                        </CardHeader>
                        <CardContent className="py-1 px-2">
                          <div className="grid gap-1">
                            {selectedSchedule
                              .filter(slot => {
                                const hour = parseInt(slot.time.split(':')[0]);
                                return hour >= 9 && hour < 12;
                              })
                              .map((slot, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors text-xs ${
                                    slot.available 
                                      ? 'hover:bg-green-50 border-green-200 bg-green-25' 
                                      : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                                  }`}
                                  onClick={() => handleTimeSlotSelect(slot)}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="font-medium flex-shrink-0 text-xs">{slot.time}</span>
                                    {slot.available ? (
                                      <Badge variant="secondary" className="bg-green-100 text-green-800 flex-shrink-0 text-xs scale-75">
                                        <CheckCircle className="h-2 w-2 mr-1" />
                                        空き
                                      </Badge>
                                    ) : slot.type === 'blocked' ? (
                                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 flex-shrink-0 text-xs scale-75">
                                        ブロック
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="bg-red-100 text-red-800 flex-shrink-0 text-xs scale-75">
                                        予約済み
                                      </Badge>
                                    )}
                                  </div>
                                  {slot.patientName && (
                                    <div className="text-right flex-shrink-0 ml-2">
                                      <div className="text-xs font-medium truncate max-w-16">{slot.patientName}</div>
                                      <div className="text-xs text-muted-foreground">{slot.patientId}</div>
                                    </div>
                                  )}
                                </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>

                      {/* 午後の予定 */}
                      <Card>
                        <CardHeader className="py-1 px-2">
                          <CardTitle className="text-xs">午後（14:00-17:00）</CardTitle>
                        </CardHeader>
                        <CardContent className="py-1 px-2">
                          <div className="grid gap-1">
                            {selectedSchedule
                              .filter(slot => {
                                const hour = parseInt(slot.time.split(':')[0]);
                                return hour >= 14 && hour < 17;
                              })
                              .map((slot, index) => (
                                <div
                                  key={index}
                                  className={`flex items-center justify-between p-2 rounded-md border cursor-pointer transition-colors text-xs ${
                                    slot.available 
                                      ? 'hover:bg-green-50 border-green-200 bg-green-25' 
                                      : 'bg-gray-50 border-gray-200 cursor-not-allowed'
                                  }`}
                                  onClick={() => handleTimeSlotSelect(slot)}
                                >
                                  <div className="flex items-center gap-2 min-w-0 flex-1">
                                    <span className="font-medium flex-shrink-0 text-xs">{slot.time}</span>
                                    {slot.available ? (
                                      <Badge variant="secondary" className="bg-green-100 text-green-800 flex-shrink-0 text-xs scale-75">
                                        <CheckCircle className="h-2 w-2 mr-1" />
                                        空き
                                      </Badge>
                                    ) : slot.type === 'blocked' ? (
                                      <Badge variant="secondary" className="bg-gray-100 text-gray-600 flex-shrink-0 text-xs scale-75">
                                        ブロック
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="bg-red-100 text-red-800 flex-shrink-0 text-xs scale-75">
                                        予約済み
                                      </Badge>
                                    )}
                                  </div>
                                  {slot.patientName && (
                                    <div className="text-right flex-shrink-0 ml-2">
                                      <div className="text-xs font-medium truncate max-w-16">{slot.patientName}</div>
                                      <div className="text-xs text-muted-foreground">{slot.patientId}</div>
                                    </div>
                                  )}
                                </div>
                            ))}
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </div>
          </div>

          {/* 下部ボタン */}
          <div className="flex justify-end gap-2 p-2 border-t bg-gray-50 flex-shrink-0">
            <Button variant="outline" onClick={onClose} size="sm">
              キャンセル
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
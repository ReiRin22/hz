'use client';

/**
 * 画像オーダー - 検査日時指定パネル（Organisms）
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingExaminationScheduling.tsx
 */

import { useState } from 'react';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Button } from '@/shared/components/atoms/button';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';
import { Badge } from '@/shared/components/atoms/badge';
import { ChevronLeft, Clock, X } from 'lucide-react';
import type {
  ImagingOrderItem,
  ExaminationSlot,
  ImagingExaminationSchedulingProps
} from '../../types';
import { categoryLabels } from '../../types';

export function ImagingExaminationScheduling({
  imagingItem,
  onDateTimeSelected,
  onBack,
  onCancel
}: ImagingExaminationSchedulingProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  // 表示用の検査種別名を取得
  const modalityName = imagingItem.category ? categoryLabels[imagingItem.category] || imagingItem.name : imagingItem.name;

  // 検査種別ごとの利用可能時間帯を生成（モックデータ）
  const generateTimeSlots = (): ExaminationSlot[] => {
    const slots: ExaminationSlot[] = [];
    const startHour = 9;
    const endHour = 17;

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeStr = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        // ランダムで一部の時間帯を予約済みにする
        const isAvailable = Math.random() > 0.3;
        slots.push({
          time: timeStr,
          available: isAvailable
        });
      }
    }

    return slots;
  };

  const timeSlots = generateTimeSlots();

  const handleConfirm = () => {
    if (selectedDate && selectedTime) {
      const dateStr = selectedDate.toISOString().split('T')[0];
      onDateTimeSelected(dateStr, selectedTime);
    }
  };

  const formatDate = (date: Date | undefined) => {
    if (!date) return '';
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const weekdays = ['日', '月', '火', '水', '木', '金', '土'];
    const weekday = weekdays[date.getDay()];
    return `${year}年${month}月${day}日 (${weekday})`;
  };

  return (
    <div className="w-full h-screen bg-card flex flex-col">
      {/* ヘッダー */}
      <div className="p-4 border-b border-border flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <h2>検査日時指定</h2>
        </div>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* 左側：カレンダー */}
        <div className="w-[400px] border-r border-border p-4">
          <div className="space-y-4">
            {/* 検査情報 */}
            <div className="border border-border rounded-lg p-3 space-y-2">
              <div className="text-sm text-muted-foreground">検査種別</div>
              <div className="font-medium">{modalityName}</div>
              {imagingItem.bodyPart && (
                <>
                  <div className="text-sm text-muted-foreground mt-2">部位</div>
                  <div>{imagingItem.bodyPart}</div>
                </>
              )}
            </div>

            {/* カレンダー */}
            <div className="flex justify-center">
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                className="rounded-md border"
                disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              />
            </div>
          </div>
        </div>

        {/* 右側：時間帯選択 */}
        <div className="flex-1 flex flex-col">
          <div className="p-4 border-b border-border">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <h3 className="font-medium">
                {selectedDate ? formatDate(selectedDate) : '日付を選択してください'}
              </h3>
            </div>
            {selectedDate && (
              <div className="mt-2 flex gap-2">
                <Badge variant="outline" className="text-xs">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  予約可能
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <span className="w-2 h-2 bg-gray-300 rounded-full mr-1"></span>
                  予約済み
                </Badge>
              </div>
            )}
          </div>

          <ScrollArea className="flex-1">
            {selectedDate ? (
              <div className="p-4">
                <div className="grid grid-cols-4 gap-2">
                  {timeSlots.map((slot) => (
                    <Button
                      key={slot.time}
                      variant={selectedTime === slot.time ? 'default' : 'outline'}
                      size="sm"
                      disabled={!slot.available}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`
                        ${!slot.available ? 'opacity-50 cursor-not-allowed' : ''}
                        ${selectedTime === slot.time ? 'bg-primary text-primary-foreground' : ''}
                      `}
                    >
                      {slot.time}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">
                カレンダーから日付を選択してください
              </div>
            )}
          </ScrollArea>

          {/* 選択中の日時表示 */}
          {selectedDate && selectedTime && (
            <div className="p-4 border-t border-border bg-muted/30">
              <div className="text-sm text-muted-foreground mb-1">選択中の検査日時</div>
              <div className="font-medium">
                {formatDate(selectedDate)} {selectedTime}
              </div>
            </div>
          )}

          {/* フッターアクション */}
          <div className="p-4 border-t border-border flex gap-2">
            <Button variant="outline" onClick={onBack} className="flex-1">
              戻る
            </Button>
            <Button
              onClick={handleConfirm}
              className="flex-1"
              disabled={!selectedDate || !selectedTime}
            >
              この日時で確定
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

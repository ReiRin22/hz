'use client';

/**
 * 画像検査予約パネルコンポーネント
 * UIガイドライン準拠: organisms層
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/organisms/ImagingReservationPanel.tsx
 */

import * as React from 'react';
import { ArrowRight, ChevronLeft, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';
import { Label } from '@/shared/components/atoms/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/atoms/select';
import { Calendar } from '@/shared/components/atoms/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/components/atoms/popover';
import { ScrollArea } from '@/shared/components/atoms/scroll-area';

export interface ImagingReservationPanelProps {
  /** 検査種別（モダリティ） */
  modality: string;
  /** 検査部位リスト */
  bodyPartsList: Array<{ bodyPart: string; protocol: string; laterality?: string }>;
  /** 予約確定時のコールバック */
  onConfirm: (reservationData: { scheduledDate: string; scheduledTime: string; examinationRoom: string }) => void;
  /** キャンセル時のコールバック */
  onCancel: () => void;
}

// 検査室のリスト（モダリティ別）
const examinationRoomsByModality: Record<string, string[]> = {
  ct: ['CT室1', 'CT室2', 'CT室3'],
  mri: ['MRI室1', 'MRI室2'],
  pet: ['PET-CT室'],
  'pet-ct': ['PET-CT室'],
  ri: ['RI検査室1', 'RI検査室2'],
  ultrasound: ['超音波検査室1', '超音波検査室2', '超音波検査室3'],
  fluoroscopy: ['透視室1', '透視室2'],
  dexa: ['骨密度測定室'],
};

// 時間帯の選択肢
const timeSlots = [
  { value: '09:00', label: '09:00' },
  { value: '09:30', label: '09:30' },
  { value: '10:00', label: '10:00' },
  { value: '10:30', label: '10:30' },
  { value: '11:00', label: '11:00' },
  { value: '11:30', label: '11:30' },
  { value: '13:00', label: '13:00' },
  { value: '13:30', label: '13:30' },
  { value: '14:00', label: '14:00' },
  { value: '14:30', label: '14:30' },
  { value: '15:00', label: '15:00' },
  { value: '15:30', label: '15:30' },
  { value: '16:00', label: '16:00' },
  { value: '16:30', label: '16:30' },
];

export const ImagingReservationPanel: React.FC<ImagingReservationPanelProps> = ({
  modality,
  bodyPartsList,
  onConfirm,
  onCancel,
}) => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());
  const [selectedTime, setSelectedTime] = React.useState<string>('09:00');
  const [examinationRoom, setExaminationRoom] = React.useState<string>('');

  // モダリティに対応する検査室リストを取得
  const modalityKey = modality.toLowerCase().replace(/検査|撮影/g, '');
  const availableRooms = examinationRoomsByModality[modalityKey] || examinationRoomsByModality['ct'];

  // デフォルトで最初の検査室を選択
  if (!examinationRoom && availableRooms.length > 0) {
    setExaminationRoom(availableRooms[0]);
  }

  const handleConfirm = () => {
    if (!selectedDate || !selectedTime || !examinationRoom) {
      return;
    }

    onConfirm({
      scheduledDate: selectedDate.toISOString().split('T')[0],
      scheduledTime: selectedTime,
      examinationRoom: examinationRoom,
    });
  };

  const isConfirmEnabled = selectedDate && selectedTime && examinationRoom;

  return (
    <div className="w-full h-full flex bg-background">
      <div className="w-[600px] h-full border-r border-border bg-background flex flex-col flex-shrink-0">
        {/* ヘッダー */}
        <div className="p-4 border-b border-border flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h2>検査予約</h2>
              <p className="text-sm text-muted-foreground mt-1">{modality} の予約を行います</p>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel}>
              <ChevronLeft className="w-4 h-4 mr-1" />
              戻る
            </Button>
          </div>
        </div>

        {/* スクロール可能なコンテンツエリア */}
        <div className="flex-1 overflow-hidden">
          <ScrollArea className="h-full">
            <div className="p-6 space-y-6">
              {/* 検査内容の表示 */}
              <div className="border border-border rounded-lg p-4 space-y-2">
                <Label className="text-sm">検査内容</Label>
                <div className="space-y-1">
                  <div>
                    <strong>{modality}</strong>
                  </div>
                  {bodyPartsList.map((item, index) => (
                    <div key={index} className="text-sm text-muted-foreground">
                      • {item.bodyPart} ({item.protocol})
                      {item.laterality && item.laterality !== 'Not specified' && ` - ${item.laterality}`}
                    </div>
                  ))}
                </div>
              </div>

              {/* 日付選択 */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <Label className="text-sm">実施予定日</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? (
                        selectedDate.toLocaleDateString('ja-JP', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })
                      ) : (
                        <span>日付を選択してください</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate}
                      onSelect={setSelectedDate}
                      disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* 時間帯選択 */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <Label className="text-sm">
                  <Clock className="inline w-4 h-4 mr-1" />
                  開始時刻
                </Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeSlots.map((slot) => (
                      <SelectItem key={slot.value} value={slot.value}>
                        {slot.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 検査室選択 */}
              <div className="border border-border rounded-lg p-4 space-y-3">
                <Label className="text-sm">検査室</Label>
                <Select value={examinationRoom} onValueChange={setExaminationRoom}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {availableRooms.map((room) => (
                      <SelectItem key={room} value={room}>
                        {room}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* 予約情報サマリー */}
              <div className="border border-primary/20 bg-primary/5 rounded-lg p-4 space-y-2">
                <Label className="text-sm">予約内容の確認</Label>
                <div className="space-y-1 text-sm">
                  <div>
                    <strong>日時:</strong> {selectedDate?.toLocaleDateString('ja-JP')} {selectedTime}
                  </div>
                  <div>
                    <strong>検査室:</strong> {examinationRoom}
                  </div>
                  <div>
                    <strong>検査種別:</strong> {modality}
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>
        </div>

        {/* フッター：確定ボタン */}
        <div className="p-4 border-t border-border flex-shrink-0 space-y-2 bg-background">
          <Button onClick={handleConfirm} className="w-full" disabled={!isConfirmEnabled}>
            予約確定して詳細入力へ進む
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

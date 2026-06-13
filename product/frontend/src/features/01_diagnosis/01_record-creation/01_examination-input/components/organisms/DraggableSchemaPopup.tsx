'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/shared/components/atoms/button';
import { X, GripVertical } from 'lucide-react';
import REC002 from '@/features/01_diagnosis/01_record-creation/01_schema-creation';

type DraggableSchemaPopupProps = {
  isOpen: boolean;
  onClose: () => void;
  onSchemaConfirm: (schemaUuid: string, base64Image: string) => void;
  soapContainerRef?: React.RefObject<HTMLDivElement>;
};

export function DraggableSchemaPopup({
  isOpen,
  onClose,
  onSchemaConfirm,
  soapContainerRef,
}: DraggableSchemaPopupProps) {
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const popupRef = useRef<HTMLDivElement>(null);

  // 初期位置設定: SOAP入力エリアの右側に配置
  useEffect(() => {
    if (isOpen && popupRef.current) {
      if (soapContainerRef?.current) {
        const soapRect = soapContainerRef.current.getBoundingClientRect();
        setPosition({ x: soapRect.right + 12, y: soapRect.top });
      } else {
        const popupRect = popupRef.current.getBoundingClientRect();
        setPosition({ x: window.innerWidth - popupRect.width - 20, y: 100 });
      }
    }
  }, [isOpen, soapContainerRef]);

  // リサイズ時の位置調整
  useEffect(() => {
    const handleResize = () => {
      if (isOpen && popupRef.current && soapContainerRef?.current && !isDragging) {
        const soapRect = soapContainerRef.current.getBoundingClientRect();
        setPosition({ x: soapRect.right + 12, y: soapRect.top });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isOpen, soapContainerRef, isDragging]);

  // ドラッグ操作
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({ x: e.clientX - dragOffset.x, y: e.clientY - dragOffset.y });
      }
    };
    const handleMouseUp = () => setIsDragging(false);
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, dragOffset]);

  // ESCキーで閉じる
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleConfirm = (schemaUuid: string, base64Image: string) => {
    onSchemaConfirm(schemaUuid, base64Image);
    onClose();
  };

  const handleCancel = () => {
    onClose();
  };

  return (
    <>
      {/* オーバーレイ（背景を暗くする） - クリックしても閉じない */}
      <div
        className="fixed inset-0 bg-black/20"
        style={{ zIndex: 40 }}
        aria-hidden="true"
      />

      {/* ポップアップ本体 */}
      <div
        ref={popupRef}
        className="fixed bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 45,
          width: '800px',
          maxHeight: '90vh',
          cursor: isDragging ? 'grabbing' : 'default',
        }}
      >
      {/* ヘッダー（ドラッグハンドル） */}
      <div
        className="p-2 border-b flex items-center justify-between bg-gray-50 dark:bg-gray-900 rounded-t-lg cursor-grab active:cursor-grabbing"
        onMouseDown={(e) => {
          if (popupRef.current) {
            const rect = popupRef.current.getBoundingClientRect();
            setDragOffset({ x: e.clientX - rect.left, y: e.clientY - rect.top });
            setIsDragging(true);
          }
        }}
      >
        <div className="flex items-center text-sm font-medium text-gray-700 dark:text-gray-300">
          <GripVertical className="w-4 h-4 mr-2 text-gray-400" />
          シェーマ描画
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0 hover:bg-gray-200 dark:hover:bg-gray-800"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* REC002コンテンツ */}
      <div className="overflow-auto" style={{ maxHeight: 'calc(90vh - 48px)' }}>
        <REC002 onConfirm={handleConfirm} onCancel={handleCancel} />
      </div>
    </div>
    </>
  );
}

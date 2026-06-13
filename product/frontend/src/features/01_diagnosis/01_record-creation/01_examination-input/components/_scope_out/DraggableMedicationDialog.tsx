"use client";
import { useState, useRef, useEffect } from "react";
import { X, Minus } from "lucide-react";
import dynamic from "next/dynamic";

const REC006Page = dynamic(() => import("../../../02_medical-info-reference/02_medication-history/REC006"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-neutral-600">薬歴を読み込み中...</p>
      </div>
    </div>
  )
});

interface DraggableMedicationDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DraggableMedicationDialog({ isOpen, onClose }: DraggableMedicationDialogProps) {
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('.dialog-header') &&
        !(e.target as HTMLElement).closest('button')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, dragOffset]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/30 z-40" onClick={onClose} />

      {/* Dialog */}
      <div
        ref={dialogRef}
        className="fixed z-50 bg-white rounded-lg shadow-2xl"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: isMinimized ? '320px' : '90vw',
          height: isMinimized ? 'auto' : '85vh',
          maxWidth: isMinimized ? '320px' : '1600px',
          transition: isMinimized ? 'all 0.3s ease' : 'none'
        }}
      >
        {/* Header */}
        <div
          className="dialog-header flex items-center justify-between px-4 py-3 border-b border-neutral-200 bg-blue-600 text-white rounded-t-lg cursor-move select-none"
          onMouseDown={handleMouseDown}
        >
          <h2 className="text-lg font-semibold">薬歴参照</h2>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-blue-700 rounded transition-colors"
              title={isMinimized ? "最大化" : "最小化"}
            >
              <Minus className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-1 hover:bg-blue-700 rounded transition-colors"
              title="閉じる"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        {!isMinimized && (
          <div className="h-[calc(100%-52px)] overflow-auto">
            <REC006Page />
          </div>
        )}
      </div>
    </>
  );
}

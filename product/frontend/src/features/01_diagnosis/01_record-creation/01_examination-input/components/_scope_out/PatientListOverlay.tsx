"use client";
import { X } from "lucide-react";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";

const ReceptionPatientListFeature = dynamic(
  () => import('@/features/01_diagnosis/06_patient-list/01_patient-list/REC020'),
  {
    ssr: false,
    loading: () => (
      <div className="h-full w-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-neutral-600">受診者一覧を読み込み中...</p>
        </div>
      </div>
    ),
  }
);

interface PatientListOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function PatientListOverlay({ isOpen, onClose }: PatientListOverlayProps) {
  const [isVisible, setIsVisible] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      timerRef.current = setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className={`fixed left-0 top-0 right-[87.5px] bottom-0 bg-white z-40 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'
      }`}
      style={{
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
      }}
    >
      {/* ヘッダー */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 bg-gradient-to-r from-blue-600 to-blue-700">
        <h2 className="text-xl font-semibold text-white">受診者一覧</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-blue-700 rounded-lg transition-colors text-white"
          title="閉じる"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* コンテンツ */}
      <div className="h-[calc(100%-73px)] overflow-auto">
        <ReceptionPatientListFeature />
      </div>
    </div>
  );
}

'use client';

import { useEffect, useRef } from 'react';

const BARCODE_BUFFER_TIMEOUT_MS = 100;
const BARCODE_MIN_LENGTH = 4;

interface UseBarcodeScannerListenerOptions {
  onScan: (value: string) => void;
  enabled?: boolean;
}

export function useBarcodeScannerListener({
  onScan,
  enabled = true,
}: UseBarcodeScannerListenerOptions): void {
  const bufferRef = useRef<string>('');
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!enabled) return;

    const handleKeyPress = (e: KeyboardEvent) => {
      // テキスト入力フィールドへのキー入力は除外（フォーカス競合防止）
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement ||
        e.target instanceof HTMLSelectElement
      ) {
        return;
      }

      if (e.key === 'Enter') {
        const barcode = bufferRef.current.trim();
        bufferRef.current = '';
        if (timerRef.current) {
          clearTimeout(timerRef.current);
          timerRef.current = null;
        }
        if (barcode.length >= BARCODE_MIN_LENGTH) {
          onScan(barcode);
        }
        return;
      }

      if (e.key.length === 1) {
        bufferRef.current += e.key;

        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
        timerRef.current = setTimeout(() => {
          const barcode = bufferRef.current.trim();
          bufferRef.current = '';
          timerRef.current = null;
          if (barcode.length >= BARCODE_MIN_LENGTH) {
            onScan(barcode);
          }
        }, BARCODE_BUFFER_TIMEOUT_MS);
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [enabled, onScan]);
}

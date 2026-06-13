'use client';

import { useEffect } from 'react';
import { useRecordInputStore } from '../stores/recordInput.store';

/**
 * ACT_START_VOICE: Web Speech API スタブ。
 * isVoiceActive が true になったときに音声認識を開始し、テキストをストアに追記する。
 * Phase 4 では起動・停止フローのみ実装（本格対応はスコープ外）。
 */
export function useVoiceInput() {
  const isVoiceActive = useRecordInputStore((s) => s.isVoiceActive);
  const setSoapText = useRecordInputStore((s) => s.setSoapText);
  const soapText = useRecordInputStore((s) => s.soapText);
  const setIsVoiceActive = useRecordInputStore((s) => s.setIsVoiceActive);

  useEffect(() => {
    if (!isVoiceActive) return;

    // Web Speech API スタブ（本格対応はスコープ外）
    const SpeechRecognition =
      (window as unknown as { SpeechRecognition?: new () => SpeechRecognition; webkitSpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition ??
      (window as unknown as { webkitSpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsVoiceActive(false);
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'ja-JP';
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0]?.[0]?.transcript ?? '';
      setSoapText(soapText + transcript);
    };

    recognition.onend = () => {
      setIsVoiceActive(false);
    };

    recognition.start();

    return () => {
      recognition.stop();
    };
  }, [isVoiceActive]);
}

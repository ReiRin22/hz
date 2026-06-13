import { useState, useEffect } from "react";
import type { SearchHistoryItem } from "@/shared/types/user-header/patient-types";

export const useSearchHistory = () => {
  const [searchHistory, setSearchHistory] = useState<SearchHistoryItem[]>([]);

  // 検索履歴の初期化
  useEffect(() => {
    const savedHistory = localStorage.getItem('patientSearchHistory');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('検索履歴の読み込みに失敗しました:', error);
        setSearchHistory([]);
      }
    }
  }, []);

  // 検索履歴の保存
  const saveSearchHistory = (history: SearchHistoryItem[]) => {
    try {
      localStorage.setItem('patientSearchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('検索履歴の保存に失敗しました:', error);
    }
  };

  // 検索履歴の更新
  const updateSearchHistory = (patientId: string) => {
    const now = Date.now();
    setSearchHistory(prev => {
      const existingIndex = prev.findIndex(item => item.patientId === patientId);
      let newHistory: SearchHistoryItem[];

      if (existingIndex >= 0) {
        // 既存のエントリを更新
        newHistory = [...prev];
        newHistory[existingIndex] = {
          ...newHistory[existingIndex],
          searchCount: newHistory[existingIndex].searchCount + 1,
          lastSearched: now,
          searchTimes: [...newHistory[existingIndex].searchTimes, now].slice(-10), // 最新10回分の検索時刻
        };
      } else {
        // 新しいエントリを追加
        const newItem: SearchHistoryItem = {
          patientId,
          searchCount: 1,
          lastSearched: now,
          searchTimes: [now],
        };
        newHistory = [newItem, ...prev];
      }

      // 最新15件までに制限し、使用頻度と最新性でソート
      newHistory = newHistory
        .sort((a, b) => {
          // 最近1日以内の検索は優先度を上げる
          const aIsRecent = now - a.lastSearched < 24 * 60 * 60 * 1000;
          const bIsRecent = now - b.lastSearched < 24 * 60 * 60 * 1000;
          
          if (aIsRecent && !bIsRecent) return -1;
          if (!aIsRecent && bIsRecent) return 1;
          
          // 検索頻度と最新性の複合スコア
          const aScore = a.searchCount * 0.3 + (now - a.lastSearched > 0 ? 1000000 / (now - a.lastSearched) : 0) * 0.7;
          const bScore = b.searchCount * 0.3 + (now - b.lastSearched > 0 ? 1000000 / (now - b.lastSearched) : 0) * 0.7;
          
          return bScore - aScore;
        })
        .slice(0, 15);

      saveSearchHistory(newHistory);
      return newHistory;
    });
  };

  // 検索履歴のクリア機能
  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('patientSearchHistory');
  };

  return {
    searchHistory,
    updateSearchHistory,
    clearSearchHistory
  };
};
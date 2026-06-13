'use client';

/**
 * 画像オーダーパネル用 BFF fetch フック
 *
 * 画像検査履歴・セットの取得と画像オーダー確定を担う。
 * activeSubTab に応じて必要なデータのみ取得する。
 */

import { useState, useEffect, useCallback } from 'react';

// Client Component 用（サーバー側は BFF_BASE_URL / クライアント側は NEXT_PUBLIC_BFF_URL を使用）
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_URL ?? 'http://localhost:3001';

export type ImagingSetType = 'hospital' | 'department' | 'my' | 'regular';

export interface ImagingHistoryItem {
  id: string;
  date: string;
  name: string;
  modality: string;
  bodyPart: string;
  imagingContent?: string;
  protocols?: string[];
  position?: string;
  laterality?: string;
  functionalConditions?: string[];
  specialInstructions?: string;
  bodyPartsList?: Array<{ bodyPart: string; protocol: string; laterality?: string }>;
  priority?: string;
  preferredTime?: string;
  useContrast?: boolean;
  hasAllergy?: boolean;
  clinicalPurpose?: string;
  symptomTags?: string[];
}

export interface ImagingSetItem {
  id: string;
  name: string;
  description: string;
  setType: ImagingSetType;
  items: ImagingHistoryItem[];
}

export interface ImagingOrderInput {
  name: string;
  modality: string;
  bodyPart: string;
  scheduledDate: string;
  useContrast?: boolean;
  hasAllergy?: boolean;
  allergySpecialInstructions?: string;
  protocols?: string[];
  bodyPartsList?: Array<{ bodyPart: string; protocol: string; laterality?: string }>;
  priority?: string;
  preferredTime?: string;
  clinicalPurpose?: string;
  specialInstructions?: string;
}

export function useImagingPanelData(
  patientId: string | undefined,
  activeSubTab: 'search' | 'history' | 'sets'
) {
  const [imagingHistory, setImagingHistory] = useState<ImagingHistoryItem[]>([]);
  const [imagingSets, setImagingSets] = useState<ImagingSetItem[]>([]);
  const [selectedSetType, setSelectedSetType] = useState<ImagingSetType>('hospital');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // historyタブ: 患者の画像検査履歴を取得
  useEffect(() => {
    if (activeSubTab !== 'history' || !patientId) return;

    const fetchHistory = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BFF_BASE_URL}/bff/patients/${patientId}/imaging-history`
        );
        if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        const data = (await res.json()) as { history: ImagingHistoryItem[] };
        setImagingHistory(data.history);
      } catch (e) {
        // TODO: エラートースト等でユーザーに通知する
        console.error('画像検査履歴の取得に失敗しました', e);
        setError('画像検査履歴の取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, [patientId, activeSubTab]);

  // setsタブ: 選択中の setType に応じてセットを取得
  useEffect(() => {
    if (activeSubTab !== 'sets') return;

    const fetchSets = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BFF_BASE_URL}/bff/imaging-sets?setType=${selectedSetType}`
        );
        if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        const data = (await res.json()) as { imagingSets: ImagingSetItem[] };
        setImagingSets(data.imagingSets);
      } catch (e) {
        // TODO: エラートースト等でユーザーに通知する
        console.error('画像検査セットの取得に失敗しました', e);
        setError('画像検査セットの取得に失敗しました');
      } finally {
        setIsLoading(false);
      }
    };

    fetchSets();
  }, [activeSubTab, selectedSetType]);

  // 画像オーダー一括確定
  const confirmImagingOrders = useCallback(
    async (orders: ImagingOrderInput[]): Promise<boolean> => {
      if (!patientId) return false;
      try {
        const res = await fetch(
          `${BFF_BASE_URL}/bff/patients/${patientId}/imaging-orders`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orders,
              // TODO: 認証実装後にセッションから取得
              confirmedBy: 'current-user',
            }),
          }
        );
        if (!res.ok) throw new Error(`BFF error: ${res.status}`);
        return true;
      } catch (e) {
        // TODO: エラートースト等でユーザーに通知する
        console.error('画像オーダーの確定に失敗しました', e);
        return false;
      }
    },
    [patientId]
  );

  return {
    imagingHistory,
    imagingSets,
    selectedSetType,
    setSelectedSetType,
    isLoading,
    error,
    confirmImagingOrders,
  };
}

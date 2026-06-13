'use client';

import { useState, useEffect } from 'react';
import { getSpecimenSets, getSpecimenHistory } from '../api/specimenOrderApi';
import type { SpecimenSetItem, SpecimenHistoryItem, SpecimenOrderFormItem, SpecimenType, OrderPriority } from '../types/specimen-order-entry.type';
import type {
  SpecimenSetItemResponse,
  SpecimenHistoryItemResponse,
} from '@/front_bff_shared/features/order/specimen-order/specimen-orders/types/responses/specimen-orders.response';

export type SpecimenSetType = 'hospital' | 'department' | 'my' | 'regular';

const SPECIMEN_TYPES: SpecimenType[] = ['blood', 'urine', 'stool', 'other'];
const ORDER_PRIORITIES: OrderPriority[] = ['normal', 'urgent'];

export function toSpecimenType(value: string): SpecimenType {
  return SPECIMEN_TYPES.includes(value as SpecimenType) ? (value as SpecimenType) : 'other';
}

export function toOrderPriority(value: string | undefined): OrderPriority | undefined {
  if (!value) return undefined;
  return ORDER_PRIORITIES.includes(value as OrderPriority) ? (value as OrderPriority) : undefined;
}

export function mapSetItem(itemRes: SpecimenHistoryItemResponse): SpecimenOrderFormItem {
  return {
    id: itemRes.id,
    specimenType: toSpecimenType(itemRes.specimenType),
    orderCode: itemRes.orderCode,
    testName: itemRes.testName,
    category: itemRes.category,
    quantity: itemRes.quantity,
    priority: toOrderPriority(itemRes.priority),
    clinicalPurpose: itemRes.clinicalPurpose,
    specialInstructions: itemRes.specialInstructions,
  };
}

export function mapSpecimenSet(setRes: SpecimenSetItemResponse): SpecimenSetItem {
  return {
    id: setRes.id,
    name: setRes.name,
    description: setRes.description,
    setType: setRes.setType,
    items: setRes.items.map(mapSetItem),
  };
}

function mapHistory(itemRes: SpecimenHistoryItemResponse): SpecimenHistoryItem {
  return {
    id: itemRes.id,
    date: itemRes.date ?? '',
    testName: itemRes.testName,
    orderCode: itemRes.orderCode,
    specimenType: toSpecimenType(itemRes.specimenType),
    status: itemRes.status ?? '',
    confirmedAt: itemRes.confirmedAt ?? '',
    confirmedBy: itemRes.confirmedBy ?? '',
    category: itemRes.category,
    quantity: itemRes.quantity,
    priority: toOrderPriority(itemRes.priority),
    clinicalPurpose: itemRes.clinicalPurpose,
    specialInstructions: itemRes.specialInstructions,
  };
}

export function useSpecimenPanelData(
  patientId: string | undefined,
  activeSubTab: 'search' | 'history' | 'sets'
) {
  const [specimenSets, setSpecimenSets] = useState<SpecimenSetItem[]>([]);
  const [specimenHistory, setSpecimenHistory] = useState<SpecimenHistoryItem[]>([]);
  const [selectedSetType, setSelectedSetType] = useState<SpecimenSetType>('hospital');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (activeSubTab !== 'sets') return;

    setIsLoading(true);
    setError(null);
    getSpecimenSets(selectedSetType)
      .then((res) => {
        if (res && 'specimenSets' in res) {
          setSpecimenSets(res.specimenSets.map(mapSpecimenSet));
        }
      })
      .catch(() => setError('検体セットの取得に失敗しました。'))
      .finally(() => setIsLoading(false));
  }, [activeSubTab, selectedSetType]);

  useEffect(() => {
    if (activeSubTab !== 'history' || !patientId) return;

    setIsLoading(true);
    setError(null);
    getSpecimenHistory(patientId)
      .then((res) => {
        if (res && 'history' in res) {
          setSpecimenHistory(res.history.map(mapHistory));
        }
      })
      .catch(() => setError('検体検査履歴の取得に失敗しました。'))
      .finally(() => setIsLoading(false));
  }, [activeSubTab, patientId]);

  return {
    specimenSets,
    specimenHistory,
    selectedSetType,
    setSelectedSetType,
    isLoading,
    error,
  };
}

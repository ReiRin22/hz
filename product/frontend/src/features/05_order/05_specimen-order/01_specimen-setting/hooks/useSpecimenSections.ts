'use client';

import { useState, useCallback, useRef } from 'react';
import type { SpecimenOrderFormItem } from '../types/specimen-order-entry.type';

type CheckedCandidate = Omit<SpecimenOrderFormItem, 'id'> & { checked: boolean };

export interface UseSpecimenSectionsReturn {
  items: SpecimenOrderFormItem[];
  addItem: (item: Omit<SpecimenOrderFormItem, 'id'>) => string | undefined;
  addCheckedItems: (candidates: CheckedCandidate[]) => string | undefined;
  addSingleItem: (item: Omit<SpecimenOrderFormItem, 'id'>) => void;
  removeItem: (orderCode: string) => void;
  removeGroup: (orderCode: string) => void;
  updateItem: (orderCode: string, patch: Partial<Omit<SpecimenOrderFormItem, 'id'>>) => void;
  clearItems: () => void;
  isConfirmEnabled: boolean;
}

export interface UseSpecimenSectionsOptions {
  confirmedOrderCodes?: string[];
}

function makeId(): string {
  return `soi-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function todayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useSpecimenSections({ confirmedOrderCodes = [] }: UseSpecimenSectionsOptions = {}): UseSpecimenSectionsReturn {
  const [items, setItems] = useState<SpecimenOrderFormItem[]>([]);
  const itemsRef = useRef(items);
  itemsRef.current = items;
  const confirmedOrderCodesRef = useRef(confirmedOrderCodes);
  confirmedOrderCodesRef.current = confirmedOrderCodes;

  const isDuplicate = useCallback((orderCode: string): boolean => {
    return (
      itemsRef.current.some((i) => i.orderCode === orderCode) ||
      confirmedOrderCodesRef.current.includes(orderCode)
    );
  }, []);

  const addItem = useCallback((item: Omit<SpecimenOrderFormItem, 'id'>): string | undefined => {
    if (isDuplicate(item.orderCode)) {
      return '同一内容のオーダーがすでに登録されています。';
    }
    setItems((prev) => [...prev, { scheduledDate: todayString(), ...item, id: makeId() }]);
    return undefined;
  }, [isDuplicate]);

  const addCheckedItems = useCallback((candidates: CheckedCandidate[]): string | undefined => {
    if (candidates.length === 0) {
      return '検査項目が未設定のため、追加できません。';
    }
    const checked = candidates.filter((c) => c.checked);
    if (checked.length === 0) {
      return '追加する項目が選択されていません。';
    }
    checked.forEach(({ checked: _checked, ...item }) => {
      setItems((prev) => {
        if (prev.some((i) => i.orderCode === item.orderCode) || confirmedOrderCodesRef.current.includes(item.orderCode)) return prev;
        return [...prev, { id: makeId(), ...item }];
      });
    });
    return undefined;
  }, []);

  const addSingleItem = useCallback((item: Omit<SpecimenOrderFormItem, 'id'>): void => {
    setItems((prev) => {
      if (prev.some((i) => i.orderCode === item.orderCode) || confirmedOrderCodesRef.current.includes(item.orderCode)) return prev;
      return [...prev, { scheduledDate: todayString(), ...item, id: makeId() }];
    });
  }, []);

  const removeItem = useCallback((orderCode: string): void => {
    setItems((prev) => prev.filter((i) => i.orderCode !== orderCode));
  }, []);

  // TODO: Phase 2 でグループ（セット）単位削除の仕様が確定したら removeItem と分離する
  const removeGroup = useCallback((orderCode: string): void => {
    setItems((prev) => prev.filter((i) => i.orderCode !== orderCode));
  }, []);

  const updateItem = useCallback((orderCode: string, patch: Partial<Omit<SpecimenOrderFormItem, 'id'>>): void => {
    setItems((prev) =>
      prev.map((i) => (i.orderCode === orderCode ? { ...i, ...patch } : i))
    );
  }, []);

  const clearItems = useCallback((): void => setItems([]), []);

  return {
    items,
    addItem,
    addCheckedItems,
    addSingleItem,
    removeItem,
    removeGroup,
    updateItem,
    clearItems,
    isConfirmEnabled: items.length > 0,
  };
}

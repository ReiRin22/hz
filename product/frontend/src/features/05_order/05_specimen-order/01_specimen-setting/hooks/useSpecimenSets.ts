'use client';

import { useState, useEffect } from 'react';
import { getSpecimenSets } from '../api/specimenOrderApi';
import { mapSpecimenSet } from './useSpecimenPanelData';
import type { SpecimenSetItem } from '../types/specimen-order-entry.type';

export interface UseSpecimenSetsReturn {
  sets: SpecimenSetItem[];
  setsError: string | undefined;
}

// TODO: このフックは現在どのコンポーネントからも参照されていない（デッドコード）。
// Phase 2 で SpecimenOrderDetailPanel を接続する際に useSpecimenPanelData と統合または削除すること。
export function useSpecimenSets(): UseSpecimenSetsReturn {
  const [sets, setSets] = useState<SpecimenSetItem[]>([]);
  const [setsError, setSetsError] = useState<string | undefined>();

  useEffect(() => {
    // TODO: 将来的にセットタブの選択（hospital/department/my 等）に応じて setType を動的に切り替える
    getSpecimenSets('hospital')
      .then((res) => {
        if (res && 'specimenSets' in res) {
          setSets(res.specimenSets.map(mapSpecimenSet));
        }
      })
      .catch(() => {
        setSetsError('検体セットの取得に失敗しました。');
      });
  }, []);

  return { sets, setsError };
}

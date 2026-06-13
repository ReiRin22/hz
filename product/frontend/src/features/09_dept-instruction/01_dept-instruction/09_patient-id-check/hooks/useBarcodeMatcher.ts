'use client';

import { useCallback } from 'react';
import { usePatientIdCheckStore } from '../stores/usePatientIdCheckStore';
import { fetchStaffByBarcode } from '../repository/usePatientIdCheck';

export function useBarcodeMatcher() {
  const applyBarcodeRead = usePatientIdCheckStore((s) => s.applyBarcodeRead);
  const setPractitionerStaffName = usePatientIdCheckStore((s) => s.setPractitionerStaffName);
  const patientScanned = usePatientIdCheckStore((s) => s.patientScanned);
  const itemScanned = usePatientIdCheckStore((s) => s.itemScanned);

  const match = useCallback(
    async (value: string) => {
      // スキャン前のセクション充填状態を確認（applyBarcodeRead が順序割り当てを行うため）
      const isPractitionerSlot = patientScanned != null && itemScanned != null;

      applyBarcodeRead(value);

      if (isPractitionerSlot) {
        // 実施者スロットへのスキャン → 職員マスタ参照して staffName を後注入
        try {
          const res = await fetchStaffByBarcode(value);
          setPractitionerStaffName(res.staff.name);
        } catch {
          setPractitionerStaffName(null);
        }
      }
    },
    [patientScanned, itemScanned, applyBarcodeRead, setPractitionerStaffName],
  );

  return { match };
}

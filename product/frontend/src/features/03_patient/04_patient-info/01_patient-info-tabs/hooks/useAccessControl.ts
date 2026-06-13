import { useState, useCallback } from 'react';
import type { AccessControlData, VipSetting } from '../types/patientInfo.type';

export function useAccessControl(initial: AccessControlData) {
  const [data, setData] = useState<AccessControlData>(initial);
  const [isEditingVip, setIsEditingVip] = useState(false);
  const [vipDraft, setVipDraft] = useState<VipSetting>(initial.vipSetting);

  const startVipEdit = useCallback(() => {
    setVipDraft(data.vipSetting);
    setIsEditingVip(true);
  }, [data.vipSetting]);

  const cancelVipEdit = useCallback(() => {
    setVipDraft(data.vipSetting);
    setIsEditingVip(false);
  }, [data.vipSetting]);

  const saveVipSetting = useCallback(() => {
    setData((prev) => ({ ...prev, vipSetting: vipDraft }));
    setIsEditingVip(false);
  }, [vipDraft]);

  const revokeAccess = useCallback((userId: string) => {
    setData((prev) => ({
      ...prev,
      userAccesses: prev.userAccesses.filter((ua) => ua.userId !== userId),
    }));
  }, []);

  return {
    data,
    isEditingVip,
    vipDraft,
    setVipDraft,
    startVipEdit,
    cancelVipEdit,
    saveVipSetting,
    revokeAccess,
  };
}

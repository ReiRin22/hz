import { useState, useCallback } from 'react';
import type { FamilyInfoData, FamilyMemberRecord, GuarantorInfo } from '../types/patientInfo.type';

export function useFamilyInfo(initial: FamilyInfoData) {
  const [data, setData] = useState<FamilyInfoData>(initial);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [isEditingGuarantor, setIsEditingGuarantor] = useState(false);
  const [guarantorDraft, setGuarantorDraft] = useState<GuarantorInfo>(initial.guarantor);

  const deleteFamilyMember = useCallback((id: string) => {
    setData((prev) => ({
      ...prev,
      familyMembers: prev.familyMembers.filter((r) => r.id !== id),
    }));
  }, []);

  const addFamilyMember = useCallback((record: FamilyMemberRecord) => {
    setData((prev) => ({
      ...prev,
      familyMembers: [...prev.familyMembers, record],
    }));
  }, []);

  const saveGuarantor = useCallback(() => {
    setData((prev) => ({ ...prev, guarantor: guarantorDraft }));
    setIsEditingGuarantor(false);
  }, [guarantorDraft]);

  const cancelGuarantorEdit = useCallback(() => {
    setGuarantorDraft(data.guarantor);
    setIsEditingGuarantor(false);
  }, [data.guarantor]);

  return {
    data,
    deleteTargetId,
    setDeleteTargetId,
    isEditingGuarantor,
    setIsEditingGuarantor,
    guarantorDraft,
    setGuarantorDraft,
    deleteFamilyMember,
    addFamilyMember,
    saveGuarantor,
    cancelGuarantorEdit,
  };
}

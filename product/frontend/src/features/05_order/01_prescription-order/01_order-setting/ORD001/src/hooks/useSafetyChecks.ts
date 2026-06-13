import { useState } from 'react';
import type { AllergyInfo, DrugMaster, CurrentMedication, OrderDetail, CurrentPatient } from '../data/types';
import { checkAllergy, checkContraindication, checkDuplication, checkPatientAttribute } from '../utils/safetyValidation';

interface SafetyCheckWarning {
  show: boolean;
  drugName: string;
  onConfirm: () => void;
}

interface AllergyWarningState extends SafetyCheckWarning {
  allergies: AllergyInfo[];
}

interface ContraindicationWarningState extends SafetyCheckWarning {
  conflicts: Array<{ withDrug: string; reason: string; source: 'current' | 'newOrder' }>;
}

interface DuplicationWarningState extends SafetyCheckWarning {
  duplicates: Array<{ withDrug: string; ingredient: string; route: string; source: 'current' | 'newOrder'; startDate?: string; endDate?: string }>;
}

interface PatientAttributeWarningState extends SafetyCheckWarning {
  warnings: Array<{ category: string; message: string; severity: 'prohibited' | 'caution' }>;
}

export function useSafetyChecks(
  patientAllergies: AllergyInfo[],
  drugMasterData: DrugMaster[],
  currentMedications: CurrentMedication[],
  confirmedOrders: OrderDetail[],
  currentPatient: CurrentPatient
) {
  // 各警告ダイアログの状態
  const [allergyWarning, setAllergyWarning] = useState<AllergyWarningState>({
    show: false,
    drugName: '',
    allergies: [],
    onConfirm: () => {}
  });
  
  const [contraindicationWarning, setContraindicationWarning] = useState<ContraindicationWarningState>({
    show: false,
    drugName: '',
    conflicts: [],
    onConfirm: () => {}
  });
  
  const [duplicationWarning, setDuplicationWarning] = useState<DuplicationWarningState>({
    show: false,
    drugName: '',
    duplicates: [],
    onConfirm: () => {}
  });
  
  const [patientAttributeWarning, setPatientAttributeWarning] = useState<PatientAttributeWarningState>({
    show: false,
    drugName: '',
    warnings: [],
    onConfirm: () => {}
  });

  /**
   * 安全性チェックを実行し、警告がある場合はダイアログを表示
   * @param drugName 薬剤名
   * @param onAllChecksPass すべてのチェックをパスした後のコールバック
   * @returns 警告があるかどうか
   */
  const performSafetyChecks = (drugName: string, onAllChecksPass: () => void): boolean => {
    const allergies = checkAllergy(drugName, patientAllergies);
    const contraindications = checkContraindication(drugName, drugMasterData, currentMedications);
    const duplications = checkDuplication(drugName, drugMasterData, confirmedOrders, currentMedications, undefined, undefined);
    const patientAttributeWarnings = checkPatientAttribute(drugName, drugMasterData, currentPatient);
    
    // 警告がない場合は直接実行
    if (allergies.length === 0 && contraindications.length === 0 && 
        duplications.length === 0 && patientAttributeWarnings.length === 0) {
      onAllChecksPass();
      return false;
    }
    
    // 警告を順番に表示する関数
    const showNextWarning = () => {
      if (allergies.length > 0) {
        setAllergyWarning({
          show: true,
          drugName,
          allergies,
          onConfirm: () => {
            setAllergyWarning({ show: false, drugName: '', allergies: [], onConfirm: () => {} });
            if (contraindications.length > 0) {
              setTimeout(() => showContraindicationWarning(), 100);
            } else if (duplications.length > 0) {
              setTimeout(() => showDuplicationWarning(), 100);
            } else if (patientAttributeWarnings.length > 0) {
              setTimeout(() => showPatientAttributeWarning(), 100);
            } else {
              onAllChecksPass();
            }
          }
        });
      } else if (contraindications.length > 0) {
        showContraindicationWarning();
      } else if (duplications.length > 0) {
        showDuplicationWarning();
      } else if (patientAttributeWarnings.length > 0) {
        showPatientAttributeWarning();
      }
    };
    
    const showContraindicationWarning = () => {
      setContraindicationWarning({
        show: true,
        drugName,
        conflicts: contraindications,
        onConfirm: () => {
          setContraindicationWarning({ show: false, drugName: '', conflicts: [], onConfirm: () => {} });
          if (duplications.length > 0) {
            setTimeout(() => showDuplicationWarning(), 100);
          } else if (patientAttributeWarnings.length > 0) {
            setTimeout(() => showPatientAttributeWarning(), 100);
          } else {
            onAllChecksPass();
          }
        }
      });
    };
    
    const showDuplicationWarning = () => {
      setDuplicationWarning({
        show: true,
        drugName,
        duplicates: duplications,
        onConfirm: () => {
          setDuplicationWarning({ show: false, drugName: '', duplicates: [], onConfirm: () => {} });
          if (patientAttributeWarnings.length > 0) {
            setTimeout(() => showPatientAttributeWarning(), 100);
          } else {
            onAllChecksPass();
          }
        }
      });
    };
    
    const showPatientAttributeWarning = () => {
      setPatientAttributeWarning({
        show: true,
        drugName,
        warnings: patientAttributeWarnings,
        onConfirm: () => {
          setPatientAttributeWarning({ show: false, drugName: '', warnings: [], onConfirm: () => {} });
          onAllChecksPass();
        }
      });
    };
    
    showNextWarning();
    return true;
  };

  return {
    allergyWarning,
    contraindicationWarning,
    duplicationWarning,
    patientAttributeWarning,
    setAllergyWarning,
    setContraindicationWarning,
    setDuplicationWarning,
    setPatientAttributeWarning,
    performSafetyChecks
  };
}
import type { AllergyInfo, DrugMaster, CurrentMedication, OrderDetail, CurrentPatient } from '../data/types';

export interface WarningChainCallbacks {
  setAllergyWarning: (state: any) => void;
  setContraindicationWarning: (state: any) => void;
  setDuplicationWarning: (state: any) => void;
  setPatientAttributeWarning: (state: any) => void;
}

export interface WarningChainChecks {
  checkAllergy: (drugName: string) => AllergyInfo[];
  checkContraindication: (drugName: string) => Array<{ withDrug: string; reason: string; source: 'current' | 'newOrder' }>;
  checkDuplication: (drugName: string, startDate?: string, period?: string) => Array<{ withDrug: string; ingredient: string; route: string; source: 'current' | 'order'; startDate?: string; endDate?: string }>;
  checkPatientAttribute: (drugName: string) => Array<{ category: string; message: string; severity: 'prohibited' | 'caution' }>;
}

/**
 * 警告を連鎖的に表示するユーティリティフック
 */
export function useWarningChain(
  callbacks: WarningChainCallbacks,
  checks: WarningChainChecks
) {
  /**
   * 重複チェックのみを実行
   * @param drugName 薬剤名
   * @param onComplete 確認後のコールバック
   * @param startDate 開始日
   * @param period 期間
   */
  const showDuplicationWarningOnly = (
    drugName: string,
    onComplete: () => void,
    startDate?: string,
    period?: string
  ) => {
    const duplications = checks.checkDuplication(drugName, startDate, period);
    
    // 重複がない場合は直接完了
    if (duplications.length === 0) {
      onComplete();
      return;
    }
    
    // 重複警告のみ表示
    callbacks.setDuplicationWarning({
      show: true,
      drugName,
      duplicates: duplications,  // "duplicates"に統一
      onConfirm: () => {
        callbacks.setDuplicationWarning({ show: false, drugName: '', duplicates: [], onConfirm: () => {} });
        onComplete();
      }
    });
  };

  /**
   * 単一の薬剤に対して警告チェーンを実行（重複チェックを除く）
   * @param drugName 薬剤名
   * @param onComplete すべての警告を確認した後のコールバック
   * @param startDate 開始日（重複チェック用、オプション）
   * @param period 期間（重複チェック用、オプション）
   */
  const showWarningChainWithoutDuplication = (
    drugName: string,
    onComplete: () => void,
    startDate?: string,
    period?: string
  ) => {
    const allergies = checks.checkAllergy(drugName);
    const contraindications = checks.checkContraindication(drugName);
    const patientAttributes = checks.checkPatientAttribute(drugName);
    
    // 警告がない場合は直接完了
    if (allergies.length === 0 && contraindications.length === 0 && 
        patientAttributes.length === 0) {
      onComplete();
      return;
    }
    
    // 警告を順番に表示
    const showNextWarning = () => {
      if (allergies.length > 0) {
        callbacks.setAllergyWarning({
          show: true,
          drugName,
          allergies,
          onConfirm: () => {
            callbacks.setAllergyWarning({ show: false, drugName: '', allergies: [], onConfirm: () => {} });
            if (contraindications.length > 0) {
              setTimeout(() => showContraindicationWarning(), 100);
            } else if (patientAttributes.length > 0) {
              setTimeout(() => showPatientAttributeWarning(), 100);
            } else {
              onComplete();
            }
          }
        });
      } else if (contraindications.length > 0) {
        showContraindicationWarning();
      } else if (patientAttributes.length > 0) {
        showPatientAttributeWarning();
      }
    };
    
    const showContraindicationWarning = () => {
      callbacks.setContraindicationWarning({
        show: true,
        drugName,
        conflicts: contraindications,
        onConfirm: () => {
          callbacks.setContraindicationWarning({ show: false, drugName: '', conflicts: [], onConfirm: () => {} });
          if (patientAttributes.length > 0) {
            setTimeout(() => showPatientAttributeWarning(), 100);
          } else {
            onComplete();
          }
        }
      });
    };
    
    const showPatientAttributeWarning = () => {
      callbacks.setPatientAttributeWarning({
        show: true,
        drugName,
        warnings: patientAttributes,
        onConfirm: () => {
          callbacks.setPatientAttributeWarning({ show: false, drugName: '', warnings: [], onConfirm: () => {} });
          onComplete();
        }
      });
    };
    
    showNextWarning();
  };

  /**
   * 単一の薬剤に対して警告チェーンを実行
   * @param drugName 薬剤名
   * @param onComplete すべての警告を確認した後のコールバック
   * @param startDate 開始日（重複チェック用、オプション）
   * @param period 期間（重複チェック用、オプション）
   */
  const showWarningChainForDrug = (
    drugName: string,
    onComplete: () => void,
    startDate?: string,
    period?: string
  ) => {
    const allergies = checks.checkAllergy(drugName);
    const contraindications = checks.checkContraindication(drugName);
    const duplications = checks.checkDuplication(drugName, startDate, period);
    const patientAttributes = checks.checkPatientAttribute(drugName);
    
    // 警告がない場合は直接完了
    if (allergies.length === 0 && contraindications.length === 0 && 
        duplications.length === 0 && patientAttributes.length === 0) {
      onComplete();
      return;
    }
    
    // 警告を順番に表示
    const showNextWarning = () => {
      if (allergies.length > 0) {
        callbacks.setAllergyWarning({
          show: true,
          drugName,
          allergies,
          onConfirm: () => {
            callbacks.setAllergyWarning({ show: false, drugName: '', allergies: [], onConfirm: () => {} });
            if (contraindications.length > 0) {
              setTimeout(() => showContraindicationWarning(), 100);
            } else if (duplications.length > 0) {
              setTimeout(() => showDuplicationWarning(), 100);
            } else if (patientAttributes.length > 0) {
              setTimeout(() => showPatientAttributeWarning(), 100);
            } else {
              onComplete();
            }
          }
        });
      } else if (contraindications.length > 0) {
        showContraindicationWarning();
      } else if (duplications.length > 0) {
        showDuplicationWarning();
      } else if (patientAttributes.length > 0) {
        showPatientAttributeWarning();
      }
    };
    
    const showContraindicationWarning = () => {
      callbacks.setContraindicationWarning({
        show: true,
        drugName,
        conflicts: contraindications,
        onConfirm: () => {
          callbacks.setContraindicationWarning({ show: false, drugName: '', conflicts: [], onConfirm: () => {} });
          if (duplications.length > 0) {
            setTimeout(() => showDuplicationWarning(), 100);
          } else if (patientAttributes.length > 0) {
            setTimeout(() => showPatientAttributeWarning(), 100);
          } else {
            onComplete();
          }
        }
      });
    };
    
    const showDuplicationWarning = () => {
      callbacks.setDuplicationWarning({
        show: true,
        drugName,
        duplicates: duplications,
        onConfirm: () => {
          callbacks.setDuplicationWarning({ show: false, drugName: '', duplicates: [], onConfirm: () => {} });
          if (patientAttributes.length > 0) {
            setTimeout(() => showPatientAttributeWarning(), 100);
          } else {
            onComplete();
          }
        }
      });
    };
    
    const showPatientAttributeWarning = () => {
      callbacks.setPatientAttributeWarning({
        show: true,
        drugName,
        warnings: patientAttributes,
        onConfirm: () => {
          callbacks.setPatientAttributeWarning({ show: false, drugName: '', warnings: [], onConfirm: () => {} });
          onComplete();
        }
      });
    };
    
    showNextWarning();
  };

  /**
   * 複数のオーダーに対して警告チェーンを順次実行
   * @param orders オーダーリスト
   * @param onAllComplete すべてのオーダーの警告を確認した後のコールバック
   */
  const showWarningChainForOrders = (
    orders: Array<{
      name: string;
      type?: 'prescription' | 'injection' | 'lab';
    }>,
    onAllComplete: () => void
  ) => {
    // 処方・注射オーダーのみフィルタ
    const relevantOrders = orders.filter(
      order => order.type === 'prescription' || order.type === 'injection'
    );

    if (relevantOrders.length === 0) {
      onAllComplete();
      return;
    }

    // 全オーダーの警告データを事前収集
    const allWarnings = relevantOrders.map(order => {
      const allergies = checks.checkAllergy(order.name);
      const contraindications = checks.checkContraindication(order.name);
      const duplications = checks.checkDuplication(order.name);
      const patientAttributes = checks.checkPatientAttribute(order.name);
      
      return {
        order,
        allergies,
        contraindications,
        duplications,
        patientAttributes,
        hasWarnings: allergies.length > 0 || contraindications.length > 0 || 
                    duplications.length > 0 || patientAttributes.length > 0
      };
    });

    // 警告があるオーダーのみ抽出
    const ordersWithWarnings = allWarnings.filter(w => w.hasWarnings);

    if (ordersWithWarnings.length === 0) {
      onAllComplete();
      return;
    }

    // オーダーごとに警告を順次表示
    const showWarningsForOrderAtIndex = (index: number) => {
      if (index >= ordersWithWarnings.length) {
        onAllComplete();
        return;
      }

      const warningData = ordersWithWarnings[index];
      const { order, allergies, contraindications, duplications, patientAttributes } = warningData;

      // 次のオーダーへ進む関数
      const proceedToNextOrder = () => {
        showWarningsForOrderAtIndex(index + 1);
      };

      // このオーダーの警告を順次表示
      const showNextWarningForCurrentOrder = () => {
        if (allergies.length > 0) {
          callbacks.setAllergyWarning({
            show: true,
            drugName: order.name,
            allergies,
            onConfirm: () => {
              callbacks.setAllergyWarning({ show: false, drugName: '', allergies: [], onConfirm: () => {} });
              if (contraindications.length > 0) {
                setTimeout(() => showContraindicationForCurrentOrder(), 100);
              } else if (duplications.length > 0) {
                setTimeout(() => showDuplicationForCurrentOrder(), 100);
              } else if (patientAttributes.length > 0) {
                setTimeout(() => showPatientAttributeForCurrentOrder(), 100);
              } else {
                proceedToNextOrder();
              }
            }
          });
        } else if (contraindications.length > 0) {
          showContraindicationForCurrentOrder();
        } else if (duplications.length > 0) {
          showDuplicationForCurrentOrder();
        } else if (patientAttributes.length > 0) {
          showPatientAttributeForCurrentOrder();
        }
      };

      const showContraindicationForCurrentOrder = () => {
        callbacks.setContraindicationWarning({
          show: true,
          drugName: order.name,
          conflicts: contraindications,
          onConfirm: () => {
            callbacks.setContraindicationWarning({ show: false, drugName: '', conflicts: [], onConfirm: () => {} });
            if (duplications.length > 0) {
              setTimeout(() => showDuplicationForCurrentOrder(), 100);
            } else if (patientAttributes.length > 0) {
              setTimeout(() => showPatientAttributeForCurrentOrder(), 100);
            } else {
              proceedToNextOrder();
            }
          }
        });
      };

      const showDuplicationForCurrentOrder = () => {
        callbacks.setDuplicationWarning({
          show: true,
          drugName: order.name,
          duplicates: duplications,
          onConfirm: () => {
            callbacks.setDuplicationWarning({ show: false, drugName: '', duplicates: [], onConfirm: () => {} });
            if (patientAttributes.length > 0) {
              setTimeout(() => showPatientAttributeForCurrentOrder(), 100);
            } else {
              proceedToNextOrder();
            }
          }
        });
      };

      const showPatientAttributeForCurrentOrder = () => {
        callbacks.setPatientAttributeWarning({
          show: true,
          drugName: order.name,
          warnings: patientAttributes,
          onConfirm: () => {
            callbacks.setPatientAttributeWarning({ show: false, drugName: '', warnings: [], onConfirm: () => {} });
            proceedToNextOrder();
          }
        });
      };

      showNextWarningForCurrentOrder();
    };

    // 最初のオーダーから開始
    showWarningsForOrderAtIndex(0);
  };

  return {
    showDuplicationWarningOnly,
    showWarningChainWithoutDuplication,
    showWarningChainForDrug,
    showWarningChainForOrders
  };
}
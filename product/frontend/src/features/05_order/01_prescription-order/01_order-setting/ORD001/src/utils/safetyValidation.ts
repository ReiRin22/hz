import type { AllergyInfo, CurrentPatient, DrugMaster, CurrentMedication, OrderDetail } from '../data/types';

/**
 * アレルギーチェック関数
 */
export const checkAllergy = (
  drugName: string,
  patientAllergies: AllergyInfo[]
): AllergyInfo[] => {
  const matchedAllergies: AllergyInfo[] = [];
  
  patientAllergies.forEach(allergy => {
    // 薬剤名にアレルギー物質が含まれているかチェック
    const substanceLower = allergy.substance.toLowerCase();
    const drugNameLower = drugName.toLowerCase();
    
    // マッチングルール
    if (
      drugNameLower.includes(substanceLower) ||
      substanceLower.includes(drugNameLower) ||
      (substanceLower.includes('ペニシリン') && (drugNameLower.includes('アモキシシリン') || drugNameLower.includes('ペニシリン'))) ||
      (substanceLower.includes('nsaids') && (drugNameLower.includes('ロキソニン') || drugNameLower.includes('イブプロフェン') || drugNameLower.includes('ジクロフェナク')))
    ) {
      matchedAllergies.push(allergy);
    }
  });
  
  return matchedAllergies;
};

/**
 * 併用禁忌チェック関数
 */
export const checkContraindication = (
  drugName: string,
  drugMasterData: DrugMaster[],
  currentMedications: CurrentMedication[]
): Array<{ withDrug: string; reason: string; source: 'current' | 'newOrder' }> => {
  const matchedConflicts: Array<{ withDrug: string; reason: string; source: 'current' | 'newOrder' }> = [];
  
  // 新規オーダーの薬剤情報取得
  const newDrug = drugMasterData.find(d => d.name === drugName);
  if (!newDrug) return matchedConflicts;
  
  // 現在服用中の薬剤との比較
  currentMedications.forEach(medication => {
    const currentDrug = drugMasterData.find(d => d.name === medication.name);
    if (!currentDrug) return;
    
    // 併用禁忌の成分が含まれているかチェック
    newDrug.contraindicatedWith.forEach(contraIngredient => {
      if (currentDrug.ingredient.includes(contraIngredient)) {
        matchedConflicts.push({
          withDrug: medication.name,
          reason: `現在服用中の薬剤「${medication.name}」と併用禁忌があります（${contraIngredient}）`,
          source: 'current'
        });
      }
    });
  });
  
  return matchedConflicts;
};

/**
 * 日付文字列から終了日を計算
 */
const calculateEndDate = (startDate: string, period: string): string | undefined => {
  if (!startDate || !period) return undefined;
  
  // periodから数値を抽出（「7日分」→7、「5回分」→undefined）
  const match = period.match(/(\d+)日分/);
  if (!match) return undefined;
  
  const days = parseInt(match[1], 10);
  const start = new Date(startDate);
  const end = new Date(start);
  end.setDate(end.getDate() + days - 1); // 7日分なら開始日+6日
  
  return end.toISOString().split('T')[0]; // YYYY-MM-DD形式
};

/**
 * 期間の重複をチェック
 */
const isDateRangeOverlapping = (
  start1: string,
  end1: string | undefined,
  start2: string,
  end2: string | undefined
): boolean => {
  // 継続中（終了日なし）の場合は重複とみなす
  if (!end1 || !end2) return true;
  
  const s1 = new Date(start1);
  const e1 = new Date(end1);
  const s2 = new Date(start2);
  const e2 = new Date(end2);
  
  // 期間の重複判定：start1 <= end2 && start2 <= end1
  return s1 <= e2 && s2 <= e1;
};

/**
 * 重複投薬チェック関数
 */
export const checkDuplication = (
  drugName: string,
  drugMasterData: DrugMaster[],
  confirmedOrders: OrderDetail[],
  currentMedications: CurrentMedication[],
  startDate?: string,
  period?: string
): Array<{ withDrug: string; ingredient: string; route: string; source: 'current' | 'order'; startDate?: string; endDate?: string }> => {
  const matchedDuplicates: Array<{ withDrug: string; ingredient: string; route: string; source: 'current' | 'order'; startDate?: string; endDate?: string }> = [];
  
  // 新規オーダーの薬剤情報取得
  const newDrug = drugMasterData.find(d => d.name === drugName);
  if (!newDrug) return matchedDuplicates;
  
  // 新規オーダーの終了日を計算
  const newEndDate = startDate && period ? calculateEndDate(startDate, period) : undefined;
  
  // 現在のオーダーリストとの比較
  confirmedOrders.forEach(order => {
    const existingDrug = drugMasterData.find(d => d.name === order.name);
    if (!existingDrug) return;
    
    // 同じ薬剤（成分と投与経路が同じ）が存在するかチェック
    if (existingDrug.ingredient === newDrug.ingredient && existingDrug.route === newDrug.route) {
      // 期間情報がある場合は期間重複もチェック
      if (startDate && order.startDate) {
        const existingEndDate = order.startDate && order.period 
          ? calculateEndDate(order.startDate, order.period)
          : undefined;
        
        // 期間が重複している場合のみ追加
        if (isDateRangeOverlapping(startDate, newEndDate, order.startDate, existingEndDate)) {
          matchedDuplicates.push({
            withDrug: order.name,
            ingredient: existingDrug.ingredient,
            route: existingDrug.route,
            source: 'order',
            startDate: order.startDate,
            endDate: existingEndDate
          });
        }
      } else {
        // 期間情報がない場合は従来通り重複とみなす
        matchedDuplicates.push({
          withDrug: order.name,
          ingredient: existingDrug.ingredient,
          route: existingDrug.route,
          source: 'order'
        });
      }
    }
  });
  
  // 現在服用中の薬剤との比較
  currentMedications.forEach(medication => {
    const currentDrug = drugMasterData.find(d => d.name === medication.name);
    if (!currentDrug) return;
    
    // 同じ薬剤（成分と投与経路が同じ）が存在するかチェック
    if (currentDrug.ingredient === newDrug.ingredient && currentDrug.route === newDrug.route) {
      // 期間情報がある場合は期間重複もチェック
      if (startDate && medication.startDate) {
        // 期間が重複している場合のみ追加
        if (isDateRangeOverlapping(startDate, newEndDate, medication.startDate, medication.endDate)) {
          matchedDuplicates.push({
            withDrug: medication.name,
            ingredient: currentDrug.ingredient,
            route: currentDrug.route,
            source: 'current',
            startDate: medication.startDate,
            endDate: medication.endDate
          });
        }
      } else {
        // 期間情報がない場合は従来通り重複とみなす
        matchedDuplicates.push({
          withDrug: medication.name,
          ingredient: currentDrug.ingredient,
          route: currentDrug.route,
          source: 'current',
          startDate: medication.startDate,
          endDate: medication.endDate
        });
      }
    }
  });
  
  return matchedDuplicates;
};

/**
 * 患者属性適合性チェック関数
 */
export const checkPatientAttribute = (
  drugName: string,
  drugMasterData: DrugMaster[],
  currentPatient: CurrentPatient
): Array<{ category: string; message: string; severity: 'prohibited' | 'caution' }> => {
  const matchedWarnings: Array<{ category: string; message: string; severity: 'prohibited' | 'caution' }> = [];
  
  // 新規オーダーの薬剤情報取得
  const newDrug = drugMasterData.find(d => d.name === drugName);
  if (!newDrug) return matchedWarnings;
  
  // 年齢制限チェック
  if (newDrug.ageRestriction) {
    const { min, max, reason } = newDrug.ageRestriction;
    if ((min && currentPatient.age < min) || (max && currentPatient.age > max)) {
      matchedWarnings.push({
        category: '年齢制限',
        message: reason || '年齢制限があります',
        severity: 'prohibited'
      });
    }
  }
  
  // 性別制限チェック
  if (newDrug.genderRestriction) {
    const { gender, reason } = newDrug.genderRestriction;
    if (currentPatient.gender !== gender) {
      matchedWarnings.push({
        category: '性別制限',
        message: reason || '性別制限があります',
        severity: 'prohibited'
      });
    }
  }
  
  // 妊娠中の使用チェック
  if (newDrug.pregnancyCategory) {
    if (currentPatient.isPregnant) {
      matchedWarnings.push({
        category: '妊娠中の使用',
        message: '妊娠中の使用は' + newDrug.pregnancyCategory + 'です',
        severity: newDrug.pregnancyCategory === 'prohibited' ? 'prohibited' : 'caution'
      });
    }
  }
  
  // 授乳中の使用チェック
  if (newDrug.lactationCategory) {
    if (currentPatient.isLactating) {
      matchedWarnings.push({
        category: '授乳中の使用',
        message: '授乳中の使用は' + newDrug.lactationCategory + 'です',
        severity: newDrug.lactationCategory === 'prohibited' ? 'prohibited' : 'caution'
      });
    }
  }
  
  // 腎機能障害での禁忌チェック
  if (newDrug.renalContraindication) {
    const { severity, reason } = newDrug.renalContraindication;
    if (severity.includes(currentPatient.renalFunction)) {
      matchedWarnings.push({
        category: '腎機能障害での禁忌',
        message: reason || '腎機能障害での禁忌があります',
        severity: 'prohibited'
      });
    }
  }
  
  // 肝機能障害での禁忌チェック
  if (newDrug.hepaticContraindication) {
    const { severity, reason } = newDrug.hepaticContraindication;
    if (severity.includes(currentPatient.hepaticFunction)) {
      matchedWarnings.push({
        category: '肝機能障害での禁忌',
        message: reason || '肝機能障害での禁忌があります',
        severity: 'prohibited'
      });
    }
  }
  
  // 禁忌の病名リストチェック
  if (newDrug.diagnosisContraindication) {
    const matchedDiagnoses = newDrug.diagnosisContraindication.filter(diagnosis => currentPatient.diagnoses?.includes(diagnosis));
    if (matchedDiagnoses.length > 0) {
      matchedWarnings.push({
        category: '禁忌の病名',
        message: '以下の病名が禁忌です: ' + matchedDiagnoses.join(', '),
        severity: 'prohibited'
      });
    }
  }
  
  return matchedWarnings;
};
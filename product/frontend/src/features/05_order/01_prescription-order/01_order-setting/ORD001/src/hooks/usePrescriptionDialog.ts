import { useState } from 'react';
import { toast } from 'sonner';
import type { OrderDetail, AllergyInfo, Doctor } from '../data/types';
import { addPrescriptionHistory } from '../utils/prescriptionStorage';

interface UsePrescriptionDialogProps {
  confirmedOrders: OrderDetail[];
  setConfirmedOrders: (value: OrderDetail[] | ((prev: OrderDetail[]) => OrderDetail[])) => void;
  setNextRpNumber: (value: number | ((prev: number) => number)) => void;
  setCandidates: (value: any[] | ((prev: any[]) => any[])) => void;
  currentDoctor: Doctor | null;
  checkAllergy: (drugName: string) => AllergyInfo[];
  showWarningChainForOrders: (
    orders: Array<{ name: string; type?: 'prescription' | 'injection' | 'lab' }>,
    onComplete: () => void
  ) => void;
}

export function usePrescriptionDialog({
  confirmedOrders,
  setConfirmedOrders,
  setNextRpNumber,
  setCandidates,
  currentDoctor,
  checkAllergy,
  showWarningChainForOrders
}: UsePrescriptionDialogProps) {
  const [prescriptionDialog, setPrescriptionDialog] = useState<{
    show: boolean;
    type: 'external' | 'internal' | null;
  }>({
    show: false,
    type: null
  });

  /**
   * 全オーダー確定処理
   */
  const handleConfirmAllOrders = () => {
    if (confirmedOrders.length === 0) {
      toast.error('確定するオーダーがありません');
      return;
    }
    
    // 警告チェーンを実行
    showWarningChainForOrders(confirmedOrders, proceedToConfirmation);
  };

  /**
   * 警告確認後の確定処理へ進む
   */
  const proceedToConfirmation = () => {
    // 処方オーダーがある場合は処方箋発行ダイアログを表示
    const prescriptionOrders = confirmedOrders.filter(o => o.type === 'prescription');
    if (prescriptionOrders.length > 0) {
      // 処方区分から院外/院内を判定
      const prescriptionTypes = prescriptionOrders
        .map(o => o.prescriptionType)
        .filter((type): type is '院外' | '院内' => type !== undefined);
      
      const hasExternal = prescriptionTypes.includes('院外');
      const hasInternal = prescriptionTypes.includes('院内');
      
      // 処方区分が混在している場合はエラー
      if (hasExternal && hasInternal) {
        toast.error('院外処方と院内処方が混在しています。処方区分を統一してください。');
        return;
      }
      
      // 処方区分が未設定の場合はデフォルトで院外
      const autoType: 'external' | 'internal' = hasInternal ? 'internal' : 'external';
      
      // 自動判定して署名ステップへ
      setPrescriptionDialog({
        show: true,
        type: autoType
      });
      return;
    }
    
    // 処方オーダーがない場合は従来通りの確定処理
    confirmOrdersWithoutPrescription();
  };

  /**
   * 処方箋なしでのオーダー確定
   */
  const confirmOrdersWithoutPrescription = () => {
    // 全オーダーのアレルギーチェック
    const allergicOrders: { order: OrderDetail; allergies: AllergyInfo[] }[] = [];
    
    confirmedOrders.forEach(order => {
      if (order.type === 'prescription' || order.type === 'injection') {
        const matchedAllergies = checkAllergy(order.name);
        if (matchedAllergies.length > 0) {
          allergicOrders.push({ order, allergies: matchedAllergies });
        }
      }
    });
    
    if (allergicOrders.length > 0) {
      const allergyMessage = allergicOrders.map(({ order, allergies }) => 
        `${order.name}: ${allergies.map(a => a.substance).join(', ')}`
      ).join('\n');
      
      toast.error(
        `以下のオーダーにアレルギー該当があります：\n${allergyMessage}`,
        { duration: 10000 }
      );
      return;
    }
    
    // 処方履歴を保存（医師がログインしている場合）
    if (currentDoctor) {
      confirmedOrders.forEach(order => {
        if (order.type === 'prescription') {
          addPrescriptionHistory(
            currentDoctor.id,
            order.name,
            order.quantity,
            order.dosage
          );
        }
      });
    }
    
    // 全オーダー確定処理のシミュレーション
    toast.success(`${confirmedOrders.length}件のオーダーを確定しました`);
    
    // オーダーリストをクリア
    setConfirmedOrders([]);
    setNextRpNumber(1);
    setCandidates([]);
  };

  /**
   * 処方箋発行ダイアログを閉じる
   */
  const closePrescriptionDialog = () => {
    setPrescriptionDialog({ show: false, type: null });
  };

  return {
    prescriptionDialog,
    setPrescriptionDialog,
    handleConfirmAllOrders,
    confirmOrdersWithoutPrescription,
    closePrescriptionDialog
  };
}
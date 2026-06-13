'use client';

import { useState } from "react";
import { toast } from "sonner";
import { formatDateToJapanese, isNewPatient } from "@/shared/utils/user-header/patient-utils";
import { 
  getCurrentPatientRecords,
  getCurrentPatientMedications,
  getCurrentPatientExternalRecords,
  getCurrentPatientHealthCheckups
} from "@/shared/utils/user-header/patient-utils";
import { patientDatabase } from "@/shared/assets/user-header/medical-data";

interface UseAppEventHandlersProps {
  currentPatient: Patient;
  currentRecord: CurrentRecord;
  setCurrentRecord: (record: CurrentRecord) => void;
  resetToNewRecord: () => void;
  changePatient: (patientId: string) => boolean;
  setSelectedRecord: (id: string | undefined) => void;
  setOrders: (orders: unknown[]) => void;
  setHasUnsavedChanges: (hasChanges: boolean) => void;
  setShowExternalRecordsDialog: (show: boolean) => void;
  setShowHealthCheckupDialog: (show: boolean) => void;
  orders: unknown[];
}

export function useAppEventHandlers({
  currentPatient,
  currentRecord,
  setCurrentRecord,
  resetToNewRecord,
  changePatient,
  setSelectedRecord,
  setOrders,
  setHasUnsavedChanges,
  setShowExternalRecordsDialog,
  setShowHealthCheckupDialog,
  orders
}: UseAppEventHandlersProps) {
  const [isSaving, setIsSaving] = useState(false);

  // 患者検索・変更機能
  const handlePatientSelect = (patientId: string) => {
    const success = changePatient(patientId);
    
    if (success) {
      // 新しい患者を選択した際は記録選択をリセット
      setSelectedRecord(undefined);
      setOrders([]);
      setHasUnsavedChanges(false);
      
      const patientType = isNewPatient(patientId) ? "新患" : "既存患者";
      const patient = patientDatabase[patientId];
      toast.success(`${patientType}に切り替えました: ${patient.name} (${patient.patientId})`);
      return true;
    } else {
      toast.error(`患者ID「${patientId}」が見つかりません`);
      return false;
    }
  };

  // 記録選択
  const handleRecordSelect = (record: MedicalRecord) => {
    setSelectedRecord(record.id);
    toast.info(`${record.date} ${record.title}の記録を選択しました`);
  };

  // 記録適用
  const handleApplyRecord = (record: MedicalRecord) => {
    // 日付をISO形式に変換（2024/12/27 → 2024-12-27）
    const convertDateToISO = (dateString: string) => {
      if (dateString.includes('/')) {
        const [year, month, day] = dateString.split('/');
        return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
      }
      return dateString;
    };

    // 選択された記録を現在の入力欄に反映
    const newRecord = {
      recordDate: convertDateToISO(record.date) || new Date().toISOString().slice(0, 10),
      soapRecord: record.soapRecord || record.content,
      vitalSigns: record.vitalSigns || {
        bloodPressure: "",
        pulse: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
      },
    };

    setCurrentRecord(newRecord);
    toast.success(`${record.date}の記録を入力欄に反映しました`);
  };

  // 記録保存
  const handleRecordSave = () => {
    const formattedDate = formatDateToJapanese(currentRecord.recordDate);
    toast.success(`${formattedDate}の診療記録を保存しました`);
    setHasUnsavedChanges(true);
  };

  // オーダー送信
  const handleOrdersSubmit = () => {
    if (orders.length > 0) {
      toast.success(`${orders.length}件のオーダーを追加しました`);
      setHasUnsavedChanges(true);
    }
  };

  // 文書作成
  const handleDocumentCreate = (type: string) => {
    const documentNames: { [key: string]: string } = {
      "medical-certificate": "診断書",
      "referral-letter": "紹介状",
      prescription: "処方箋",
      report: "検査報告書",
    };
    toast.info(`${documentNames[type]}の作成画面を開きます`);
  };

  // テンプレート読み込み
  const handleTemplateLoad = (template: string) => {
    const templateNames: { [key: string]: string } = {
      "internal-medicine": "内科テンプレート",
      surgery: "外科テンプレート",
      pediatrics: "小児科テンプレート",
      orthopedics: "整形外科テンプレート",
    };
    toast.info(`${templateNames[template]}を読み込みました`);
  };

  // 新規記録モード
  const handleNewRecordMode = () => {
    setSelectedRecord(undefined);
    resetToNewRecord();
    toast.success("新規入力モードに切り替えました");
    setHasUnsavedChanges(false);
  };

  // 記録詳細パネルを閉じる処理
  const handleCloseRecordDetail = () => {
    setSelectedRecord(undefined);
    toast.info("記録詳細パネルを閉じました");
  };

  // 一括保存処理
  const handleBulkSave = async () => {
    setIsSaving(true);
    
    try {
      // 診療記録の保存
      const formattedDate = formatDateToJapanese(currentRecord.recordDate);
      
      // オーダーの保存
      const orderCount = orders.length;
      
      // 実際の保存処理をシミュレート
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 成功メッセージ
      toast.success(
        `診療記録とオーダー（${orderCount}件）を一括保存しました`,
        {
          description: `保存日時: ${formattedDate}`,
        }
      );
      
      // 状態をリセット
      setOrders([]);
      setHasUnsavedChanges(false);
      
    } catch {
      toast.error("保存に失敗しました。再度お試しください。");
    } finally {
      setIsSaving(false);
    }
  };

  interface DiagnosisData {
    diagnosisName: string;
    diagnosisCode?: string;
    confirmedDate: string;
    isPrimary: boolean;
    severity: string;
    status: string;
  }

  // 病名登録の処理
  const handleDiagnosisRegistration = (diagnosisData: DiagnosisData) => {
    const diagnosisInfo = [
      `病名: ${diagnosisData.diagnosisName}`,
      diagnosisData.diagnosisCode ? `コード: ${diagnosisData.diagnosisCode}` : null,
      `確定日: ${diagnosisData.confirmedDate}`,
      diagnosisData.isPrimary ? '主病名' : '副病名',
      `重症度: ${diagnosisData.severity}`,
      `病状: ${diagnosisData.status}`
    ].filter(Boolean).join(' | ');
    
    toast.success('病名を登録しました', {
      description: diagnosisInfo,
      duration: 5000,
    });
    
    setHasUnsavedChanges(true);
  };

  // 薬歴参照の処理
  const handleMedicationHistoryView = () => {
    const medicationCount = getCurrentPatientMedications(currentPatient.patientId).length;
    if (medicationCount === 0) {
      toast.info(isNewPatient(currentPatient.patientId) 
        ? '新患のため薬歴はありません' 
        : 'この患者の薬歴は登録されていません'
      );
    }
  };

  // 画像参照の処理
  const handleImageViewing = () => {
    toast.info('PACS システムから画像データを取得中...', {
      description: '放射線科システムと連携して画像を読み込んでいます',
      duration: 2000,
    });
  };

  // 検査結果参照の処理
  const handleTestResultsView = () => {
    toast.info('検査システム（LIS）から検査結果を取得中...', {
      description: '血液検査・生化学検査・生理検査の結果を読み込んでいます',
      duration: 2000,
    });
  };

  // 他院診療情報参照の処理
  const handleExternalRecordsView = () => {
    const recordCount = getCurrentPatientExternalRecords(currentPatient.patientId).length;
    if (recordCount === 0) {
      toast.info(isNewPatient(currentPatient.patientId) 
        ? '新患のため他院診療情報はありません' 
        : 'この患者の他院診療情報は登録されていません'
      );
    } else {
      setShowExternalRecordsDialog(true);
    }
  };

  // 健診情報参照の処理
  const handleHealthCheckupView = () => {
    const checkupCount = getCurrentPatientHealthCheckups(currentPatient.patientId).length;
    if (checkupCount === 0) {
      toast.info(isNewPatient(currentPatient.patientId) 
        ? '新患のため健診情報はありません' 
        : 'この患者の健診情報は登録されていません'
      );
    } else {
      setShowHealthCheckupDialog(true);
    }
  };

  // 健診情報の表示/非表示切り替え
  const handleHealthCheckupVisibilityToggle = (_checkupId: string, visible: boolean) => {
    toast.success(`健診記録の表示を${visible ? '有効' : '無効'}にしました`);
  };

  // 自動保存処理
  const handleAutoSave = () => {
    if (orders.length > 0) {
      toast.info("自動保存しました", { duration: 2000 });
    }
  };

  // 日付選択処理
  const handleDateSelect = (date: string) => {
    // 指定された日付の記録を検索
    const records = getCurrentPatientRecords(currentPatient.patientId);
    const recordsForDate = records.filter(record => record.date === date);
    
    if (recordsForDate.length > 0) {
      // その日の最新の記録を選択
      const latestRecord = recordsForDate[recordsForDate.length - 1];
      handleRecordSelect(latestRecord);
      toast.info(`${date}の記録を選択しました（${recordsForDate.length}件）`);
    } else {
      // 記録がない日付の場合、その日付で新規記録作成モードに
      const convertDateToISO = (dateString: string) => {
        if (dateString.includes('/')) {
          const [year, month, day] = dateString.split('/');
          return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        }
        return dateString;
      };

      setSelectedRecord(undefined);
      setCurrentRecord({
        recordDate: convertDateToISO(date),
        soapRecord: "",
        vitalSigns: {
          bloodPressure: "",
          pulse: "",
          temperature: "",
          respiratoryRate: "",
          oxygenSaturation: "",
        },
      });
      toast.info(`${date}の新規記録作成モードに切り替えました`);
    }
  };

  return {
    isSaving,
    handlePatientSelect,
    handleRecordSelect,
    handleApplyRecord,
    handleRecordSave,
    handleOrdersSubmit,
    handleDocumentCreate,
    handleTemplateLoad,
    handleNewRecordMode,
    handleCloseRecordDetail,
    handleBulkSave,
    handleDiagnosisRegistration,
    handleMedicationHistoryView,
    handleImageViewing,
    handleTestResultsView,
    handleExternalRecordsView,
    handleHealthCheckupView,
    handleHealthCheckupVisibilityToggle,
    handleAutoSave,
    handleDateSelect
  };
}
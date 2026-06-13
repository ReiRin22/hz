'use client';

import { useState } from "react";
import type { Patient, ProgressRecord, HandoverItem, MedicalAlert, CurrentRecord } from "@/shared/types/user-header/patient-types";
import { 
  defaultPatient, 
  sampleProgressRecords, 
  sampleHandoverItems
} from "@/shared/assets/user-header/medical-data";
import { 
  isNewPatient, 
  getPatientAlerts, 
  getPatientById, 
  formatDateToJapanese 
} from "@/shared/utils/user-header/patient-utils";

export const usePatientData = () => {
  const [currentPatient, setCurrentPatient] = useState<Patient>(defaultPatient);
  const [progressRecords, setProgressRecords] = useState<ProgressRecord[]>(
    isNewPatient(defaultPatient.patientId) ? [] : sampleProgressRecords
  );
  const [handoverItems, setHandoverItems] = useState<HandoverItem[]>(
    isNewPatient(defaultPatient.patientId) ? [] : sampleHandoverItems
  );
  const [medicalAlerts, setMedicalAlerts] = useState<MedicalAlert[]>(
    getPatientAlerts(defaultPatient.patientId)
  );
  const [currentRecord, setCurrentRecord] = useState<CurrentRecord>({
    recordDate: new Date().toISOString().slice(0, 10), // 今日の日付をデフォルトに設定
    soapRecord: "", // 初期状態は空文字列
    vitalSigns: {
      bloodPressure: "",
      pulse: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: "",
    },
  });

  // 患者変更の処理
  const changePatient = (patientId: string): boolean => {
    const patient = getPatientById(patientId);
    
    if (patient) {
      setCurrentPatient(patient);
      
      // 新患かどうかによって初期記録を変更
      if (isNewPatient(patientId)) {
        setCurrentRecord({
          recordDate: new Date().toISOString().slice(0, 10),
          soapRecord: "", // 新患も初期状態は空文字列
          vitalSigns: {
            bloodPressure: "",
            pulse: "",
            temperature: "",
            respiratoryRate: "",
            oxygenSaturation: "",
          },
        });
        // 新患の場合は経過記録・申し送りをクリア
        setProgressRecords([]);
        setHandoverItems([]);
      } else {
        setCurrentRecord({
          recordDate: new Date().toISOString().slice(0, 10),
          soapRecord: "", // 既存患者も初期状態は空文字列
          vitalSigns: {
            bloodPressure: "",
            pulse: "",
            temperature: "",
            respiratoryRate: "",
            oxygenSaturation: "",
          },
        });
        // 既存患者の場合は経過記録・申し送りを復元
        setProgressRecords(sampleProgressRecords);
        setHandoverItems(sampleHandoverItems);
      }

      // 患者に応じてアラートを更新
      setMedicalAlerts(getPatientAlerts(patientId));
      
      return true;
    }
    
    return false;
  };

  // 新規記録モードの処理
  const resetToNewRecord = () => {
    setCurrentRecord({
      recordDate: new Date().toISOString().slice(0, 10),
      soapRecord: "", // 新規記録も初期状態は空文字列
      vitalSigns: {
        bloodPressure: "",
        pulse: "",
        temperature: "",
        respiratoryRate: "",
        oxygenSaturation: "",
      },
    });
  };

  // 経過記録の追加
  const addProgressRecord = (record: any) => {
    const now = new Date();
    const newRecord: ProgressRecord = {
      ...record,
      id: `prog_${Date.now()}`,
      date: formatDateToJapanese(now.toISOString().slice(0, 10)),
      time: now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };
    setProgressRecords(prev => [newRecord, ...prev]);
  };

  // 申し送りの追加
  const addHandoverItem = (item: any) => {
    const now = new Date();
    const newItem: HandoverItem = {
      ...item,
      id: `hand_${Date.now()}`,
      date: formatDateToJapanese(now.toISOString().slice(0, 10)),
      time: now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' }),
    };
    setHandoverItems(prev => [newItem, ...prev]);
  };

  // 申し送りを既読にする
  const markHandoverAsRead = (id: string) => {
    setHandoverItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isRead: true } : item
      )
    );
  };

  // 申し送りを解決済みにする
  const markHandoverAsResolved = (id: string) => {
    setHandoverItems(prev => 
      prev.map(item => 
        item.id === id ? { ...item, isResolved: true, isRead: true } : item
      )
    );
  };

  // アラート削除
  const dismissAlert = (alertId: string) => {
    setMedicalAlerts(prev => 
      prev.map(alert => 
        alert.id === alertId ? { ...alert, dismissed: true } : alert
      )
    );
  };

  return {
    currentPatient,
    progressRecords,
    handoverItems,
    medicalAlerts,
    currentRecord,
    setCurrentRecord,
    changePatient,
    resetToNewRecord,
    addProgressRecord,
    addHandoverItem,
    markHandoverAsRead,
    markHandoverAsResolved,
    dismissAlert
  };
};
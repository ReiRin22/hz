import { useState, useEffect } from 'react';
import { Patient } from '../types/document';

const SCAN_MOCK_DELAY = 1500;
const SCAN_PAGES_COUNT = 3;
const DEFAULT_DEPARTMENT = '内科';

export interface ScannedDocument {
  id: string;
  imageData: string;
  registered: boolean;
  patientId: string;
  patientName: string;
  docType: string;
  department: string;
  doctor: string;
  documentDate: Date; // 文書日付（印字される日付）
  referralType: string;
  referralHospital: string;
  referralDepartment: string;
  referralDoctor: string;
  comment: string;
}

interface UseDocumentScanningOptions {
  currentPatient?: Patient; // カルテ版の場合は患者情報が固定
  onUpload: (uploadData: any) => void;
  onClose: () => void;
}

const createNewScannedDocument = (currentPatient?: Patient): ScannedDocument => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 9);
  
  return {
    id: `scanned-${timestamp}-${random}`,
    imageData: `image-data-${timestamp}-${random}`,
    registered: false,
    patientId: currentPatient?.id || '',
    patientName: currentPatient?.name || '',
    docType: '',
    department: DEFAULT_DEPARTMENT,
    doctor: '',
    documentDate: new Date(), // 文書日付（印字される日付）
    referralType: '',
    referralHospital: '',
    referralDepartment: '',
    referralDoctor: '',
    comment: ''
  };
};

const findNextUnregisteredIndex = (
  documents: ScannedDocument[],
  currentIndex: number
): number | null => {
  const nextIndex = documents.findIndex((doc, i) => i > currentIndex && !doc.registered);
  if (nextIndex !== -1) return nextIndex;
  
  const prevIndex = documents.findIndex((doc, i) => i !== currentIndex && !doc.registered);
  return prevIndex !== -1 ? prevIndex : null;
};

export function useDocumentScanning({ 
  currentPatient, 
  onUpload, 
  onClose 
}: UseDocumentScanningOptions) {
  const [isScanning, setIsScanning] = useState(false);
  const [scannedDocuments, setScannedDocuments] = useState<ScannedDocument[]>([]);
  const [selectedDocIndex, setSelectedDocIndex] = useState<number | null>(null);

  // 1枚だけの場合は自動選択
  useEffect(() => {
    if (scannedDocuments.length === 1 && selectedDocIndex === null) {
      setSelectedDocIndex(0);
    }
  }, [scannedDocuments.length, selectedDocIndex]);

  const handleScan = () => {
    setIsScanning(true);
    
    setTimeout(() => {
      const newDocs = Array.from({ length: SCAN_PAGES_COUNT }, () => 
        createNewScannedDocument(currentPatient)
      );
      setScannedDocuments(prev => {
        const updated = [...prev, ...newDocs];
        // スキャン前に文書がなければ、1枚目を自動選択
        if (prev.length === 0) {
          setSelectedDocIndex(0);
        }
        return updated;
      });
      setIsScanning(false);
    }, SCAN_MOCK_DELAY);
  };

  const removeScannedDocument = (index: number) => {
    const newDocuments = scannedDocuments.filter((_, i) => i !== index);
    setScannedDocuments(newDocuments);
    
    if (newDocuments.length === 0) {
      setSelectedDocIndex(null);
      return;
    }
    
    if (selectedDocIndex === index) {
      const nextIndex = index < newDocuments.length ? index : newDocuments.length - 1;
      setSelectedDocIndex(nextIndex);
    } else if (selectedDocIndex !== null && index < selectedDocIndex) {
      setSelectedDocIndex(selectedDocIndex - 1);
    }
  };

  const selectDocument = (index: number) => {
    setSelectedDocIndex(index);
  };

  const updateSelectedDocument = (field: keyof ScannedDocument, value: any) => {
    if (selectedDocIndex === null) return;
    
    setScannedDocuments(prev => prev.map((doc, i) => 
      i === selectedDocIndex ? { ...doc, [field]: value } : doc
    ));
  };

  const handleRegisterDocument = () => {
    if (selectedDocIndex === null) return;
    const selectedDoc = scannedDocuments[selectedDocIndex];
    if (!selectedDoc) return;
    
    // 独立版の場合は患者IDチェック
    if (!currentPatient && !selectedDoc.patientId) {
      alert('患者を選択してください');
      return;
    }
    
    if (!selectedDoc.docType) {
      alert('文書種別は必須項目です');
      return;
    }
    
    // アップロード実行
    const uploadData = currentPatient 
      ? {
          // カルテ版：患者情報不要
          type: selectedDoc.docType,
          department: selectedDoc.department,
          doctor: selectedDoc.doctor,
          documentDate: selectedDoc.documentDate, // 文書日付（印字される日付）
          referralType: selectedDoc.referralType,
          referralHospital: selectedDoc.referralHospital,
          referralDepartment: selectedDoc.referralDepartment,
          referralDoctor: selectedDoc.referralDoctor,
          comment: selectedDoc.comment
        }
      : {
          // 独立版：患者情報含む
          patientId: selectedDoc.patientId,
          type: selectedDoc.docType,
          department: selectedDoc.department,
          doctor: selectedDoc.doctor,
          documentDate: selectedDoc.documentDate, // 文書日付（印字される日付）
          referralType: selectedDoc.referralType,
          referralHospital: selectedDoc.referralHospital,
          referralDepartment: selectedDoc.referralDepartment,
          referralDoctor: selectedDoc.referralDoctor,
          comment: selectedDoc.comment
        };
    
    onUpload(uploadData);
    
    // 登録済みマーク
    setScannedDocuments(prev => prev.map((doc, i) => 
      i === selectedDocIndex ? { ...doc, registered: true } : doc
    ));
    
    // 次の未登録文書に自動遷移
    const nextIndex = findNextUnregisteredIndex(scannedDocuments, selectedDocIndex);
    setSelectedDocIndex(nextIndex);
  };

  const handleComplete = () => {
    const registeredCount = scannedDocuments.filter(doc => doc.registered).length;
    const totalCount = scannedDocuments.length;
    const allRegistered = totalCount > 0 && registeredCount === totalCount;
    
    // 全ての文書が登録済みなら画面を閉じる
    if (scannedDocuments.length === 0 || allRegistered) {
      onClose();
      return;
    }
    
    // 未登録の文書がある場合の確認ダイアログ（カルテ版・独立版共通）
    const unregisteredCount = totalCount - registeredCount;
    if (window.confirm(`${unregisteredCount}枚の未登録文書があります。\n閉じてもよろしいですか？`)) {
      onClose();
    }
  };

  const selectedDoc = selectedDocIndex !== null ? scannedDocuments[selectedDocIndex] : null;
  const registeredCount = scannedDocuments.filter(doc => doc.registered).length;
  const totalCount = scannedDocuments.length;
  const allRegistered = totalCount > 0 && registeredCount === totalCount;

  return {
    // State
    isScanning,
    scannedDocuments,
    selectedDocIndex,
    selectedDoc,
    registeredCount,
    totalCount,
    allRegistered,
    
    // Actions
    handleScan,
    removeScannedDocument,
    selectDocument,
    updateSelectedDocument,
    handleRegisterDocument,
    handleComplete
  };
}
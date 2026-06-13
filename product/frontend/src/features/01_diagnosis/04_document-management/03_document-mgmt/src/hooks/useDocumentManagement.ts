import { useState } from 'react';
import { toast } from 'sonner';
import { sampleDocuments, type DocumentData, type FieldChange, type RevisionRecord } from '../data/sampleData';

export function useDocumentManagement() {
  const [documents, setDocuments] = useState<DocumentData[]>(sampleDocuments);

  const handleSaveDocument = (
    documentData: Omit<DocumentData, 'id' | 'createdDate' | 'updatedDate' | 'createdBy' | 'documentDate' | 'createdAt' | 'updatedAt' | 'updatedBy' | 'revisionHistory'>,
    status: '作成中' | '作成済'
  ) => {
    const now = new Date();
    const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const dateTimeString = `${dateString} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentUser = '田中太郎'; // 実際はログインユーザー情報から取得
    
    const newDocument: DocumentData = {
      ...documentData,
      id: `d-${Date.now()}`,
      documentDate: dateString,
      createdAt: dateTimeString,
      createdBy: currentUser,
      updatedAt: dateTimeString,
      updatedBy: currentUser,
      createdDate: dateString,
      updatedDate: dateString,
      status: status,
      revisionHistory: [
        {
          revisionNumber: 1,
          timestamp: dateTimeString,
          updatedBy: currentUser,
          action: '作成',
          changes: [],
          memo: '新規作成'
        }
      ]
    };

    setDocuments(prev => [...prev, newDocument]);
    
    if (status === '作成中') {
      toast.success('文書を一時保存しました');
    } else {
      toast.success('文書を登録しました');
    }
    
    return newDocument.id;
  };

  const handleUpdateDocument = (
    documentId: string,
    documentData: Omit<DocumentData, 'id' | 'createdDate' | 'updatedDate' | 'createdBy' | 'documentDate' | 'createdAt' | 'updatedAt' | 'updatedBy' | 'revisionHistory'>,
    status: '作成中' | '作成済'
  ) => {
    const now = new Date();
    const dateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const dateTimeString = `${dateString} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const currentUser = '田中太郎'; // 実際はログインユーザー情報から取得
    
    setDocuments(prev => prev.map(doc => {
      if (doc.id !== documentId) return doc;
      
      // 一時保存の場合は版履歴を更新せず、最終更新日時のみ更新
      if (status === '作成中') {
        return {
          ...documentData,
          id: doc.id,
          documentDate: doc.documentDate,
          createdAt: doc.createdAt,
          createdBy: doc.createdBy,
          updatedAt: dateTimeString,
          updatedBy: currentUser,
          createdDate: doc.createdDate,
          updatedDate: dateString,
          status: status,
          revisionHistory: doc.revisionHistory // 履歴はそのまま保持
        };
      }
      
      // 登録（作成済）の場合のみ版履歴を更新
      // 変更差分を検出
      const changes: FieldChange[] = [];
      const oldContent = doc.content;
      const newContent = documentData.content;
      
      if (oldContent && newContent) {
        const fieldMap: Record<string, string> = {
          patientName: '患者氏名',
          patientAge: '年齢',
          patientGender: '性別',
          birthDate: '生年月日',
          department: '診療科',
          doctor: '担当医',
          allergy: 'アレルギー',
          diagnosis: '病名',
          treatmentSummary: '治療経過（概要）',
          purpose: '紹介目的',
          medicalHistory: '診療経過',
          treatmentPlan: '治療方針',
          notes: '注意事項'
        };
        
        Object.keys(fieldMap).forEach(field => {
          const oldValue = String(oldContent[field as keyof typeof oldContent] || '');
          const newValue = String(newContent[field as keyof typeof newContent] || '');
          if (oldValue !== newValue) {
            changes.push({
              field,
              fieldLabel: fieldMap[field],
              oldValue,
              newValue
            });
          }
        });
      }
      
      // 新しいリビジョンレコードを作成
      const currentRevisionNumber = doc.revisionHistory && doc.revisionHistory.length > 0 
        ? doc.revisionHistory[0].revisionNumber 
        : 0;
      
      const newRevision: RevisionRecord = {
        revisionNumber: currentRevisionNumber + 1,
        timestamp: dateTimeString,
        updatedBy: currentUser,
        action: '更新',
        changes: changes
      };
      
      // 履歴の先頭に追加（最新が先頭）
      const updatedHistory = [newRevision, ...(doc.revisionHistory || [])];
      
      return {
        ...documentData,
        id: doc.id,
        documentDate: doc.documentDate,
        createdAt: doc.createdAt,
        createdBy: doc.createdBy,
        updatedAt: dateTimeString,
        updatedBy: currentUser,
        createdDate: doc.createdDate,
        updatedDate: dateString,
        status: status,
        revisionHistory: updatedHistory
      };
    }));
    
    if (status === '作成中') {
      toast.success('文書を一時保存しました');
    } else {
      toast.success('文書を登録しました');
    }
  };

  const handleDeleteDocument = (documentId: string) => {
    const doc = documents.find(d => d.id === documentId);
    setDocuments(prev => prev.filter(d => d.id !== documentId));
    if (doc) {
      toast.success(`文書「${doc.type}」を削除しました`);
    }
  };

  const handleUploadDocument = (uploadData: {
    patientId?: string;
    type: string;
    department: string;
    doctor: string;
    documentDate: Date; // 文書日付（印字される日付）
    referralType?: string;
    referralHospital?: string;
    referralDepartment?: string;
    referralDoctor?: string;
    comment?: string;
  }) => {
    // 文書日付を文字列に変換
    const documentDateString = `${uploadData.documentDate.getFullYear()}/${String(uploadData.documentDate.getMonth() + 1).padStart(2, '0')}/${String(uploadData.documentDate.getDate()).padStart(2, '0')}`;
    
    // システム登録日時（現在時刻）
    const now = new Date();
    const createdDateString = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${String(now.getDate()).padStart(2, '0')}`;
    const dateTimeString = `${createdDateString} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newDocument: DocumentData = {
      id: `d-${Date.now()}`,
      type: uploadData.type,
      documentDate: documentDateString, // 文書日付（印字される日付）
      createdAt: dateTimeString,
      createdBy: uploadData.doctor || '検査部',
      updatedAt: dateTimeString,
      updatedBy: uploadData.doctor || '検査部',
      createdDate: createdDateString, // システム登録日
      updatedDate: createdDateString,
      status: '取込済',
      department: uploadData.department,
      referralType: uploadData.referralType,
      referralHospital: uploadData.referralHospital,
      referralDepartment: uploadData.referralDepartment,
      referralDoctor: uploadData.referralDoctor,
      comment: uploadData.comment,
      issuer: uploadData.referralHospital,
      revisionHistory: []
    };

    setDocuments(prev => [...prev, newDocument]);
    toast.success('文書を取り込みました');
  };

  return {
    documents,
    handleSaveDocument,
    handleUpdateDocument,
    handleDeleteDocument,
    handleUploadDocument
  };
}
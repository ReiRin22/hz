'use client';

import REC001 from '@/features/01_diagnosis/01_record-creation/01_examination-input';

interface RecordCreationClientProps {
  patientId: string;
  receptionId: string;
  recordId?: string;
  loginUserName: string;
  recorderId: string;
}

/** 診療記録作成画面 Client Component ラッパー */
export default function RecordCreationClient({
  patientId,
  receptionId,
  recordId,
  loginUserName,
  recorderId,
}: RecordCreationClientProps) {
  const handleConfirmed = (confirmedRecordId: string) => {
    // TODO: 後で実装 - 確定後の処理
    console.log('Record confirmed:', confirmedRecordId);
  };

  return (
    <div className="karte-panel__record-wrapper">
      <REC001
        patientId={patientId}
        receptionId={receptionId}
        recordId={recordId}
        loginUserName={loginUserName}
        recorderId={recorderId}
        onConfirmed={handleConfirmed}
      />
    </div>
  );
}

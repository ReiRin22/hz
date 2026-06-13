// src/app/patients/[id]/page.tsx
'use client';

import { use } from 'react';
import { usePatient, useUploadPatientImage } from '@/app/patient/_api/patient.api';
import { PatientCard } from '@/app/patient/_components/organisms/patient-card';

export default function PatientDetailPage({ params }: { params: Promise<{ patientId: string }> }) {
  const { patientId } = use(params);

  // 1. 患者データの取得
  const { data: patient, isLoading, error } = usePatient(patientId);

  // 2. アップロード用関数の取得
  const { mutate: uploadImage, isPending: isUploading } = useUploadPatientImage(patientId);

  if (isLoading) return <div>読み込み中...</div>;
  if (error || !patient) return <div>エラーが発生しました</div>;

  return (
    <div className="p-8">
      <PatientCard 
        patient={patient} 
        onImageUpload={(file) => uploadImage(file)} 
      />
      {isUploading && <p className="text-blue-500 mt-2">アップロード中...</p>}
    </div>
  );
}
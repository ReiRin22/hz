import { PatientInfoClient } from './patient-info-client';
import type { UserRole } from '@/features/03_patient/04_patient-info/01_patient-info-tabs';
import type { GetPatientInfoResponse } from '@/front_bff_shared/features/karte/patientInfo/types/responses/patient-info.response';

const BFF_BASE_URL = process.env.SERVER_SIDE_BFF_URL ?? 'http://localhost:3001';

// TODO: 認証実装後に PATIENT_ID / USER_ROLE はセッションから取得する
const PATIENT_ID = 'P001';
const USER_ROLE: UserRole = 'admin';

/** 患者基本情報スタンドアロンページ（Server Component） */
export default async function StandalonePatientInfoPage() {
  const res = await fetch(`${BFF_BASE_URL}/bff/patients/${PATIENT_ID}/patient-info`, {
    cache: 'no-store',
  });
  if (!res.ok) {
    throw new Error(`BFF fetch failed: ${res.status}`);
  }
  const data = (await res.json()) as GetPatientInfoResponse;

  return (
    <PatientInfoClient
      initialData={data.patientInfo}
      userRole={USER_ROLE}
    />
  );
}

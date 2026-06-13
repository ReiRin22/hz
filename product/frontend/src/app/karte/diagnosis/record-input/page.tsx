import REC001 from "@/features/01_diagnosis/01_record-creation/01_examination-input";

// TODO: 認証セッション実装後、ログインユーザーの patientId を動的に取得する
const PATIENT_ID = "P001";

export default function RecordInputPage() {
  return (
    <REC001
      patientId={PATIENT_ID}
      receptionId=""
    />
  );
}

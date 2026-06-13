import RecordCreationClient from './RecordCreationClient';

// TODO: 認証セッションから取得する
const LOGIN_USER_NAME = '田中 医師';
const RECORDER_ID = 'doctor-001';

/** 診療記録作成画面（Server Component） */
export default async function RecordCreationPage({
  params,
  searchParams,
}: {
  params: Promise<{ patientId: string }>;
  searchParams: Promise<{ receptionId?: string; recordId?: string }>;
}) {
  const { patientId } = await params;
  const { receptionId = '', recordId } = await searchParams;

  // TODO: 後で実装 - 患者データの取得
  // const patientData = await fetchPatientData(patientId);

  return (
    <div className="karte-layout">
      {/* TODO: 後で実装 - RecordReferencePanelsClient（記録参照パネル） */}
      <div className="karte-panel__reference-placeholder">
        {/* 記録参照パネルは後で実装 */}
      </div>

      {/* TODO: 後で実装 - SoapInputPanelClient（SOAP入力パネル） */}
      <div className="karte-panel__soap-placeholder">
        {/* SOAP入力パネルは後で実装 */}
      </div>

      {/* REC001: 診療記録入力コンポーネント（Client Component経由） */}
      <RecordCreationClient
        patientId={patientId}
        receptionId={receptionId}
        recordId={recordId}
        loginUserName={LOGIN_USER_NAME}
        recorderId={RECORDER_ID}
      />
    </div>
  );
}

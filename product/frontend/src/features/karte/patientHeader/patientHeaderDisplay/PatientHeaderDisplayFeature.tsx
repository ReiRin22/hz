'use client';

import { useRouter } from 'next/navigation';
import { Eye } from 'lucide-react';
import { Card } from '@/shared/components/atoms/card';
import { ja } from '@/shared/i18n/ja';
import { usePatientHeaderData } from './hooks/usePatientHeaderData';
import { usePatientHeaderState } from './hooks/usePatientHeaderState';
import { useAuthStore } from '@/shared/stores/use-auth.store';
import {
  PatientIdentityBlock,
  PatientBasicInfoBlock,
  PatientConsultationBlock,
  PatientSystemStatusBlock,
  PatientAlertBlock,
  PatientStatusActionsBlock,
} from './components/molecules';
import {
  PatientDetailDialog,
  PatientMemoDialog,
  PrescriptionSettingsDialog,
  MedicalInfoSharingDialog,
  ProxyInputConfirmDialog,
  PatientSearchDialog,
} from './components/organisms';

const t = ja.karte.patientHeader.patientHeaderDisplay.patientHeaderDisplayFeature;

interface Props {
  patientId: string | null;
}

export function PatientHeaderDisplayFeature({ patientId }: Props) {
  const router = useRouter();
  const { userName, role } = useAuthStore();
  const orderingPhysician = role === 'doctor' ? userName : null;

  // 患者ID がない場合は空白表示
  if (!patientId) {
    return (
      <div className="patient-header-feature patient-header-feature--empty" style={{ minHeight: '80px', backgroundColor: '#f9fafb' }}>
        {/* 空白（患者未選択状態） */}
      </div>
    );
  }

  const { data, isLoading, error } = usePatientHeaderData(patientId, orderingPhysician);
  const state = usePatientHeaderState(data);

  const displayData = data
    ? {
        ...data,
        prescriptionStatus: state.prescriptionStatus,
        medicalInfoSharing: { status: state.medicalInfoSharingStatus },
      }
    : null;

  if (isLoading) {
    return (
      <div className="patient-header-feature patient-header-feature--loading" role="status" aria-live="polite">
        {t.loadingText}
      </div>
    );
  }

  if (error || !data || !displayData) {
    return (
      <div className="patient-header-feature patient-header-feature--loading" role="alert">
        {t.errorText}
      </div>
    );
  }

  return (
    <>
      <Card className={`patient-header-feature ${state.isPrivacyMode ? 'patient-header-feature--privacy' : ''}`}>
        {/* 上部アクセントライン */}
        <div className={`patient-header-feature__accent-line ${state.isPrivacyMode ? 'patient-header-feature__accent-line--privacy' : ''}`} />

        <div className="patient-header-feature__inner">
          <div className="patient-header-feature__left">
            {/* アバター＋患者名 */}
            <PatientIdentityBlock
              data={displayData}
              isPrivacyMode={state.isPrivacyMode}
              onTogglePrivacy={state.togglePrivacyMode}
              onPatientSearchClick={() => state.setIsPatientSearchDialogOpen(true)}
            />

            {/* 患者情報グリッド */}
            {!state.isPrivacyMode ? (
              <div className="patient-header-feature__info-area">
                {/* 左：基本情報 */}
                <PatientBasicInfoBlock
                  data={displayData}
                  isPrivacyMode={state.isPrivacyMode}
                  onMemoClick={() => state.setIsMemoDialogOpen(true)}
                />

                {/* 右：3列グリッド */}
                <div className="patient-header-feature__grid">
                  {/* 列1: 病室・入外・保険 */}
                  <PatientConsultationBlock
                    data={displayData}
                    admissionType={state.admissionType}
                    onAdmissionToggle={state.setAdmissionType}
                  />
                  {/* 列2: 診療科・主治医・指示医 */}
                  <PatientSystemStatusBlock
                    data={displayData}
                    onProxyClick={() => state.setIsProxyDialogOpen(true)}
                  />
                  {/* 列3: 診察開始/終了・処方箋・情報共有 */}
                  <PatientStatusActionsBlock
                    data={displayData}
                    isConsultationStarted={state.isConsultationStarted}
                    onConsultationToggle={state.toggleConsultation}
                    onPrescriptionClick={() => state.setIsPrescriptionDialogOpen(true)}
                    onSharingClick={() => state.setIsSharingDialogOpen(true)}
                  />
                </div>
              </div>
            ) : (
              <div className="patient-header-feature__privacy-info">
                <div className="patient-header-feature__privacy-grid">
                  <PatientStatusActionsBlock
                    data={displayData}
                    isConsultationStarted={state.isConsultationStarted}
                    onConsultationToggle={state.toggleConsultation}
                    onPrescriptionClick={() => state.setIsPrescriptionDialogOpen(true)}
                    onSharingClick={() => state.setIsSharingDialogOpen(true)}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 右：アラート＋詳細ボタン */}
          <div className="patient-header-feature__right">
            {!state.isPrivacyMode && (
              <PatientAlertBlock
                allergies={displayData.allergies}
                infections={displayData.infections}
              />
            )}
            <button
              type="button"
              className="patient-header-feature__detail-btn"
              onClick={() => router.push('/patient-info')}
            >
              <Eye className="w-3.5 h-3.5" />
              {t.detailBtn}
            </button>
          </div>
        </div>
      </Card>

      <PatientDetailDialog
        patientId={patientId}
        open={state.isDetailDialogOpen}
        onOpenChange={state.setIsDetailDialogOpen}
      />
      <PatientMemoDialog
        open={state.isMemoDialogOpen}
        onOpenChange={state.setIsMemoDialogOpen}
      />
      <PrescriptionSettingsDialog
        open={state.isPrescriptionDialogOpen}
        onOpenChange={state.setIsPrescriptionDialogOpen}
        patientId={patientId}
        patientName={data.name}
        currentStatus={state.prescriptionStatus}
        onStatusChange={state.setPrescriptionStatus}
      />
      <MedicalInfoSharingDialog
        open={state.isSharingDialogOpen}
        onOpenChange={state.setIsSharingDialogOpen}
        patientId={patientId}
        patientName={data.name}
        currentData={{ status: state.medicalInfoSharingStatus }}
        onDataChange={(newData) => state.setMedicalInfoSharingStatus(newData.status)}
      />
      <ProxyInputConfirmDialog
        open={state.isProxyDialogOpen}
        onOpenChange={state.setIsProxyDialogOpen}
      />
      <PatientSearchDialog
        open={state.isPatientSearchDialogOpen}
        onOpenChange={state.setIsPatientSearchDialogOpen}
      />
    </>
  );
}

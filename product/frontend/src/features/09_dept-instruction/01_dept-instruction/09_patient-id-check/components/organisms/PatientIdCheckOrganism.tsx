'use client';

import { ja } from '@/shared/i18n/ja';
import { useState, useCallback } from 'react';
import { format } from 'date-fns';
import { parseISO } from 'date-fns';
import { useAuthStore } from '@shared/stores/use-auth.store';
import { usePatientIdCheckStore } from '../../stores/usePatientIdCheckStore';
import { usePatientIdCheckInit } from '../../hooks/usePatientIdCheckInit';
import { useBarcodeScannerListener } from '../../hooks/useBarcodeScannerListener';
import { useBarcodeMatcher } from '../../hooks/useBarcodeMatcher';
import { usePatientConfirmReason } from '../../hooks/usePatientConfirmReason';
import { usePractitionerManualEntry } from '../../hooks/usePractitionerManualEntry';
import { usePatientIdCheckSubmit } from '../../hooks/usePatientIdCheckSubmit';
import { BarcodeScanGuideBanner } from '../../components/molecules/BarcodeScanGuideBanner';
import { PatientIdCheckSection } from '../../components/molecules/PatientIdCheckSection';
import { BarcodeReadInfoCard } from '../../components/molecules/BarcodeReadInfoCard';
import { ConfirmerRadioGroup } from '../../components/molecules/ConfirmerRadioGroup';
import { ConfirmReasonForm } from '../../components/molecules/ConfirmReasonForm';
import { PractitionerIdInput } from '../../components/molecules/PractitionerIdInput';
import { UnconfirmedAlertBar } from '../../components/molecules/UnconfirmedAlertBar';
import type { PatientIdCheckResult } from '../../types/patientIdCheck.viewmodel';

const t = ja.deptInstruction.patientIdCheck.organism;

interface PatientIdCheckOrganismProps {
  orderId: string;
  onComplete: (result: PatientIdCheckResult) => void;
  onCancel: () => void;
}

export function PatientIdCheckOrganism({
  orderId,
  onComplete,
  onCancel,
}: PatientIdCheckOrganismProps) {
  const userName = useAuthStore((s) => s.userName);
  const store = usePatientIdCheckStore();
  const { reasonTemplates, isLoading, error, retry } = usePatientIdCheckInit(orderId);
  const { match } = useBarcodeMatcher();
  const { save: saveReason, isSaving: isSavingReason, saveError: reasonSaveError } = usePatientConfirmReason(orderId);
  const { manualPractitionerId, idValidationError, setManualPractitionerId, register } = usePractitionerManualEntry();
  const { isSubmitting, submitError, submit } = usePatientIdCheckSubmit(orderId, onComplete);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [patientNameChecked, setPatientNameChecked] = useState(false);
  const [patientBirthChecked, setPatientBirthChecked] = useState(false);
  const bothPatientChecked = patientNameChecked && patientBirthChecked;

  const handlePatientNameCheck = useCallback((checked: boolean) => {
    setPatientNameChecked(checked);
    store.setPatientVisualConfirmed(checked && patientBirthChecked);
  }, [patientBirthChecked, store]);

  const handlePatientBirthCheck = useCallback((checked: boolean) => {
    setPatientBirthChecked(checked);
    store.setPatientVisualConfirmed(patientNameChecked && checked);
  }, [patientNameChecked, store]);

  const handleScan = useCallback((value: string) => { match(value); }, [match]);
  useBarcodeScannerListener({ onScan: handleScan });

  const handleSubmit = useCallback(async () => {
    await submit(userName ?? '');
  }, [submit, userName]);

  const handleSaveReason = useCallback(async () => {
    await saveReason(userName ?? '');
  }, [saveReason, userName]);

  if (isLoading) {
    return <div className="flex items-center justify-center p-8 text-sm text-gray-500">{t.loading}</div>;
  }

  if (error) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-sm text-red-600">{error}</p>
        <button type="button" onClick={retry} className="text-sm text-blue-600 underline">
          {t.retry}
        </button>
      </div>
    );
  }

  const { expectations } = store;
  if (!expectations) return null;

  const patientSectionStatus = store.isPatientChecked ? 'ok' : store.patientScanned?.matchResult === 'NG' ? 'ng' : 'pending';
  const itemSectionStatus = store.isItemChecked ? 'ok' : store.itemScanned?.matchResult === 'NG' ? 'ng' : 'pending';
  const practitionerSectionStatus = store.isPractitionerChecked ? 'ok' : 'pending';

  const showPatientFallback = patientSectionStatus === 'ng' || (patientSectionStatus === 'pending' && !store.patientScanned);
  const showItemFallback = itemSectionStatus === 'ng' || (itemSectionStatus === 'pending' && !store.itemScanned);
  const showPractitionerFallback = !store.practitionerScanned;
  const showReasonForm = store.patientConfirmer !== 'PERSON' && (patientSectionStatus === 'ng' || showPatientFallback);

  return (
    <div className="flex flex-col gap-4 p-4">
      <BarcodeScanGuideBanner />

      {/* 患者セクション */}
      <PatientIdCheckSection title={t.patientSection} status={patientSectionStatus} sectionType="patient">
        <div className="text-sm space-y-2 text-gray-700">
          <div className="flex items-center justify-between gap-4">
            <span className="text-base">{expectations.patient.name}（{expectations.patient.kana}）</span>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={patientNameChecked}
                onChange={(e) => handlePatientNameCheck(e.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
              <span>{t.confirmCheck}</span>
            </label>
          </div>
          <div className="flex items-center justify-between gap-4">
            <span className="text-muted-foreground">
              {t.patientId}: {expectations.patient.id} / 生年月日:{' '}
              {format(parseISO(expectations.patient.birthDate), 'yyyy年MM月dd日')}
            </span>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 select-none">
              <input
                type="checkbox"
                checked={patientBirthChecked}
                onChange={(e) => handlePatientBirthCheck(e.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
              <span>{t.confirmCheck}</span>
            </label>
          </div>
        </div>
        <BarcodeReadInfoCard
          status={store.patientScanned ? (store.patientScanned.matchResult === 'OK' ? 'ok' : 'ng') : 'waiting'}
          scannedValue={store.patientScanned?.value}
          expectedValue={expectations.patient.barcode}
        />
        {(showPatientFallback || bothPatientChecked) && (
          <div className="space-y-3">
            <p className="text-xs text-gray-500">{t.visualCheckHint}</p>
            <div className={bothPatientChecked ? '' : 'pointer-events-none opacity-40'}>
              <ConfirmerRadioGroup value={store.patientConfirmer} onChange={store.setPatientConfirmer} />
            </div>
          </div>
        )}
        {showReasonForm && (
          <ConfirmReasonForm
            templates={reasonTemplates}
            presetCode={store.presetReasonCode}
            customText={store.customReason}
            isSaving={isSavingReason}
            saveError={reasonSaveError}
            onPresetChange={store.setPresetReason}
            onCustomTextChange={store.setCustomReason}
            onSave={handleSaveReason}
          />
        )}
      </PatientIdCheckSection>

      {/* 物品セクション */}
      <PatientIdCheckSection title={t.itemSection} status={itemSectionStatus} sectionType="item">
        <div className="text-sm space-y-1 text-gray-700">
          <div className="flex items-center justify-between gap-4">
            <span>{expectations.item.name}</span>
            <label className="flex shrink-0 cursor-pointer items-center gap-2 select-none whitespace-nowrap">
              <input
                type="checkbox"
                checked={store.itemVisualChecked}
                onChange={(e) => store.setItemVisualChecked(e.target.checked)}
                className="h-5 w-5 accent-blue-600"
              />
              <span>{t.visualCheck}</span>
            </label>
          </div>
          {expectations.item.lotNumber && <div className="text-muted-foreground">{t.lotNumber}: {expectations.item.lotNumber}</div>}
        </div>
        <BarcodeReadInfoCard
          status={store.itemScanned ? (store.itemScanned.matchResult === 'OK' ? 'ok' : 'ng') : 'waiting'}
          scannedValue={store.itemScanned?.value}
          expectedValue={expectations.item.barcode}
        />
      </PatientIdCheckSection>

      {/* 実施者セクション */}
      <PatientIdCheckSection title={t.practitionerSection} status={practitionerSectionStatus} sectionType="practitioner">
        {store.practitionerScanned ? (
          <div className="text-sm text-gray-700">
            {t.practitionerScanned(store.practitionerScanned.staffName ?? t.practitionerNameFail)}
          </div>
        ) : (
          <div className="text-sm text-gray-500">{t.practitionerScanHint}</div>
        )}
        {showPractitionerFallback && (
          <PractitionerIdInput
            value={manualPractitionerId}
            validationError={idValidationError}
            onChange={setManualPractitionerId}
            onRegister={register}
          />
        )}
        <BarcodeReadInfoCard
          status={store.practitionerScanned ? 'ok' : 'waiting'}
          scannedValue={store.practitionerScanned?.staffName ?? undefined}
        />
      </PatientIdCheckSection>

      {/* 未確認アラート */}
      {!store.isAllChecked && (
        <UnconfirmedAlertBar message={t.unconfirmedAlert} />
      )}

      {/* API エラー */}
      {submitError && (
        <p role="alert" className="text-sm text-red-600">
          {submitError}
        </p>
      )}

      {/* ボタン群 */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setShowCancelDialog(true)}
          className="flex-1 rounded-md border border-gray-300 py-3 text-base font-medium text-gray-700 hover:bg-gray-50"
        >
          {t.cancelButton}
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !store.isAllChecked}
          className="flex-1 rounded-md bg-blue-600 py-3 text-base font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {isSubmitting ? t.submitting : t.submitButton}
        </button>
      </div>

      {/* キャンセル確認ダイアログ */}
      {showCancelDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="rounded-lg bg-white p-6 shadow-xl w-80 space-y-4">
            <p className="text-sm text-gray-800 whitespace-pre-line">
              {t.cancelDialog.message}
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowCancelDialog(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                {t.cancelDialog.back}
              </button>
              <button
                type="button"
                onClick={onCancel}
                className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
              >
                {t.cancelDialog.cancel}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

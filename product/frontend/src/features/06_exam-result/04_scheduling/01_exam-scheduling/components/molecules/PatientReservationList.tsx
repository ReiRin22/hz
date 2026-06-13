'use client';

import { useState } from 'react';
import { User, Trash2, Calendar } from 'lucide-react';
import { ja } from '@/shared/i18n/ja';
import type { UnifiedReservation, CurrentPatient } from '../../types/examination.types';

const t = ja.examination.examinationScheduling.patientReservationList;

interface PatientReservationListProps {
  currentPatient?: CurrentPatient;
  examinationReservations: UnifiedReservation[];
  appointmentReservations: UnifiedReservation[];
  onDeleteExamination?: (reservationId: string) => void;
  onDeleteAppointment?: (reservationId: string) => void;
  showType?: 'all' | 'examination' | 'appointment';
}

export function PatientReservationList({
  currentPatient,
  examinationReservations,
  appointmentReservations,
  onDeleteExamination,
  onDeleteAppointment,
  showType = 'all',
}: PatientReservationListProps) {
  const [deletingReservationId, setDeletingReservationId] = useState<string | null>(null);
  const [deletingReservationType, setDeletingReservationType] = useState<'examination' | 'appointment' | null>(null);

  const getDisplayReservations = () => {
    let reservations: UnifiedReservation[] = [];

    if (showType === 'all') {
      reservations = [
        ...examinationReservations.map((r) => ({ ...r, type: 'examination' as const })),
        ...appointmentReservations.map((r) => ({ ...r, type: 'appointment' as const })),
      ];
    } else if (showType === 'examination') {
      reservations = examinationReservations.map((r) => ({ ...r, type: 'examination' as const }));
    } else if (showType === 'appointment') {
      reservations = appointmentReservations.map((r) => ({ ...r, type: 'appointment' as const }));
    }

    return reservations.sort((a, b) => {
      if (a.date === '未定' && b.date !== '未定') return 1;
      if (a.date !== '未定' && b.date === '未定') return -1;
      if (a.date === '未定' && b.date === '未定') return 0;

      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;

      if (a.startTime === '未定' && b.startTime !== '未定') return 1;
      if (a.startTime !== '未定' && b.startTime === '未定') return -1;

      return a.startTime.localeCompare(b.startTime);
    });
  };

  const allReservations = getDisplayReservations();

  const handleDeleteClick = (id: string, type: 'examination' | 'appointment') => {
    setDeletingReservationId(id);
    setDeletingReservationType(type);
  };

  const handleConfirmDelete = () => {
    if (!deletingReservationId || !deletingReservationType) return;

    if (deletingReservationType === 'examination' && onDeleteExamination) {
      onDeleteExamination(deletingReservationId);
    } else if (deletingReservationType === 'appointment' && onDeleteAppointment) {
      onDeleteAppointment(deletingReservationId);
    }

    setDeletingReservationId(null);
    setDeletingReservationType(null);
  };

  const handleCancelDelete = () => {
    setDeletingReservationId(null);
    setDeletingReservationType(null);
  };

  const getReservationDescription = (reservation: UnifiedReservation) => {
    if (reservation.type === 'examination') {
      return reservation.examType || t.typeExamination;
    } else {
      return reservation.title || t.appointmentTitle;
    }
  };

  const getReservationDetail = (reservation: UnifiedReservation) => {
    if (reservation.type === 'examination') {
      return reservation.equipment ? `(${reservation.equipment})` : '';
    } else {
      return reservation.targetResource ? t.targetResource(reservation.targetResource) : '';
    }
  };

  const listTitle =
    showType === 'examination'
      ? t.titleExamination
      : showType === 'appointment'
        ? t.titleAppointment
        : t.titleAll;

  const countLabel =
    showType === 'all'
      ? t.countAll(allReservations.length, examinationReservations.length, appointmentReservations.length)
      : t.countSingle(allReservations.length);

  return (
    <div className="w-125 border-l border-border bg-background flex flex-col">
      {/* ヘッダー */}
      <div className="border-b border-border p-4">
        <div className="flex items-center gap-2">
          <User className="w-5 h-5 text-blue-600" />
          <h2 className="font-medium">{listTitle}</h2>
        </div>
        {currentPatient && (
          <div className="mt-2 text-sm text-muted-foreground">
            {t.patientInfo(currentPatient.name, currentPatient.patientNumber)}
          </div>
        )}
        <div className="mt-2 text-xs text-muted-foreground">{countLabel}</div>
      </div>

      {/* 予約履歴テーブル */}
      <div className="flex-1 overflow-auto">
        <div className="border-b border-border bg-muted/50 sticky top-0">
          <div className="grid grid-cols-[80px_100px_1fr_80px] gap-2 px-4 py-2 text-xs font-medium text-muted-foreground">
            <div>{t.colDate}</div>
            <div>{t.colTime}</div>
            <div>{t.colContent}</div>
            <div className="text-center">{t.colAction}</div>
          </div>
        </div>

        <div>
          {allReservations.length === 0 ? (
            <div className="p-8 text-center text-sm text-muted-foreground">{t.emptyMessage}</div>
          ) : (
            allReservations.map((reservation) => {
              const isUndecided = reservation.date === '未定' || reservation.startTime === '未定';

              return (
                <div
                  key={`${reservation.type}-${reservation.id}`}
                  className={`grid grid-cols-[80px_100px_1fr_80px] gap-2 px-4 py-3 text-sm border-b border-border hover:bg-accent/50 transition-colors ${isUndecided ? 'bg-red-50' : 'bg-blue-50'}`}
                >
                  <div className="font-medium">
                    {reservation.date === '未定' ? (
                      <span className="text-red-600">{t.undecidedDate}</span>
                    ) : (
                      reservation.date
                    )}
                  </div>

                  <div>
                    {reservation.startTime === '未定' ? (
                      <span className="text-red-600">{t.undecidedTime}</span>
                    ) : (
                      reservation.startTime
                    )}
                  </div>

                  <div>
                    <div className="font-medium">
                      {getReservationDescription(reservation)}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getReservationDetail(reservation)}
                    </div>
                    {reservation.notes && (
                      <div className="text-xs text-muted-foreground mt-1">{reservation.notes}</div>
                    )}
                  </div>

                  <div className="flex gap-1 justify-center">
                    <button
                      type="button"
                      onClick={() => handleDeleteClick(reservation.id, reservation.type)}
                      className="p-1 hover:bg-red-100 rounded transition-colors"
                      title={t.deleteTitle}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* 削除確認ダイアログ */}
      {deletingReservationId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-[400px]"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-reservation-dialog-title"
          >
            <div className="flex items-center gap-2 mb-4">
              <Calendar className="w-5 h-5 text-blue-600" />
              <h3 id="delete-reservation-dialog-title" className="font-medium">
                {deletingReservationType === 'appointment'
                  ? t.dateUndecidedDialogTitle
                  : t.slotUndecidedDialogTitle}
              </h3>
            </div>

            <p className="text-sm mb-4">
              {deletingReservationType === 'appointment'
                ? t.dateUndecidedDialogMessage
                : t.slotUndecidedDialogMessage}
            </p>

            <div className="flex gap-3 justify-end">
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"
              >
                {t.dialogCancelBtn}
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors"
              >
                {t.dialogConfirmBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

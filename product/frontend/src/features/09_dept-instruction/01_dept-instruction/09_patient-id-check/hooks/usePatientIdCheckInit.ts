'use client';

import { useEffect, useCallback, useState } from 'react';
import { ja } from '@/shared/i18n/ja';
import { fetchPatientIdCheckInit } from '../repository/usePatientIdCheck';
import { usePatientIdCheckStore } from '../stores/usePatientIdCheckStore';
import type { Expectations, ReasonTemplate } from '../types/patientIdCheck.viewmodel';
import type { GetPatientIdCheckExpectationsResponse } from '@/front_bff_shared/features/dept-instruction/patient-id-check/types/responses/patientIdCheck.response';

function mapExpectations(res: GetPatientIdCheckExpectationsResponse): Expectations {
  return {
    patient: {
      id: res.patient.id,
      name: res.patient.name,
      kana: res.patient.kana,
      birthDate: res.patient.birthDate,
      barcode: res.patient.barcode,
    },
    item: {
      name: res.item.name,
      lotNumber: res.item.lotNumber,
      barcode: res.item.barcode,
    },
    order: {
      id: res.order.id,
      orderType: res.order.orderType,
    },
  };
}

interface InitState {
  isLoading: boolean;
  error: string | null;
  reasonTemplates: ReasonTemplate[];
}

interface UsePatientIdCheckInitReturn extends InitState {
  retry: () => void;
}

export function usePatientIdCheckInit(orderId: string): UsePatientIdCheckInitReturn {
  const setOrderId = usePatientIdCheckStore((s) => s.setOrderId);
  const setExpectations = usePatientIdCheckStore((s) => s.setExpectations);
  const [initState, setInitState] = useState<InitState>(() => {
    // storeに既にデータが入っている場合（Storybookのdecorator等で事前セット済み）はローディング不要
    const preloaded = usePatientIdCheckStore.getState().expectations;
    return preloaded
      ? { isLoading: false, error: null, reasonTemplates: [] }
      : { isLoading: true, error: null, reasonTemplates: [] };
  });

  const load = useCallback(async () => {
    // storeに既にデータが入っている場合はAPIコールをスキップ
    if (usePatientIdCheckStore.getState().expectations) return;
    setInitState({ isLoading: true, error: null, reasonTemplates: [] });
    try {
      const { expectations, reasonTemplates } = await fetchPatientIdCheckInit(orderId);
      setOrderId(orderId);
      setExpectations(mapExpectations(expectations));
      setInitState({
        isLoading: false,
        error: null,
        reasonTemplates: reasonTemplates.templates.map((tmpl) => ({
          code: tmpl.code,
          label: tmpl.label,
        })),
      });
    } catch {
      setInitState({ isLoading: false, error: ja.deptInstruction.patientIdCheck.organism.fetchError, reasonTemplates: [] });
    }
  }, [orderId, setOrderId, setExpectations]);

  useEffect(() => {
    load();
    return () => {
      usePatientIdCheckStore.getState().reset();
    };
  }, [load]);

  return { ...initState, retry: load };
}

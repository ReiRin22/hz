'use client';

import { useEffect, useCallback, useState, useMemo } from 'react';
import { i18n } from '@/shared/i18n';
import { fetchDeptInstructions } from '../repository/useDeptInstructions';
import { useDeptInstructionStore } from '../stores/useDeptInstructionStore';
import type { DeptInstructionConfig } from '../types/deptInstructionConfig.type';
import type { Order, OrderStatus, OrderType, Gender, PatientLocation, Department, StatusHistory, Allergy, VisualIndicator, PhysiologicalTestType, SpecimenTubeType } from '../types/deptInstruction.viewmodel';
import type { DeptInstructionOrderResponse } from '@/front_bff_shared/features/dept-instruction/lab-instruction/types/responses/deptInstruction.response';

// BFF は英語キーで返すため、マッピング不要。型キャストのみ
function toStatus(raw: string): OrderStatus {
  return raw as OrderStatus;
}

function toOrderType(raw: string): OrderType {
  return raw as OrderType;
}

function toGender(raw: string): Gender {
  return raw as Gender;
}

// 検体検査オーダー種ごとのデフォルト試験管
const SPECIMEN_TUBE_MAP: Record<string, { tubeType: SpecimenTubeType; tubeColor: string }> = {
  SPECIMEN_TEST: { tubeType: 'PURPLE_CAP', tubeColor: '#7C3AED' },
  PATHOLOGY:     { tubeType: 'FORMALIN_CONTAINER', tubeColor: '#92400E' },
  BACTERIA:      { tubeType: 'CULTURE_BOTTLE', tubeColor: '#065F46' },
};

// 生理検査タイプのマッピング（BFF コードが略称の場合）
const PHYSIO_TYPE_MAP: Record<string, PhysiologicalTestType> = {
  ecg:       'ECG',
  pulmonary: 'PULMONARY',
  eeg:       'EEG',
  ultrasound:'ULTRASOUND',
  echo:      'ECHOCARDIOGRAM',
  hearing:   'AUDIOMETRY',
  fundus:    'FUNDUS',
};

function toVisualIndicator(res: DeptInstructionOrderResponse): VisualIndicator | undefined {
  const orderType = toOrderType(res.orderType);
  if (orderType === 'PHYSIOLOGICAL_TEST' && res.physiologicalTestType) {
    const physioType = (PHYSIO_TYPE_MAP[res.physiologicalTestType] ?? res.physiologicalTestType) as PhysiologicalTestType;
    return { physiologicalTestType: physioType };
  }
  const tube = SPECIMEN_TUBE_MAP[orderType];
  if (tube) return tube;
  return undefined;
}

function formatTimestamp(iso: string): string {
  try {
    return new Date(iso).toLocaleString('ja-JP', {
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

function mapToOrder(res: DeptInstructionOrderResponse): Order {
  return {
    id: res.id,
    status: toStatus(res.status),
    patientId: res.patientId,
    patientName: res.patientName,
    patientKana: res.patientKana,
    gender: toGender(res.gender),
    birthDate: res.birthDate,
    age: res.age,
    orderType: toOrderType(res.orderType),
    content: res.content,
    allergies: [] as Allergy[],
    hasAllergies: res.hasAllergies,
    location: res.location as PatientLocation,
    department: res.department as Department,
    attendingDoctor: res.attendingDoctor,
    ward: res.ward,
    roomNumber: res.roomNumber,
    procedureType: res.procedureType,
    statusHistory: res.statusHistory?.map((h) => ({
      status: toStatus(h.status),
      timestamp: formatTimestamp(h.timestamp),
      updatedBy: h.updatedBy,
    })) as StatusHistory[] | undefined,
    visualIndicator: toVisualIndicator(res),
    examinationType: undefined,
    labTestLocation: res.labTestLocation,
    imageTestType: res.imageTestType,
    physiologicalTestType: res.physiologicalTestType,
    receivedAt: formatTimestamp(res.receivedAt),
    acceptedAt: res.acceptedAt ? formatTimestamp(res.acceptedAt) : undefined,
    implementedAt: res.implementedAt ? formatTimestamp(res.implementedAt) : undefined,
    acceptedBy: res.acceptedBy,
    implementedBy: res.implementedBy,
    implementationNotes: res.implementationNotes,
    scheduledTime: res.scheduledTime ? formatTimestamp(res.scheduledTime) : undefined,
    materialRecorded: res.materialRecorded,
  };
}

export function useDeptInstructionInit(config: DeptInstructionConfig, date?: string) {
  const { setOrders, setIsLoading } = useDeptInstructionStore();
  const [initError, setInitError] = useState<string | null>(null);

  const orderTypesKey = useMemo(
    () => config.targetOrderTypes.join(','),
    [config.targetOrderTypes],
  );

  const initialize = useCallback(async () => {
    setIsLoading(true);
    setInitError(null);
    try {
      const response = await fetchDeptInstructions({
        dept: config.deptCode,
        orderTypes: orderTypesKey,
        date,
      });
      const orders = response.orders.map(mapToOrder);
      setOrders(orders);
    } catch {
      setInitError(i18n.deptInstruction.screen.errors.fetchFailed);
    } finally {
      setIsLoading(false);
    }
  }, [config.deptCode, orderTypesKey, date, setOrders, setIsLoading]);

  useEffect(() => {
    initialize();
  }, [initialize]);

  return { refresh: initialize, initError, clearInitError: () => setInitError(null) };
}

'use client';

import { OrderConfirmPanel } from './OrderConfirmPanel';

interface ORD076Props {
  patientId: string;
  patientName: string;
  confirmedBy: string;
  isSubstituteUser: boolean;
  patientAllergies?: string[];
  onSpecimenOrderOpen?: () => void;
  onImagingOrderOpen?: () => void;
}

export default function ORD076({
  patientId,
  patientName,
  confirmedBy,
  isSubstituteUser,
  patientAllergies,
  onSpecimenOrderOpen,
  onImagingOrderOpen,
}: ORD076Props) {
  return (
    <OrderConfirmPanel
      patientId={patientId}
      patientName={patientName}
      confirmedBy={confirmedBy}
      isSubstituteUser={isSubstituteUser}
      patientAllergies={patientAllergies}
      onSpecimenOrderOpen={onSpecimenOrderOpen}
      onImagingOrderOpen={onImagingOrderOpen}
    />
  );
}

'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useAuthStore } from '@shared/stores/use-auth.store';
import { useDeptInstructionSubmit } from '../02_lab-instruction/hooks/useDeptInstructionSubmit' // [SCOPE-OUT: cross-LV3] 将来 src/shared/ 移管時に解消予定;
import { PatientIdCheckOrganism } from './components/organisms/PatientIdCheckOrganism';
import type { PatientIdCheckResult } from './types/patientIdCheck.viewmodel';

export default function DEP009Page() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderId = searchParams.get('orderId') ?? '';
  const currentUser = useAuthStore((s) => s.userName) ?? '';
  const submit = useDeptInstructionSubmit(currentUser);

  const handleComplete = async (_result: PatientIdCheckResult) => {
    await submit.handleStatusUpdate(orderId, 'started');
    router.back();
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <PatientIdCheckOrganism
        orderId={orderId}
        onComplete={handleComplete}
        onCancel={handleCancel}
      />
    </div>
  );
}

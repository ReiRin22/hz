import { ExaminationSchedulingFeature } from '@/features/06_exam-result/04_scheduling/01_exam-scheduling';
import type { CurrentPatient } from '@/features/06_exam-result/04_scheduling/01_exam-scheduling';

interface ExaminationPageProps {
  searchParams: Promise<{
    patientId?: string;
    patientName?: string;
    patientNumber?: string;
    age?: string;
    gender?: string;
    visitDate?: string;
    orderId?: string;
  }>;
}

export default async function ExaminationPage({ searchParams }: ExaminationPageProps) {
  const params = await searchParams;

  const currentPatient: CurrentPatient | undefined =
    params.patientId && params.patientName
      ? {
          id: params.patientId,
          name: params.patientName,
          patientNumber: params.patientNumber ?? '',
          age: params.age ? parseInt(params.age) : 0,
          // TODO: 'male' / 'female' 以外の値が来た場合の処理を検討する
          gender: params.gender === 'female' ? 'female' : 'male',
          visitDate: params.visitDate ?? '',
        }
      : undefined;

  return <ExaminationSchedulingFeature currentPatient={currentPatient} orderId={params.orderId} />;
}

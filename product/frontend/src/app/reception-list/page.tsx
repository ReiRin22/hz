import { ReceptionPatientListFeature } from '@/features/01_diagnosis/06_patient-list';

export default function ReceptionListPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <main className="px-6 py-6">
        <ReceptionPatientListFeature />
      </main>
    </div>
  );
}

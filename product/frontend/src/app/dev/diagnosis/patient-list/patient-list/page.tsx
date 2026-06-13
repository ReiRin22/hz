import { ReceptionPatientListFeature } from '@/features/01_diagnosis/06_patient-list';
import { ja } from '@/shared/i18n/ja';

const t = ja.reception.receptionPatientList.receptionPatientListFeature;

export default function Page() {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-gray-900 text-lg">{t.title}</h1>
      </header>
      <main className="px-6 py-6">
        <ReceptionPatientListFeature />
      </main>
    </div>
  );
}

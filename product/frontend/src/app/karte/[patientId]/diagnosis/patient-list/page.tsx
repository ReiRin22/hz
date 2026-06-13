import { ReceptionPatientListFeature } from '@/features/01_diagnosis/06_patient-list/01_patient-list';

export default function PatientListPage() {
  return (
    <div className="reception-page">
      <main className="reception-page__main">
        <ReceptionPatientListFeature />
      </main>
    </div>
  );
}

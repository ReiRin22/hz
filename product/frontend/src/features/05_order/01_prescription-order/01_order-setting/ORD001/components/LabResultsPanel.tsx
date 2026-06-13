// import Rec from '../imports/【Rec008】検査結果参照';

interface CurrentPatient {
  id: string;
  name: string;
  age: number;
  gender: 'male' | 'female';
  patientNumber: string;
  visitDate: string;
}

interface LabResultsPanelProps {
  currentPatient?: CurrentPatient;
}

export function LabResultsPanel({ currentPatient }: LabResultsPanelProps) {
  return (
    <div className="flex-1 h-screen overflow-hidden">
      <Rec />
    </div>
  );
}

export default LabResultsPanel;
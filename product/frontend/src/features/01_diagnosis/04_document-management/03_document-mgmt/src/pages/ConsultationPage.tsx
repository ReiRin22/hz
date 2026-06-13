import { useOutletContext, useNavigate } from 'react-router-dom';
import { DepartmentConsultationPanel } from '../../components/DepartmentConsultationPanel';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  currentPatient: CurrentPatient;
}

export function ConsultationPage() {
  const { currentPatient } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  return (
    <DepartmentConsultationPanel 
      onBack={() => navigate('/order')}
      patientName={currentPatient.name}
    />
  );
}

import { useOutletContext, useNavigate } from 'react-router-dom';
import { ExaminationScheduling } from '../../components/ExaminationScheduling';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  currentPatient: CurrentPatient;
}

export function ExaminationPage() {
  const { currentPatient } = useOutletContext<OutletContext>();
  const navigate = useNavigate();

  return (
    <ExaminationScheduling 
      onBack={() => navigate('/order')} 
      currentPatient={currentPatient}
    />
  );
}

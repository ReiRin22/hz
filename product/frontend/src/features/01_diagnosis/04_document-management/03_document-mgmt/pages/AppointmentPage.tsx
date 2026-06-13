import { useOutletContext } from 'react-router-dom';
import { AppointmentManagement } from '../../components/appointment/AppointmentManagement';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  currentPatient: CurrentPatient;
}

export function AppointmentPage() {
  const { currentPatient } = useOutletContext<OutletContext>();

  return <AppointmentManagement currentPatient={currentPatient} />;
}

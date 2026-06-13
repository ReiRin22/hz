import { useOutletContext } from 'react-router-dom';
import { ExternalInfoPanel } from '../../components/ExternalInfoPanel';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  currentPatient: CurrentPatient;
}

export function ExternalInfoPage() {
  const { currentPatient } = useOutletContext<OutletContext>();

  return <ExternalInfoPanel currentPatient={currentPatient} />;
}

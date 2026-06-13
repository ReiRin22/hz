import { useOutletContext } from 'react-router-dom';
import { ChartPanel } from '../../components/panels/ChartPanel';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  currentPatient: CurrentPatient;
}

export function ChartPage() {
  const { currentPatient } = useOutletContext<OutletContext>();

  return <ChartPanel currentPatient={currentPatient} />;
}

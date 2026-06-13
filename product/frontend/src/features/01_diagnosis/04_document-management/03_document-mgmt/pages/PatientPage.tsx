import { useState } from 'react';
import { useOutletContext } from 'react-router-dom';
import { PatientInfoPanel, PatientInfoCategory } from '../../components/patient/PatientInfoPanel';
import { PatientDetailPanel } from '../../components/PatientDetailPanel';
import type { CurrentPatient } from '../data/sampleData';

interface OutletContext {
  currentPatient: CurrentPatient;
}

export function PatientPage() {
  const { currentPatient } = useOutletContext<OutletContext>();
  const [activeCategory, setActiveCategory] = useState<PatientInfoCategory>('basic');

  return (
    <>
      <PatientInfoPanel 
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        patientGender="male"
      />
      
      <PatientDetailPanel 
        activeCategory={activeCategory}
      />
    </>
  );
}

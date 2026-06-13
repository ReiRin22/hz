import { Patient } from '../../lib/types';
import { PatientAvatar } from '../molecules/PatientAvatar';
import { PatientBasicInfo } from '../molecules/PatientBasicInfo';
import { PatientMedicalInfo } from '../molecules/PatientMedicalInfo';
import { PatientInsuranceInfo } from '../molecules/PatientInsuranceInfo';
import { PatientAlerts } from '../molecules/PatientAlerts';
import { PatientHeaderActions } from '../molecules/PatientHeaderActions';

interface PatientHeaderProps {
  patient: Patient;
}

export function PatientHeader({ patient }: PatientHeaderProps) {
  return (
    <div className="bg-sky-50 border-b px-4 py-2">
      <div className="flex items-center justify-between">
        {/* Left Section - Patient Information */}
        <div className="flex items-center gap-6">
          <PatientAvatar name={patient.name} />
          
          <PatientBasicInfo
            id={patient.id}
            name={patient.name}
            nameKana={patient.nameKana}
            gender={patient.gender}
            birthDate={patient.birthDate}
          />

          <div className="w-px h-12 bg-gray-300"></div>

          <PatientMedicalInfo
            primaryDiagnosis={patient.primaryDiagnosis}
            department={patient.department}
            reception={patient.reception}
            prescription={patient.prescription}
          />

          <div className="w-px h-12 bg-gray-300"></div>

          <PatientInsuranceInfo
            insuranceType={patient.insuranceType}
            consultationType={patient.consultationType}
          />
        </div>

        {/* Right Section - Alerts and Actions */}
        <div className="flex items-center gap-3">
          <PatientAlerts
            allergies={patient.allergies}
            medicalHistory={patient.medicalHistory}
          />

          <div className="w-px h-8 bg-gray-300"></div>

          <PatientHeaderActions />
        </div>
      </div>
    </div>
  );
}

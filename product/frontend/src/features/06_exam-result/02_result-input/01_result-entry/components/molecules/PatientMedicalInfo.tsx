interface PatientMedicalInfoProps {
  primaryDiagnosis: string;
  department: string;
  reception: string;
  prescription: string;
}

export function PatientMedicalInfo({ 
  primaryDiagnosis, 
  department, 
  reception, 
  prescription 
}: PatientMedicalInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">主病名</span>
          <span className="text-xs">{primaryDiagnosis}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">診療科</span>
          <span className="text-xs">{department}</span>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">受付</span>
          <span className="text-xs">{reception}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-xs text-gray-500">処方</span>
          <span className="text-xs">{prescription}</span>
        </div>
      </div>
    </div>
  );
}

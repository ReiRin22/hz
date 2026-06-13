interface PatientBasicInfoProps {
  id: string;
  name: string;
  nameKana: string;
  gender: string;
  birthDate: string;
}

export function PatientBasicInfo({ id, name, nameKana, gender, birthDate }: PatientBasicInfoProps) {
  return (
    <div className="flex items-center gap-6">
      {/* Patient ID and Name */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs text-blue-600">ID: {id}</span>
        </div>
        <div className="flex items-center gap-1">
          <span className="text-sm">{name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-600">{nameKana}</span>
        </div>
      </div>

      {/* Divider */}
      <div className="w-px h-12 bg-gray-300"></div>

      {/* Gender and Birth Date */}
      <div className="flex flex-col">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">性別</span>
          <span className="text-xs">{gender}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">生年月日</span>
          <span className="text-xs">{birthDate}</span>
        </div>
      </div>
    </div>
  );
}

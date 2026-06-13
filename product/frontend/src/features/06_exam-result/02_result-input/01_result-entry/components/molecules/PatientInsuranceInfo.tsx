import { Badge } from '@/shared/components/atoms/badge';

interface PatientInsuranceInfoProps {
  insuranceType: string;
  consultationType: string;
}

export function PatientInsuranceInfo({ insuranceType, consultationType }: PatientInsuranceInfoProps) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">保険種別</span>
        <Badge variant="outline" className="text-xs border-blue-400 text-blue-600">
          {insuranceType}
        </Badge>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-gray-500">診察区分</span>
        <span className="text-xs">{consultationType}</span>
      </div>
    </div>
  );
}

import { Badge } from '@/shared/components/atoms/badge';
import { Bell } from 'lucide-react';

interface PatientAlertsProps {
  allergies: string[];
  medicalHistory: string[];
}

export function PatientAlerts({ allergies, medicalHistory }: PatientAlertsProps) {
  return (
    <div className="flex items-center gap-3">
      {allergies.length > 0 && (
        <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 flex items-center gap-1">
          <Bell className="w-3 h-3" />
          <span className="text-xs">アレルギー</span>
          <span className="text-xs">{allergies.join('・')}</span>
        </Badge>
      )}
      {medicalHistory.length > 0 && (
        <Badge className="bg-orange-400 hover:bg-orange-500 text-white px-3 py-1 flex items-center gap-1">
          <span className="text-xs">既往歴</span>
          <span className="text-xs">{medicalHistory.join('・')}</span>
        </Badge>
      )}
    </div>
  );
}

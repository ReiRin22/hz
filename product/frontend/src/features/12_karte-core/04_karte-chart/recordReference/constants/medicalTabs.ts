import { CheckCircle, Grid3X3, BarChart3 } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface MedicalTab {
  value: string;
  label: string;
  icon: LucideIcon;
}

// TODO: karteChartView でも同タブを使用する場合は _shared/components/molecules/MedicalTabsList.tsx に昇格する
export const medicalTabs: MedicalTab[] = [
  { value: 'records',  label: '診療記録',             icon: CheckCircle },
  { value: 'overview', label: '診療オーバービュー',   icon: Grid3X3 },
  { value: 'stats',    label: 'バイタル・検査グラフ', icon: BarChart3 },
];

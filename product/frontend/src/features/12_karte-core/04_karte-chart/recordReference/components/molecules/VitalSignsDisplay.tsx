import { Activity, Heart, Thermometer, Wind, Droplets } from 'lucide-react';
import { ja } from '@/shared/i18n/ja';

const t = ja.karte.recordReference.vitalSignsDisplay;

interface VitalSignsDisplayProps {
  vitalSigns?: {
    bloodPressure?: string;
    pulse?: string;
    temperature?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
}

export function VitalSignsDisplay({ vitalSigns }: VitalSignsDisplayProps) {
  if (!vitalSigns) return null;

  const vitalItems = [
    { icon: Activity,    label: t.bloodPressure,    value: vitalSigns.bloodPressure,    colorClass: 'text-red-600 dark:text-red-400' },
    { icon: Heart,       label: t.pulse,             value: vitalSigns.pulse,            colorClass: 'text-pink-600 dark:text-pink-400' },
    { icon: Thermometer, label: t.temperature,       value: vitalSigns.temperature,      colorClass: 'text-orange-600 dark:text-orange-400' },
    { icon: Wind,        label: t.respiratoryRate,   value: vitalSigns.respiratoryRate,  colorClass: 'text-blue-600 dark:text-blue-400' },
    { icon: Droplets,    label: t.oxygenSaturation,  value: vitalSigns.oxygenSaturation, colorClass: 'text-cyan-600 dark:text-cyan-400' },
  ];

  const hasAnyVitals = vitalItems.some((item) => item.value);
  if (!hasAnyVitals) return null;

  return (
    <div className="grid grid-cols-2 gap-3">
      {vitalItems.map((item) => {
        if (!item.value) return null;
        const Icon = item.icon;
        return (
          <div key={item.label} className="flex items-center space-x-2 p-2 rounded-lg bg-muted/50">
            <Icon className={`w-4 h-4 ${item.colorClass}`} />
            <div className="flex flex-col">
              <span className="text-xs text-muted-foreground">{item.label}</span>
              <span className="text-sm font-semibold">{item.value}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

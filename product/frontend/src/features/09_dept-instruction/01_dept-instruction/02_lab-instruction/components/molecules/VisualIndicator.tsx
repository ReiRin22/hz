'use client';

import { Pill, Syringe, Droplet, TestTube2, Activity, Wind, Radio, Waves, Ear, Eye } from 'lucide-react';
import type { VisualIndicator as VisualIndicatorType } from '../../types/deptInstruction.viewmodel';
import { i18n } from '@/shared/i18n';

const { deptInstruction: di } = i18n;

interface VisualIndicatorProps {
  indicator: VisualIndicatorType;
  size?: 'xs' | 'sm' | 'md';
}

export function VisualIndicator({ indicator, size = 'md' }: VisualIndicatorProps) {
  const isSmall = size === 'sm';
  const isExtraSmall = size === 'xs';

  if (indicator.physiologicalTestType) {
    const testType = indicator.physiologicalTestType;
    const label = di.visualIndicator.physiologicalTestLabels[testType as keyof typeof di.visualIndicator.physiologicalTestLabels] ?? testType;

    let icon = null;
    let bgColor = 'bg-cyan-50';
    let textColor = 'text-cyan-700';
    let borderColor = 'border-cyan-300';

    switch (testType) {
      case 'ECG':
        icon = <Activity className={isExtraSmall ? 'h-4 w-4' : isSmall ? 'h-5 w-5' : 'h-8 w-8'} />;
        bgColor = 'bg-cyan-50'; textColor = 'text-cyan-700'; borderColor = 'border-cyan-300';
        break;
      case 'PULMONARY':
        icon = <Wind className={isExtraSmall ? 'h-4 w-4' : isSmall ? 'h-5 w-5' : 'h-8 w-8'} />;
        bgColor = 'bg-sky-50'; textColor = 'text-sky-700'; borderColor = 'border-sky-300';
        break;
      case 'EEG':
        icon = <Waves className={isExtraSmall ? 'h-4 w-4' : isSmall ? 'h-5 w-5' : 'h-8 w-8'} />;
        bgColor = 'bg-indigo-50'; textColor = 'text-indigo-700'; borderColor = 'border-indigo-300';
        break;
      case 'ULTRASOUND':
      case 'ECHOCARDIOGRAM':
        icon = <Radio className={isExtraSmall ? 'h-4 w-4' : isSmall ? 'h-5 w-5' : 'h-8 w-8'} />;
        bgColor = 'bg-teal-50'; textColor = 'text-teal-700'; borderColor = 'border-teal-300';
        break;
      case 'AUDIOMETRY':
        icon = <Ear className={isExtraSmall ? 'h-4 w-4' : isSmall ? 'h-5 w-5' : 'h-8 w-8'} />;
        bgColor = 'bg-purple-50'; textColor = 'text-purple-700'; borderColor = 'border-purple-300';
        break;
      case 'FUNDUS':
        icon = <Eye className={isExtraSmall ? 'h-4 w-4' : isSmall ? 'h-5 w-5' : 'h-8 w-8'} />;
        bgColor = 'bg-violet-50'; textColor = 'text-violet-700'; borderColor = 'border-violet-300';
        break;
      default:
        icon = <Activity className={isExtraSmall ? 'h-4 w-4' : isSmall ? 'h-5 w-5' : 'h-8 w-8'} />;
    }

    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`${isExtraSmall ? 'p-1' : isSmall ? 'p-1.5' : 'p-2'} rounded-lg ${bgColor} ${textColor} shadow-sm border ${borderColor}`}>
          {icon}
        </div>
        <div className={`${isExtraSmall ? 'text-[9px] px-0.5 py-0' : isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} text-center rounded ${bgColor} ${textColor} ${borderColor} border whitespace-nowrap`}>
          {label}
        </div>
      </div>
    );
  }

  if (indicator.tubeType === 'FORMALIN_CONTAINER') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative flex items-center justify-center">
          <div className={`${isSmall ? 'w-8 h-10' : 'w-12 h-14'} bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-amber-400 rounded-sm relative overflow-hidden shadow-md`}>
            <div className={`absolute bottom-0 left-0 right-0 ${isSmall ? 'h-7' : 'h-11'} bg-gradient-to-t from-amber-200/60 to-amber-100/40`}></div>
            <div className={`absolute ${isSmall ? 'bottom-1 w-2 h-1.5' : 'bottom-2 w-3 h-2'} left-1/2 -translate-x-1/2 bg-pink-300 rounded-sm opacity-70`}></div>
          </div>
          <div className={`absolute -top-1 left-1/2 -translate-x-1/2 ${isSmall ? 'w-8 h-2' : 'w-12 h-2.5'} bg-gray-800 rounded-sm shadow-md border border-gray-900`}></div>
        </div>
        <div className={`${isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} text-center rounded bg-amber-100 text-amber-800 border border-amber-300`}>
          {isSmall ? di.visualIndicator.formalinShort : di.visualIndicator.formalinLong}
        </div>
      </div>
    );
  }

  if (indicator.tubeType === 'CULTURE_BOTTLE') {
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative flex items-center justify-center">
          <div className={`${isSmall ? 'w-7 h-11' : 'w-10 h-16'} bg-gradient-to-b from-green-50 to-white border-2 border-green-500 rounded-lg relative overflow-hidden shadow-md`}>
            <div className={`absolute bottom-0 left-0 right-0 ${isSmall ? 'h-6' : 'h-10'} bg-gradient-to-t from-green-200/70 to-green-100/50`}></div>
            <div className={`absolute ${isSmall ? 'bottom-5 left-1.5 w-1 h-1' : 'bottom-8 left-2 w-1.5 h-1.5'} bg-green-300 rounded-full opacity-60`}></div>
            <div className={`absolute ${isSmall ? 'bottom-4 right-1.5 w-0.5 h-0.5' : 'bottom-6 right-2 w-1 h-1'} bg-green-300 rounded-full opacity-60`}></div>
          </div>
          <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 ${isSmall ? 'w-7 h-2' : 'w-11 h-3'} bg-green-600 rounded-sm shadow-md border border-green-700`}></div>
        </div>
        <div className={`${isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} text-center rounded bg-green-100 text-green-800 border border-green-300`}>
          {isSmall ? di.visualIndicator.cultureShort : di.visualIndicator.cultureLong}
        </div>
      </div>
    );
  }

  if (indicator.tubeType && indicator.tubeColor) {
    const tubeLabel = di.specimenTubeLabels[indicator.tubeType as keyof typeof di.specimenTubeLabels] ?? indicator.tubeType;
    return (
      <div className="flex flex-col items-center gap-1">
        <div className="relative flex items-center justify-center">
          <div className={`${isExtraSmall ? 'w-5 h-10' : isSmall ? 'w-6 h-11' : 'w-8 h-16'} bg-white border-2 border-gray-300 rounded-sm relative overflow-hidden shadow-sm`}>
            <div className={`absolute bottom-0 left-0 right-0 ${isExtraSmall ? 'h-5' : isSmall ? 'h-6' : 'h-10'} bg-gradient-to-t from-red-600 to-red-500`}></div>
          </div>
          <div
            className={`absolute -top-1 left-1/2 -translate-x-1/2 ${isExtraSmall ? 'w-6 h-2' : isSmall ? 'w-7 h-2' : 'w-10 h-3'} rounded-sm shadow-md border border-gray-400`}
            style={{ backgroundColor: indicator.tubeColor }}
          ></div>
        </div>
        <div
          className={`${isExtraSmall ? 'text-[10px] px-1 py-0' : isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} text-center rounded`}
          style={{ backgroundColor: `${indicator.tubeColor}20`, color: indicator.tubeColor }}
        >
          {tubeLabel}
        </div>
      </div>
    );
  }

  if (indicator.medicationType) {
    const medType = indicator.medicationType;
    const medLabel = di.medicationTypeLabels[medType as keyof typeof di.medicationTypeLabels] ?? medType;

    let icon = null;
    let bgColor = '';
    let textColor = '';

    switch (medType) {
      case 'INJECTION':
        icon = <Syringe className="h-6 w-6" />;
        bgColor = 'bg-blue-50'; textColor = 'text-blue-700';
        break;
      case 'DRIP':
        icon = <Droplet className="h-6 w-6" />;
        bgColor = 'bg-cyan-50'; textColor = 'text-cyan-700';
        break;
      case 'TABLET':
      case 'INTERNAL':
        icon = <Pill className="h-6 w-6" />;
        bgColor = 'bg-purple-50'; textColor = 'text-purple-700';
        break;
      case 'CAPSULE':
        icon = (
          <div className="flex gap-0.5">
            <div className="w-2 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-full"></div>
            <div className="w-2 h-5 bg-gradient-to-b from-white to-gray-100 rounded-r-full border border-gray-300"></div>
          </div>
        );
        bgColor = 'bg-indigo-50'; textColor = 'text-indigo-700';
        break;
      default:
        icon = <TestTube2 className="h-6 w-6" />;
        bgColor = 'bg-gray-50'; textColor = 'text-gray-700';
    }

    return (
      <div className="flex flex-col items-center gap-1.5">
        <div className={`p-2 rounded-lg ${bgColor} ${textColor} shadow-sm border border-gray-200`}>
          {icon}
        </div>
        <div className={`text-xs px-2 py-0.5 rounded ${bgColor} ${textColor}`}>
          {medLabel}
        </div>
        {indicator.medicationForm && (
          <div className="text-xs text-gray-600 text-center max-w-[80px] leading-tight">
            {indicator.medicationForm}
          </div>
        )}
      </div>
    );
  }

  return null;
}

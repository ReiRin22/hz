import { Pill, Syringe, Droplet, TestTube2 } from 'lucide-react';
import type { VisualIndicator as VisualIndicatorType } from '../../types';

interface VisualIndicatorProps {
  indicator: VisualIndicatorType;
}

export function VisualIndicator({ indicator }: VisualIndicatorProps) {
  // 病理検査用のホルマリン容器表示
  if (indicator.tubeType === 'ホルマリン容器') {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {/* ホルマリン容器の視覚表現 */}
        <div className="relative flex items-center justify-center">
          {/* 容器本体（四角い瓶） */}
          <div className="w-12 h-14 bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-amber-400 rounded-sm relative overflow-hidden shadow-md">
            {/* ホルマリン液（薄い琥珀色） */}
            <div className="absolute bottom-0 left-0 right-0 h-11 bg-gradient-to-t from-amber-200/60 to-amber-100/40"></div>
            {/* 検体（小さい固形物） */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-3 h-2 bg-pink-300 rounded-sm opacity-70"></div>
          </div>
          {/* キャップ（黒） */}
          <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-gray-800 rounded-sm shadow-md border border-gray-900"></div>
        </div>
        {/* ラベル */}
        <div className="text-xs text-center px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
          ホルマリン容器
        </div>
      </div>
    );
  }

  // 細菌培養ボトル表示
  if (indicator.tubeType === '培養ボトル') {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {/* 培養ボトルの視覚表現 */}
        <div className="relative flex items-center justify-center">
          {/* ボトル本体（縦長の円柱） */}
          <div className="w-10 h-16 bg-gradient-to-b from-green-50 to-white border-2 border-green-500 rounded-lg relative overflow-hidden shadow-md">
            {/* 培地（下半分） */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-green-200/70 to-green-100/50"></div>
            {/* 気泡表現 */}
            <div className="absolute bottom-8 left-2 w-1.5 h-1.5 bg-green-300 rounded-full opacity-60"></div>
            <div className="absolute bottom-6 right-2 w-1 h-1 bg-green-300 rounded-full opacity-60"></div>
          </div>
          {/* キャップ（緑） */}
          <div className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-11 h-3 bg-green-600 rounded-sm shadow-md border border-green-700"></div>
        </div>
        {/* ラベル */}
        <div className="text-xs text-center px-2 py-0.5 rounded bg-green-100 text-green-800 border border-green-300">
          培養ボトル
        </div>
      </div>
    );
  }

  // 検体検査用のスピッツ表示
  if (indicator.tubeType && indicator.tubeColor) {
    return (
      <div className="flex flex-col items-center gap-1.5">
        {/* スピッツの視覚表現 */}
        <div className="relative flex items-center justify-center">
          {/* チューブ本体 */}
          <div className="w-8 h-16 bg-white border-2 border-gray-300 rounded-sm relative overflow-hidden shadow-sm">
            {/* 血液部分（下半分） */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-red-600 to-red-500"></div>
          </div>
          {/* キャップ */}
          <div 
            className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-10 h-3 rounded-sm shadow-md border border-gray-400"
            style={{ backgroundColor: indicator.tubeColor }}
          ></div>
        </div>
        {/* ラベル */}
        <div className="text-xs text-center px-2 py-0.5 rounded" 
             style={{ 
               backgroundColor: `${indicator.tubeColor}20`,
               color: indicator.tubeColor 
             }}>
          {indicator.tubeType}
        </div>
      </div>
    );
  }

  // 注射・薬剤用の表示
  if (indicator.medicationType) {
    let icon = null;
    let bgColor = '';
    let textColor = '';

    switch (indicator.medicationType) {
      case '注射剤':
        icon = <Syringe className="h-6 w-6" />;
        bgColor = 'bg-blue-50';
        textColor = 'text-blue-700';
        break;
      case '点滴':
        icon = <Droplet className="h-6 w-6" />;
        bgColor = 'bg-cyan-50';
        textColor = 'text-cyan-700';
        break;
      case '錠剤':
      case '内服薬':
        icon = <Pill className="h-6 w-6" />;
        bgColor = 'bg-purple-50';
        textColor = 'text-purple-700';
        break;
      case 'カプセル':
        icon = (
          <div className="flex gap-0.5">
            <div className="w-2 h-5 bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-full"></div>
            <div className="w-2 h-5 bg-gradient-to-b from-white to-gray-100 rounded-r-full border border-gray-300"></div>
          </div>
        );
        bgColor = 'bg-indigo-50';
        textColor = 'text-indigo-700';
        break;
      default:
        icon = <TestTube2 className="h-6 w-6" />;
        bgColor = 'bg-gray-50';
        textColor = 'text-gray-700';
    }

    return (
      <div className="flex flex-col items-center gap-1.5">
        {/* 薬剤アイコン */}
        <div className={`p-2 rounded-lg ${bgColor} ${textColor} shadow-sm border border-gray-200`}>
          {icon}
        </div>
        {/* タイプラベル */}
        <div className={`text-xs px-2 py-0.5 rounded ${bgColor} ${textColor}`}>
          {indicator.medicationType}
        </div>
        {/* 形態詳細 */}
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

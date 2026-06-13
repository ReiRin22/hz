import { Pill, Syringe, Droplet, TestTube2 } from 'lucide-react';
import type { VisualIndicator as VisualIndicatorType } from '../../types';

interface VisualIndicatorProps {
  indicator: VisualIndicatorType;
  size?: 'normal' | 'small';
}

export function VisualIndicator({ indicator, size = 'normal' }: VisualIndicatorProps) {
  const isSmall = size === 'small';
  
  // 病理検査用のホルマリン容器表示
  if (indicator.tubeType === 'ホルマリン容器') {
    return (
      <div className={`flex flex-col items-center ${isSmall ? 'gap-0.5' : 'gap-1.5'}`}>
        {/* ホルマリン容器の視覚表現 */}
        <div className="relative flex items-center justify-center">
          {/* 容器本体（四角い瓶） */}
          <div className={`${isSmall ? 'w-8 h-10' : 'w-12 h-14'} bg-gradient-to-b from-amber-100 to-amber-50 border-2 border-amber-400 rounded-sm relative overflow-hidden shadow-md`}>
            {/* ホルマリン液（薄い琥珀色） */}
            <div className={`absolute bottom-0 left-0 right-0 ${isSmall ? 'h-7' : 'h-11'} bg-gradient-to-t from-amber-200/60 to-amber-100/40`}></div>
            {/* 検体（小さい固形物） */}
            <div className={`absolute ${isSmall ? 'bottom-1 w-2 h-1.5' : 'bottom-2 w-3 h-2'} left-1/2 -translate-x-1/2 bg-pink-300 rounded-sm opacity-70`}></div>
          </div>
          {/* キャップ（黒） */}
          <div className={`absolute -top-1 left-1/2 -translate-x-1/2 ${isSmall ? 'w-8 h-2' : 'w-12 h-2.5'} bg-gray-800 rounded-sm shadow-md border border-gray-900`}></div>
        </div>
        {/* ラベル */}
        <div className={`${isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} text-center rounded bg-amber-100 text-amber-800 border border-amber-300`}>
          ホルマリン容器
        </div>
      </div>
    );
  }

  // 細菌培養ボトル表示
  if (indicator.tubeType === '培養ボトル') {
    return (
      <div className={`flex flex-col items-center ${isSmall ? 'gap-0.5' : 'gap-1.5'}`}>
        {/* 培養ボトルの視覚表現 */}
        <div className="relative flex items-center justify-center">
          {/* ボトル本体（縦長の円柱） */}
          <div className={`${isSmall ? 'w-7 h-11' : 'w-10 h-16'} bg-gradient-to-b from-green-50 to-white border-2 border-green-500 rounded-lg relative overflow-hidden shadow-md`}>
            {/* 培地（下半分） */}
            <div className={`absolute bottom-0 left-0 right-0 ${isSmall ? 'h-7' : 'h-10'} bg-gradient-to-t from-green-200/70 to-green-100/50`}></div>
            {/* 気泡表現 */}
            {!isSmall && (
              <>
                <div className="absolute bottom-8 left-2 w-1.5 h-1.5 bg-green-300 rounded-full opacity-60"></div>
                <div className="absolute bottom-6 right-2 w-1 h-1 bg-green-300 rounded-full opacity-60"></div>
              </>
            )}
          </div>
          {/* キャップ（緑） */}
          <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 ${isSmall ? 'w-8 h-2' : 'w-11 h-3'} bg-green-600 rounded-sm shadow-md border border-green-700`}></div>
        </div>
        {/* ラベル */}
        <div className={`${isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} text-center rounded bg-green-100 text-green-800 border border-green-300`}>
          培養ボトル
        </div>
      </div>
    );
  }

  // 検体検査用のスピッツ表示
  if (indicator.tubeType && indicator.tubeColor) {
    return (
      <div className={`flex flex-col items-center ${isSmall ? 'gap-0.5' : 'gap-1.5'}`}>
        {/* スピッツの視覚表現 */}
        <div className="relative flex items-center justify-center">
          {/* チューブ本体 */}
          <div className={`${isSmall ? 'w-5 h-10' : 'w-8 h-16'} bg-white border-2 border-gray-300 rounded-sm relative overflow-hidden shadow-sm`}>
            {/* 血液部分（下半分） */}
            <div className={`absolute bottom-0 left-0 right-0 ${isSmall ? 'h-6' : 'h-10'} bg-gradient-to-t from-red-600 to-red-500`}></div>
          </div>
          {/* キャップ */}
          <div 
            className={`absolute ${isSmall ? '-top-1 w-6 h-2' : '-top-1.5 w-10 h-3'} left-1/2 -translate-x-1/2 rounded-sm shadow-md border border-gray-400`}
            style={{ backgroundColor: indicator.tubeColor }}
          ></div>
        </div>
        {/* ラベル */}
        <div className={`${isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} text-center rounded`}
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
    
    const iconSize = isSmall ? 'h-4 w-4' : 'h-6 w-6';

    switch (indicator.medicationType) {
      case '注射剤':
        icon = <Syringe className={iconSize} />;
        bgColor = 'bg-blue-50';
        textColor = 'text-blue-700';
        break;
      case '点滴':
        icon = <Droplet className={iconSize} />;
        bgColor = 'bg-cyan-50';
        textColor = 'text-cyan-700';
        break;
      case '錠剤':
      case '内服薬':
        icon = <Pill className={iconSize} />;
        bgColor = 'bg-purple-50';
        textColor = 'text-purple-700';
        break;
      case 'カプセル':
        icon = (
          <div className="flex gap-0.5">
            <div className={`${isSmall ? 'w-1.5 h-4' : 'w-2 h-5'} bg-gradient-to-b from-blue-500 to-blue-600 rounded-l-full`}></div>
            <div className={`${isSmall ? 'w-1.5 h-4' : 'w-2 h-5'} bg-gradient-to-b from-white to-gray-100 rounded-r-full border border-gray-300`}></div>
          </div>
        );
        bgColor = 'bg-indigo-50';
        textColor = 'text-indigo-700';
        break;
      default:
        icon = <TestTube2 className={iconSize} />;
        bgColor = 'bg-gray-50';
        textColor = 'text-gray-700';
    }

    return (
      <div className={`flex flex-col items-center ${isSmall ? 'gap-0.5' : 'gap-1.5'}`}>
        {/* 薬剤アイコン */}
        <div className={`${isSmall ? 'p-1' : 'p-2'} rounded-lg ${bgColor} ${textColor} shadow-sm border border-gray-200`}>
          {icon}
        </div>
        {/* タイプラベル */}
        <div className={`${isSmall ? 'text-[10px] px-1 py-0' : 'text-xs px-2 py-0.5'} rounded ${bgColor} ${textColor}`}>
          {indicator.medicationType}
        </div>
        {/* 形態詳細 */}
        {!isSmall && indicator.medicationForm && (
          <div className="text-xs text-gray-600 text-center max-w-[80px] leading-tight">
            {indicator.medicationForm}
          </div>
        )}
      </div>
    );
  }

  return null;
}
'use client';

/**
 * オーダー種別選択グリッド
 *
 * 参照元: 【ORD032～ORD035】src/components/features/chart/_components/molecules/OrderTypeSelectionGrid.tsx
 */

import * as React from 'react';
import { Pill, Syringe, TestTube, Activity, Eye, Zap, Clipboard, Users, Heart, Droplet, Bed, FileText } from 'lucide-react';
import { Button } from '@/shared/components/atoms/button';

interface OrderType {
  id: string;
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
}

interface OrderTypeSelectionGridProps {
  onSelectType: (typeId: string) => void;
}

const orderTypes: OrderType[] = [
  { id: 'prescription', label: '処方', icon: <Pill className="w-6 h-6 text-purple-500" />, hoverColor: 'hover:bg-purple-50 hover:border-purple-300' },
  { id: 'injection', label: '注射', icon: <Syringe className="w-6 h-6 text-green-600" />, hoverColor: 'hover:bg-green-50 hover:border-green-300' },
  { id: 'treatment', label: '処置', icon: <Activity className="w-6 h-6 text-blue-500" />, hoverColor: 'hover:bg-blue-50 hover:border-blue-300' },
  { id: 'guidance', label: '指導', icon: <Clipboard className="w-6 h-6 text-amber-600" />, hoverColor: 'hover:bg-amber-50 hover:border-amber-300' },
  { id: 'lab', label: '検体検査', icon: <TestTube className="w-6 h-6 text-red-500" />, hoverColor: 'hover:bg-red-50 hover:border-red-300' },
  { id: 'physiological', label: '生理検査', icon: <Activity className="w-6 h-6 text-pink-500" />, hoverColor: 'hover:bg-pink-50 hover:border-pink-300' },
  { id: 'endoscopy', label: '内視鏡検査', icon: <Eye className="w-6 h-6 text-teal-600" />, hoverColor: 'hover:bg-teal-50 hover:border-teal-300' },
  { id: 'imaging', label: '画像検査', icon: <FileText className="w-6 h-6 text-blue-600" />, hoverColor: 'hover:bg-blue-50 hover:border-blue-300' },
  { id: 'pathology', label: '病理検査', icon: <Activity className="w-6 h-6 text-purple-600" />, hoverColor: 'hover:bg-purple-50 hover:border-purple-300' },
  { id: 'bacteriology', label: '細菌検査', icon: <TestTube className="w-6 h-6 text-rose-500" />, hoverColor: 'hover:bg-rose-50 hover:border-rose-300' },
  { id: 'general', label: '汎用', icon: <Clipboard className="w-6 h-6 text-slate-600" />, hoverColor: 'hover:bg-slate-50 hover:border-slate-300' },
  { id: 'complex', label: '複合', icon: <Zap className="w-6 h-6 text-indigo-600" />, hoverColor: 'hover:bg-indigo-50 hover:border-indigo-300' },
  { id: 'meal', label: '食事', icon: <FileText className="w-6 h-6 text-lime-600" />, hoverColor: 'hover:bg-lime-50 hover:border-lime-300' },
  { id: 'rehabilitation', label: 'リハビリ', icon: <Users className="w-6 h-6 text-emerald-600" />, hoverColor: 'hover:bg-emerald-50 hover:border-emerald-300' },
  { id: 'transfusion', label: '輸血', icon: <Heart className="w-6 h-6 text-rose-500" />, hoverColor: 'hover:bg-rose-50 hover:border-rose-300' },
  { id: 'surgery', label: '手術', icon: <Zap className="w-6 h-6 text-fuchsia-600" />, hoverColor: 'hover:bg-fuchsia-50 hover:border-fuchsia-300' },
  { id: 'dialysis', label: '透析', icon: <Droplet className="w-6 h-6 text-cyan-600" />, hoverColor: 'hover:bg-cyan-50 hover:border-cyan-300' },
  { id: 'admission', label: '入院', icon: <Bed className="w-6 h-6 text-sky-600" />, hoverColor: 'hover:bg-sky-50 hover:border-sky-300' },
  { id: 'discharge', label: '退院', icon: <FileText className="w-6 h-6 text-gray-600" />, hoverColor: 'hover:bg-gray-50 hover:border-gray-300' },
  { id: 'transfer', label: '転院転科転室', icon: <FileText className="w-6 h-6 text-stone-600" />, hoverColor: 'hover:bg-stone-50 hover:border-stone-300' },
  { id: 'nursing', label: '看護ケア', icon: <Heart className="w-6 h-6 text-cyan-600" />, hoverColor: 'hover:bg-cyan-50 hover:border-cyan-300' },
];

export const OrderTypeSelectionGrid: React.FC<OrderTypeSelectionGridProps> = ({ onSelectType }) => {
  return (
    <div className="grid grid-cols-3 gap-3 p-6 pt-4">
      {orderTypes.map((type) => (
        <Button
          key={type.id}
          onClick={() => onSelectType(type.id)}
          variant="outline"
          className={`h-20 flex flex-col items-center justify-center gap-2 ${type.hoverColor} border-gray-200`}
        >
          {type.icon}
          <span className="text-sm">{type.label}</span>
        </Button>
      ))}
    </div>
  );
};

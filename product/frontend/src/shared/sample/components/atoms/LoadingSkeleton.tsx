// src/features/_shared/components/atoms/LoadingSkeleton.tsx
import React from 'react';

interface LoadingSkeletonProps {
  // A: デフォルト(引数なし), B: プリセット(list, card), C: 自由指定
  variant?: 'default' | 'list' | 'card' | 'circle';
  rows?: number;      // list時の行数
  className?: string; // C: h-[450px] などの高さ指定用
}

export const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({ 
  variant = 'default', 
  rows = 3, 
  className = "" 
}) => {
  // ベーススタイル
  const baseClass = "bg-slate-100 animate-pulse rounded-lg border border-slate-200 w-full";

  // B: プリセット表示
  if (variant === 'list') {
    return (
      <div className={`space-y-3 ${className}`}>
        {[...Array(rows)].map((_, i) => (
          <div key={i} className={`${baseClass} h-10`} />
        ))}
      </div>
    );
  }

  if (variant === 'card') {
    return (
      <div className={`p-6 bg-white border border-slate-200 rounded-xl space-y-4 ${className}`}>
        <div className={`${baseClass} h-6 w-1/3`} />
        <div className="space-y-2">
          <div className={`${baseClass} h-4 w-full`} />
          <div className={`${baseClass} h-4 w-5/6`} />
        </div>
      </div>
    );
  }

  // A & C: デフォルトまたはclassNameによる自由指定
  return <div className={`${baseClass} ${variant === 'default' ? 'h-32' : ''} ${className}`} />;
};
// src/app/(karte)/diagnosis/record-view/view/page.tsx
import { Suspense } from 'react';
import { REC005RecordView } from '@/features/sample/diagnosis/record-view/view/components/REC005RecordView';
import { CLT001ClinicalEntry } from '@/features/sample/diagnosis/record-management/clinical-entry/components/organisms/CLT001ClinicalEntry/index';
// 共通スケルトンをインポート（以前作成したものと仮定）
import { LoadingSkeleton } from '@shared/sample/components/atoms/LoadingSkeleton';

export default function Page() {
  return (
    <div className="grid grid-cols-3 gap-4 p-4 h-full">
      {/* 左：診療情報参照（ここだけ10秒待機してスケルトンを表示） */}
      <div className="overflow-y-auto">
        <Suspense fallback={<LoadingSkeleton />}>
          <REC005RecordView />
        </Suspense>
      </div>

      {/* 中央：診療記録入力（データフェッチがないので即座に表示される） */}
      <div className="overflow-y-auto">
        <CLT001ClinicalEntry />
      </div>

      {/* 右：空きスペース（即座に表示される） */}
      <div className="border-2 border-dashed border-slate-200 rounded-lg flex items-center justify-center text-slate-400 text-sm">
        将来の拡張スペース
      </div>
    </div>
  );
}
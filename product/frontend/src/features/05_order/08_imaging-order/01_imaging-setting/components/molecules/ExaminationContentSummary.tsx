'use client';

/**
 * 検査内容サマリー表示 - ImagingOrderDetailPanel用UI部品
 *
 * 参照元: 【ORD032～ORD035】src/components/features/imaging-order/molecules/ExaminationContentSummary.tsx
 */

export interface BodyPartItem {
  bodyPart: string;
  protocol: string;
  laterality?: string;
  position?: string;
  radiationCondition?: string;
}

export interface ExaminationContentSummaryProps {
  bodyPartsList: BodyPartItem[];
}

export function ExaminationContentSummary({ bodyPartsList }: ExaminationContentSummaryProps) {
  if (bodyPartsList.length === 0) {
    return (
      <div className="border border-border rounded-lg p-3 space-y-3">
        <h3 className="text-sm">検査内容</h3>
        <div className="text-sm text-muted-foreground text-center py-4">
          検査内容が選択されていません
        </div>
      </div>
    );
  }

  // 側性と撮影方向でグループ化
  const grouped = bodyPartsList.reduce((acc, item) => {
    const key = `${item.laterality || 'none'}-${item.protocol}-${item.position || 'none'}`;
    if (!acc[key]) {
      acc[key] = {
        laterality: item.laterality,
        protocol: item.protocol,
        position: item.position,
        bodyParts: []
      };
    }
    acc[key].bodyParts.push(item.bodyPart);
    return acc;
  }, {} as Record<string, { laterality?: string; protocol: string; position?: string; bodyParts: string[] }>);

  return (
    <div className="border border-border rounded-lg p-3 space-y-3">
      <h3 className="text-sm">検査内容</h3>

      <div className="space-y-3">
        {Object.values(grouped).map((group, index) => (
          <div key={index}>
            <div className="flex bg-muted/50 rounded p-2 text-xs">
              <span className="font-medium max-w-[220px]">
                {group.bodyParts.map((part, i) => (
                  <span key={i}>
                    {part}
                    {i < group.bodyParts.length - 1 && '、'}
                  </span>
                ))}
              </span>
              <span className="text-center min-w-[50px] ml-2">{group.protocol}</span>
              <span className="text-center min-w-[30px] ml-2">
                {group.laterality && group.laterality !== 'none' && group.laterality !== 'null' && group.laterality !== '指定なし' && group.laterality !== 'Not specified'
                  ? group.laterality
                  : '-'}
              </span>
              <span className="text-center min-w-[50px] ml-2">
                {group.position && group.position !== 'none' && group.position !== '指定なし' && group.position !== 'Not specified'
                  ? group.position
                  : '-'}
              </span>
            </div>
            {index < Object.values(grouped).length - 1 && (
              <div className="border-t border-border mt-2" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

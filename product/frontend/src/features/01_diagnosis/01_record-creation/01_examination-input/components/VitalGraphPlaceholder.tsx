// バイタル・検査グラフエリア（仮コンポーネント）
// 将来的にここに StatsDashboard が配置される

export function VitalGraphPlaceholder() {
  return (
    <div className="min-h-[calc(100vh-160px)] w-full rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
      <span className="text-sm text-muted-foreground">バイタル・検査グラフ</span>
    </div>
  );
}

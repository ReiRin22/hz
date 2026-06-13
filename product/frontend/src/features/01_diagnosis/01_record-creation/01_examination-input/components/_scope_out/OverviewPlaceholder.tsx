// 診察オーバービューエリア（仮コンポーネント）
// 将来的にここに OverviewMatrix が配置される

export function OverviewPlaceholder() {
  return (
    <div className="h-[calc(100vh-160px)] w-full rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
      <span className="text-sm text-muted-foreground">診察オーバービュー</span>
    </div>
  );
}

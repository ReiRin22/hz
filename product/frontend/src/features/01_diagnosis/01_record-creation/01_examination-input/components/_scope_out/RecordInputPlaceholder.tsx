// 記録入力エリア（仮コンポーネント）
// 将来的にここに MedicalRecordInput / OrderInput / HamburgerMenu 等が配置される

export function RecordInputPlaceholder() {
  return (
    <div className="flex-1 min-h-[calc(100vh-160px)] w-full rounded-lg border-2 border-dashed border-border bg-muted/30 flex items-center justify-center">
      <span className="text-sm text-muted-foreground">記録入力</span>
    </div>
  );
}

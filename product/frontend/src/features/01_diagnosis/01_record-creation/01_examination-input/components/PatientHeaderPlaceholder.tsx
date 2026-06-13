// 将来的に PatientHeader コンポーネントに置き換え予定
// 現在の実装は ./PatientHeader.tsx を参照

export function PatientHeaderPlaceholder() {
  return (
    <div className="h-[140px] w-full bg-muted border-b border-border flex items-center px-4">
      <span className="text-xs text-muted-foreground">【患者情報ヘッダー】（仮）</span>
    </div>
  );
}

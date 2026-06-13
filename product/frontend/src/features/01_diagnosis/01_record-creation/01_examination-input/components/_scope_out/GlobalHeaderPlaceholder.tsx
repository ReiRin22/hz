// 将来的に GlobalHeader コンポーネントに置き換え予定
// 現在の実装は ./GlobalHeader.tsx を参照

export function GlobalHeaderPlaceholder() {
  return (
    <div className="h-12 w-full bg-muted border-b border-border flex items-center px-4">
      <span className="text-xs text-muted-foreground">【グローバルヘッダー】（仮）</span>
    </div>
  );
}

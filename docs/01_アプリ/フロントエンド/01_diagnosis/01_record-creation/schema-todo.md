# REC002 シェーマ機能 — 調査メモ & 今後の変更候補

> 調査日: 2026-05-13  
> ステータス: メモ（未確定。変更するかどうかは要検討）

---

## 現状の実装サマリー

### 描画エンジン

**Fabric.js などの外部描画ライブラリは未使用。**  
HTML5 Canvas 2D Context を直接操作する独自実装。

```
DrawingCanvas.tsx
  └─ useRef<HTMLCanvasElement>
       └─ getContext('2d')  ← ここで全描画
```

### ツール種類

```typescript
type DrawTool = 'pen' | 'rectangle' | 'circle' | 'text' | 'spray' | 'eraser'
```

| ツール | Canvas API |
|---|---|
| ペン | `ctx.lineTo()` + `ctx.stroke()` |
| 矩形 | `ctx.strokeRect()` |
| 円 | `ctx.arc()` + `ctx.stroke()` |
| テキスト | `ctx.fillText()` |
| スプレー | `Math.random()` オフセットで複数ドット |
| 消しゴム | `ctx.globalCompositeOperation = 'destination-out'` |

### 出力形式

**Base64 PNG（描画操作のJSONシリアライズなし）**

```typescript
// 保存
const imageData = canvas.toDataURL('image/png');  // "data:image/png;base64,..."

// BFF APIリクエスト（JSON）
{ imageData: string }  // Base64 PNG文字列を1フィールドに格納

// BFF APIレスポンス
{ schemaUuid: string; savedAt: string }
```

Fabric.jsのような `canvas.toJSON()` → 操作ツリーをサーバー保存 → 再レンダリング という方式ではない。

### Undo/Redo

`ImageData` をスタックに最大50件保存し、`ctx.putImageData()` で復元。  
→ メモリ消費が大きい方式（600x600px × 50件）。

### 主要ファイル

```
src/features/01_diagnosis/01_record-creation/01_schema-creation/
  ├─ REC002.tsx
  ├─ components/
  │   ├─ organisms/
  │   │   ├─ DrawingCanvas.tsx          ← 描画メイン
  │   │   └─ SchemaCreationOrganism.tsx
  │   └─ molecules/
  │       ├─ DrawingToolPanel.tsx       ← ツール選択UI
  │       ├─ ColorPickerPanel.tsx
  │       ├─ TemplateSelectorPanel.tsx
  │       ├─ ToolbarPanel.tsx           ← Undo/Redo/Clear/Flip
  │       └─ FooterActionBar.tsx
  ├─ stores/schemaCreation.store.ts     ← Zustand（penSize, strokeColor等）
  ├─ hooks/
  │   ├─ useSchemaCreationInit.ts
  │   ├─ useSchemaCreationActions.ts
  │   └─ useSchemaCreationSubmit.ts
  ├─ api/
  │   ├─ postSchema.api.ts
  │   ├─ putSchema.api.ts
  │   └─ getTemplates.api.ts
  ├─ assets/
  │   ├─ MedicalTemplates.tsx           ← SVGテンプレート
  │   └─ templates.ts
  └─ types/schema-creation.types.ts
```

---

## 今後の変更候補（未確定）

### 候補1: Fabric.js 導入

**メリット:**
- 図形ごとにオブジェクト管理 → 選択・移動・リサイズが容易
- `canvas.toJSON()` で描画操作をJSONシリアライズ可能（サーバー側で再レンダリング可能）
- Undo/Redo がオブジェクト単位で精度向上（現状は ImageData 全体）

**デメリット:**
- バンドルサイズ増加（Fabric.js は ~300kb）
- 既存の DrawingCanvas.tsx を全面書き直し
- APIのリクエスト形式変更が必要（Base64 PNG → JSON操作ツリー）

**前提条件:** サーバー側で図形の再編集が必要かどうか。現状は「PNG画像として保存」で完結しているため、導入コストに見合うか要確認。

### 候補2: Undo/Redo のメモリ最適化

現状: ImageData（600×600px = 約1.4MB/件）× 最大50件 = 最大約70MB  
改善案: 差分のみ保存、またはスタック上限を削減

**優先度:** 低（現状で動作しているため）

### 候補3: 出力形式の追加（SVG）

現状は PNG のみ。SVG形式での出力を追加すると拡縮時の劣化がなくなる。  
ただし Canvas → SVG の変換は非trivialで、外部ライブラリ（`canvg` 等）が必要。

---

## 判断待ち事項

- [ ] Fabric.js 導入の是非（図形の後編集が必要か）
- [ ] APIの出力形式変更の必要性（Base64 PNG のままでよいか）
- [ ] Undo/Redo のメモリ制約が実用上問題になっているか

---
name: synchronizer-phase1
description: synchronizer Phase 1（型定義）実装ガイド。front_bff_shared と LV3 の型の役割分担・配置ルール・移設方法を定義する。Phase 1 開始時（S1-1〜S1-5）に必ず参照すること。
---

# synchronizer Phase 1: 型定義実装ガイド

## Phase 1 の型定義の役割分担

Phase 1 では 3 種類の型を定義する:

| 型の種類 | 配置場所 | 用途 | 誰が使う |
|---------|---------|------|---------|
| **BFF API 型** | `front_bff_shared/` | BFF ⇔ FE 間の通信型 | FE の `api/` 層 |
| **ViewModel 型** | `features/{LV3}/types/` | 画面・UI ロジックで使う型 | FE の `hooks/`, `components/` 層 |
| **BE API 型** | `backend/` (C#) | BE ⇔ BFF 間の通信型 | BFF の `clients/` 層 |

---

## 型の役割と配置ルール

### 1. BFF API 型（front_bff_shared）

**配置先:**
```
product/frontend/src/front_bff_shared/
└── {domain}/
    └── {LV3機能名}/
        └── types/
            ├── {機能名}.api.request.ts      ← BFF へのリクエスト型
            └── {機能名}.api.response.ts     ← BFF からのレスポンス型
```

**役割:**
- BFF ⇔ FE 間の **通信仕様** を定義する
- API エンドポイントの入出力を型で表現する
- BFF と FE で **共有** される（シンボリックリンクで同期）

**例: `schema-creation.api.request.ts`**
```typescript
/** POST /bff/schemas リクエストボディ */
export type SchemaSaveRequest = {
  imageData: string;
};

/** PUT /bff/schemas/{schemaUuid} リクエストボディ */
export type SchemaUpdateRequest = {
  imageData: string;
};

/** POST /bff/favorites リクエストボディ */
export type FavoriteAddRequest = {
  templateId: string;
};
```

**例: `schema-creation.api.response.ts`**
```typescript
/** GET /bff/templates?category={category} レスポンス */
export type TemplatesResponse = {
  templates: TemplateItem[];
  favoriteTemplateIds: string[];
};

/** GET /bff/schemas/{schemaUuid} レスポンス */
export type SchemaGetResponse = {
  schemaUuid: string;
  imageData: string;
  createdAt: string;
  updatedAt: string;
};

/** BFF統一エラーレスポンス */
export type BffErrorResponse = {
  type: 'AUTH_ERROR' | 'FORBIDDEN' | 'BUSINESS_ERROR' | 'SYSTEM_ERROR';
  code: string;
};
```

---

### 2. ViewModel 型（LV3 features）

**配置先:**
```
product/frontend/src/features/{domain}/{LV2}/{LV3}/
└── types/
    └── {機能名}.types.ts      ← 画面・UIロジック用の型
```

**役割:**
- **画面固有のビジネスロジック** で使う型
- UI 状態・操作・表示用の型を定義する
- BFF レスポンスを **変換** して使いやすい形にする

**例: `schema-creation.types.ts`**
```typescript
import type { Canvas as FabricCanvas } from 'fabric';

export const CANVAS_SIZE = 600;

export type DrawTool = 'pen' | 'rectangle' | 'circle' | 'text' | 'spray' | 'eraser';

export type DrawOperation = {
  type: 'draw' | 'clear' | 'flip' | 'image' | 'template' | 'text';
  imageData: string;
};

export type FabricCanvasRef = {
  fabricCanvas: FabricCanvas | null;
  undo: () => void;
  redo: () => void;
  clear: () => void;
  reset: () => void;
  flipHorizontal: () => void;
  save: () => string | null;
};

export type TemplateViewModel = {
  templateId: string;
  name: string;
  category: string;
  svgComponent: string;
  isFavorite: boolean;  // ← BFFレスポンスを加工して作る
};

export type SchemaCreationMode = 'new' | 'edit';

export type SchemaCreationDialogType =
  | 'clear-confirm'
  | 'cancel-confirm'
  | 'empty-confirm'
  | 'template-confirm'
  | 'error';
```

---

## 型の移設計画

### 現状の問題

シェーマ機能では、以下の2箇所に型が分散している:

1. **`front_bff_shared/diagnosis/schema-creation/types/`**
   - `schema-creation.api.request.ts` (BFF API リクエスト型)
   - `schema-creation.api.response.ts` (BFF API レスポンス型)

2. **`features/01_diagnosis/01_record-creation/01_schema-creation/types/`**
   - `schema-creation.types.ts` (ViewModel 型)

**この配置は正しい。移設不要。**

### 判断基準: いつ移設が必要か？

以下の場合のみ移設が必要:

| ケース | 移設元 | 移設先 | 理由 |
|--------|--------|--------|------|
| BFF API 型が LV3 にある | `features/{LV3}/types/*.api.*` | `front_bff_shared/` | BFF と共有する必要がある |
| ViewModel 型が `front_bff_shared` にある | `front_bff_shared/` | `features/{LV3}/types/` | 画面固有のロジックは LV3 に置く |
| BFF レスポンス型を UI で直接使っている | `hooks/` / `components/` 内で `*.api.response` をインポート | ViewModel 型を作成して変換 | UI とAPIを分離する |

### 移設手順

#### パターン1: BFF API 型を front_bff_shared に移動

```bash
# 1. front_bff_shared に型定義を作成
mkdir -p product/frontend/src/front_bff_shared/{domain}/{LV3}/types
touch product/frontend/src/front_bff_shared/{domain}/{LV3}/types/{機能名}.api.request.ts
touch product/frontend/src/front_bff_shared/{domain}/{LV3}/types/{機能名}.api.response.ts

# 2. LV3 の型をコピーして移動
# BFF API に関連する型のみを front_bff_shared に移動
# （ViewModel型は残す）

# 3. LV3 の api/ 層のインポートを更新
# 変更前: import { XxxRequest } from '../types/xxx.types';
# 変更後: import { XxxRequest } from '@/front_bff_shared/{domain}/{LV3}/types/xxx.api.request';
```

#### パターン2: ViewModel 型を LV3 に作成

```bash
# 1. LV3 に types/ ディレクトリを作成
mkdir -p product/frontend/src/features/{domain}/{LV2}/{LV3}/types

# 2. ViewModel 型を定義
touch product/frontend/src/features/{domain}/{LV2}/{LV3}/types/{機能名}.types.ts

# 3. BFF レスポンス型から ViewModel 型への変換ロジックを repository/ に実装
# repository/ で BFF レスポンスを受け取り、ViewModel に変換して hooks/ に渡す
```

---

## Phase 1 実装チェックリスト

### S1-1: BE リクエスト型・レスポンス型定義（C#）

- [ ] `backend/Features/{Domain}/Controllers/` に Request / Response クラスを定義
- [ ] BFF が送信するデータ構造に合わせた型定義
- [ ] `[FromHeader]` で受け取るヘッダーを定義（`x-tenant-id`, `x-correlation-id`, `authorization`）

### S1-2: BFF internal 型定義

- [ ] `bff/src/features/{domain}/{機能名}/types/` に `*.api.request.ts` / `*.api.response.ts` を定義
- [ ] FE の `front_bff_shared` と **構造一致** させる（同じ型を二重定義しない）

### S1-3: BFF → FE 共有型定義

- [ ] `front_bff_shared/{domain}/{LV3}/types/` に `*.api.request.ts` / `*.api.response.ts` を作成
- [ ] BFF API の入出力型のみを定義（ViewModel 型は含めない）
- [ ] 既に正しい場所にあれば移設不要

### S1-4: FE ViewModel 型定義

- [ ] `features/{domain}/{LV2}/{LV3}/types/` に `{機能名}.types.ts` を作成
- [ ] 画面固有の UI ロジック・状態管理用の型を定義
- [ ] BFF レスポンス型を直接使わず、必要に応じて変換して使う

### S1-5: Zod スキーマ定義

- [ ] `front_bff_shared/{domain}/{LV3}/schemas/` に `*.schema.ts` を作成
- [ ] BFF リクエスト型のバリデーションスキーマを定義
- [ ] `z.infer<typeof schema>` で型推論が一致することを確認

---

## 型取得の実装例

### API 層での型取得（front_bff_shared から）

```typescript
// product/frontend/src/features/01_diagnosis/01_record-creation/01_schema-creation/api/postSchema.api.ts
import { axiosClient } from '@shared/plugins/axios.client';
import { useMutation } from '@tanstack/react-query';
import type { SchemaSaveRequest } from '@/front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.request';
import type { SchemaSaveResponse } from '@/front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';

export type { SchemaSaveRequest, SchemaSaveResponse };

export const useSaveSchema = () => {
  return useMutation({
    mutationFn: async (request: SchemaSaveRequest) => {
      const response = await axiosClient.post<SchemaSaveResponse>('/schemas', request);
      return response.data;
    },
  });
};
```

### Repository 層での型変換（ViewModel への変換）

```typescript
// product/frontend/src/features/01_diagnosis/01_record-creation/01_schema-creation/repository/schema-creation.repository.ts
import type { TemplatesResponse } from '@/front_bff_shared/diagnosis/schema-creation/types/schema-creation.api.response';
import type { TemplateViewModel } from '../types/schema-creation.types';

export function convertToTemplateViewModels(
  response: TemplatesResponse
): TemplateViewModel[] {
  return response.templates.map((template) => ({
    templateId: template.templateId,
    name: template.name,
    category: template.category,
    svgComponent: template.svgComponent,
    isFavorite: response.favoriteTemplateIds.includes(template.templateId), // ← 変換ロジック
  }));
}
```

### Hooks 層での ViewModel 使用

```typescript
// product/frontend/src/features/01_diagnosis/01_record-creation/01_schema-creation/hooks/useSchemaCreationInit.ts
import type { TemplateViewModel } from '../types/schema-creation.types';

export function useSchemaCreationInit() {
  const [templates, setTemplates] = useState<TemplateViewModel[]>([]);
  
  // repository から ViewModel を受け取る
  // BFF API 型は直接使わない
}
```

---

## まとめ

### 型の配置原則

1. **BFF API 型** → `front_bff_shared/` (BFF と FE で共有)
2. **ViewModel 型** → `features/{LV3}/types/` (画面固有)
3. **BE API 型** → `backend/` (C#)

### 移設が必要なケース

- BFF API 型が LV3 にある → `front_bff_shared` に移動
- ViewModel 型が `front_bff_shared` にある → LV3 に移動
- BFF レスポンス型を UI で直接使っている → ViewModel 型を作成

### シェーマ機能の現状

✅ **移設不要** — 既に正しい配置になっている:
- `front_bff_shared/diagnosis/schema-creation/types/` に BFF API 型
- `features/.../schema-creation/types/` に ViewModel 型

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| `.claude/commands/synchronizer.md` | synchronizer 全体ワークフロー |
| `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/03.TypeScript型管理とスキーマ共有.md` | 型管理の詳細設計 |
| `.claude/rules/cross-layer-rules.md` | 型の整合性チェックルール |

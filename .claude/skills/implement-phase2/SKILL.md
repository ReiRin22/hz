---
name: implement-phase2
description: Phase 2（API・Repository 層）実装 — Axios + React Query パターン。useQuery/useMutation ベースで api/ 層と repository/ 層を実装する
---

# Phase 2: API・Repository 層（Axios + React Query パターン）

**このファイルは `implement-phase2/SKILL.md` の代替実装パターン。**

fetch ベースの SKILL.md に対し、こちらは **Axios + React Query** ベースの実装パターンを定義する。
synchronizer-phase2 で使用しているパターンと同じ構成。

---

## 前提条件

Phase 1（T1-1〜T1-3）が完了していること。

---

## T2-1: api/ 通信関数実装（Axios + React Query パターン）

### 実装パターン

**SKILL.md の fetch パターンの代わりに、以下の Axios + React Query パターンを使用する。**

#### GET リクエストの例

```typescript
// features/{domain}/{LV2}/{LV3}/api/getTemplates.api.ts
import { axiosClient } from '@shared/plugins/axios.client';
import { useQuery } from '@tanstack/react-query';
import { TemplateListResponse } from '@/front_bff_shared/{domain}/{feature}/types/template-list.api.response';

export type { TemplateListResponse };

/**
 * テンプレート一覧取得 Hook
 */
export const useTemplates = () => {
  return useQuery({
    queryKey: ['templates'],
    queryFn: async () => {
      console.log('--- fetch実行: テンプレート一覧を取得します ---');

      const response = await axiosClient.get<TemplateListResponse>('/clinical/templates');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1時間（マスタデータなので長めに設定）
    refetchOnWindowFocus: false,
  });
};
```

#### POST リクエストの例

```typescript
// features/{domain}/{LV2}/{LV3}/api/postSaveSchema.api.ts
import { axiosClient } from '@shared/plugins/axios.client';
import { useMutation } from '@tanstack/react-query';
import { SaveSchemaRequest } from '@/front_bff_shared/{domain}/{feature}/types/save-schema.api.request';
import { SaveSchemaResponse } from '@/front_bff_shared/{domain}/{feature}/types/save-schema.api.response';

export type { SaveSchemaRequest, SaveSchemaResponse };

/**
 * シェーマ保存 Hook
 */
export const useSaveSchema = () => {
  return useMutation({
    mutationFn: async (request: SaveSchemaRequest) => {
      console.log('--- mutation実行: シェーマを保存します ---', request);

      const response = await axiosClient.post<SaveSchemaResponse>('/clinical/schema/save', request);
      return response.data;
    },
  });
};
```

#### パラメータ付き GET の例

```typescript
// features/{domain}/{LV2}/{LV3}/api/getSchemaDetail.api.ts
import { axiosClient } from '@shared/plugins/axios.client';
import { useQuery } from '@tanstack/react-query';
import { SchemaDetailResponse } from '@/front_bff_shared/{domain}/{feature}/types/schema-detail.api.response';

export type { SchemaDetailResponse };

/**
 * シェーマ詳細取得 Hook
 */
export const useSchemaDetail = (schemaUuid: string) => {
  return useQuery({
    queryKey: ['schemaDetail', schemaUuid],
    queryFn: async () => {
      console.log('--- fetch実行: シェーマ詳細を取得します ---', schemaUuid);

      const response = await axiosClient.get<SchemaDetailResponse>(`/clinical/schema/${schemaUuid}`);
      return response.data;
    },
    enabled: !!schemaUuid, // schemaUuid がある場合のみ実行
    staleTime: 0, // トランザクションデータなので短め
  });
};
```

---

## パターンの構成要素

### 1. axiosClient のインポート

```typescript
import { axiosClient } from '@shared/plugins/axios.client';
```

**axiosClient が自動実行する処理**:
- `x-tenant-id` ヘッダーの自動注入
- 認証トークンの自動注入（計画中）
- Base64 難読化（リクエストボディ）

### 2. React Query の使用

```typescript
// GET の場合
import { useQuery } from '@tanstack/react-query';

// POST/PUT/DELETE の場合
import { useMutation } from '@tanstack/react-query';
```

### 3. 型定義のインポート（front_bff_shared から）

```typescript
import { XxxResponse } from '@/front_bff_shared/{domain}/{feature}/types/*.api.response';
import { XxxRequest } from '@/front_bff_shared/{domain}/{feature}/types/*.api.request';
```

### 4. queryKey の設定

```typescript
// パラメータなし
queryKey: ['templates']

// パラメータあり
queryKey: ['schemaDetail', schemaUuid]

// 複数パラメータ
queryKey: ['patientData', patientId, date]
```

**重要**: queryKey は配列形式で一意性を確保する。パラメータがある場合は必ず配列に含める。

### 5. queryFn での axiosClient 呼び出し

```typescript
queryFn: async () => {
  const response = await axiosClient.get<ResponseType>('/endpoint');
  return response.data; // ← response.data を返す（response 全体ではない）
}
```

### 6. staleTime / refetchOnWindowFocus の設定

| データ種別 | staleTime | refetchOnWindowFocus |
|---|---|---|
| マスタデータ | `1000 * 60 * 60`（1時間） | `false` |
| トランザクションデータ | `0` または未設定 | デフォルト（`true`） |

---

## T2-2: repository/ 複合API実装（Axios + React Query パターン）

**SKILL.md では repository/ で複数 API を並列呼び出ししているが、Axios + React Query パターンでは以下のように変わる:**

### パターン1: 複数の useQuery を並列実行

```typescript
// features/{domain}/{LV2}/{LV3}/repository/useSchemaCreationData.ts
import { useTemplates } from '../api/getTemplates.api';
import { useFavorites } from '../api/getFavorites.api';

/**
 * シェーマ作成画面の初期データ取得
 */
export const useSchemaCreationData = () => {
  const templatesQuery = useTemplates();
  const favoritesQuery = useFavorites();

  return {
    templates: templatesQuery.data,
    favorites: favoritesQuery.data,
    isLoading: templatesQuery.isLoading || favoritesQuery.isLoading,
    isError: templatesQuery.isError || favoritesQuery.isError,
    error: templatesQuery.error || favoritesQuery.error,
  };
};
```

**React Query が自動的に並列実行する** — Promise.all は不要。

### パターン2: 保存処理（楽観的更新）

```typescript
// features/{domain}/{LV2}/{LV3}/repository/useSaveSchemaWithFavorite.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useSaveSchema } from '../api/postSaveSchema.api';
import { useToggleFavorite } from '../api/putToggleFavorite.api';

/**
 * シェーマ保存 + お気に入り切り替え
 */
export const useSaveSchemaWithFavorite = () => {
  const queryClient = useQueryClient();
  const saveSchema = useSaveSchema();
  const toggleFavorite = useToggleFavorite();

  return useMutation({
    mutationFn: async (params: { schemaData: SaveSchemaRequest; isFavorite: boolean }) => {
      // 1. シェーマ保存
      const saveResult = await saveSchema.mutateAsync(params.schemaData);

      // 2. お気に入り切り替え（必要な場合）
      if (params.isFavorite) {
        await toggleFavorite.mutateAsync({ templateId: saveResult.templateId });
      }

      return saveResult;
    },
    onSuccess: () => {
      // キャッシュを無効化して再取得
      queryClient.invalidateQueries({ queryKey: ['templates'] });
      queryClient.invalidateQueries({ queryKey: ['favorites'] });
    },
  });
};
```

---

## SKILL.md との違い

| 項目 | SKILL.md（fetch） | SKILL2.md（Axios + React Query） |
|---|---|---|
| **通信ライブラリ** | `fetch` + `cookies()` / `headers()` | `axiosClient` |
| **型定義** | Request/Response を api/ ファイル内で定義 | `front_bff_shared/` から import |
| **ヘッダー注入** | 手動で `x-tenant-id` を付与 | axiosClient が自動注入 |
| **エラーハンドリング** | try-catch で手動処理 | axiosClient interceptor が自動処理 |
| **キャッシュ** | なし（毎回通信） | React Query が自動キャッシュ |
| **並列実行** | `Promise.all` を明示的に記述 | React Query が自動並列実行 |
| **repository/ の役割** | 並列 API 呼び出し + Promise.all | 複数の useQuery/useMutation を組み合わせ |

---

## 実装手順

### ステップ1: API 一覧の洗い出し

**SKILL.md の「実装前の洗い出し」セクションと同じ手順を実行する。**

### ステップ2: api/ ファイル実装

各エンドポイントに対して以下を作成:

1. **GET の場合**: `useXxx.ts` — `useQuery` を返す Hook
2. **POST/PUT/DELETE の場合**: `useXxx.ts` — `useMutation` を返す Hook

### ステップ3: repository/ ファイル実装

複数 API を組み合わせる場合のみ作成:

1. **並列取得**: 複数の `useQuery` を並行実行
2. **連続保存**: `useMutation` の `mutationFn` 内で複数 API を順次実行

---

## チェックリスト

### T2-1: api/ 通信関数実装

- [ ] 全ファイルで `axiosClient` を `@shared/plugins/axios.client` からインポートしている
- [ ] 全ファイルで React Query の `useQuery` または `useMutation` を使用している
- [ ] `queryKey` が一意で、パラメータを含んでいる
- [ ] 型定義を `@/front_bff_shared/` からインポートしている
- [ ] `staleTime` を適切に設定している（マスタ: 1時間、トランザクション: 短め）
- [ ] `response.data` を返している（`response` 全体ではなく）
- [ ] BFF エンドポイント（`/clinical/*`）を呼び出している（BE を直接呼ばない）

### T2-2: repository/ 複合API実装

- [ ] 複数の `useQuery` を並行実行している（Promise.all 不要）
- [ ] `useMutation` の `mutationFn` 内で複数 API を順次実行している
- [ ] `onSuccess` で `queryClient.invalidateQueries` を呼び、キャッシュを無効化している
- [ ] エラーハンドリングは axiosClient に任せている（個別 try-catch は不要）

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| `product/frontend/src/shared/plugins/axios.client.ts` | axiosClient 実体（ヘッダー自動注入の実装） |

---

## いつ SKILL.md と SKILL2.md のどちらを使うか


**今後の実装は SKILL2.md（Axios + React Query）を標準とする。**

---
name: synchronizer-phase2
description: synchronizer Phase 2 実装ガイド。フロントエンド API 層（LV3/api/配下）の axiosClient パターン実装を最優先で行い、その後 BE Controller モック実装に進む。Phase 2 開始時（S2-1）に必ず参照すること。
---

# synchronizer Phase 2 実装ガイド

## Phase 2 の実装順序（重要）

Phase 2 では以下の順序で実装する:

1. **フロントエンド API 層実装** (優先) — `frontend/src/features/{domain}/{LV2}/{LV3}/api/` 配下のすべてのファイル
2. **BE Controller モック実装** — BE が送信するレスポンスに合わせて固定値を返す

**理由**: フロントエンドの API 層が先に実装されていれば、BE Controller の必要なヘッダーとレスポンス形式が明確になる。

---

## ステップ1: フロントエンド API 層実装 (S2-1a)

### 対象ファイル

```
product/frontend/src/features/{domain}/{LV2}/{LV3}/api/
├── getXxx.api.ts           ← GET リクエスト
├── postXxx.api.ts          ← POST リクエスト
├── useXxxData.ts           ← React Query フック
└── ...
```

**実装対象**: これから実装する機能の **LV3 配下の `api/` ディレクトリ内のすべてのファイル**

### 標準パターン: React Query + axiosClient

**例: `useBloodTypeMaster.ts`** (参考実装)

```typescript
import { axiosClient } from '@shared/plugins/axios.client';
import { useQuery } from '@tanstack/react-query';
import { BloodTypeMasterResponse, BloodTypeOption } from '@/front_bff_shared/sample/master/types/blood-type-master.api.response';

// BloodTypeOptionを再エクスポート（既存のコードとの互換性のため）
export type { BloodTypeOption, BloodTypeMasterResponse };

/**
 * 血液型マスタ情報の取得 Hook
 */
export const useBloodTypeMaster = () => {
  return useQuery({
    queryKey: ['bloodTypeMaster'],
    queryFn: async () => {
      console.log('--- fetch実行: 血液型マスタデータを取得します ---');

      const response = await axiosClient.get<BloodTypeMasterResponse>('/clinical/master/blood-type');
      return response.data;
    },
    staleTime: 1000 * 60 * 60, // 1時間（マスタデータなので長めに設定）
    refetchOnWindowFocus: false,
  });
};
```

### パターンの構成要素

1. **axiosClient のインポート**
   ```typescript
   import { axiosClient } from '@shared/plugins/axios.client';
   ```

2. **React Query の使用**
   ```typescript
   import { useQuery } from '@tanstack/react-query';
   ```

3. **型定義のインポート（front_bff_shared から）**
   ```typescript
   import { XxxResponse } from '@/front_bff_shared/{domain}/{feature}/types/*.api.response';
   ```

4. **queryKey の設定**
   - 配列形式で一意性を確保
   - パラメータがある場合は配列に含める: `['bloodTypeMaster', patientId]`

5. **queryFn での axiosClient 呼び出し**
   ```typescript
   const response = await axiosClient.get<ResponseType>('/endpoint');
   return response.data;
   ```

6. **staleTime / refetchOnWindowFocus の設定**
   - マスタデータ: `staleTime: 1000 * 60 * 60`（1時間）
   - トランザクションデータ: `staleTime: 0` または未設定

### POST の例

```typescript
import { axiosClient } from '@shared/plugins/axios.client';
import { useMutation } from '@tanstack/react-query';
import { SaveSchemaRequest } from '@/front_bff_shared/diagnosis/schema/types/save-schema.api.request';
import { SaveSchemaResponse } from '@/front_bff_shared/diagnosis/schema/types/save-schema.api.response';

export const useSaveSchema = () => {
  return useMutation({
    mutationFn: async (request: SaveSchemaRequest) => {
      const response = await axiosClient.post<SaveSchemaResponse>('/clinical/schema/save', request);
      return response.data;
    },
  });
};
```

### axiosClient が自動実行する処理

`product/frontend/src/shared/plugins/axios.client.ts` は以下を自動処理する:

| 処理 | 内容 |
|------|------|
| **Tenant ID 注入** | `x-tenant-id: 'tenant_a'` ヘッダーを全リクエストに追加 |
| **認証トークン注入** (計画中) | `Authorization: Bearer {token}` ヘッダーを追加 |
| **Base64 難読化** | リクエストボディを `{ payload: "base64", _obfuscated: true }` に変換 |

**実装者は axiosClient を呼ぶだけで、これらの処理は自動実行される。**

---

## ステップ2: BE Controller モック実装 (S2-1b)

フロントエンド API 層が完成したら、BE Controller を実装する。

### 必須: ヘッダー受け取り

**全エンドポイントに以下の `[FromHeader]` 属性を追加する:**

```csharp
using Microsoft.AspNetCore.Mvc;

namespace Backend.Features.Clinical.Controllers
{
    [ApiController]
    [Route("api/clinical")]
    public class ClinicalController : ControllerBase
    {
        [HttpGet("master/blood-type")]
        public IActionResult GetBloodTypeMaster(
            [FromHeader(Name = "x-tenant-id")] string tenantId,           // 必須
            [FromHeader(Name = "x-correlation-id")] string correlationId, // 必須
            [FromHeader(Name = "authorization")] string? authorization    // オプション (認証実装後は必須)
        )
        {
            // モック実装: 固定値を返す
            var response = new BloodTypeMasterResponse
            {
                Options = new List<BloodTypeOption>
                {
                    new BloodTypeOption { Code = "A", Label = "A型" },
                    new BloodTypeOption { Code = "B", Label = "B型" },
                    new BloodTypeOption { Code = "O", Label = "O型" },
                    new BloodTypeOption { Code = "AB", Label = "AB型" }
                }
            };
            
            return Ok(response);
        }
        
        [HttpPost("schema/save")]
        public IActionResult SaveSchema(
            [FromBody] SaveSchemaRequest request,
            [FromHeader(Name = "x-tenant-id")] string tenantId,
            [FromHeader(Name = "x-correlation-id")] string correlationId,
            [FromHeader(Name = "authorization")] string? authorization
        )
        {
            // モック実装
            var response = new SaveSchemaResponse
            {
                SchemaUuid = Guid.NewGuid().ToString(),
                Success = true
            };
            
            return Ok(response);
        }
    }
}
```

### ヘッダーの用途

| ヘッダー | BE での使用目的 |
|---------|---------------|
| `x-tenant-id` | マルチテナント識別（DB スキーマ切り替え・テナント分離） |
| `x-correlation-id` | 分散トレーシング（ログ追跡・デバッグ） |
| `authorization` | JWT 認証（ユーザー識別・権限チェック） |

**Phase 2 (モック実装) では、これらのヘッダーを受け取るだけで、実際の処理は不要。**

固定値を返す実装に徹する。

---

## チェックリスト (Phase 2)

### S2-1a: フロントエンド API 層実装（優先）

- [ ] 対象機能の `features/{domain}/{LV2}/{LV3}/api/` 配下のすべてのファイルを特定している
- [ ] 全ファイルで `axiosClient` を `@shared/plugins/axios.client` からインポートしている
- [ ] 全ファイルで React Query の `useQuery` または `useMutation` を使用している
- [ ] `queryKey` が一意で、パラメータを含んでいる
- [ ] 型定義を `@/front_bff_shared/` からインポートしている
- [ ] `staleTime` を適切に設定している（マスタ: 1時間、トランザクション: 短め）
- [ ] `response.data` を返している（`response` 全体ではなく）

### S2-1b: BE Controller モック実装

- [ ] 全エンドポイントに `[FromHeader(Name = "x-tenant-id")]` を追加している
- [ ] 全エンドポイントに `[FromHeader(Name = "x-correlation-id")]` を追加している
- [ ] 全エンドポイントに `[FromHeader(Name = "authorization")]` を追加している (オプション)
- [ ] ヘッダーパラメータを受け取っているが、Phase 2 ではヘッダー値を使用していない (固定値を返すのみ)
- [ ] リクエスト型とレスポンス型が設計書と一致している

### S2-2: Program.cs へのルーティング登録確認

- [ ] `app.MapControllers()` が呼ばれている
- [ ] Controller が正しくルーティングに登録されている

### S2-3: Swagger 定義確認

- [ ] Swagger UI で全エンドポイントが表示される
- [ ] ヘッダーパラメータが Swagger 定義に含まれている

---

## 実装の流れ（まとめ）

```
Phase 2 開始
  ↓
S2-1a: フロントエンド API 層実装
  - LV3/api/ 配下のすべてのファイルに axiosClient パターンを実装
  - useQuery / useMutation + axiosClient.get/post
  - front_bff_shared の型を使用
  ↓
S2-1b: BE Controller モック実装
  - [FromHeader] でヘッダー受け取り
  - 固定値を返す
  ↓
S2-2: Program.cs ルーティング確認
  ↓
S2-3: Swagger 定義確認
  ↓
Phase 2 完了
```

---

## 参照ファイル

| ファイル | 内容 |
|---------|------|
| `product/frontend/src/shared/plugins/axios.client.ts` | axiosClient 実体 (ヘッダー自動注入の実装) |
| `product/frontend/src/shared/sample/api/useBloodTypeMaster.ts` | React Query + axiosClient パターン実装例（GET） |
| `.claude/commands/synchronizer.md` | synchronizer 全体ワークフロー |
| `.claude/rules/cross-layer-rules.md` | 3層横断の禁止事項 |
| `docs/02_アプリ基盤/01_フロントエンド/02_詳細設計書/new/10.BFF設計.md` | BFF レイヤー定義 |

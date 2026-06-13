---
name: app-bff-fetch-impl
description: BFF fetch を含む実装（Server Component の page.tsx・Client Component の fetch 呼び出し）時に必ず適用すること。TRIGGER when: BFF fetch 実装・BFF コントローラー/サービス実装・実装計画立案時（app-impl-planner サブエージェント呼び出し前）。DO NOT TRIGGER when: フロントエンドのみの UI 実装、テスト実行のみ。
---

# BFF fetch 実装チェックリスト

BFF への fetch を実装する際は、**環境変数の使い分け**と**エラーハンドリング**の両方を必ず実装すること。
未実装のまま実装を完了すると、セキュリティリスク・ランタイム障害が発生する（実績あり：BFF-REC001 で3件発生）。

---

## チェックリスト

### 1. 環境変数の使い分け

| 場所 | 使用する環境変数 | 理由 |
|---|---|---|
| Server Component（`page.tsx` 等） | `BFF_BASE_URL` | サーバー専用。`NEXT_PUBLIC_` を使うと URL がクライアントバンドルに露出する |
| Client Component（Feature コンポーネント等） | `NEXT_PUBLIC_BFF_BASE_URL` | ブラウザから呼び出すため公開が必要 |

```typescript
// Server Component
const BFF_BASE_URL = process.env.BFF_BASE_URL ?? "http://localhost:3001";

// Client Component
const BFF_BASE_URL = process.env.NEXT_PUBLIC_BFF_BASE_URL ?? "http://localhost:3001";
```

### 2. Server Component のエラーハンドリング

`res.ok` を必ずチェックすること。未チェックのまま `.json()` を呼ぶと、BFF が 4xx/5xx を返した場合に予期しない例外が発生する。

```typescript
// NG: res.ok チェックなし
const res = await fetch(`${BFF_BASE_URL}/api/...`, { cache: "no-store" });
const data = (await res.json()) as SomeResponse;

// OK: res.ok チェックあり
const res = await fetch(`${BFF_BASE_URL}/api/...`, { cache: "no-store" });
if (!res.ok) {
  throw new Error(`BFF fetch failed: ${res.status}`);
}
const data = (await res.json()) as SomeResponse;
```

複数の fetch を `Promise.all` でまとめる場合：

```typescript
const [aRes, bRes] = await Promise.all([
  fetch(`${BFF_BASE_URL}/api/a`, { cache: "no-store" }),
  fetch(`${BFF_BASE_URL}/api/b`, { cache: "no-store" }),
]);
if (!aRes.ok || !bRes.ok) {
  throw new Error(`BFF fetch failed: a=${aRes.status} b=${bRes.status}`);
}
```

### 3. Client Component のエラーハンドリング

fetch を `try-catch` でラップし、ユーザーへのフィードバックを実装すること。

```typescript
// NG: try-catch なし
const handleSave = async () => {
  await fetch(`${BFF_BASE_URL}/api/...`, { method: "POST", ... });
};

// OK: try-catch あり
const handleSave = async () => {
  try {
    const res = await fetch(`${BFF_BASE_URL}/api/...`, { method: "POST", ... });
    if (!res.ok) throw new Error(`BFF error: ${res.status}`);
  } catch (e) {
    // TODO: エラートースト等でユーザーに通知する
    console.error("保存の BFF 送信に失敗しました", e);
  }
};
```

### 4. BFF コントローラーのクエリパラメータバリデーション

`@Query()` で enum を受け取るエンドポイントには **`ParseEnumPipe` + `DefaultValuePipe` を必須**とする。

```typescript
// NG: バリデーションなし
@Get()
async getList(@Query("orderType") orderType: OrderType) { ... }

// OK: ParseEnumPipe + DefaultValuePipe
@Get()
async getList(
  @Query("orderType", new DefaultValuePipe(OrderType.PRESCRIPTION), new ParseEnumPipe(OrderType))
  orderType: OrderType,
) { ... }
```

手動 `includes` チェックも禁止。`ParseEnumPipe` で宣言的バリデーションに統一する。

### 5. モックデータへの TODO コメント

モジュールスコープに定義したモック配列・定数には**必ず TODO コメント**を付与すること。

```typescript
// NG: コメントなし
const MOCK_MEMOS = [...];

// OK: TODO コメントあり
// TODO: 将来的に BFF API から取得する（現在はモックデータ）
const MOCK_MEMOS = [...];
```

モックデータを破壊的変更（`.push()` 等）するコードも禁止。

### 6. Upstream型の配置

バックエンドAPIの生レスポンス型（`Upstream*`）は **`*.clients.ts` 内に直接定義しない**。
必ず `bff/src/features/<feature>/types/<feature>.type.ts` に定義すること。

```typescript
// NG: clients.ts 内に直接定義
// staff.clients.ts
type UpstreamStaffMember = { ... }; // ← 禁止

// OK: type.ts に分離
// staff.type.ts
export type UpstreamStaffMember = { ... };

// staff.clients.ts
import type { UpstreamStaffMember } from "./staff.type";
```

`*.services.ts` から `*.clients.ts` に型インポートが発生していたら配置ミスのサイン。

### 7. Zod バリデーションの粒度

形式が決まっている文字列フィールドには `.min(1)` だけでなく **`.regex()` または `.datetime()` を追加**すること。

| フィールド種別 | 追加すべき Zod バリデーション |
|---|---|
| 日付（YYYY-MM-DD） | `.regex(/^\d{4}-\d{2}-\d{2}$/)` または `.date()` |
| 日時（ISO 8601） | `.datetime()` |
| コード値（英数字固定長等） | `.regex(/^[A-Z0-9]{3,10}$/)` 等、仕様に合わせる |
| UUID | `.uuid()` |

```typescript
// NG: 文字列チェックのみ
recordDate: z.string().min(1),

// OK: 形式チェックまで実施
recordDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
```

---

## 実装前の確認手順

```
BFF fetch を含むコードを書く前に
  → ① Server Component か Client Component かを確認
  → ② 対応する環境変数（BFF_BASE_URL / NEXT_PUBLIC_BFF_BASE_URL）を使っているか確認
  → ③ res.ok チェック（Server）または try-catch（Client）が実装されているか確認
  → ④ @Query() で enum を受け取る場合は ParseEnumPipe + DefaultValuePipe を付けているか確認
  → ⑤ モックデータには TODO コメントが付いているか確認
  → ⑥ Upstream* 型は *.type.ts に定義しているか確認（clients.ts 内への直接定義なし）
  → ⑦ 日付・コード値・UUID フィールドに .regex() / .datetime() / .uuid() を追加しているか確認
```

---

## 参照

- `.claude/review-missing-perspectives.md` — カテゴリ 2・3・4・6（発生した問題の詳細）

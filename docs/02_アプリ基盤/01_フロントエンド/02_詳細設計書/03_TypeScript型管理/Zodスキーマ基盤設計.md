# Zodスキーマ基盤設計

| 関連設計書 | リンク |
|---|---|
| TypeScript型管理規約 | [TypeScript型管理規約.md](./TypeScript型管理規約.md) §2（基盤I/F利用規約） |
| BFFバリデーション基盤設計 | [BFFバリデーション基盤設計.md](./BFFバリデーション基盤設計.md) |

> 根拠: [ADR-1](adr/contract-first-design.md)

---

## 1. Zodスキーマの定義仕様

### 1-1. 基本定義パターン

**インポートパス**: `from 'zod'`

**ファイル配置**: `front_bff_shared/features/{LV1}/{LV2}/{LV3}/schemas/{機能名}.schema.ts`

```typescript
import { z } from 'zod';
import { messages } from '@/front_bff_shared/i18n';

// プリミティブ型の検証
export const userUpdateSchema = z.object({
  name: z.string()
    .min(2, messages.validation.nameMinLength)
    .max(10, messages.validation.nameMaxLength),

  email: z.string()
    .email(messages.validation.emailInvalid),

  age: z.number()
    .int()
    .min(0)
    .max(150)
    .optional(),
});

// 型推論（手書き型定義は不要）
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;
```

**JSDoc**:
```typescript
/**
 * ユーザー情報更新スキーマ。
 *
 * @remarks
 * フロントエンド（zodResolver）とBFF（.parse()）の両方から参照する。
 * エラーメッセージは i18n/validation.json から参照すること。
 */
export const userUpdateSchema = z.object({ /* ... */ });
```

### 1-2. オブジェクトと配列の定義

```typescript
import { z } from 'zod';
import { addressSchema } from '@/front_bff_shared/features/shared/schemas/address.schema';

export const patientUpdateSchema = z.object({
  address: addressSchema,                          // 共通スキーマを再利用

  allergies: z.array(
    z.string().min(1)
  ).optional(),

  medications: z.array(
    z.object({
      name: z.string().min(1),
      dosage: z.string().min(1),
    })
  ).optional(),
});

export type PatientUpdateInput = z.infer<typeof patientUpdateSchema>;
```

### 1-3. 共通スキーマ（shared/schemas/）の定義

**ファイル配置**: `front_bff_shared/features/shared/schemas/{項目名}.schema.ts`

```typescript
// address.schema.ts
import { z } from 'zod';
import { messages } from '@/front_bff_shared/i18n';

export const addressSchema = z.object({
  postalCode: z.string().regex(/^\d{7}$/, messages.validation.postalCodeFormat),
  prefecture: z.string().min(1, messages.validation.prefectureRequired),
  city: z.string().min(1, messages.validation.cityRequired),
});
```

---

## 2. フロントエンドでのスキーマ活用（zodResolver 連携）

### 2-1. zodResolverの利用

[TypeScript型管理規約.md §2](./TypeScript型管理規約.md#2-基盤-if-利用規約) の通り、フロントエンドでの Zod スキーマ利用は `zodResolver` 経由とする。

**インポートパス**:
```typescript
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { userUpdateSchema, UserUpdateInput } from '@/front_bff_shared/features/user/profile/update/schemas/userUpdate.schema';
```

**基本実装パターン**:
```tsx
const {
  register,
  handleSubmit,
  formState: { errors, isValid }
} = useForm<UserUpdateInput>({
  resolver: zodResolver(userUpdateSchema),
  // mode のデフォルト: 'onBlur'（フォーカスアウト時） + 'onSubmit'（送信時）
});
```

### 2-2. バリデーション実行タイミング

| モード | 用途 |
|---|---|
| `mode: 'onBlur'`（標準） | フォーカスアウト時に検証（項目から離れた際のフィードバック） |
| `mode: 'onSubmit'`（標準） | 送信ボタン押下時に検証（最終確認） |
| `mode: 'onChange'` | リアルタイムバリデーションが必要な場合（パスワード強度表示等）に明示指定 |

### 2-3. エラー表示パターン

```tsx
{errors.name && (
  <p className="text-red-500 text-sm">{errors.name.message}</p>
)}
```

### 2-4. 送信制御パターン

```tsx
const { formState: { isValid } } = useForm<UserUpdateInput>({ /*...*/ });

<button
  type="submit"
  disabled={!isValid}
  className={isValid ? "bg-blue-500 text-white p-2" : "bg-gray-300 p-2"}
>
  更新
</button>
```

### 2-5. バリデーション成功・失敗の動作仕様

| 状態 | 動作 |
|---|---|
| バリデーション成功 | `handleSubmit` が `onSubmit` を呼び出し、BFFへリクエストを送信する |
| バリデーション失敗 | `handleSubmit` は `onSubmit` を呼び出さず、`errors` にエラー情報が格納される |

---

## 3. 入力相関バリデーション仕様

### 3-1. `.refine()` と `.superRefine()` の使い分け

| | `.refine()` | `.superRefine()` |
|---|---|---|
| エラー追加数 | 1件 | 複数件 |
| エラーパス指定 | `path` オプション（明示的に指定） | `ctx.addIssue()` で動的指定 |
| スキーマチェーン | 可能（連続呼び出しで複数条件を検証） | 複数フィールド依存の単一チェックに適する |
| 使う場面 | 単純な比較・単一条件・形式チェック | 複数条件分岐・複数フィールド依存の複合判定 |

入力相関バリデーションには原則 `.superRefine()` を使う。`.refine()` を複数チェーンする場合は short-circuit 動作に注意し、複数エラーを同時表示する場合は各チェックを別々の `.superRefine()` で実装すること。

> 根拠: [ADR-1](adr/contract-first-design.md)

### 3-2. パターン別実装仕様

#### パターン1: 条件付き必須

```typescript
import { messages } from '@/front_bff_shared/i18n';

/**
 * 条件付き必須バリデーションスキーマ。
 *
 * @remarks
 * category が 'other' の場合、description は必須となる。
 *
 * @throws {ZodError} バリデーション失敗時（.parse() 呼び出し時）
 */
export const conditionalRequiredSchema = z
  .object({
    category: z.string().min(1, messages.validation.categoryRequired),
    description: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.category === 'other' && (!data.description || data.description.trim() === '')) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.validation.descriptionRequiredWhenOther,
        path: ['description'],
      });
    }
  });
```

#### パターン2: フィールド間比較

```typescript
import { messages } from '@/front_bff_shared/i18n';

/**
 * 日付範囲バリデーションスキーマ。
 *
 * @remarks
 * endDate は startDate より後の日付でなければならない。
 * 日付文字列の形式は ISO 8601 (YYYY-MM-DD) を想定する。
 *
 * @throws {ZodError} バリデーション失敗時（.parse() 呼び出し時）
 */
export const dateRangeSchema = z
  .object({
    startDate: z.string().min(1, messages.validation.startDateRequired),
    endDate: z.string().min(1, messages.validation.endDateRequired),
  })
  .superRefine((data, ctx) => {
    const start = new Date(data.startDate);
    const end = new Date(data.endDate);
    if (!isNaN(start.getTime()) && !isNaN(end.getTime()) && start >= end) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: messages.validation.endDateAfterStartDate,
        path: ['endDate'],
      });
    }
  });
```

#### パターン3: 複合バリデーション（ファイル）

```typescript
import { messages } from '@/front_bff_shared/i18n';

/**
 * ファイルアップロードバリデーションスキーマ。
 *
 * @remarks
 * 許可形式: JPEG / PNG / PDF。最大サイズ: 5MB。
 *
 * @throws {ZodError} バリデーション失敗時（.parse() 呼び出し時）
 */
export const uploadFileSchema = z
  .custom<File>(
    (file) => file instanceof File,
    { message: messages.validation.fileRequired }
  )
  .refine(
    (f) => ['image/jpeg', 'image/png', 'application/pdf'].includes(f.type),
    { message: messages.validation.fileFormatInvalid }
  )
  .refine(
    (f) => f.size <= 5 * 1024 * 1024,
    { message: messages.validation.fileSizeExceeded }
  );
```

### 3-3. Zodスコープ外の相関制御

以下はZodスキーマではなく、各実装層で制御する。

| 制御内容 | 実装層 |
|---|---|
| フィールドの活性/非活性切替 | UIコンポーネント（`disabled` prop） |
| ロール別フィールド制御 | UIコンポーネント（条件付きレンダリング） |
| 状態遷移による一括制御 | Zustand store 連携 |
| 手描き・描画内容チェック | `onSubmit` ハンドラ |
| ユーザー操作の確認ダイアログ | イベントハンドラ |

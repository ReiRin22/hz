# BFFバリデーション基盤設計

| 関連設計書 | リンク |
|---|---|
| TypeScript型管理規約 | [TypeScript型管理規約.md](./TypeScript型管理規約.md) §2（基盤I/F利用規約） |
| Zodスキーマ基盤設計 | [Zodスキーマ基盤設計.md](./Zodスキーマ基盤設計.md) |
| エラーレスポンス仕様 | [09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md](../09_監視エラーハンドリング設計/BFFエラーレスポンス設計.md) |

> 根拠: [ADR-1](adr/contract-first-design.md)

---

## 1. コントローラー単位でのスキーマ適用

[TypeScript型管理規約.md §2](./TypeScript型管理規約.md#2-基盤-if-利用規約) の通り、BFF でのバリデーションはコントローラー単位で `schema.parse()` を使って実施する。

> 根拠: [ADR-1](adr/contract-first-design.md)

**インポートパス**:
```typescript
import { userUpdateSchema, UserUpdateInput } from '@/front_bff_shared/features/user/profile/update/schemas/userUpdate.schema';
```

**ファイル配置例**: `bff/src/features/user/profile/update/userUpdate.controller.ts`

```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { userUpdateSchema, UserUpdateInput } from '@/front_bff_shared/features/user/profile/update/schemas/userUpdate.schema';

@Controller('users')
export class UserUpdateController {
  @Post('update')
  /**
   * ユーザー情報を更新する。
   *
   * @param body - リクエストボディ（unknown 型で受け取り、スキーマで検証する）
   * @throws {ZodError} body のバリデーション失敗時。ZodExceptionFilter が捕捉するためコントローラー内では catch しないこと。
   */
  async updateUser(@Body() body: unknown) {
    const validatedData: UserUpdateInput = userUpdateSchema.parse(body);
    // 以降、validatedData は型保証されている
    // return this.userService.update(validatedData);
  }
}
```

### 1-1. `.parse()` の動作仕様

| 結果 | 動作 |
|---|---|
| バリデーション成功 | 型保証されたデータを返却 |
| バリデーション失敗 | `ZodError` を throw |

`ZodError` は `ZodExceptionFilter` が自動的に捕捉し、HTTP 400 レスポンスに変換する（§2 参照）。

---

## 2. ZodExceptionFilter 公開 I/F

**ファイル**: `bff/src/shared/filters/zod-exception.filter.ts`

**役割**: NestJS に登録済みの Exception Filter。`ZodError` を捕捉し、プロジェクト標準の統一エラーレスポンス形式（HTTP 400）に変換する。アプリ実装者はこのフィルターを直接 instantiate する必要はないが、**エラーレスポンスのフィールド構造**を UI 実装に使う。

**エラーレスポンス構造**:

```typescript
{
  title: string;       // 例: '不正なリクエストです。'
  status: 400;
  detail: string;      // 例: '入力内容に不備があります。各項目の詳細を確認してください。'
  instance: string;    // リクエストパス（例: '/clinical/entry/vital-info'）
  errors: Array<{
    field: string;     // フィールドパス（例: 'address.postalCode'）
    code: 'REQUIRED' | 'INVALID_FORMAT' | 'INVALID_TYPE';
    message: string;   // Zodスキーマで定義したカスタムメッセージ
  }>;
  traceId: string;     // リクエストID（UUID）
}
```

**Zod 内部コード → プロジェクト標準コードへの変換ルール**:

| Zod issue.code | issue.received | プロジェクトコード |
|---|---|---|
| `invalid_type` | `undefined` または `null` | `REQUIRED` |
| `invalid_type` | 上記以外 | `INVALID_TYPE` |
| `too_small`, `too_big`, `invalid_string`, `invalid_enum_value`, `custom` 等 | — | `INVALID_FORMAT` |

**実装参照**（方針説明用抜粋）:

```typescript
import { ExceptionFilter, Catch, ArgumentsHost, HttpStatus } from '@nestjs/common';
import type { Request, Response } from 'express';
import { ZodError, ZodIssue } from 'zod';

function mapZodCodeToProjectCode(issue: ZodIssue): 'REQUIRED' | 'INVALID_FORMAT' | 'INVALID_TYPE' {
  if (issue.code === 'invalid_type') {
    return issue.received === 'undefined' || issue.received === 'null' ? 'REQUIRED' : 'INVALID_TYPE';
  }
  return 'INVALID_FORMAT';
}

@Catch(ZodError)
export class ZodExceptionFilter implements ExceptionFilter {
  /**
   * ZodError を捕捉し、HTTP 400 レスポンスに変換する。
   *
   * @param exception - Zod がスローした ZodError
   * @param host - NestJS の ArgumentsHost
   * @remarks
   * アプリ実装者がこのフィルターを直接 instantiate する必要はない。
   * NestJS に登録済みのため、コントローラーで ZodError がスローされると自動的に呼び出される。
   */
  catch(exception: ZodError, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();

    const errors = exception.issues.map((issue) => ({
      field: issue.path.map((p) => String(p)).join('.'),
      code: mapZodCodeToProjectCode(issue),
      message: issue.message,
    }));

    response.status(HttpStatus.BAD_REQUEST).json({
      title: '不正なリクエストです。',
      status: 400,
      detail: '入力内容に不備があります。各項目の詳細を確認してください。',
      instance: request.url,
      errors,
      traceId: getTraceId(request),
    });
  }
}
```

> `getTraceId(request)` は BFF 側のリクエストIDミドルウェアで採番された UUID を取得する共通ユーティリティ。

---

## 3. コントローラー単位の検証

本プロジェクトでは**コントローラー単位での検証**を標準パターンとする。

> 根拠: [ADR-1](adr/contract-first-design.md)

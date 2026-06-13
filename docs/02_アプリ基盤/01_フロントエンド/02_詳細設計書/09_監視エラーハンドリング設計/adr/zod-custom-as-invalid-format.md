# ADR-5: Zod の `custom`（superRefine）を `INVALID_FORMAT` 固定にマッピングする

* **ステータス**: Accepted
* **決定日**: 2026-05-22
* **関連設計書**: [BFFエラーレスポンス設計.md](../BFFエラーレスポンス設計.md) §5
* **関連 ADR**: なし

## 背景

BFF の `ZodExceptionFilter` が Zod の `ZodIssue.code` をプロジェクト標準コード（`REQUIRED` / `INVALID_FORMAT` / `INVALID_TYPE`）に変換する。
`invalid_type` / `too_small` / `too_big` / `invalid_string` 等は変換ルールが直感的に決まる一方、`custom`（`superRefine` 由来）は単一フィールドではなく **複数フィールドにまたがる業務ルール検証** を表現するためのコードで、プロジェクト標準コードのいずれにマッピングすべきかが自明でない。

## 検討した選択肢

### 案A: `custom` 専用のプロジェクトコード（例: `BUSINESS_RULE_VIOLATION`）を新設
* **メリット**: フロント側で「単一フィールド形式違反」と「複数フィールド業務ルール違反」を区別して UI 制御できる
* **デメリット**: フロントの分岐が増える。`errors[].message` を表示する以外に区別の実用価値が薄い

### 案B: `INVALID_FORMAT` 固定にマッピング
* **メリット**: フロントの分岐を増やさない。`errors[].message` をそのまま表示すれば十分
* **デメリット**: 厳密には「形式違反」ではなく「業務ルール上の組み合わせ違反」だが、フロントの責務範囲では区別不要

### 案C: `superRefine` の path から自動判定（フィールドが1つなら `INVALID_FORMAT`、複数なら新コード）
* **メリット**: 案A と案B の中間。実態に応じて分かれる
* **デメリット**: 自動判定ロジックが脆い。`superRefine` の path 設計次第で結果が変わる

## 決定

**案B を採用する**。

* `custom`（`superRefine` 由来）は無条件で `INVALID_FORMAT` にマッピングする
* フロントエンドは `errors[].message` をそのままフィールドのエラー表示として使う
* もし将来「単一フィールド形式違反」と「複数フィールド業務ルール違反」を UI で区別する必要が出た場合は、機能固有の業務エラーコード（例: `ORDER_ALREADY_CONFIRMED`）として個別機能設計書で定義する（[BFFエラーレスポンス設計.md](../BFFエラーレスポンス設計.md) §3 のコード拡張ルール）

## 影響

### 正の影響
* フロントの UI 分岐がシンプル
* バリデーションロジックの記述自由度が上がる（`superRefine` を気軽に使える）

### 負の影響
* 厳密な意味では「形式違反」ではないものを `INVALID_FORMAT` で表現することになる
* GlitchTip 送信対象外判定（[ADR-4](exclude-business-errors.md)）の対象に `INVALID_FORMAT` が含まれるため、`superRefine` 由来の業務ルール違反も GlitchTip に送信されない（これは意図通りの動作）

### 見直しトリガー
* `superRefine` 由来エラーが事業上「障害として検知すべき」と判断された場合（業務エラー判定から除外する別コード化が必要）

## 参考

* Zod 公式: superRefine — https://zod.dev/?id=superrefine

# ADR-2: Error Boundary はグローバル一段に集約する

* **ステータス**: Accepted
* **決定日**: 2026-05-22
* **関連設計書**: [エラー処理基盤設計.md](../エラー処理基盤設計.md) §4
* **関連 ADR**: なし

## 背景

React の Error Boundary は階層的に配置でき、機能群単位・コンポーネント単位で多段に構成すると影響範囲を局所化できる。
一方で、本プロジェクトは「業務システムで予期しない React エラーが出る時点で、システムが正常に動作していない状態」と扱う方針で、ランタイムエラー発生時に画面の一部だけ生かして操作継続させる積極的価値が薄い。
階層的 Error Boundary を採用すると、設計・実装・テストが複雑になり、各境界での GlitchTip 送信ロジック・UI 仕様の重複も発生する。

## 検討した選択肢

### 案A: 階層的 Error Boundary（機能群・コンポーネント単位）
* **メリット**: エラー発生時に影響範囲を局所化できる。一部画面だけエラー表示し、他の領域は操作継続できる
* **デメリット**: 各境界の責務分担・GlitchTip 送信ロジック・UI 仕様の重複設計が必要。テストケースが boundary の数だけ増える

### 案B: グローバル Error Boundary 一段（`app/error.tsx` のみ）＋オプトインの `ErrorGuard`
* **メリット**: 設計・実装・テストがシンプル。既定では画面全体エラー表示で十分（業務上問題なし、頻度も低い）。`ErrorGuard` を任意配置することで局所吸収も可能
* **デメリット**: 既定では画面全体がエラー UI に切り替わるため、UX 上は劣る

## 決定

**案B を採用する**。

* グローバル `app/error.tsx` をフロントエンドの最終防波堤とする
* コンポーネント単位の `ErrorGuard`（`react-error-boundary` ベース）を Atoms として提供し、Organism / Page 単位での局所吸収はアプリチームの判断でオプトインする
* 既定では `ErrorGuard` を配置しない（グローバル `error.tsx` で受ける）

## 影響

### 正の影響
* 設計・実装・テスト工数が大幅に削減される
* ランタイムエラー発生時の挙動が一貫する（基本は全画面エラー表示）
* GlitchTip 送信ロジックを 1 箇所（`error.tsx` の `useEffect`）に集約できる

### 負の影響
* ランタイムエラー発生時に画面全体がエラー UI に切り替わる
* 局所吸収が必要な箇所はアプリチームが個別に `ErrorGuard` を配置する判断が必要

### 見直しトリガー
* ランタイムエラーの発生頻度が想定を大きく上回り、UX 影響が顕在化した場合
* 特定機能（例: ダッシュボードのウィジェット）で局所吸収が常時必要になった場合は、その機能限定で階層化を検討する

## 参考

* React 公式: Error Boundaries — https://react.dev/reference/react/Component#catching-rendering-errors-with-an-error-boundary
* Next.js: error.tsx — https://nextjs.org/docs/app/api-reference/file-conventions/error
* `react-error-boundary` — https://github.com/bvaughn/react-error-boundary

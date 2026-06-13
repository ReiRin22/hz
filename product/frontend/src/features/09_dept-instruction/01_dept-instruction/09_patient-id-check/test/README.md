# DEP009 患者取り違い防止チェック

医療スタッフが処置・投薬前に患者・物品・実施者の3点を照合するチェック画面。

## ルートパス

```
/dept-instruction/patient-id-check/DEP009?orderId={orderId}
```

> 旧パス `/dev/dept-instruction/dept-instruction/patient-id-check/DEP009` は廃止済み（2026-05 ディレクトリ統合）。

## 機能概要

- 患者確認・物品確認・実施者確認の3セクション
- バーコードスキャンによる順不同連続照合
- 実施者 ID 手入力（半角英数字バリデーション、エラーコード E001）
- 全セクション確認済みになると「チェック実施」ボタンが有効化
- キャンセルフロー（確認ダイアログ付き）

## テスト実行

```bash
# Vitest（ユニット + Storybook テスト）
cd product/frontend
npx vitest run src/features/09_dept-instruction/01_dept-instruction/09_patient-id-check

# E2E（開発サーバー起動後）
cd product/frontend && npm run dev &
bash .claude/scripts/server-test.sh DEP009

# Storybook ビルド確認
npm run storybook:build
```

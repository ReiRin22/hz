# DEP002 臨床検査科指示受け

臨床検査技師向けの指示受け画面。検体検査・生理検査・病理検査・細菌検査の4オーダー種を管理する。

## ルートパス

```
/dept-instruction/lab-instruction/DEP002
```

> 旧パス `/dev/dept-instruction/dept-instruction/lab-instruction/DEP002` は廃止済み（2026-05 ディレクトリ統合）。

## 機能概要

- オーダー一覧表示（日付・患者・病棟・担当医によるフィルタリング）
- ステータス遷移（受付済 → 開始済 → 採取済 → 検体受領済 → 実施済 → 結果入力済）
- 3点チェック（患者 × 検体 × 実施者の照合）
- ラベル印刷・帳票発行
- 実施者登録
- ORD076 連携（楽観的更新・確定キャンセルフロー）
- 医事会計連携（検体受領済・結果入力済トリガー）

## ORD076 連携（検体検査オーダー確定との接続）

ORD076（検体検査オーダー確定）が確定操作を行うと、DEP002 の OrderTable に以下のフィールドが追加表示される。

| フィールド | 説明 |
|---|---|
| `implementedAt` | 実施日時 |
| `implementedBy` | 実施者名 |
| `implementationNotes` | 実施備考 |

楽観的更新フローにより、BFF レスポンスを受信する前に UI 上のステータスが先行更新される。失敗時は自動ロールバックされる。

## コンポーネント構成

### Organisms（`_shared/components/organisms/`）

| コンポーネント | 責務 |
|---|---|
| `DeptInstructionScreen` | 部門指示受け共通画面骨格（config 駆動） |

### Molecules（`_shared/components/molecules/`）

| コンポーネント | 責務 |
|---|---|
| `OrderTable` | オーダー一覧テーブル（ステータス別ボタン表示） |
| `SearchCriteria` | 検索条件パネル（折りたたみ対応） |
| `ThreePointCheckModal` | 3点チェックダイアログ（W2） |
| `ImplementerInputDialog` | 実施者入力ダイアログ（W3） |
| `PrintDialog` | ラベル印刷・帳票発行ダイアログ |
| `PrescriptionDialog` | 処方詳細ダイアログ |
| `MedicationInfoDialog` | 薬剤情報ダイアログ |
| `AllergyDetailDialog` | アレルギー詳細ダイアログ |
| `ResultInputDialog` | 結果入力リンクダイアログ |
| `MaterialRecordDialog` | 材料記録ダイアログ |
| `PatientScheduleSummary` | 患者スケジュールサマリー |
| `VisualIndicator` | 検体チューブ・生理検査種別ビジュアル表示 |
| `StatusHistoryDialog` | ステータス履歴ダイアログ |

## カスタムフック（`_shared/hooks/`）

| フック | 責務 |
|---|---|
| `useDeptInstructionInit` | 画面初期化（一覧取得・フィルタ初期化） |
| `useDeptInstructionActions` | 操作ハンドラー（ステータス遷移・ダイアログ開閉） |
| `useDeptInstructionSubmit` | 送信処理（楽観的更新 + 失敗時ロールバック） |

## エントリポイント

```tsx
// 02_lab-instruction/DEP002.tsx（薄いエントリ）
import { DeptInstructionScreen } from '../_shared/components/organisms/DeptInstructionScreen';
import { labInstructionConfig } from './lab-instruction.config';

export default function DEP002() {
  return <DeptInstructionScreen config={labInstructionConfig} />;
}
```

## テスト実行

```bash
# Vitest（ユニット + Storybook テスト）
cd product/frontend
npx vitest run src/features/09_dept-instruction

# E2E（開発サーバー起動後）
cd product/frontend && npm run dev &
bash .claude/scripts/server-test.sh DEP002

# Storybook ビルド確認
npm run storybook:build
```

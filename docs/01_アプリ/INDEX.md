# 機能一覧（Feature Index）

> 最終更新: 2026-05-12

## 機能一覧

**このファイルが全機能の状態管理の正（Single Source of Truth）。**

| ID | ドメイン | 機能名 | ステータス | 依存 | 概要 |
|----|---------|--------|-----------|------|------|
| F01 | exam-result | RES002-result-input | design | - | 検査結果入力。詳細設計 PASS（2026-04-15）。[設計書一式](フロントエンド/exam-result/結果入力/) |
| F08 | diagnosis | REC001-diagnosis-record-input | implement | - | 診察記録入力（SOAP形式・下書き・Myコメント・テンプレート・シェーマ連携）。詳細設計 PASS済み。実装開始（2026-05-12）。[設計書一式](フロントエンド/01_diagnosis/01_record-creation/) |
| F02 | diagnosis | REC002-schema-creation | implement | - | シェーマ作成機能（canvas描画・テンプレート選択・お気に入り）。詳細設計 PASS（2026-04-27）。実装開始（2026-05-11）。[設計書一式](フロントエンド/01_diagnosis/01_record-creation/) |
| F09 | ui-common | ETC003-patient-header | implement | F03 | 患者情報ヘッダ表示（患者基本情報・アレルギー/感染症アラート・各種ダイアログ）。設計書なし・Figma Makeコードあり。実装開始（2026-05-13）。 |
| F10 | ui-common | ETC006-user-header | implement | F03,F09 | カルテ画面メインシェル（GlobalHeader・PatientHeader統合・自動ログアウト・テーマ制御）。設計書なし・Figma Makeコードあり。実装開始（2026-05-13）。 |
| F03 | ui-common | ETC001-login | implement | - | ログイン機能（FE→BFF→BE 認証疎通・Zustand persist）。実装開始（2026-04-30）。 |
| F04 | ui-common | ETC002-menu | implement | F03 | メニュー／ダッシュボード画面（通知・テーマ設定・代行入力未承認・院内メール）。実装中（2026-04-30）。 |
| F05 | ui-common | ETC005-right-sidemenu | implement | F04 | カルテ画面右サイドメニュー（折りたたみ・院内掲示板・伝言メモ・メニュー遷移）。実装中（2026-04-30）。 |
| F06 | order | ORD023-specimen-order | done | F03 | 検体検査オーダー入力（オーダー設定・確定・履歴表示）。Phase 10 完了（2026-05-08）。/review PASS（2026-05-11）: BFF 34件・FE 52件 全PASS。 |
| F07 | diagnosis | REC020-patient-list | done | F03 | 受診者一覧画面（フィルタ・ソート・呼び出し・診察キャンセル）。Phase 10 完了（2026-05-08）: E2E 8/8 PASS・Vitest Stmts 83%・Storybook ビルド成功。 |
| F08 | order | ORD076-order-confirm | done | F03 | オーダー確定画面（未確定/確定済みオーダー管理・帳票出力・部門連携）。全Phase 0〜10 完了（2026-05-11）。/review PASS（2026-05-12）: BFF 62件全PASS・FE型エラー0件。[設計書](フロントエンド/05_order/19_nursing-care-order/03_order-confirm/design_detail-ORD076_オーダー確定.md) |
| F09 | dept-instruction | DEP002-lab-instruction | done | F03 | 臨床検査科指示受け（部門指示受け共通基盤の先行実装）。FE Phase 0〜10 + BFF B1〜B5 + BE E1 全実装完了（2026-05-12）。/review PASS（2026-05-12）: High 0件・23テスト全通過。|
| F10 | dept-instruction | DEP009-patient-id-check | done | F09 | 患者取り違い防止チェック（3点チェック: 患者・物品・実施者バーコード照合）。FE Phase 0-10 + BFF B1-B4 + BE E1 完了。レビュー PASS（2026-05-13）。|

※ 機能は `/design {domain}/Fxx_機能名` で追加する。

### ステータス定義

| ステータス | 意味 |
|-----------|------|
| design | 設計中（PRD/設計書作成中） |
| implement | 実装中 |
| done | 完了（レビュー通過済み） |

## ドメイン一覧

> **パス規約**: レイヤーごとに以下のパスに配置する。`{domain}` はドメイン名（kebab-case）と一致させる。
>
> | レイヤー | パス |
> |---------|------|
> | フロントエンド | `docs/01_アプリ/フロントエンド/{domain}/{機能グループ名}/` |
> | BFF | `docs/01_アプリ/BFF/{bff-service-name}/{機能グループ名}/` |
> | バックエンド | `docs/01_アプリ/バックエンド/{backend-domain}/` |

| ドメイン | 日本語名 | 実ディレクトリ（フロントエンド設計書） |
|---------|---------|------|
| `exam-result` | 検査結果管理 | `docs/01_アプリ/フロントエンド/06_exam-result/` |
| `diagnosis` | 診療記録・診断管理 | `docs/01_アプリ/フロントエンド/diagnosis/`（未作成） |
| `proxy-input` | 代行入力 | `docs/01_アプリ/フロントエンド/proxy-input/`（未作成） |
| `patient` | 患者管理 | `docs/01_アプリ/フロントエンド/patient/`（未作成） |
| `reception` | 受付・予約管理 | `docs/01_アプリ/フロントエンド/reception/`（未作成） |
| `order` | オーダリング | `docs/01_アプリ/フロントエンド/order/`（未作成） |
| `nursing` | 看護管理 | `docs/01_アプリ/フロントエンド/nursing/`（未作成） |
| `nursing-support` | 看護支援 | `docs/01_アプリ/フロントエンド/nursing-support/`（未作成） |
| `dept-instruction` | 部門指示受け | `docs/01_アプリ/フロントエンド/dept-instruction/`（未作成） |
| `integration-internal` | 外部部門システム（院内） | `docs/01_アプリ/フロントエンド/integration-internal/`（未作成） |
| `integration-external` | 外部部門システム（院外） | `docs/01_アプリ/フロントエンド/integration-external/`（未作成） |
| `karte-core` | 電子カルテ共通基盤 | `docs/01_アプリ/フロントエンド/karte-core/`（未作成） |
| `karte-option` | 電子カルテ共通基盤（Harz外オプション） | `docs/01_アプリ/フロントエンド/karte-option/`（未作成） |
| `analytics` | データウェアハウス（統計） | `docs/01_アプリ/フロントエンド/analytics/`（未作成） |
| `security` | セキュリティ/アクセス管理 | `docs/01_アプリ/フロントエンド/security/`（未作成） |
| `ui-common` | メニュー・共通ヘッダ | `docs/01_アプリ/フロントエンド/ui-common/`（未作成） |
| `master` | マスタ管理 | `docs/01_アプリ/フロントエンド/master/`（未作成） |

## 採番ルール

- 連番（F01, F02, ...）。ドメインをまたいでもグローバル連番
- 欠番は埋めない（削除された機能のIDは再利用しない）
- 機能名は kebab-case（例: `patient-basic-info`）
- ドメイン名は kebab-case（例: `exam-result`）

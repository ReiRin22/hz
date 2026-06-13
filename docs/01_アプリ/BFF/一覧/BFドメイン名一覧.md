# ドメイン一覧

## マルチテナント対象
医療機関ごとにデータが独立すべき領域。  
テナントごとに独立したスキーマを持つ。データは完全に分離。  
例: `schema_hospital_001.patients`

| ドメイン | 説明 | 主な対象テーブル例 | 開発優先度 |
|---|---|---|---|
| 患者管理（Patient） | 患者基本情報・属性・ID・保険情報を管理 | patients, patient_insurances | 高 |
| 診療記録（Clinical Record） | SOAP、経過記録、サマリ、指示履歴 | progress_notes, clinical_documents | 高 |
| オーダ（Order Entry） | 検査・処置・注射・薬剤・指示の作成と状態管理 | orders, order_items, order_result_links | 高 |
| 看護記録（Nursing） | 看護記録、バイタル、看護必要度、アセスメント | nursing_notes, patient_vitals | 高・中 |
| 投薬・処方（Medication） | 処方箋、与薬、持参薬管理、服薬指導 | prescriptions, drug_administrations | 高・中・低 |
| 検査（Laboratory） | 検体検査オーダ、結果、参照レンジ | lab_orders, lab_results | 高 |
| 画像診断（Radiology） | 放射線オーダ、レポート、画像リンク | rad_orders, rad_reports | 高 |
| リハビリ（Rehabilitation） | 予定、実績、サマリ | rehab_sessions | 中 |
| 入退院管理（ADL / ADT） | ベッド・病棟管理、院基本情報、転棟 | admissions, beds, ward_masters | 中 |
| 会計・請求（Claim） | 医事会計、点数計算、レセプト | claims, receipts, claim_details | 不要、医事会計システム |
| 栄養管理（Nutrition） | 食事オーダ、栄養指導、禁食情報 | diet_orders, nutrition_counseling | 中 |
| リスク管理（Safety） | 医療安全・インシデント報告 | incident_reports | 低 |
| 地域連携（Referral） | 紹介状、地域医療連携文書 | referrals, shared_documents | 低 |
| 部門システム連携（Interfaces） | HL7、FHIR、CSV、検査機器連携 | interface_logs, fhir_resources | 中・低 |
| ユーザ管理（院内ユーザ） | 職種・権限・部署・ロール | local_users, roles, permissions | 高 ※認証認可システムで保有？ |
| スケジューリング（Scheduling） | 外来予約、担当枠、装置予約 | appointments, schedules | 高 |
| 看護計画（Care Plan） | 看護計画、ゴール、介入 | care_plans | 中 |
| 療養病棟特有領域 | 医療区分、ADL評価、長期療養項目 | care_levels, adl_scores | 中・低 |

---

## 共通ドメイン
全テナントで共有、全体で統合される領域。  
全テナントで共通利用。  
例: `common.icd10`, `common.drug_master`

| ドメイン | 説明 | 主なテーブル |
|---|---|---|
| 標準コードマスタ | ICD10、JLAC10、薬剤標準コード | icd10, jlac10, drug_master |
| 検査マスタ | 検査項目、基準値、単位 | test_master |
| 医薬品マスタ（標準） | 一般名、規格、剤形、投与経路 | drug_master, dosage_master |
| 住所・地域マスタ | 郵便番号、自治体コード | address_master |
| 認証・認可（ID基盤） | システム全体のユーザ、テナント情報 | users, tenant_master |
| システムログ（共通） | 監査ログ、APIアクセスログ | audit_logs, access_logs |
| システム設定（共通） | 共通システム設定、ライセンス | system_settings |
| 通知（共通処理） | メール、Webhook、Push通知 | notifications |

---

## スキーマ例

```text
common     ... 標準マスタ系
tenant_001 ... 病院A（電子カルテデータ）
tenant_002 ... 病院B（電子カルテデータ）
...
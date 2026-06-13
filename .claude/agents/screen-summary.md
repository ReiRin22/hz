# 画面構造サマリー: 入院オーダー

> 生成元: docs/01_アプリ/機能設計/入院オーダー/components/
> 生成日: 2026-05-11

---

## 画面レイアウト

入院オーダーはカルテ画面（ChartPanel）からオーバーレイで起動する。

| 領域 | コンポーネント | 概要 |
|---|---|---|
| カルテ中央 | ChartPanel | 診療記録入力・表示。右サイドバーにオーダー追加ボタンを持つ |
| 右端オーバーレイ（w-600px） | AdmissionOrderPanel | 入院オーダー入力パネル。パステンプレート選択・タイムライン編集・入院療養計画書プレビューを担う |

---

## パネル別 UI要素

### ChartPanel（ChartPanel.tsx）— 入院オーダー起動に関連する部分

| 要素種別 | 名称 | 説明・条件 |
|---|---|---|
| ボタン | オーダー追加（ChartRightPanel） | 押下でオーダー種別選択ダイアログを開く |
| ダイアログ | オーダー種別選択 | 「入院」選択で `showAdmissionPanel = true` |
| オーバーレイ | 入院オーダーパネル | `showAdmissionPanel === true` の時に右側600px幅で固定表示（AdmissionOrderPanel） |

---

### AdmissionOrderPanel（AdmissionOrderPanel.tsx）

| 要素種別 | 名称 | 説明・条件 |
|---|---|---|
| 入力 | パス名/疾患名検索 | `searchQuery` stateでテンプレートをフィルタリング |
| ボタン群 | テンプレートカード | 大腿骨骨折術後パス / 肺炎パス / 脳卒中リハビリパス（3種）。選択中はSELECTEDバッジ |
| タブ | タイムラインプレビュー | 選択パスの処方/注射/食事/看護の日別スケジュールテーブル |
| タブ | 入院療養計画書プレビュー | 自動生成された計画書。「自動生成済」バッジ |
| テーブル | タイムラインテーブル | Day 1〜7の処方・注射・食事・看護のセルを編集・D&D可能 |
| ボタン | セル編集 | 各セルの鉛筆アイコン。`editingCell` stateで制御 |
| 入力 | セル内テキストエリア | 編集中のセル内容。Enterで保存・Escでキャンセル |
| ボタン | 全画面表示 | タブヘッダー右端 |
| 表示 | 入院診療計画書（計画書タブ） | 傷病名・予定入院期間・各計画セクション（症状・検査・リハビリ・食事） |
| ボタン | 印刷 / PDF出力 | 計画書タブのヘッダー右 |
| 入力 | 傷病名 | 編集ボタンで編集モード切り替え。`editingDiagnosis` state |
| 入力 | 予定入院期間（入院日〜退院日） | date入力2つ。`editingPeriod` state |
| ボタン | 各計画セクション編集 | `editingPlanSection` state で対象インデックスを管理 |
| ボタン | パス内容を確定して適用 | `onConfirm(updatedTemplate)` 呼び出し。ChartPanelへ返却 |
| ボタン | 計画書を確定する | 計画書タブ時の確定ボタン |

---

## ダイアログ一覧（入院オーダー関連）

| ダイアログ名 | トリガー操作 | 主要UI要素 |
|---|---|---|
| オーダー種別選択 | ChartRightPanelの「オーダー追加」ボタン | 21種別ボタン（入院・退院・処方等）。「入院」でAdmissionOrderPanel起動 |
| 入院オーダー入力 | オーダー種別ダイアログで「入院」選択 | パステンプレート選択・タイムライン編集・入院療養計画書プレビュー |

---

## 状態管理（入院オーダー関連）

### AdmissionOrderPanel

| 状態変数 | 型 | 役割 |
|---|---|---|
| selectedTemplate | PathTemplate | 選択中のパステンプレート（デフォルト: 大腿骨骨折術後パス） |
| activeTab | 'timeline' \| 'plan' | タイムライン/計画書タブ切り替え |
| searchQuery | string | テンプレート検索テキスト |
| timeline | PathTemplate['timeline'] | 編集済みタイムラインデータ（D&D・セル編集後） |
| editingCell | {category, day} \| null | 編集中のタイムラインセル |
| diagnosis | string | 傷病名 |
| admissionDate | Date | 入院日 |
| dischargeDate | Date | 退院予定日 |
| editingPlanSection | number \| null | 編集中の計画セクションインデックス |

### ChartPanel（入院オーダー関連のみ）

| 状態変数 | 型 | 役割 |
|---|---|---|
| isOrderDialogOpen | boolean | オーダー種別選択ダイアログ開閉 |
| showAdmissionPanel | boolean | 入院オーダーパネル表示状態 |

---

## 主要な型定義（入院オーダー関連）

| 型名 | 主要フィールド | 用途 |
|---|---|---|
| PathTemplate (AdmissionPanel) | id, name, duration, timeline{prescription, injection, meal, nursing} | 入院パスのタイムラインデータ（Day単位） |

# /implement コマンド アーキテクチャ図解

2026-05-19 作成

本ディレクトリには `/implement` コマンドの全体構造を可視化した9つの図が含まれています。

## 図の一覧

1. **01_overall_orchestration.png** - Phase 0〜10の全体フローとセッション停止ポイント
2. **02_session_startup.png** - セッション開始時の必須ファイル読み込みフロー（9ファイル）
3. **03_phase_detail_map.png** - 各PhaseのSKILL.md・タスク・phase-testの詳細マップ
4. **04_impl_reviewer_flow.png** - app-impl-reviewerの6ステップ完全フロー
5. **05_nextjs_best_practices.png** - Next.js Best PracticesのPhase 2/6での統合
6. **06_bff_check_flow.png** - BFF実装チェックの7項目と3-header伝搬
7. **07_test_flow.png** - テストピラミッド（Phase 8→9→10）
8. **08_agents_diagram.png** - 7つの実装エージェントとメインエージェントの関係
9. **09_cross_cutting_rules.png** - 横断ルール・設計書参照・補助スキルの構造

## ファイル形式

- `.mmd`: Mermaid図のソースファイル
- `.png`: PNG画像（1920x1080、背景透明）

## 使用方法

各PNG画像をドキュメント・プレゼンテーション・レビュー資料に使用してください。

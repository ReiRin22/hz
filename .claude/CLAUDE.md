# Harz

中小規模の療養病棟を保持する病院向けのクラウドネイティブ型の電子カルテシステムです。

---

## 設計原則

**対象: 複数機能を持ち継続的に開発するプロダクト。** スクリプト・ライブラリ・プロトタイプは対象外。

**メインエージェントは「判断」のみ。調査・作成・検証はサブエージェントに委譲する。**

ただし、ユーザーとの対話が密で文脈の転送コストが委譲の利益を上回る作成作業（例: /init のヒアリング→ドラフト）はメインエージェントが直接行ってよい。

---

## ルーティングテーブル（何を読むか）

**毎セッション開始時、`session_phase` に従って最小限のファイルだけ読む。**

| session_phase | 読むファイル | 読まないもの |
|---|---|---|
| idle | このファイルだけ | それ以外全て |
| poc | `docs/02_アプリ基盤/{target}/03_PoC検証/state.md` + Skill(arch-poc) | 他機能のspec, docs/01_アプリ |
| design (機能) | `docs/01_アプリ/{domain}/Fxx/` + `docs/01_アプリ/design-review-findings.md` + 該当コマンド | 他機能のspec, src/ |
| design (基盤) | `docs/02_アプリ基盤/{対象ファイル}` + 対応テンプレート | docs/01_アプリ/, src/ |
| design (リファクタ) | 対象コード + `docs/meta/debt.md` | 無関係のspec |
| implement | `docs/01_アプリ/{domain}/Fxx/` + Skill(steering) | 他機能のspec |
| fix | `docs/01_アプリ/{domain}/Fxx/` + 対象コード + Skill(steering) | 他機能のspec |

**原則: 表にないファイルは読まない。調査はサブエージェントに委譲する。**

---

## ルール（9つ + 文書規約）

0. **文書規約 — RFC 2119** — 仕様書の要件強度は RFC 2119 キーワードで明示する
1. **仕様が先、実装は後** — コードを書く前に `docs/01_アプリ/` にPRDと設計書を作成する
2. **1機能 = 1フォルダ** — `docs/01_アプリ/{domain}/｛Lv2機能グループ名｝/` に prd-Fxx_機能名.md + design-Fxx_機能名.md を置く
3. **スコープ宣言** — 作業開始時に何を読み何を書くか `.steering/` に記録する
4. **300行制限** — docs配下のMarkdownは300行以内。超えたら分割する
5. **フレームワーク改善** — 開発中に検出した問題を `docs/meta/framework-retro.md` に自動記録する
6. **レビュー知見の蓄積** — /review FAIL 直後に `docs/01_アプリ/design-review-findings.md` へ再発防止パターンを追記する。次の設計フェーズ開始時にこのファイルを読んで自己チェックする
7. **Web参照はJina経由でMD変換** — 外部URLの内容を取得する際は `https://r.jina.ai/{URL}` 経由でMarkdownに変換してからfetchする。生HTMLを直接取得するとHTMLタグ等の不要情報でトークンが膨れるため禁止。例: `https://r.jina.ai/https://example.com/docs`

詳細 → `docs/meta/rules.md`

---

## エージェント・スキル作成規約

詳細 → `docs/meta/agent-skill-conventions.md`

- エージェント: `{scope}-{target}-{role}.md`（kebab-case。スコープは arch-/app-/common-。ロール語は conventions.md 参照）
- スキル: `{scope}-{function-name}/SKILL.md`（スコープ付きフォルダ + SKILL.md 構成）
- 作成後は必ず CLAUDE.md のサブエージェントカタログに登録する

---

## hooks の仕組み

`.claude/hooks/` に配置された Node.js スクリプトを `product/.claude/hooks.json` で登録すると、特定のタイミング（PreToolUse / PostToolUse / Stop）で自動実行される。
hooks は `stdin` で JSON を受け取り、`stdout` に変更後の JSON を返す（または exit 2 でブロック）。
Phase-test や omc コマンド検出など、繰り返し実行が必要な検証・トリガー処理を自動化するために使用する。
`product/.claude/hooks.json` の設定により、特定のツール・ファイルパターン・フェーズに応じて hooks を起動できる。

---

## コマンド

`.claude/commands/` に定義されたコマンド。複数セッションにまたがって使用する。

| コマンド | 用途 | フローチャート |
|---|---|---|
| `/init` | プロジェクト基盤の初期化（最初の1回） | — |
| `/poc {target}` | 技術検証（PoC）の実施 | — |
| `/figmamake` | Figma Make UI からコード移行・詳細設計書ドラフト作成 | — |
| `/design {domain}/Fxx_機能名` | 詳細設計書の作成 | `.claude/flow-chart/design-flow.md` |
| `/review 対象パス` | 仕様・実装のレビュー | — |
| `/gyoumu {domain}/Fxx_機能名` | 業務フローによる詳細設計書の更新 | — |
| `/implement {domain}/Fxx_機能名` | FE実装（Phase単位で停止必須） | `.claude/flow-chart/implement-flow.md` |
| `/synchronizer {domain}/Fxx_機能名` | BFF実装 | — |
| `/backend {domain}/Fxx_機能名` | BE実装 | — |
| `/fix {domain}/Fxx_機能名 概要` | バグ修正 | — |

## 作業フロー概要

```
1. /figmamake
   └─ Figma Make UI からコードを移行・詳細設計書（ドラフト）の作成

2. /design {domain}/Fxx_機能名
   └─ 詳細設計書の作成（詳細: .claude/flow-chart/design-flow.md）

3. /review 対象パス
   └─ 詳細設計書のレビュー → PASS → design-review-findings.md に知見追記

4. /gyoumu {domain}/Fxx_機能名
   └─ 業務フローによる詳細設計書の更新

5. /implement {domain}/Fxx_機能名
   └─ FE実装（Phase 0〜10）（詳細: .claude/flow-chart/implement-flow.md）

6. Page層実装
   └─ Next.js の app/ ディレクトリに Page コンポーネント配置

7. /synchronizer {domain}/Fxx_機能名
   └─ BFF実装（API・Service・Client 層）

8. PostgreSQL整備
   └─ テーブル定義・マイグレーション・初期データ投入

9. /backend {domain}/Fxx_機能名
   └─ BE実装（C# Controller・Service・Repository 層）

```

フェーズの進行は人間が判断する。AIが勝手に次フェーズへ進まない。

---

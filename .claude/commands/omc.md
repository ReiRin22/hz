---
description: Operation Mode Command - 3agents並列ワークフローを起動
---

# /omc 3agents

フロントエンド個別詳細設計書作成のための3エージェント並列ワークフローを実行します。

## 用途

- フロントエンド画面の詳細設計書を効率的に作成する
- 既存仕様との整合性を自動チェックする
- 設計品質を並行して検証する

## 前提条件

1. 要件ファイルが以下に配置されていること:
   ```
   docs/01_アプリ/フロントエンド/検査結果管理/結果入力/
     ├── RES002.pdf                         (画面仕様書)
     ├── design-RES002_結果入力.md          (機能設計書)
     ├── design_detail-RES002_結果入力.md   (詳細設計書)
     └── 画面遷移図.drawio.svg               (画面遷移図)
   ```

2. エージェント定義が存在すること:
   ```
   .claude/agents/
     ├── app-frontend-detail-design-drafter.md
     ├── spec-cross-checker.md
     └── design-validator.md
   ```

3. 設計ゲートが定義されていること:
   ```
   .claude/commands/design.md
   ```

## 実行方法

```
/omc 3agents
```

## ワークフロー

### Phase0: プレチェック
- 前提条件のファイルが全て存在するか確認する
- 不足ファイルがあれば中断してユーザーに報告する

### Phase1: 調査（並列）

以下を**並列で**起動し、結果を `.steering/YYYYMMDD-機能名/` に書き出す。

| エージェント | 出力ファイル | 内容 |
|---|---|---|
| **spec-cross-checker** | `research-cross-check.md` | 既存仕様との重複・競合・依存関係 |
| **codebase-researcher** | `research-codebase.md` | 既存コードの型定義・パターン・再利用可能モジュール |

→ 両ファイルが書き出されてから Phase2 へ進む。

### Phase2: ドラフト作成

**detail-design-drafter** を起動する。

- 入力: 全要件ファイル + `.steering/YYYYMMDD-機能名/research-codebase.md` + `.steering/YYYYMMDD-機能名/research-cross-check.md`
- 出力: `docs/01_アプリ/{domain}/Fxx_{機能名}/design_detail-{画面ID}_{機能名}.md` など

→ ドラフトファイルが書き出されてから Phase3 へ進む。

### Phase3: 検証（並列）

以下を**並列で**起動し、結果を `.steering/YYYYMMDD-機能名/` に書き出す。

| エージェント | 出力ファイル | 内容 |
|---|---|---|
| **design-validator** | `validation-result.md` | PRDカバレッジ・core整合性・指摘事項 |
| **spec-registry-checker** | `validation-registry.md` | 共通一覧への未登録エントリ |

### Phase4: DoDゲート

`validation-result.md` と `validation-registry.md` の内容を確認し、以下の完了基準チェックリストをユーザーに提示する。

```yaml
header: "詳細設計完了確認"
checklist:
  - "[ ] 機能設計書の全操作フローがセクション4に対応している"
  - "[ ] 機能設計書の全エラーメッセージがセクション5に定義されている"
  - "[ ] Upstream*型が *.type.ts に定義されている（clients.ts 内への直接定義なし）"
  - "[ ] 日付・コード値フィールドに .regex() / .datetime() バリデーションがある"
  - "[ ] spec-cross-checkerの競合がすべて解消または[要確認]で明示されている"
  - "[ ] spec-registry-checkerの未登録エントリが全て反映されている"
  - "[ ] 300行以内（超過なら分割済み）"
question: "次のステップは？"
options:
  - "ドラフトを承認して次フェーズへ (推奨)"
  - "指摘事項を修正する"
  - "要件から見直す"
```

## 中間ファイル構成

```
.steering/YYYYMMDD-機能名/
  research-codebase.md       ← Phase1: codebase-researcherの出力
  research-cross-check.md    ← Phase1: spec-cross-checkerの出力
  validation-result.md       ← Phase3: design-validatorの出力
  validation-registry.md     ← Phase3: spec-registry-checkerの出力
```

## 設定

hooks.json でトリガーを設定:
```json
{
  "hooks": {
    "beforeSubmitPrompt": [
      {
        "command": "node .claude/hooks/omc-trigger.js",
        "event": "beforeSubmitPrompt",
        "description": "Detect /omc 3agents command"
      }
    ]
  }
}
```

## エラー処理

- ファイルが見つからない場合: エラーメッセージを表示し、処理を中断
- エージェント起動失敗: 失敗したエージェントをスキップし、他のエージェントの結果を返す
- hook失敗: プロンプトをそのまま返し、フック処理をスキップ

## 参考

- 設計フロー: [.claude/commands/design.md](design.md)
- エージェント定義: [.claude/agents/app-frontend-detail-design-drafter.md](../agents/app-frontend-detail-design-drafter.md)
- フレームワークルール: [CLAUDE.md](../../CLAUDE.md)

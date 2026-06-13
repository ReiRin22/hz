# OMC Reference — スクリーンコード解決辞書

`/omc-teams 3 "RES002のフロント実装"` のように入力したとき、
コード（`RES001`, `RES002` など）から要件ファイル群・ゲート群・エージェント・スキルを自動解決します。

エージェント選択は **「コード の {操作名}」** の形式で行います。
例: `RES002のフロント実装` → `フロント実装` エージェントを使用

---

## グローバル定義

スクリーンコードを横断して使う、エージェントとスキルの定義テーブルです。
コードエントリの `agents:` / `skills:` はここで定義した名前を参照します。

### エージェント定義

| 名前 | ファイルパス | 用途 |
|---|---|---|
| フロント実装 | .claude/agents/app-frontend-detail-design-drafter.md | フロントエンド詳細設計書ドラフト作成 |
| フロントテスト | .claude/agents/app-frontend-spec-valifer.md | 仕様検証・テスト |
| サーバーテスト | .claude/agents/app-server-test-agent.md | localhost:3000自動テスト |

> **追加方法:** 上の表に行を追加し、対応するエージェントファイルを `.claude/agents/` に作成してください。
> コードエントリの `agents:` に名前を追加すれば、その操作名でエージェントが呼び出されます。

### スキル定義

| 名前 | ファイルパス | 用途 |
|---|---|---|
| フロント詳細設計 | .claude/skills/design-writing/SKILL.md | フロントエンド詳細設計書の書き方ガイド |
| ステアリング | .claude/skills/steering/SKILL.md | 実装ガイドライン |

> **追加方法:** 上の表に行を追加し、対応するスキルファイルを `.claude/skills/` に配置してください。
> コードエントリの `skills:` に名前を追加すれば、そのスキルが実行時に注入されます。

---

## コードエントリ フォーマット

```
## {CODE}
requirements:
  - {ファイルパス（プロジェクトルートからの相対パス）}
gates:
  - {コマンド定義ファイルパス}
structure: {ファイル構成参考パス（オプション）}
agents:
  - {エージェント定義の名前}
  - {エージェント定義の名前}
skills:
  - {スキル定義の名前}
  - {スキル定義の名前}
default_agent: {デフォルトエージェント名（操作名未検出時）}
```

**ルール:**
- `agents` はリスト。グローバル定義の名前を参照。入力の「コード の {名前}」で選択される
- `skills` はリスト。グローバル定義の名前を参照。複数指定すると全て注入される
- `default_agent` は操作名がマッチしなかった場合のフォールバック（省略時は agents の先頭）

---

## REC001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/01_診療記録作成・管理/01_診察記録入力/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
  - サーバーテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/01_診療記録作成・管理/01_シェーマ作成機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
  - サーバーテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/01_診療記録作成・管理/02_経過記録記載機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/01_診療記録作成・管理/02_申し送り機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/02_診療情報参照・共有・作成/01_診療情報参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/02_診療情報参照・共有・作成/02_薬歴参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/02_診療情報参照・共有・作成/03_外部ビューワ/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/02_診療情報参照・共有・作成/03_検査結果参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC009

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/02_診療情報参照・共有・作成/04_他院診療情報参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC010

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/02_診療情報参照・共有・作成/05_健診情報参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/02_看護業務支援/06_外来カルテオーバービュー/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC012

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/03_診断・病名管理/01_病名登録/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC013

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/04_文書作成・管理/01_文書作成/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC014

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/04_文書作成・管理/01_栄養管理計画書/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC015

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/04_文書作成・管理/01_薬剤管理サマリ/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC016

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/04_文書作成・管理/01_看護支援文書作成支援/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC017

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/04_文書作成・管理/02_受領文書取込/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC018

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/04_文書作成・管理/03_文書管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC019

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/05_他科依頼/01_他科依頼/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REC020

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/01_診療記録・診断管理/06_受診者一覧/01_受診者一覧/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PRI001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/02_代行入力/01_代行入力/01_代行入力/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PRI002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/02_代行入力/01_代行入力/02_代行入力承認/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PRI003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/02_代行入力/01_代行入力/03_代行入力（オーダ）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PRI004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/02_代行入力/01_代行入力/04_代行入力差戻し/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/01_患者基本情報参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/02_家族・キーパーソン情報/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/03_アレルギー・既往歴管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/04_生活習慣・嗜好/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/05_感染症/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/06_診療メモ/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/10_患者検索機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/02_患者情報セキュリティ/01_アクセス制御/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT009

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/02_患者情報セキュリティ/02_アクセスログ管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT010

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/03_患者一覧/01_患者一覧/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/03_患者一覧/01_指定病名使用患者一覧/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT012

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/03_患者一覧/01_指定診療行為使用患者一覧/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT013

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/07_ACP情報/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT014

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/08_インプラント・デバイス情報/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PAT015

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/03_患者管理/01_患者基本情報管理/09_予防接種/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REG001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/04_受付・予約管理/01_外来受付・問診/01_受付処理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REG002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/04_受付・予約管理/01_外来受付・問診/02_検査予約/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REG003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/04_受付・予約管理/01_外来受付・問診/02_診療予約/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## REG004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/04_受付・予約管理/01_外来受付・問診/03_問診/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/01_オーダー設定/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/01_薬剤情報表示/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/02_薬剤アレルギーチェック/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/02_併用禁忌チェック/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/02_重複投薬チェック/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/02_患者属性適合性チェック/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/03_院外処方箋の電子署名・印刷/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/04_院内処方箋の電子署名・印刷/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD009

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/05_オーダ出力帳票（処方）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD010

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/01_処方オーダー/06_オーダー連携（処方）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/02_注射オーダー/01_注射指示入力・設定/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD015

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/02_注射オーダー/02_オーダ出力帳票（注射）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD016

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/02_注射オーダー/03_オーダー連携（注射）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD017

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/03_処置オーダー/01_オーダー設定（処置）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD018

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/03_処置オーダー/02_オーダ出力帳票（処置）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD019

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/03_処置オーダー/03_オーダー連携（処置）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD020

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/04_指導オーダー/01_オーダー設定（指導）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD021

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/04_指導オーダー/02_オーダ出力帳票（指導）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD022

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/04_指導オーダー/03_オーダー連携（指導）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD023

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/05_検体検査オーダー/01_オーダー設定（検体）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD024

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/05_検体検査オーダー/02_オーダー連携（検体）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD025

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/05_検体検査オーダー/03_オーダ出力帳票（検体）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD026

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/06_生理検査オーダー/01_オーダー設定（生理）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD027

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/06_生理検査オーダー/02_オーダ出力帳票（生理）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD028

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/06_生理検査オーダー/03_オーダー連携（生理）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD029

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/07_内視鏡検査オーダー/01_オーダー設定（内視鏡）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD030

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/07_内視鏡検査オーダー/02_オーダ出力帳票（内視鏡）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD031

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/07_内視鏡検査オーダー/03_オーダー連携（内視鏡）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD032

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/08_画像検査オーダー/01_オーダー設定（画像）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD033

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/08_画像検査オーダー/02_チェック（画像）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD034

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/08_画像検査オーダー/03_オーダ出力帳票（画像）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD035

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/08_画像検査オーダー/04_オーダー連携（画像）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD036

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/09_病理検査オーダー/01_オーダー設定（病理）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD037

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/09_病理検査オーダー/02_オーダ出力帳票（病理）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD038

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/09_病理検査オーダー/03_オーダー連携（病理）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD039

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/10_細菌検査オーダー/01_オーダー設定（細菌）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD040

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/10_細菌検査オーダー/02_オーダ出力帳票（細菌）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD041

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/10_細菌検査オーダー/03_オーダー連携（細菌）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD042

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/11_汎用オーダー/01_オーダー設定（汎用）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD043

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/11_汎用オーダー/02_オーダ出力帳票（汎用）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD044

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/11_汎用オーダー/03_オーダー連携（汎用）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD045

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/12_複合オーダー/01_オーダー設定（複合）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD046

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/12_複合オーダー/02_オーダ出力帳票（複合）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD047

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/12_複合オーダー/03_オーダー連携（複合）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD048

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/13_食事オーダー/01_オーダー設定（食事）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD049

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/13_食事オーダー/02_オーダ出力帳票（食事）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD050

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/13_食事オーダー/03_オーダー連携（食事）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD051

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/14_リハビリオーダー/01_オーダー設定（リハビリ）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD052

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/14_リハビリオーダー/02_リハビリ処方箋/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD053

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/14_リハビリオーダー/03_リハビリ計画書/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD054

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/14_リハビリオーダー/04_オーダー連携（リハビリ）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD055

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/15_輸血オーダー/01_オーダー設定（輸血）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD057

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/15_輸血オーダー/02_オーダー連携（輸血）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD058

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/16_手術オーダー/01_オーダー設定（手術）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD060

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/16_手術オーダー/02_オーダー連携（手術）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD061

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/17_透析オーダー/01_オーダー設定（透析）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD063

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/17_透析オーダー/02_オーダー連携（透析）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD064

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/01_オーダー設定（入院）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD065

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/02_オーダ出力帳票（入院）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD066

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/03_オーダー連携（入院）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD067

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/04_病床・期間管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD068

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/05_オーダー設定（退院）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD069

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/05_オーダ出力帳票（退院）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD070

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/05_オーダー連携（退院）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD071

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/06_オーダー設定（転棟）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD072

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/06_オーダ出力帳票（転棟）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD073

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/18_入退院・転棟オーダー/06_オーダー連携（転棟）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD074

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/19_看護ケアオーダー/01_オーダー設定（看護ケア）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD075

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/19_看護ケアオーダー/02_オーダー連携（看護ケア）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD076

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/19_看護ケアオーダー/03_オーダー確定/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ORD077

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/05_オーダリング/19_看護ケアオーダー/04_オーダリングセット登録/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## RES001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/検査結果管理/結果参照/RES001.md
  - docs/01_アプリ/フロントエンド/検査結果管理/結果参照/design-RES001_結果参照.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## RES002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/検査結果管理/結果入力/RES002.md
  - docs/01_アプリ/フロントエンド/検査結果管理/結果入力/design-RES002_結果入力.md
  - docs/01_アプリ/フロントエンド/検査結果管理/結果入力/design_detail-RES002_結果入力.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NUR001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/07_看護管理/01_看護業務管理/01_病棟日誌/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NUR002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/07_看護管理/01_看護業務管理/02_看護管理日誌/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NUR003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/07_看護管理/01_看護業務管理/03_病院日誌/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NUR004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/07_看護管理/01_看護業務管理/04_外来日誌/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NUR005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/07_看護管理/02_空床・稼働率管理/01_空床管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NUR006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/07_看護管理/02_空床・稼働率管理/02_稼働率管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/01_病床管理/01_移動情報登録/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/01_病床管理/01_担当者登録・変更/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/01_病床管理/01_ワークシート発行/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/01_病床管理/01_ワークシート実施入力/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/01_病床管理/01_各種一覧/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/02_移動情報管理/01_入退院・転棟・転科等/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/03_看護業務支援/01_温度板/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/03_看護業務支援/02_経過記録/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP009

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/03_看護業務支援/03_看護データベース/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP010

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/03_看護業務支援/04_サマリ/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/03_看護業務支援/04_退院サマリ/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP012

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/04_指示管理/01_食事箋管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP013

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/04_指示管理/02_入院看護指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP014

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/05_入院時・入院中指示/01_入院診療計画/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP015

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/05_入院時・入院中指示/02_予測指示/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP016

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/05_入院時・入院中指示/03_持参薬管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP017

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/05_入院時・入院中指示/04_食事変更/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP018

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/07_看護過程/01_看護診断/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP019

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/06_服薬・注射実施管理/01_服薬管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP020

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/06_服薬・注射実施管理/02_注射管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP021

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/07_看護過程/04_看護介入/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP022

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/07_看護過程/05_看護記録/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP023

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/07_看護過程/06_看護評価/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP024

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/08_看護評価/01_看護度・救護区分/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP025

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/08_看護評価/02_看護必要度/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP026

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/08_看護評価/03_日常生活機能評価/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP027

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/08_看護評価/04_医療区分・ADL評価/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP028

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/08_看護評価/05_尿路確認リスト/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP029

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/09_傷病管理支援/01_褥瘡管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP030

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/09_傷病管理支援/01_褥瘡観察/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP031

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/09_傷病管理支援/01_褥瘡計画書/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP032

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/09_傷病管理支援/01_危険因子評価表/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP033

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/09_傷病管理支援/01_日別評価表/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP034

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/09_傷病管理支援/01_月間評価表/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP035

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/10_制度系/01_看護必要度集計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## NSP036

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/08_看護支援/10_制度系/01_医療区分集計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/01_外来看護指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/02_検査科指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/03_放射線科指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/04_栄養科指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/05_手術・輸血指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/06_薬剤科指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/07_リハビリ科指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/08_透析指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP009

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/09_患者取り違い防止チェック/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP010

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/10_指示受け・指示元オーダ編集/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DEP011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/09_部門指示受け/01_部門指示受け/11_内視鏡検査科指示受け/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/01_医事・事務系システム/01_医事会計システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/02_診療情報・報告支援/01_様式1（外来）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/02_診療情報・報告支援/01_様式1（入院）/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/02_診療情報・報告支援/02_DPC/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/01_検体検査システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/01_外注検査/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/01_検査機器/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/02_PACS/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT009

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/02_MWM/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT010

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/02_RIS/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/03_生理検査システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT012

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/03_心電図・骨密度/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT013

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/04_内視鏡システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT014

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/05_外注細菌検査業者/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT015

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/03_医療系部門システム/05_外注病理検査業者/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT018

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/04_リハビリ部門システム/01_リハビリシステム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT019

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/05_手術・透析管理支援/01_透析管理システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT020

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/05_手術・透析管理支援/02_手術室管理システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT021

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/05_手術・透析管理支援/02_輸血管理システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT023

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/06_入退院支援/01_地域連携支援システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT024

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/06_入退院支援/02_給食管理システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT025

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/07_事務系システム/01_健診システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT026

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/07_事務系システム/02_診断書作成支援システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT027

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/07_事務系システム/03_再来受付機/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT028

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/08_人事管理系システム/01_出退勤システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT029

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/09_看護業務体制・勤務管理支援/01_勤務管理システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT030

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/10_入院業務支援系システム/01_ナースコールシステム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT031

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/10_入院業務支援系システム/02_見守りシステム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT032

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/10_入院業務支援系システム/03_離床検知システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT033

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/10_入院業務支援系システム/04_バイタルシステム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT034

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/11_院内システム認証基盤/01_二要素認証/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT035

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/11_院内システム認証基盤/01_シングルサインオン/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT036

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/12_ユーザー・認証管理/01_ユーザー管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXT037

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/10_外部部門システム（院内）/12_ユーザー・認証管理/01_アクセス制御/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/01_地域・外部連携/01_介護システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/02_地域医療情報ネットワーク/01_地域医療情報ネットワーク/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/03_全国医療情報プラットフォーム/01_オンライン資格確認/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/03_全国医療情報プラットフォーム/02_電子処方箋管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/03_全国医療情報プラットフォーム/03_電子カルテ共有サービス/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/03_全国医療情報プラットフォーム/04_特定健診/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/04_在宅診療看護連携支援/01_在宅管理システム/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## EXO008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/11_外部部門システム（院外）/05_医療安全管理/01_インシデント報告/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/01_認証・認可/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/02_ヘルプ機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/03_お知らせ・通知/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/04_エラーメッセージ制御/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/05_ログ管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/06_時間管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/07_印刷機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/08_ファイル添付・参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT009

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/09_カレンダー・日付選択/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT010

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/01_共通基盤/10_検索・フィルタリング/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/02_情報共有・掲示/01_掲示板/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT012

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/02_情報共有・掲示/01_伝言メモ/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT013

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/02_情報共有・掲示/02_付箋機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT014

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/02_情報共有・掲示/02_TODO/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLT015

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/12_電子カルテ共通基盤/03_コミュニケーション/01_チャット/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLO063

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/13_電子カルテ共通基盤（Harz外オプション）/01_コミュニケーション/01_スケジューラ/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## PLO064

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/13_電子カルテ共通基盤（Harz外オプション）/01_コミュニケーション/02_プレゼンス機能/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/01_オーダー統計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/01_食事集計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/02_病名統計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/04_外来患者数集計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/04_ジェネリック使用率/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/04_疾患分類表統計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH007

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/04_被ばく線量管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH008

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/01_診療統計/04_指定病名件数出力/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH011

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/02_経営系/01_診療時間・待ち時間分析/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH012

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/02_経営系/02_病院統計/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## DWH013

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/14_データウェアハウス（統計）/03_データ連携/01_カルテ参照/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## SEC001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/15_セキュリティ・アクセス管理/01_操作・監査ログ管理/01_ログ管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## SEC002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/15_セキュリティ・アクセス管理/02_通知・監視・アラート設定/01_通知・アラート設定/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## SEC003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/15_セキュリティ・アクセス管理/03_システム設定・パラメータ管理/01_各種パラメーター設定/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## SEC004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/15_セキュリティ・アクセス管理/04_外部接続・インターフェース管理/01_インターフェース管理/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ETC001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/16_メニュー・共通ヘッダ/01_メニュー・共通ヘッダ/01_ログイン画面/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ETC002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/16_メニュー・共通ヘッダ/01_メニュー・共通ヘッダ/01_メニュー画面/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ETC003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/16_メニュー・共通ヘッダ/01_メニュー・共通ヘッダ/01_患者情報ヘッダ表示/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ETC004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/16_メニュー・共通ヘッダ/01_メニュー・共通ヘッダ/01_カルテ画面左サイドメニュー/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ETC005

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/16_メニュー・共通ヘッダ/01_メニュー・共通ヘッダ/01_カルテ画面右サイドメニュー/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## ETC006

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/16_メニュー・共通ヘッダ/01_メニュー・共通ヘッダ/01_ユーザーヘッダ表示/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## RES001

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/06_検査結果管理/01_検査結果参照・表示/01_検査結果参照・表示/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## RES002

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/06_検査結果管理/02_結果入力/01_結果入力/reference.md
  - docs/01_アプリ/フロントエンド/06_検査結果管理/02_結果入力/01_結果入力/design-RES002_結果入力.md
  - docs/01_アプリ/フロントエンド/06_検査結果管理/02_結果入力/01_結果入力/design_detail-RES002_結果入力.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## RES003

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/06_検査結果管理/02_結果入力/01_結果通知/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

## RES004

```yaml
requirements:
  - docs/01_アプリ/フロントエンド/06_検査結果管理/03_帳票出力/01_帳票出力/reference.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
  - ステアリング
default_agent: フロント実装
```

---

## 追加方法

### 新しいスクリーンコードを追加

```yaml
## NEW001

requirements:
  - docs/01_アプリ/.../NewSpec.md
gates:
  - .claude/commands/implement.md
structure: .claude/commands/structure_2.md
agents:
  - フロント実装
  - フロントテスト
skills:
  - フロント詳細設計
default_agent: フロント実装
```

### 新しいエージェントを追加

1. 上の「エージェント定義」テーブルに行を追加
2. `.claude/agents/` に対応するエージェントファイルを作成
3. 使いたいコードエントリの `agents:` にその名前を追加

### 新しいスキルを追加

1. 上の「スキル定義」テーブルに行を追加
2. `.claude/skills/` に対応するスキルファイルを配置
3. 使いたいコードエントリの `skills:` にその名前を追加

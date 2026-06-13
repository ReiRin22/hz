# 開発規約

> 最終更新: YYYY-MM-DD

## コーディングスタイル

- フォーマッター: {{Prettier / Black / gofmt}}
- リンター: {{ESLint / Ruff / golangci-lint}}
- 設定ファイル: {{.prettierrc, eslint.config.js 等}}
- 自動実行: {{保存時 / コミット時（husky）/ CI}}

## 命名規則

| 対象 | 規則 | 例 |
|------|------|-----|
| ファイル（コンポーネント） | {{PascalCase}} | `UserProfile.tsx` |
| ファイル（ユーティリティ） | {{camelCase}} | `formatDate.ts` |
| ファイル（設定） | {{kebab-case}} | `eslint-config.js` |
| 変数・関数 | {{camelCase}} | `getUserById` |
| クラス・型 | {{PascalCase}} | `UserService` |
| 定数 | {{UPPER_SNAKE}} | `MAX_RETRY_COUNT` |
| ディレクトリ | {{kebab-case}} | `user-profile/` |

## Git運用

### コミットメッセージ

```
{{type}}: {{概要}}

type: feat / fix / refactor / test / docs / chore
```

### PR

- タイトル: コミットメッセージと同形式
- 本文: 変更の背景、影響範囲
- レビュー: {{最低1名承認}}

## コードレビュー基準

| 観点 | 確認すること |
|------|------------|
| 正確性 | 仕様（PRD）の受入条件を満たしているか |
| 可読性 | 意図が読み取れるか、命名は適切か |
| テスト | テストが追加されているか、境界値をカバーしているか |
| セキュリティ | 入力検証、認可チェックが漏れていないか |

## ドキュメント規約

- docs/ 配下は300行以内
- 言語: {{日本語 / 英語}}
- Markdownのみ使用

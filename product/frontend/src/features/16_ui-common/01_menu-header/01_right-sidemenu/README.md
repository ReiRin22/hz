# ETC005 カルテ画面右サイドメニュー

カルテ各画面に表示される右サイドメニュー。折りたたみ対応・院内掲示板ダイアログ・伝言メモダイアログを含む。

## 主要コンポーネント

### Organisms
- `RightSideMenu` — 右サイドメニュー全体（API取得メニュー項目・折りたたみ・各種ダイアログ）

## カスタムフック

- `useRightSideMenuInit` — 右サイドメニュー項目API取得・エラー管理

## テスト

```bash
# Vitestユニットテスト
npx vitest run src/features/16_ui-common/01_menu-header/01_right-sidemenu/

# E2Eテスト（開発サーバー起動後）
bash .claude/scripts/server-test.sh ETC005
```

## URL

- 開発: `http://localhost:3000/ui-common/menu-header/user-header/ETC005`

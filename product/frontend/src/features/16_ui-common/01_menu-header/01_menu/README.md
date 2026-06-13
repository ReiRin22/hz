# ETC002 メニュー画面

ログイン後のメインメニュー。テーマ切り替え・ダッシュボード・代行入力・一時保存・院内メールを統合した画面。

## 主要コンポーネント

### Organisms
- `MenuOrganism` — メニュー全体統合コンポーネント（テーマ・通知管理）
- `MenuSection` — メニュー項目一覧・お気に入り・設定ダイアログ
- `DashboardSection` — 掲示板・付箋・院内メール・伝言メモ・病床稼働タブ
- `InternalMail` — 院内メール受信・送信・作成機能
- `ProxyInputSection` — 代行入力未承認一覧
- `TemporarySaveSection` — 一時保存データ一覧

### Molecules
- `BulletinBoard` — 院内掲示板
- `MessageMemo` — 伝言メモ
- `BedOccupancyChart` — 病床稼働状況チャート
- `BedManagementTable` — 病床管理表
- `StickyNotes` — 付箋

## カスタムフック

- `useMenuItems` — メニュー項目API取得・エラー管理

## テスト

```bash
# Vitestユニットテスト
npx vitest run src/features/16_ui-common/01_menu-header/01_menu/

# E2Eテスト（開発サーバー起動後）
bash .claude/scripts/server-test.sh ETC002
```

## URL

- 開発: `http://localhost:3000/ui-common/menu-header/menu/ETC002`

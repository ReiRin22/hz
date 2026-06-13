# ADR-3: ログアウトクリーンアップの処理順序（Step 2 → Step 3）

* **ステータス**: Accepted
* **決定日**: 2026-05-12
* **関連設計書**: [クリーンアップ基盤設計.md](../クリーンアップ基盤設計.md) §ログアウトシーケンス
* **関連 ADR**: [hard-redirect-on-logout.md](hard-redirect-on-logout.md)

## 背景

ログアウト時のクリーンアップは以下4ステップで構成される。

* Step 0: WebSocket 切断
* Step 1: `queryClient.clear()`（React Query 全削除）
* Step 2: `resetAllStores()`（Zustand Store 一斉初期化）
* Step 3: LocalStorage の対象キー削除
* Step 4: ハードリダイレクト

このうち Step 2（Zustand リセット）と Step 3（LocalStorage 削除）の順序を決定する必要がある。

Zustand の `persist` ミドルウェアは `createJSONStorage(() => localStorage)` を使う場合、ストアの状態変更を **同期的に** LocalStorage へ書き戻す。そのため、`reset()` を呼ぶと初期値が即座に LocalStorage へ書き込まれる。

## 検討した選択肢

### 案A: Step 3 → Step 2（先にLocalStorage削除、後でストアリセット）
* 流れ: LocalStorage を `removeItem` → `resetAllStores()` 実行 → persist が初期値を **再書き込み**
* **結果**: 削除したはずのキーが復活する。`harz:theme` が `{theme:'light',fontSize:'medium'}` で書き戻され、削除目的を果たせない。

### 案B: Step 2 → Step 3（先にストアリセット、後でLocalStorage削除）
* 流れ: `resetAllStores()` 実行 → persist が初期値を LocalStorage に同期書き込み → `removeItem` でその初期値ごと削除
* **結果**: 最終的に LocalStorage は空になる。意図通り。

### 案C: persist を一時無効化してから両方実行
* persist の `setOptions({ skipHydration: true })` 等で書き戻しを抑止する案。
* **デメリット**: API が安定していない・ライブラリ実装に強く依存する。Step 4 のハードリダイレクトで JS ランタイムごと消えるため、ここまでの手間に見合わない。

## 決定

**案B（Step 2 → Step 3）を採用する**。

実装上、`useTenantCleanup` の処理順は以下に固定する。

```
Step 0: WebSocket disconnect
Step 1: queryClient.clear()
Step 2: resetAllStores()         ← persist が初期値を LocalStorage に書き戻す
Step 3: localStorage.removeItem  ← その初期値ごと削除
Step 4: window.location.href     ← JS ランタイムごとリセット
```

## 影響

### 正の影響
* persist の同期書き戻し挙動を逆手に取り、追加 API なしで意図通りの結果が得られる。
* Step 4 のハードリダイレクトにより、Step 0〜3 の部分失敗は次回ロードで無効化されるため、エラーハンドリングを単純化できる（try-catch + Sentry 記録 + 続行）。

### 負の影響
* Zustand `persist` の同期書き戻し挙動に依存している。将来 `persist` が非同期書き込みに変更された場合、この順序の前提が崩れる。
* この順序は直感に反する（普通は「データを消したい → LocalStorage を消す」と書きたくなる）。コメントとテストで意図を明示する必要がある。

### 見直しトリガー
* Zustand `persist` ミドルウェアの仕様変更（同期 → 非同期）。
* persist 採用ストアが大きく増え、書き戻しコストが無視できなくなった場合（バッチクリア API の検討）。

## 参考

* Zustand `persist` ミドルウェア仕様
* [クリーンアップ基盤設計.md](../クリーンアップ基盤設計.md) §ログアウトシーケンス

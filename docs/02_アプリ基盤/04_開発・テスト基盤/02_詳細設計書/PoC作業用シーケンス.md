# /poc コマンド シーケンス図

## エージェント役割定義

| エージェント | 役割 | 担当作業 |
|---|---|---|
| **メインエージェント** | 判断・対話 | ユーザーとの対話、Gate判断、state.md管理、item_{N:02}_{略称}.md作成・総合判定 |
| **poc-item-extractor** | 調査（委譲先） | 方式設計書を読み込みPoC項目を抽出 → `{target}PoC開発計画.md` を作成 |
| **poc-evaluator** | 検証（委譲先） | 実行結果と合否基準を数値照合（モード1: item_NN.md 記入）/ 総合評価・報告書作成（モード2: report.md） |

### メインエージェントにPoC実装させる意図

アプリ基盤のPoCは技術選定の核となる工程であり、**ユーザーとの対話を密に保ちながら実装を進める**ことを優先する。
そのため、実装（Step3-B）・判定（Step3-D）・状態管理（state.md）はメインエージェントが直接担う。

> 詳細設計フェーズ（`/design`）や機能実装フェーズ（`/implement`）では、
> 作成・検証の多くをサブエージェントへ委譲してよい。

---

```mermaid
sequenceDiagram
    participant U as ユーザー
    participant M as メインエージェント
    participant X as poc-item-extractor
    participant E as poc-evaluator

    U->>M: /poc {target}
    Note over M: state.md 確認<br>（初回: 作成 / 継続: next_step から再開）

    rect rgb(230, 245, 230)
        Note over M,X: Step1: PoC項目洗い出し
        M->>X: 方式設計書からPoC項目を抽出
        Note over X: 方式設計書を読む（00_方式設計書/ 配下 .md / .htm）
        X->>X: {target}PoC開発計画.md 作成
        X-->>M: 完了報告（項目数・優先度内訳）
        Note over M: state.md: next_step → 2
    end

    rect rgb(255, 245, 220)
        Note over U,M: Step2: 項目確認 [Gate: CONFIRM]
        M->>U: PoC項目確認（PoC開発計画の要約）
        U-->>M: 承認 / 追加 / 修正
        Note over M: state.md: items_confirmed → true
    end

    rect rgb(255, 230, 230)
        Note over U,M: Step3-0: TBD解消 [Gate: CONFIRM]
        M->>U: TBD確認（PoCへの影響あり項目の一覧）
        U-->>M: 各TBDの方針回答
        Note over M: state.md: tbds_resolved 更新
    end

    loop 各PoC項目（N = 1, 2, ...）

        rect rgb(230, 240, 255)
            Note over M: Step3-A: 実装計画作成
            Note over M: item_{N:02}_{略称}.md を作成<br>（合否基準・実装方針・検証手順）
            M->>U: 実装計画確認 [Gate: CONFIRM]
            U-->>M: 承認 / 修正 / スキップ
        end

        rect rgb(240, 230, 255)
            Note over M: Step3-B: 実装
            Note over M: sample/{target}/{N}_*/ にコード実装（既存流用可）<br>item_{N:02}_{略称}.md「実装詳細」追記
            M->>U: 動作確認して検証してください
        end

        rect rgb(255, 240, 200)
            Note over U,E: Step3-C: 検証
            Note over U: コードを実行<br>実行ログ・測定結果を item_{N:02}_{略称}.md に貼付<br>定性評価（所見・懸念）を記入
            U->>M: /poc {target} 再実行
            M->>E: 定量評価（item_{N:02}_{略称}.md）
            Note over E: 合否基準と実測値を数値照合
            E->>E: item_{N:02}_{略称}.md「AI評価（定量）」追記
            E-->>M: 評価完了（○/× の件数）
        end

        rect rgb(230, 255, 240)
            Note over M: Step3-D: 総合判定
            Note over M: AI評価（定量）+ 定性評価（人間）を統合<br>item_{N:02}_{略称}.md「総合判定」記入
            Note over M: state.md: items_progress[N] → evaluated
        end

        rect rgb(255, 245, 230)
            Note over U,M: Step3-E: 項目承認 [Gate: CONFIRM]
            M->>U: 項目承認確認（Step3-D の総合判定）
            alt 承認
                U-->>M: 承認
                Note over M: state.md: items_progress[N] → approved
            else 再検証する
                U-->>M: 再検証指示
                Note over M: Step3-A に戻り計画を修正
            end
        end

    end

    rect rgb(220, 240, 220)
        Note over U,M: 追加検証確認 [Gate: CONFIRM]
        M->>U: 全項目完了サマリ + 追加検証が必要か確認
        alt 追加不要
            U-->>M: 追加不要 → 報告書作成へ
        else 項目を追加する
            U-->>M: 追加項目を指示
            Note over M: PoC開発計画に追記して Step3-A へ戻る
        end
    end

    rect rgb(200, 230, 255)
        Note over M,E: 総合評価・報告書作成（poc-evaluator）
        M->>E: 全 item_{N:02}_{略称}.md を集約して評価・報告書作成
        Note over E: 項目別合否を集約・総合判定<br>詳細設計への引き継ぎ事項を整理
        E->>E: report.md 作成
        E-->>M: 完了報告（総合判定・引き継ぎ事項の件数）
    end

    rect rgb(255, 245, 210)
        Note over U,M: GO/NOGO 判断 [Gate: GO/NOGO + 承認]
        M->>U: 報告書確認・採用判断（report.md の要約）
        alt 採用 / 条件付き採用
            U-->>M: 採用承認
            Note over M: state.md: go_nogo・report_approved 更新<br>CLAUDE.md: phase → idle
            M->>U: /design 02_アプリ基盤/{file} で詳細設計書作成可能
        else 不採用
            U-->>M: 不採用 + 代替技術を指定
            Note over M: 代替技術で Step3-A に戻る
        else 修正
            U-->>M: 報告書修正指示
            Note over M: report.md を修正して再提示
        end
    end
```

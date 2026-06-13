/**
 * queryKeyStore_test.ts
 *
 * queryKeyStore.ts の sanity テスト。
 *
 * 設計書 L437-439 により、本ファイル（基盤）の責務は「テンプレート作成・保守」のみで、
 * ドメイン別クエリキーの追加とそのテストは実装チーム責務となる。
 * したがって本テストはテンプレート自体の健全性のみを検証する。
 */

import { describe, it, expect } from 'vitest';

import { queries } from '@/shared/keys/queryKeyStore';

describe('queryKeyStore', () => {
  // Q-01: queries が export され、object として読み込める
  it('Q-01: queries が object として export されている', () => {
    expect(queries).toBeDefined();
    expect(typeof queries).toBe('object');
  });

  // Q-02: テンプレート段階ではドメインが未登録（実装チームが追加する前提）
  it('Q-02: テンプレート段階では queries にドメインが登録されていない', () => {
    // createQueryKeyStore({}) の実装上、ドメインキーが存在しないことを確認
    // 実装チームがドメインを追加した時点で本アサーションは更新される
    const domainKeys = Object.keys(queries).filter((key) => !key.startsWith('_'));
    expect(domainKeys).toHaveLength(0);
  });
});

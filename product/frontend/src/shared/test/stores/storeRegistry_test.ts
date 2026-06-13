/**
 * storeRegistry_test.ts
 *
 * storeRegistry.ts の単体テスト（C2網羅）
 *
 * 注意: registry はモジュールレベル変数のためテスト間で状態が引き継がれる。
 * beforeEach で vi.resetModules() を呼び再インポートすることで独立実行を保証する。
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('storeRegistry', () => {
  let registerStore: (resetFn: () => void) => void;
  let resetAllStores: () => void;

  beforeEach(async () => {
    vi.resetModules();
    const mod = await import('@/shared/stores/storeRegistry');
    registerStore = mod.registerStore;
    resetAllStores = mod.resetAllStores;
  });

  // R-01: registerStore() を1回呼ぶとレジストリに1件追加される
  it('R-01: registerStore() を1回呼ぶと、resetAllStores() で登録した関数が呼ばれる', () => {
    const resetFn = vi.fn();
    registerStore(resetFn);
    resetAllStores();
    expect(resetFn).toHaveBeenCalledTimes(1);
  });

  // R-02: registerStore() を3回呼ぶとレジストリに3件追加される
  it('R-02: registerStore() を3回呼ぶと、resetAllStores() で3件全て呼ばれる', () => {
    const fn1 = vi.fn();
    const fn2 = vi.fn();
    const fn3 = vi.fn();
    registerStore(fn1);
    registerStore(fn2);
    registerStore(fn3);
    resetAllStores();
    expect(fn1).toHaveBeenCalledTimes(1);
    expect(fn2).toHaveBeenCalledTimes(1);
    expect(fn3).toHaveBeenCalledTimes(1);
  });

  // R-03: resetAllStores() を呼ぶと登録済みの全reset関数が1回ずつ呼ばれる（forEach T: 1件以上）
  it('R-03: resetAllStores() は登録された全関数をそれぞれ1回実行する', () => {
    const resetFn = vi.fn();
    registerStore(resetFn);
    resetAllStores();
    expect(resetFn).toHaveBeenCalledTimes(1);
  });

  // R-04: resetAllStores() を呼ぶとレジストリの全関数が実行される（3件登録・3件呼び出し確認）
  it('R-04: resetAllStores() は複数登録されたすべての関数を実行する（数の一致確認）', () => {
    const fns = [vi.fn(), vi.fn(), vi.fn()];
    fns.forEach((fn) => registerStore(fn));
    resetAllStores();
    fns.forEach((fn) => expect(fn).toHaveBeenCalledTimes(1));
  });

  // R-05: 1件も登録されていない状態で resetAllStores() を呼んでもエラーにならない（forEach F: 0件）
  it('R-05: 何も登録されていない状態で resetAllStores() を呼んでもエラーにならない', () => {
    expect(() => resetAllStores()).not.toThrow();
  });

  // R-06: registerStore() に渡したのとは別の関数がリセットされない（排他条件）
  it('R-06: 登録していない関数は resetAllStores() で呼ばれない', () => {
    const registeredFn = vi.fn();
    const unregisteredFn = vi.fn();
    registerStore(registeredFn);
    resetAllStores();
    expect(registeredFn).toHaveBeenCalledTimes(1);
    expect(unregisteredFn).not.toHaveBeenCalled();
  });

  // R-07: 同じ関数を registerStore() に2回渡すと resetAllStores() 呼び出し時に2回実行される
  // 設計書 L552「モジュールロード時1回」が呼び出し側責務。重複登録は SHOULD NOT だが、
  // 発生時は push 通り登録回数分実行される（reset 関数は冪等のため副作用なし）。
  it('R-07: 同じ関数を2回 registerStore() に渡すと resetAllStores() で2回実行される（重複チェックなし）', () => {
    const resetFn = vi.fn();
    registerStore(resetFn);
    registerStore(resetFn);
    resetAllStores();
    // 現実装は重複チェックなし・push のみのため2回呼ばれる
    expect(resetFn).toHaveBeenCalledTimes(2);
  });

  // R-08: reset 関数が throw しても他の reset 関数は呼ばれ続ける
  it('R-08: 1つの reset 関数が throw しても他の reset 関数は呼ばれる', () => {
    const throwingReset = vi.fn(() => {
      throw new Error('reset failed');
    });
    const normalReset = vi.fn();
    registerStore(throwingReset);
    registerStore(normalReset);
    expect(() => resetAllStores()).not.toThrow();
    expect(normalReset).toHaveBeenCalledTimes(1);
  });

  // R-09: reset 関数が throw しても resetAllStores 自体は throw しない
  it('R-09: 全 reset 関数が throw しても resetAllStores は throw しない', () => {
    const throwingReset1 = vi.fn(() => { throw new Error('error1'); });
    const throwingReset2 = vi.fn(() => { throw new Error('error2'); });
    registerStore(throwingReset1);
    registerStore(throwingReset2);
    expect(() => resetAllStores()).not.toThrow();
  });
});

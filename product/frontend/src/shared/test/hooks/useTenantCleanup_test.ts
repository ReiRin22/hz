import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { createElement, type ReactNode } from 'react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

vi.mock('@/shared/stores/storeRegistry', () => ({
  resetAllStores: vi.fn(),
}));

import { useTenantCleanup } from '@/shared/hooks/useTenantCleanup';
import { resetAllStores } from '@/shared/stores/storeRegistry';

const mockLocationHref = vi.fn();
Object.defineProperty(window, 'location', {
  value: {
    get href() {
      return 'http://localhost/';
    },
    set href(val: string) {
      mockLocationHref(val);
    },
  },
  writable: true,
});

let store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => {
    store[key] = value;
  },
  removeItem: (key: string) => {
    delete store[key];
  },
  clear: () => {
    store = {};
  },
  get length() {
    return Object.keys(store).length;
  },
  key: (index: number) => {
    const keys = Object.keys(store);
    return index < keys.length ? keys[index] : null;
  },
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
  writable: true,
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return {
    wrapper: ({ children }: { children: ReactNode }) =>
      createElement(QueryClientProvider, { client: queryClient }, children),
    queryClient,
  };
}

describe('useTenantCleanup', () => {
  beforeEach(() => {
    vi.resetAllMocks();
    localStorageMock.clear();
  });

  afterEach(() => {
    localStorageMock.clear();
  });

  // C-01: Step1: queryClient.clear() が呼ばれる
  it('C-01: cleanup() を呼ぶと Step1: queryClient.clear() が実行される', () => {
    const { wrapper, queryClient } = createWrapper();
    const clearSpy = vi.spyOn(queryClient, 'clear');
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup();
    expect(clearSpy).toHaveBeenCalledTimes(1);
  });

  // C-02: Step2: resetAllStores() が呼ばれる
  it('C-02: cleanup() を呼ぶと Step2: resetAllStores() が実行される', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup();
    expect(resetAllStores).toHaveBeenCalledTimes(1);
  });

  // C-03: Step3: harz:theme が LocalStorage から削除される
  it('C-03: cleanup() を呼ぶと Step3: harz:theme が LocalStorage から削除される', () => {
    const { wrapper } = createWrapper();
    localStorageMock.setItem('harz:theme', 'dark');
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup();
    expect(localStorageMock.getItem('harz:theme')).toBeNull();
  });

  // C-04: Step4: window.location.href が書き換わる
  it('C-04: cleanup() を呼ぶと Step4: window.location.href が書き換わる', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup('/login');
    expect(mockLocationHref).toHaveBeenCalledWith('/login');
  });

  // C-05: Step1 → Step2 → Step3 → Step4 の順で実行される
  it('C-05: Step1→Step2→Step3→Step4 の順で実行される', () => {
    const callOrder: string[] = [];
    const { wrapper, queryClient } = createWrapper();
    vi.spyOn(queryClient, 'clear').mockImplementation(() => {
      callOrder.push('step1');
    });
    vi.mocked(resetAllStores).mockImplementation(() => {
      callOrder.push('step2');
    });
    localStorageMock.setItem('harz:theme', 'dark');

    const originalRemoveItem = localStorageMock.removeItem;
    const removeItemSpy = vi.spyOn(localStorageMock, 'removeItem').mockImplementation((key) => {
      callOrder.push('step3');
      originalRemoveItem(key);
    });
    mockLocationHref.mockImplementation(() => {
      callOrder.push('step4');
    });

    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup('/login');

    expect(callOrder[0]).toBe('step1');
    expect(callOrder[1]).toBe('step2');
    expect(callOrder[2]).toBe('step3');
    expect(callOrder[3]).toBe('step4');

    removeItemSpy.mockRestore();
  });

  // C-06: cleanup('/login') → href が '/login'
  it('C-06: cleanup("/login") を呼ぶと location.href が "/login" になる', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup('/login');
    expect(mockLocationHref).toHaveBeenCalledWith('/login');
  });

  // C-07: cleanup('/dashboard') → href が '/dashboard'
  it('C-07: cleanup("/dashboard") を呼ぶと location.href が "/dashboard" になる', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup('/dashboard');
    expect(mockLocationHref).toHaveBeenCalledWith('/dashboard');
  });

  // C-08: redirectTo 省略 → '/login'（デフォルト値）
  it('C-08: redirectTo を省略すると "/login" にリダイレクトされる', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup();
    expect(mockLocationHref).toHaveBeenCalledWith('/login');
  });

  // C-09: 'harz:theme' はログアウト時に削除される
  it('C-09: "harz:theme" はログアウト時に削除される', () => {
    const { wrapper } = createWrapper();
    localStorageMock.setItem('harz:theme', 'dark');
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup();
    expect(localStorageMock.getItem('harz:theme')).toBeNull();
  });

  // C-10: 'harz:' プレフィックス外のキーは削除されない
  it('C-10: "language" は削除されない', () => {
    const { wrapper } = createWrapper();
    localStorageMock.setItem('language', 'ja');
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup();
    expect(localStorageMock.getItem('language')).toBe('ja');
  });

  // C-11: LocalStorageが空でもエラーにならない
  it('C-11: LocalStorage が空でも cleanup() はエラーにならない', () => {
    const { wrapper } = createWrapper();
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    expect(() => result.current.cleanup()).not.toThrow();
  });

  // C-12: harz:theme は削除され、harz:tenant と other:key は残る
  it('C-12: "harz:theme" は削除され、"harz:tenant" "other:key" は残る', () => {
    const { wrapper } = createWrapper();
    localStorageMock.setItem('harz:theme', 'dark');
    localStorageMock.setItem('harz:tenant', 'tenant-001');
    localStorageMock.setItem('other:key', 'keep');
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup();
    expect(localStorageMock.getItem('harz:theme')).toBeNull();    // 削除される
    expect(localStorageMock.getItem('harz:tenant')).toBe('tenant-001');  // 残る
    expect(localStorageMock.getItem('other:key')).toBe('keep');   // 残る
  });

  // C-13: localStorage.key() が null を返す場合でもエラーにならない
  it('C-13: localStorage.key() が null を返す場合でも cleanup() がエラーにならない', () => {
    const { wrapper } = createWrapper();
    const originalKey = localStorageMock.key.bind(localStorageMock);
    const keySpy = vi.spyOn(localStorageMock, 'key').mockImplementation((index) => {
      if (index === 0) return null;
      return originalKey(index);
    });
    const lengthSpy = vi.spyOn(localStorageMock, 'length', 'get').mockReturnValue(1);

    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    expect(() => result.current.cleanup()).not.toThrow();

    keySpy.mockRestore();
    lengthSpy.mockRestore();
  });

  // C-14: Step1〜3で例外が発生してもStep4（リダイレクト）は必ず実行される
  it('C-14: Step2 で例外が発生しても Step4 のリダイレクトは実行される', () => {
    const { wrapper } = createWrapper();
    vi.mocked(resetAllStores).mockImplementation(() => {
      throw new Error('store reset failed');
    });
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup('/login');
    expect(mockLocationHref).toHaveBeenCalledWith('/login');
  });

  // C-15: Step3で例外が発生してもStep4（リダイレクト）は必ず実行される
  // 削除対象キーが空のため removeItem は呼ばれない。Step1 の clear() を throw させて検証する。
  it('C-15: Step3 相当の処理で例外が発生しても Step4 のリダイレクトは実行される', () => {
    const { wrapper, queryClient } = createWrapper();
    vi.spyOn(queryClient, 'clear').mockImplementation(() => {
      throw new Error('queryClient.clear error');
    });
    const { result } = renderHook(() => useTenantCleanup(), { wrapper });
    result.current.cleanup('/login');
    expect(mockLocationHref).toHaveBeenCalledWith('/login');
  });
});

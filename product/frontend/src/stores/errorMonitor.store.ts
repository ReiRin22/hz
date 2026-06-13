import { create } from 'zustand';

/**
 * エラー監視ストア
 *
 * SentryInitializer.tsx の beforeSend フックで収集したエラーを保存する。
 * test-error2 画面で一覧表示するために使用。
 *
 * 【注意】このストアは開発・デバッグ用の暫定実装。
 * GlitchTip 導入後は削除予定。
 */

export interface ErrorEntry {
  id: string;
  timestamp: number;
  type: string; // エラータイプ（TypeError, ReferenceError, Error 等）
  message: string;
  level: string; // error, warning, info 等
  platform: string; // javascript
  environment: string; // development, production
  tags: Record<string, string>; // tenant_id, trace_id 等
  extra: Record<string, unknown>; // API エラー時の追加情報
  stacktrace?: {
    frames: Array<{
      filename?: string;
      function?: string;
      lineno?: number;
      colno?: number;
    }>;
  };
  breadcrumbs: Array<{
    timestamp: number;
    category?: string;
    message?: string;
    level?: string;
  }>;
  sdk: {
    name: string;
    version: string;
  };
  contexts: {
    browser?: {
      name: string;
      version: string;
    };
    os?: {
      name: string;
      version: string;
    };
  };
  user?: {
    id?: string;
    ip_address?: string;
  };
}

interface ErrorMonitorStore {
  errors: ErrorEntry[];
  addError: (error: ErrorEntry) => void;
  clearErrors: () => void;
}

export const useErrorMonitorStore = create<ErrorMonitorStore>((set) => ({
  errors: [],
  addError: (error) =>
    set((state) => ({
      errors: [...state.errors, error],
    })),
  clearErrors: () => set({ errors: [] }),
}));

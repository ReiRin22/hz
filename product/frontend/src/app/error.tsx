'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';

/**
 * グローバル Error Boundary
 *
 * フロントエンド（React/Next.js）内で発生するランタイムエラーを捕捉する最終防波堤。
 *
 * キャッチ対象:
 * - Reactコンポーネントのレンダリング中に発生した例外
 * - useEffect内での未捕捉例外
 *
 * キャッチ対象外:
 * - axiosClientが捕捉したAPIエラー（axios interceptorで処理済み）
 * - イベントハンドラ内の例外（try/catchで個別処理が必要）
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // GlitchTipへ非同期送信
    Sentry.captureException(error);
    console.error('[Global Error Boundary] Error sent to GlitchTip:', {
      name: error.name,
      message: error.message,
      digest: error.digest,
    });
  }, [error]);

  // TODO: エラーメッセージをインラインで定義せず、リソースファイル（i18nファイル等）で一元管理すること。
  // error.nameに応じたメッセージを取得
  const errorMessages: Record<string, { title: string; description: string }> = {
    NetworkError: {
      title: '通信エラーが発生しました',
      description: 'ネットワーク接続を確認して、再試行してください。',
    },
    TypeError: {
      title: 'システムエラーが発生しました',
      description: 'データの処理中にエラーが発生しました。再試行してください。',
    },
    ReferenceError: {
      title: 'システムエラーが発生しました',
      description: 'データの処理中にエラーが発生しました。再試行してください。',
    },
  };

  const { title, description } = errorMessages[error.name] ?? {
    title: 'システムエラーが発生しました',
    description: 'システムが停止しました。時間をおいて再試行するか、システム管理者に連絡してください。',
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* エラーアイコン */}
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg
              className="h-8 w-8 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>

        {/* エラーメッセージ */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-red-600 mb-3">{title}</h1>
          <p className="text-gray-600">{description}</p>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <button
            onClick={() => reset()}
            className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            再試行する
          </button>
          <Link
            href="/"
            className="px-6 py-3 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors font-medium text-center"
          >
            ホームに戻る
          </Link>
        </div>

        {/* エラー詳細情報 */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">エラー詳細</h2>

          {/* エラー種別 */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-600 mb-1">エラー種別</div>
            <div className="text-sm text-gray-800 font-mono bg-gray-50 p-2 rounded">
              {error.name}
            </div>
          </div>

          {/* エラーメッセージ */}
          <div className="mb-4">
            <div className="text-sm font-medium text-gray-600 mb-1">エラーメッセージ</div>
            <div className="text-sm text-gray-800 font-mono bg-gray-50 p-2 rounded break-words">
              {error.message}
            </div>
          </div>

          {/* Digest（Next.jsが付与する場合のみ） */}
          {error.digest && (
            <div className="mb-4">
              <div className="text-sm font-medium text-gray-600 mb-1">エラーID</div>
              <div className="text-sm text-gray-800 font-mono bg-gray-50 p-2 rounded">
                {error.digest}
              </div>
            </div>
          )}

          {/* スタックトレース */}
          {error.stack && (
            <div>
              <div className="text-sm font-medium text-gray-600 mb-1">スタックトレース</div>
              <div className="text-xs text-gray-700 font-mono bg-gray-50 p-3 rounded overflow-x-auto max-h-64 overflow-y-auto">
                <pre className="whitespace-pre-wrap break-words">{error.stack}</pre>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

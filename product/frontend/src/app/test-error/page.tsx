'use client';

import { useState } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * エラーハンドリング動作確認ページ
 *
 * 3種類のエラーフローをテスト:
 * 1. APIエラー（フロントエンド → BFF） - BFF内部でエラー発生 → SentryExceptionFilterで捕捉
 * 2. APIエラー（フロントエンドのみ） - 存在しないエンドポイント404
 * 3. ランタイムエラー（Error Boundary経由） - error.tsxで捕捉
 */
export default function TestErrorPage() {
  const [message, setMessage] = useState<string>('');
  const [shouldThrowError, setShouldThrowError] = useState(false);

  // ランタイムエラーをトリガー（Error Boundaryでキャッチされる）
  if (shouldThrowError) {
    throw new TypeError('テスト用ランタイムエラー: nullオブジェクトへのアクセス');
  }

  // BFFエラーをトリガー（BFF内部でエラー発生）
  const handleBffError = async () => {
    try {
      setMessage('BFFエラーを発生させています...');

      // TODO: URLをハードコーディングせず、環境変数（NEXT_PUBLIC_BFF_URL等）から取得すること。
      // BFFのtest-errorエンドポイントを呼び出し
      const response = await fetch('http://localhost:3001/api/test-error/sync', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'tenant-hospital-a',
          'x-user-id': 'user-12345',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        setMessage(
          `✅ BFFエラーが発生しました\n` +
          `- status: ${errorData.status}\n` +
          `- trace_id: ${errorData.traceId}\n` +
          `- code: ${errorData.errors?.[0]?.code}\n` +
          `\n【GlitchTip確認】\n` +
          `BFF側: 26フィールド送信\n` +
          `フロントエンド側: 33フィールド送信\n` +
          `→ 同じtrace_idで紐付け可能`
        );

        // フロントエンド側でもGlitchTipに送信
        console.log('[TestError] フロントエンド側でGlitchTipに送信開始');
        const error: any = new Error(`BFF Error: ${errorData.status}`);
        error.response = {
          status: errorData.status,
          statusText: errorData.title,
          data: errorData,
        };
        error.config = {
          url: '/api/test-error/sync',
          method: 'GET',
          headers: {
            'x-tenant-id': 'tenant-hospital-a',
            'x-user-id': 'user-12345',
          },
        };

        Sentry.captureException(error, {
          tags: {
            tenant_id: 'tenant-hospital-a',
            trace_id: errorData.traceId,
          },
          extra: {
            status: errorData.status,
            statusText: errorData.title,
            url: '/api/test-error/sync',
            method: 'GET',
            errorResponse: errorData,
          },
        });
        console.log('[TestError] フロントエンド側でGlitchTipに送信完了（beforeSendフックでログ出力）');
      }
    } catch (error) {
      console.error('[Test] BFF Error:', error);
      setMessage('❌ BFFへの接続に失敗しました');
    }
  };

  // APIエラーをシミュレート（存在しないエンドポイント）
  const handleApiError = async () => {
    try {
      setMessage('APIエラー送信中...');

      const response = await fetch('/api/nonexistent-endpoint', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-tenant-id': 'tenant-hospital-a',
        },
        body: JSON.stringify({ test: 'data' }),
      });

      if (!response.ok) {
        const error: any = new Error(`API Error: ${response.status}`);
        error.response = {
          status: response.status,
          statusText: response.statusText,
          data: { traceId: crypto.randomUUID() },
        };
        error.config = {
          url: '/api/nonexistent-endpoint',
          method: 'POST',
          headers: { 'x-tenant-id': 'tenant-hospital-a' },
        };

        console.log('[TestError] APIエラーをGlitchTipに送信開始');
        Sentry.captureException(error, {
          tags: {
            tenant_id: 'tenant-hospital-a',
            trace_id: error.response.data.traceId,
          },
          extra: {
            status: error.response.status,
            statusText: error.response.statusText,
            url: error.config.url,
            method: error.config.method,
          },
        });
        console.log('[TestError] APIエラーをGlitchTipに送信完了（beforeSendフックでログ出力）');

        setMessage(
          `✅ APIエラーをGlitchTipに送信しました\n` +
          `- status: ${response.status}\n` +
          `- フロントエンドのみ: 33フィールド送信`
        );
      }
    } catch (error) {
      console.error('[Test] API Error:', error);
      setMessage('❌ APIエラー送信に失敗しました');
    }
  };

  // ランタイムエラーをトリガー
  const handleRuntimeError = () => {
    setMessage('ランタイムエラーを発生させます...');
    setTimeout(() => setShouldThrowError(true), 100);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            エラーハンドリング動作確認
          </h1>
          <p className="text-gray-600">
            3種類のエラーフローをテストできます。
          </p>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <pre className="text-blue-800 whitespace-pre-wrap text-sm">{message}</pre>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* BFFエラー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-600 font-bold">1</span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">BFFエラー</h2>
                <p className="text-sm text-gray-600 mb-4">
                  BFF内部でエラーを発生させます。
                </p>
              </div>
            </div>
            <button
              onClick={handleBffError}
              className="w-full px-4 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors font-medium"
            >
              BFFエラーを発生させる
            </button>
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-semibold mb-1">動作:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>BFF: 26フィールド</li>
                <li>フロントエンド: 33フィールド</li>
                <li>trace_idで紐付け</li>
              </ul>
            </div>
          </div>

          {/* APIエラー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-orange-600 font-bold">2</span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">APIエラー</h2>
                <p className="text-sm text-gray-600 mb-4">
                  404エラーを発生させます。
                </p>
              </div>
            </div>
            <button
              onClick={handleApiError}
              className="w-full px-4 py-3 bg-orange-600 text-white rounded-md hover:bg-orange-700 transition-colors font-medium"
            >
              APIエラーを発生させる
            </button>
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-semibold mb-1">動作:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>フロントエンドのみ</li>
                <li>33フィールド送信</li>
              </ul>
            </div>
          </div>

          {/* ランタイムエラー */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 font-bold">3</span>
              </div>
              <div className="ml-4">
                <h2 className="text-xl font-bold text-gray-900 mb-2">ランタイムエラー</h2>
                <p className="text-sm text-gray-600 mb-4">
                  Error Boundaryで捕捉します。
                </p>
              </div>
            </div>
            <button
              onClick={handleRuntimeError}
              className="w-full px-4 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
            >
              ランタイムエラーを発生させる
            </button>
            <div className="mt-4 p-3 bg-gray-50 rounded text-xs text-gray-600">
              <p className="font-semibold mb-1">動作:</p>
              <ul className="list-disc list-inside space-y-1">
                <li>33フィールド送信</li>
                <li>error.tsx画面表示</li>
              </ul>
            </div>
          </div>
        </div>

        {/* 確認手順 */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-gray-900 mb-4">確認手順</h3>
          <ol className="list-decimal list-inside space-y-2 text-sm text-gray-700">
            <li><strong>BFFエラー</strong>: BFFコンソールとブラウザコンソールでログ確認</li>
            <li><strong>APIエラー</strong>: ブラウザコンソールでログ確認</li>
            <li><strong>ランタイムエラー</strong>: エラー画面表示を確認</li>
            <li><strong>GlitchTip</strong>: http://localhost:8080 でイベント確認</li>
          </ol>
        </div>
      </div>
    </div>
  );
}

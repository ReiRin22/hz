'use client';

import { useErrorMonitorStore } from '@/stores/errorMonitor.store';

/**
 * エラー監視画面（開発・デバッグ用）
 *
 * SentryInitializer.tsx の beforeSend フックで収集したエラーを一覧表示する。
 *
 * 表示内容:
 * - フロントエンドで発生した全エラー（error.tsx, axiosClient.ts 等）
 * - エラー詳細（34フィールド）
 * - 時系列順に表示
 *
 * 【注意】この画面は暫定実装。GlitchTip 導入後は削除予定。
 */
export default function TestError2Page() {
  const { errors, clearErrors } = useErrorMonitorStore();

  return (
    <div className="fixed inset-0 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto p-8 pb-12">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              エラー監視（開発・デバッグ用）
            </h1>
            <p className="text-gray-600">
              SentryInitializer.tsx で収集したフロントエンドエラーを一覧表示します。
            </p>
          </div>
          <button
            onClick={clearErrors}
            className="px-6 py-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors font-medium"
          >
            全てクリア
          </button>
        </div>

        {/* エラー統計 */}
        <div className="mb-6 bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-3 gap-6">
            <div>
              <div className="text-sm text-gray-600 mb-1">総エラー数</div>
              <div className="text-3xl font-bold text-gray-900">{errors.length}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">最新エラー</div>
              <div className="text-lg text-gray-900">
                {errors.length > 0
                  ? new Date(errors[errors.length - 1].timestamp * 1000).toLocaleTimeString()
                  : '-'}
              </div>
            </div>
            <div>
              <div className="text-sm text-gray-600 mb-1">エラータイプ</div>
              <div className="text-lg text-gray-900">
                {errors.length > 0
                  ? [...new Set(errors.map((e) => e.type))].join(', ')
                  : '-'}
              </div>
            </div>
          </div>
        </div>

        {/* エラーがない場合 */}
        {errors.length === 0 && (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 mb-4">
              <svg
                className="w-16 h-16 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">エラーはまだ収集されていません</p>
            <p className="text-gray-400 text-sm mt-2">
              エラーが発生すると、ここに自動的に表示されます
            </p>
          </div>
        )}

        {/* エラー一覧 */}
        <div className="space-y-4">
          {[...errors].reverse().map((error, index) => (
            <div
              key={error.id}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              {/* エラーヘッダー */}
              <div className="bg-red-50 border-l-4 border-red-600 p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="px-2 py-1 bg-red-600 text-white text-xs font-bold rounded">
                        {error.type}
                      </span>
                      <span className="px-2 py-1 bg-gray-200 text-gray-700 text-xs font-medium rounded">
                        {error.level.toUpperCase()}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(error.timestamp * 1000).toLocaleString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {error.message}
                    </h3>
                    <p className="text-sm text-gray-600">
                      Environment: {error.environment} | Platform: {error.platform}
                    </p>
                  </div>
                  <span className="text-2xl font-bold text-gray-400">
                    #{errors.length - index}
                  </span>
                </div>
              </div>

              {/* エラー詳細 */}
              <div className="p-6">
                <div className="grid grid-cols-2 gap-6">
                  {/* 左カラム */}
                  <div>
                    {/* SDK情報 */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">SDK情報</h4>
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <div className="flex justify-between mb-1">
                          <span className="text-gray-600">Name:</span>
                          <span className="text-gray-900 font-medium">{error.sdk.name}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Version:</span>
                          <span className="text-gray-900 font-medium">{error.sdk.version}</span>
                        </div>
                      </div>
                    </div>

                    {/* コンテキスト */}
                    <div className="mb-6">
                      <h4 className="text-sm font-bold text-gray-700 mb-2">コンテキスト</h4>
                      <div className="bg-gray-50 rounded p-3 text-sm space-y-2">
                        {error.contexts.browser && (
                          <div>
                            <div className="text-gray-600 mb-1">Browser:</div>
                            <div className="text-gray-900 font-medium">
                              {error.contexts.browser.name} {error.contexts.browser.version}
                            </div>
                          </div>
                        )}
                        {error.contexts.os && (
                          <div>
                            <div className="text-gray-600 mb-1">OS:</div>
                            <div className="text-gray-900 font-medium">
                              {error.contexts.os.name} {error.contexts.os.version}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* タグ */}
                    {Object.keys(error.tags).length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">タグ</h4>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          {Object.entries(error.tags).map(([key, value]) => (
                            <div key={key} className="flex justify-between mb-1">
                              <span className="text-gray-600">{key}:</span>
                              <span className="text-gray-900 font-medium">{value}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* ユーザー情報 */}
                    {error.user && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">ユーザー情報</h4>
                        <div className="bg-gray-50 rounded p-3 text-sm">
                          {error.user.id && (
                            <div className="flex justify-between mb-1">
                              <span className="text-gray-600">User ID:</span>
                              <span className="text-gray-900 font-medium">{error.user.id}</span>
                            </div>
                          )}
                          {error.user.ip_address && (
                            <div className="flex justify-between">
                              <span className="text-gray-600">IP Address:</span>
                              <span className="text-gray-900 font-medium">
                                {error.user.ip_address}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* 右カラム */}
                  <div>
                    {/* スタックトレース */}
                    {error.stacktrace && error.stacktrace.frames.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">
                          スタックトレース（最新5件）
                        </h4>
                        <div className="bg-gray-900 rounded p-3 text-xs font-mono text-gray-100 max-h-64 overflow-y-auto">
                          {error.stacktrace.frames.slice(-5).reverse().map((frame, i) => (
                            <div key={i} className="mb-2 pb-2 border-b border-gray-700">
                              <div className="text-yellow-400">{frame.function || '(anonymous)'}</div>
                              <div className="text-gray-400">
                                {frame.filename}:{frame.lineno}:{frame.colno}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 操作履歴（Breadcrumbs） */}
                    {error.breadcrumbs.length > 0 && (
                      <div className="mb-6">
                        <h4 className="text-sm font-bold text-gray-700 mb-2">
                          操作履歴（最新5件）
                        </h4>
                        <div className="bg-gray-50 rounded p-3 text-xs max-h-64 overflow-y-auto">
                          {error.breadcrumbs.slice(-5).map((crumb, i) => (
                            <div key={i} className="mb-2 pb-2 border-b border-gray-200 last:border-0">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                                  {crumb.category || 'default'}
                                </span>
                                <span className="text-gray-500">
                                  {new Date(crumb.timestamp * 1000).toLocaleTimeString()}
                                </span>
                              </div>
                              <div className="text-gray-900">{crumb.message}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* 追加情報（Extra） */}
                    {Object.keys(error.extra).length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-700 mb-2">追加情報</h4>
                        <div className="bg-gray-50 rounded p-3 text-xs font-mono max-h-64 overflow-y-auto">
                          <pre className="text-gray-900 whitespace-pre-wrap">
                            {JSON.stringify(error.extra, null, 2)}
                          </pre>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

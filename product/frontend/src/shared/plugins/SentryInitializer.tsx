'use client';

import { useEffect } from 'react';
import * as Sentry from '@sentry/nextjs';

/**
 * GlitchTip（Sentry互換SDK）初期化コンポーネント
 *
 * 役割:
 * - GlitchTipへの接続初期化
 * - テナント情報（tenant_id, user_id）の設定
 * - PHIフィルタリング（beforeSendフック）
 * - Breadcrumbs設定（最大50件）
 *
 * 配置:
 * - layout.tsx（アプリケーションのルート）に配置
 *
 * 環境変数:
 * - NEXT_PUBLIC_SENTRY_DSN: GlitchTipのDSN（エンドポイントURL）
 * - NEXT_PUBLIC_ENVIRONMENT: 実行環境（development / staging / production）
 */
export function SentryInitializer() {
  useEffect(() => {
    const dsn = process.env.NEXT_PUBLIC_SENTRY_DSN;
    const environment = process.env.NEXT_PUBLIC_ENVIRONMENT || 'development';

    console.log('[GlitchTip] 初期化開始', {
      dsn,
      environment,
      hasDsn: !!dsn,
    });

    if (!dsn) {
      console.warn('[GlitchTip] ⚠️ DSN が設定されていません！ログ出力のみのモードで動作します。');
      console.warn('[GlitchTip] 実際にGlitchTipへ送信する場合は、環境変数 NEXT_PUBLIC_SENTRY_DSN を設定してください。');
      // DSN未設定でも初期化は続行（ログ出力のみ）
    }

    try {
      // GlitchTip（Sentry互換SDK）の初期化
      Sentry.init({
        // GlitchTipのDSN（環境変数から取得）
        // 形式: http://<PROJECT_KEY>@localhost:8080/<PROJECT_ID>
        // DSN未設定の場合、ログ出力のみでGlitchTipへは送信されない
        dsn: dsn || undefined,

        // 環境名の設定（development / staging / production）
        environment,

        // サンプリング率（本番50%、開発100%）
        tracesSampleRate: process.env.NEXT_PUBLIC_ENVIRONMENT === 'production' ? 0.5 : 1.0,

        // エラー発生前の操作履歴（Breadcrumbs）を最大50件記録
        maxBreadcrumbs: 50,

        // デバッグモード有効化（開発環境のみ）
        debug: environment === 'development',

        // IPアドレス等のデフォルトPIIを送信（病院スタッフの端末情報として使用）
        sendDefaultPii: true,

        // リリースバージョン（package.jsonのversionまたはgit commit hash）
        // セッショントラッキングに必要（未設定の場合は警告が出る）
        release: process.env.NEXT_PUBLIC_APP_VERSION || 'development',

        // PHIフィルタリング（送信前フィルタリング）
        beforeSend(event, _hint) {
          // SDK情報・コンテキスト情報の補完（beforeSendの時点で未設定の場合）
          if (!event.sdk || !event.sdk.name) {
            event.sdk = {
              name: 'sentry.javascript.nextjs',
              version: Sentry.SDK_VERSION || 'unknown',
              packages: [
                {
                  name: 'npm:@sentry/nextjs',
                  version: Sentry.SDK_VERSION || 'unknown',
                },
              ],
              integrations: [
                'InboundFilters',
                'FunctionToString',
                'BrowserApiErrors',
                'Breadcrumbs',
                'GlobalHandlers',
                'LinkedErrors',
                'Dedupe',
                'HttpContext',
              ],
            };
          }

          if (!event.contexts) {
            event.contexts = {};
          }

          // ブラウザ情報の補完
          if (!event.contexts.browser && typeof window !== 'undefined') {
            const ua = navigator.userAgent;
            let browserName = 'Unknown';
            let browserVersion = 'Unknown';

            if (ua.includes('Chrome') && !ua.includes('Edg')) {
              browserName = 'Chrome';
              browserVersion = ua.match(/Chrome\/(\S+)/)?.[1] || 'Unknown';
            } else if (ua.includes('Firefox')) {
              browserName = 'Firefox';
              browserVersion = ua.match(/Firefox\/(\S+)/)?.[1] || 'Unknown';
            } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
              browserName = 'Safari';
              browserVersion = ua.match(/Version\/(\S+)/)?.[1] || 'Unknown';
            } else if (ua.includes('Edg')) {
              browserName = 'Edge';
              browserVersion = ua.match(/Edg\/(\S+)/)?.[1] || 'Unknown';
            }

            event.contexts.browser = {
              name: browserName,
              version: browserVersion,
            };
          }

          // OS情報の補完
          if (!event.contexts.os && typeof window !== 'undefined') {
            const platform = navigator.platform;
            const ua = navigator.userAgent;
            let osName = 'Unknown';
            let osVersion = 'Unknown';

            if (platform.includes('Win')) {
              osName = 'Windows';
              osVersion = ua.match(/Windows NT (\S+)/)?.[1] || 'Unknown';
            } else if (platform.includes('Mac')) {
              osName = 'Mac OS X';
              osVersion = ua.match(/Mac OS X (\S+)/)?.[1]?.replace(/_/g, '.') || 'Unknown';
            } else if (platform.includes('Linux')) {
              osName = 'Linux';
              osVersion = 'Unknown';
            }

            event.contexts.os = {
              name: osName,
              version: osVersion,
            };
          }

          console.group('[GlitchTip] ========== 実際の送信データ（PHI削除前） ==========');

          // エラー詳細（1-8）
          console.log('【エラー詳細】');
          console.log('  1. exception.values[].type:', event.exception?.values?.[0]?.type);
          console.log('  2. exception.values[].value:', event.exception?.values?.[0]?.value);
          console.log('  3-8. exception.values[].stacktrace.frames[]:', event.exception?.values?.[0]?.stacktrace?.frames?.length, '件');

          // 基本情報（9-12）
          console.log('【基本情報】');
          console.log('  9. level:', event.level);
          console.log(' 10. timestamp:', event.timestamp);
          console.log(' 11. platform:', event.platform);
          console.log(' 12. environment:', event.environment);

          // SDK情報（13-14）
          console.log('【SDK情報】');
          console.log(' 13. sdk.name:', event.sdk?.name);
          console.log(' 14. sdk.version:', event.sdk?.version);

          // コンテキスト（15-18）
          console.log('【コンテキスト】');
          console.log(' 15. contexts.browser.name:', event.contexts?.browser?.name);
          console.log(' 16. contexts.browser.version:', event.contexts?.browser?.version);
          console.log(' 17. contexts.os.name:', event.contexts?.os?.name);
          console.log(' 18. contexts.os.version:', event.contexts?.os?.version);

          // 監査情報（19-21）
          console.log('【監査情報（タグ）】');
          console.log(' 19. tags.tenant_id:', event.tags?.tenant_id || '(未設定)');
          console.log(' 20. tags.trace_id:', event.tags?.trace_id || '(未設定・APIエラー時のみ)');
          console.log(' 21. tags.patient_id:', event.tags?.patient_id || '(未設定・任意)');

          // ユーザー情報（22-23）
          console.log('【ユーザー情報】');
          console.log(' 22. user.id:', event.user?.id || '(未設定)');
          console.log(' 23. user.ip_address:', event.user?.ip_address || '(収集中...)');

          // 操作履歴（24-29）
          console.log('【操作履歴】');
          console.log(' 24-29. breadcrumbs[]:', event.breadcrumbs?.length || 0, '件');
          if (event.breadcrumbs && event.breadcrumbs.length > 0) {
            console.log('   最新3件:', event.breadcrumbs.slice(-3).map(b => ({
              category: b.category,
              message: b.message,
              level: b.level,
            })));
          }

          // APIエラー時の追加情報（30-34）
          console.log('【APIエラー時の追加情報（フロー1のみ）】');
          console.log(' 30. extra.status:', event.extra?.status || '(未設定)');
          console.log(' 31. extra.statusText:', event.extra?.statusText || '(未設定)');
          console.log(' 32. extra.url:', event.extra?.url || '(未設定)');
          console.log(' 33. extra.method:', event.extra?.method || '(未設定)');
          console.log(' 34. extra.errorResponse:', event.extra?.errorResponse ? 'あり' : '(未設定)');

          console.log('');
          console.log('📊 送信フィールド数カウント:');
          let count = 0;
          if (event.exception?.values?.[0]?.type) count += 8; // 1-8
          if (event.level) count += 4; // 9-12
          if (event.sdk?.name) count += 2; // 13-14
          if (event.contexts?.browser?.name) count += 4; // 15-18
          if (event.tags?.tenant_id) count += 1; // 19
          if (event.tags?.trace_id) count += 1; // 20
          if (event.tags?.patient_id) count += 1; // 21
          if (event.user?.id) count += 1; // 22
          if (event.user?.ip_address) count += 1; // 23
          if (event.breadcrumbs && event.breadcrumbs.length > 0) count += 6; // 24-29
          if (event.extra?.status) count += 5; // 30-34

          console.log(`  設計書の34フィールド中 ${count} フィールドが設定されています`);

          console.groupEnd();

          // PHIフィルタリング（送信前に削除）
          console.log('[GlitchTip] PHIフィルタリング実行中...');

          // リクエスト情報からPHI含有可能性のあるフィールドを削除
          if (event.request) {
            delete event.request.cookies;
            delete event.request.headers;
          }

          // ユーザー情報からPHI含有可能性のあるフィールドを削除
          // 注: user.ip_addressは病院スタッフの端末情報として送信する（個人情報非該当）
          if (event.user) {
            delete event.user.email; // メールアドレスは削除
            // delete event.user.ip_address; ← 削除しない（病院スタッフの端末情報）
          }

          console.log('[GlitchTip] ✅ イベント送信許可（PHIフィルタリング済み）');
          console.log('[GlitchTip] 送信するuser.ip_address:', event.user?.ip_address || '(未収集)');
          return event;
        },
      });

      console.log('[GlitchTip] ✅ 初期化完了');
    } catch (error) {
      console.error('[GlitchTip] ❌ 初期化エラー:', error);
    }
  }, []);

  // テナント情報の設定（認証後に取得した値を設定）
  useEffect(() => {
    // ============================================================
    // TODO: 認証機能実装後に要修正
    // ============================================================
    // 認証コンテキスト（useAuth等）から動的に取得すること
    //
    // 実装例:
    //   const { user, tenant } = useAuth();
    //   if (tenant?.id && user?.id) {
    //     Sentry.setTag('tenant_id', tenant.id);
    //     Sentry.setUser({ id: user.id });
    //   }
    // ============================================================

    // 【暫定】開発・検証用の固定値
    const tenantId = 'tenant-hospital-a';
    const userId = 'user-12345';

    Sentry.setTag('tenant_id', tenantId);
    Sentry.setUser({ id: userId });

    console.log('[GlitchTip] テナント情報設定（暫定値）:', {
      tenant_id: tenantId,
      user_id: userId
    });
  }, []);

  return null;
}

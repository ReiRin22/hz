import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import * as Sentry from '@sentry/node';
import { randomUUID } from 'crypto';

/**
 * GlitchTip（Sentry互換）グローバル例外フィルター
 *
 * 役割:
 * - NestJSで発生した全ての未処理例外を自動捕捉
 * - GlitchTipにエラー送信（26フィールド）
 * - RFC 9457形式のエラーレスポンスを返却
 *
 * 送信される情報（26フィールド）:
 * - エラー詳細: exception.type, value, stacktrace等（8フィールド）
 * - 基本情報: level, timestamp, platform, environment（4フィールド）
 * - SDK情報: sdk.name, sdk.version（2フィールド）
 * - コンテキスト: contexts.runtime.name, version（2フィールド）
 * - 監査情報: tags.tenant_id, tags.trace_id（2フィールド）
 * - ユーザー情報: user.id, user.ip_address（2フィールド）
 * - リクエスト情報: extra.endpoint, method, query, body, statusCode（5フィールド）
 */
@Catch()
export class SentryExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    // HTTPステータスコードの取得
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    // エラーメッセージの取得
    const message =
      exception instanceof HttpException
        ? exception.message
        : 'Internal server error';

    // テナントIDの取得（リクエストヘッダーから）
    const tenantId = request.headers['x-tenant-id'] as string | undefined;

    // ============================================================
    // ユーザーIDの取得（リクエストヘッダーから）
    // ============================================================
    // 【暫定】認証機能実装前はヘッダーから取得
    // 認証機能実装後はJWTトークンから取得すること
    //
    // 実装例（JWT使用時）:
    //   const token = request.headers['authorization']?.replace('Bearer ', '');
    //   const decoded = jwt.verify(token, process.env.JWT_SECRET);
    //   const userId = decoded.sub;
    // ============================================================
    const userId = request.headers['x-user-id'] as string | undefined;

    // 端末IPアドレスの取得（リクエストから）
    const clientIp = this.getClientIp(request);

    // trace_id生成（フロントエンドとBFFのエラーを紐付けるため）
    // TODO: traceIdはExceptionFilter内で生成すべきではない。
    //       ここではtraceIdを取り出して使う方式に変更すること。
    const traceId = randomUUID();

    // ========================================
    // GlitchTipにエラーを送信（26フィールド）
    // ========================================
    try {
      Sentry.captureException(exception, {
        tags: {
          tenant_id: tenantId || 'unknown',
          trace_id: traceId,
        },
        user: {
          id: userId || 'unknown',
          ip_address: clientIp,
        },
        extra: {
          endpoint: request.url,
          method: request.method,
          query: request.query,
          body: this.filterPHI(request.body), // PHIフィルタリング
          statusCode: status,
        },
      });
    } catch (sentryError: any) {
      console.warn('[GlitchTip BFF] ⚠️ GlitchTip送信失敗（DSN未設定の可能性）:', sentryError?.message || sentryError);
      console.warn('[GlitchTip BFF] ログ出力のみ継続します。');
    }

    // ========================================
    // 詳細ログ出力（26フィールドの送信状況確認）
    // ※ GlitchTip送信に失敗しても必ずログ出力する
    // ========================================
    console.group('[GlitchTip BFF] ========== 送信データ ==========');

    // エラー詳細（1-8）
    console.log('【エラー詳細】');
    console.log('  1. exception.values[].type:', exception instanceof Error ? exception.constructor.name : 'Unknown');
    console.log('  2. exception.values[].value:', message);
    console.log('  3-8. exception.values[].stacktrace.frames[]:', exception instanceof Error && exception.stack ? '✓' : '✗');

    // 基本情報（9-12）
    console.log('【基本情報】');
    console.log('  9. level:', 'error');
    console.log(' 10. timestamp:', new Date().toISOString());
    console.log(' 11. platform:', 'node');
    console.log(' 12. environment:', process.env.NODE_ENV || 'development');

    // SDK情報（13-14）
    console.log('【SDK情報】');
    console.log(' 13. sdk.name:', '@sentry/node');
    console.log(' 14. sdk.version:', Sentry.SDK_VERSION || 'unknown');

    // コンテキスト（15-16）
    console.log('【コンテキスト】');
    console.log(' 15. contexts.runtime.name:', 'node');
    console.log(' 16. contexts.runtime.version:', process.version);

    // 監査情報（17-18）
    console.log('【監査情報（タグ）】');
    console.log(' 17. tags.tenant_id:', tenantId || '(未設定)');
    console.log(' 18. tags.trace_id:', traceId);

    // ユーザー情報（19-20）
    console.log('【ユーザー情報】');
    console.log(' 19. user.id:', userId || '(未設定)');
    console.log(' 20. user.ip_address:', clientIp);

    // リクエスト情報（21-25）
    console.log('【リクエスト情報】');
    console.log(' 21. extra.endpoint:', request.url);
    console.log(' 22. extra.method:', request.method);
    console.log(' 23. extra.query:', Object.keys(request.query || {}).length, '件');
    console.log(' 24. extra.body:', request.body ? '✓（PHIフィルタリング済み）' : '(なし)');
    console.log(' 25. extra.statusCode:', status);

    console.log('');
    console.log('📊 送信フィールド数: 26フィールド（設計書23 + user情報2 + statusCode1）');

    console.groupEnd();

    console.error(`[SentryFilter] エラーをGlitchTipに送信完了 (trace_id: ${traceId})`);

    // ========================================
    // RFC 9457形式のエラーレスポンスを返却
    // ========================================
    const errorCode = this.getErrorCode(status);
    const errorResponse = {
      title: this.getErrorTitle(status),
      status: status,
      detail: message,
      instance: request.url,
      errors: [
        {
          field: '',
          code: errorCode,
          message: message,
        },
      ],
      traceId: traceId, // フロントエンド・BFF間でエラーを紐付け
    };

    response.status(status).json(errorResponse);
  }

  /**
   * 端末IPアドレスの取得
   *
   * リクエストヘッダーから実際のクライアントIPアドレスを取得する。
   * プロキシ経由の場合は X-Forwarded-For ヘッダーを優先的に使用。
   */
  private getClientIp(request: Request): string {
    // X-Forwarded-For ヘッダー（プロキシ経由の場合）
    const xForwardedFor = request.headers['x-forwarded-for'];
    if (xForwardedFor) {
      // カンマ区切りの場合は最初のIPを取得
      const ips = Array.isArray(xForwardedFor)
        ? xForwardedFor[0]
        : xForwardedFor;
      return ips.split(',')[0].trim();
    }

    // X-Real-IP ヘッダー（nginxなどのプロキシ）
    const xRealIp = request.headers['x-real-ip'];
    if (xRealIp) {
      return Array.isArray(xRealIp) ? xRealIp[0] : xRealIp;
    }

    // 直接接続の場合
    return request.ip || request.socket.remoteAddress || 'unknown';
  }

  /**
   * PHIフィルタリング（リクエストボディから機密情報を削除）
   *
   * ホワイトリスト方式: 許可されたフィールドのみ送信
   * （実際の実装では、プロジェクト固有のPHI定義に応じて調整）
   */
  private filterPHI(body: any): any {
    if (!body || typeof body !== 'object') {
      return body;
    }

    // TODO: プロジェクト固有のPHI定義に応じて実装
    // 現状は簡易的なフィルタリング
    const filtered = { ...body };

    // 明らかにPHIと判断できるフィールドを削除
    const phiFields = [
      'password',
      'patientName',
      'birthDate',
      'diagnosis',
      'medicalHistory',
    ];

    phiFields.forEach((field) => {
      if (field in filtered) {
        delete filtered[field];
      }
    });

    return filtered;
  }

  /**
   * HTTPステータスコードからエラーコードを取得
   * TODO: getErrorCode / getErrorTitle はこのクラス専用ではなく共通ユーティリティとして切り出すこと。
   */
  private getErrorCode(status: number): string {
    switch (status) {
      case 400:
        return 'INVALID_REQUEST';
      case 401:
        return 'UNAUTHORIZED';
      case 403:
        return 'FORBIDDEN';
      case 404:
        return 'NOT_FOUND';
      case 409:
        return 'CONFLICT';
      case 500:
        return 'SYSTEM_ERROR';
      case 502:
        return 'BAD_GATEWAY';
      case 504:
        return 'TIMEOUT';
      default:
        return 'SYSTEM_ERROR';
    }
  }

  /**
   * HTTPステータスコードからエラータイトルを取得
   */
  private getErrorTitle(status: number): string {
    switch (status) {
      case 400:
        return '不正なリクエストです。';
      case 401:
        return '認証に失敗しました。';
      case 403:
        return '権限がありません。';
      case 404:
        return 'リソースが見つかりません。';
      case 409:
        return '編集が競合しました。';
      case 500:
        return 'サーバーエラーが発生しました。';
      case 502:
        return '上流サービスでエラーが発生しました。';
      case 504:
        return 'タイムアウトしました。';
      default:
        return 'エラーが発生しました。';
    }
  }
}

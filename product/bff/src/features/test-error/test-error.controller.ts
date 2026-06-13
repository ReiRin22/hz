import { Controller, Get, Post, Body } from '@nestjs/common';
import * as Sentry from '@sentry/node';

/**
 * エラー監視テスト用コントローラー
 * GlitchTipへのエラー送信を検証するためのエンドポイント
 */
@Controller('test-error')
export class TestErrorController {
  /**
   * 同期エラーのテスト
   * GET /api/test-error/sync
   */
  @Get('sync')
  testSyncError(): void {
    console.log('[TestError] 同期エラーを発生させます');
    throw new Error('BFF同期エラーテスト: これは意図的に発生させたエラーです');
  }

  /**
   * 非同期エラーのテスト
   * GET /api/test-error/async
   */
  @Get('async')
  async testAsyncError(): Promise<void> {
    console.log('[TestError] 非同期エラーを発生させます');
    await new Promise((resolve) => setTimeout(resolve, 100));
    throw new Error('BFF非同期エラーテスト: これは意図的に発生させたエラーです');
  }

  /**
   * 手動でGlitchTipにエラーを送信するテスト
   * POST /api/test-error/manual
   */
  @Post('manual')
  testManualError(@Body() body: { message: string; tenantId?: string }): { success: boolean } {
    console.log('[TestError] 手動エラー送信:', body.message);

    // テナントIDの設定（マルチテナント対応）
    if (body.tenantId) {
      Sentry.setTag('tenant_id', body.tenantId);
    }

    // 手動でエラーをキャプチャ
    const error = new Error(body.message || 'BFF手動エラーテスト');
    Sentry.captureException(error, {
      tags: {
        test_type: 'manual',
      },
      extra: {
        request_body: body,
      },
    });

    return { success: true };
  }

  /**
   * エラーなし（正常動作確認用）
   * GET /api/test-error/health
   */
  @Get('health')
  health(): { status: string; message: string } {
    console.log('[TestError] ヘルスチェック');
    return {
      status: 'ok',
      message: 'BFF test-error endpoint is working',
    };
  }
}

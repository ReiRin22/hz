import 'reflect-metadata'; // 🔴 必ず一番上に追加！
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';
import * as Sentry from '@sentry/node';
import { SentryExceptionFilter } from '@shared/filters/sentry-exception.filter';

async function bootstrap() {
  // ========================================
  // GlitchTip（Sentry互換SDK）初期化
  // ========================================
  const sentryDsn = process.env.SENTRY_DSN;

  if (!sentryDsn) {
    console.warn('[GlitchTip BFF] ⚠️ SENTRY_DSN が設定されていません！ログ出力のみのモードで動作します。');
    console.warn('[GlitchTip BFF] 実際にGlitchTipへ送信する場合は、環境変数 SENTRY_DSN を設定してください。');
  } else {
    console.log('[GlitchTip BFF] 初期化開始:', { dsn: sentryDsn });
  }

  Sentry.init({
    // GlitchTipのDSN（環境変数から取得）
    // 形式: http://<PROJECT_KEY>@localhost:8080/<PROJECT_ID>
    // DSN未設定の場合、ログ出力のみでGlitchTipへは送信されない
    dsn: sentryDsn || undefined,

    // 環境名の設定（development / staging / production）
    environment: process.env.NODE_ENV || 'development',

    // サンプリング率（本番50%、開発100%）
    tracesSampleRate: process.env.NODE_ENV === 'production' ? 0.5 : 1.0,

    // PHIフィルタリング（フロントエンドと同様）
    beforeSend(event) {
      // リクエスト情報からPHI含有可能性のあるフィールドを削除
      if (event.request) {
        delete event.request.cookies;
        delete event.request.headers;
      }

      return event;
    },
  });

  // NestJS インスタンスを作成（これで AppModule 配下の Controller が解析される）
  const app = await NestFactory.create(AppModule);

  // グローバルエラーフィルターを登録（GlitchTipにエラーを送信）
  app.useGlobalFilters(new SentryExceptionFilter());

  app.enableCors({
    origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    credentials: true,
  });

  // もし今まで /api/... でアクセスしていたなら、ここでプレフィックスを付ける
  app.setGlobalPrefix('bff');

  // ========================================
  // リクエストごとにテナントIDをGlitchTipに設定するミドルウェア
  // ========================================
  app.use((req: any, res: any, next: any) => {
    // ヘッダーからテナントID取得
    const tenantId = req.headers['x-tenant-id'];

    if (tenantId) {
      Sentry.setTag('tenant_id', tenantId as string);
    }

    next();
  });

  // ポート 3001 で待機
  await app.listen(3001);
  console.log('BFF (NestJS) is running on: http://localhost:3001');
}

bootstrap();

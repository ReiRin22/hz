import 'reflect-metadata'; // 🔴 必ず一番上に追加！
import { NestFactory } from '@nestjs/core';
import { AppModule } from '@/app.module';

async function bootstrap() {
  // NestJS インスタンスを作成（これで AppModule 配下の Controller が解析される）
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: 'http://localhost:3000', // フロントエンドのURLを指定
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // クッキーなどを含める場合に必要
  });

  // もし今まで /api/... でアクセスしていたなら、ここでプレフィックスを付ける
  app.setGlobalPrefix('api');

  // ポート 3001 で待機
  await app.listen(3001);
  console.log('BFF (NestJS) is running on: http://localhost:3001');
}

bootstrap();
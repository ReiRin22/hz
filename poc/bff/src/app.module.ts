import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { UserModule } from '@/features/user/user.module';
import { KarteModule } from '@/features/karte/karte.module';
import { PatientModule } from '@/features/patient/patient.module';
import { DecryptionMiddleware } from '@shared/plugins/decryption.middleware';

@Module({
  imports: [
    UserModule,
    KarteModule,
    PatientModule,
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(DecryptionMiddleware)
      .forRoutes('*'); // 全てのルートに適用（必要に応じて特定のパスに絞れます）
  }
}
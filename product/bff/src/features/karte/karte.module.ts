import { Module } from '@nestjs/common';
import { KarteController } from '@/features/karte/karte.controller';
import { KarteService } from '@/features/karte/karte.service';
import { KarteClient } from '@/features/karte/karte.client';

@Module({
  controllers: [KarteController],
  providers: [
    KarteService,
    KarteClient
  ],

})
export class KarteModule {}
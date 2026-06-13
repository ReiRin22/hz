import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HandoverController } from './handover.controller';
import { HandoverService } from './handover.service';
import { HandoverClient } from './handover.client';

@Module({
  imports: [HttpModule],
  controllers: [HandoverController],
  providers: [HandoverService, HandoverClient],
})
export class HandoverModule {}

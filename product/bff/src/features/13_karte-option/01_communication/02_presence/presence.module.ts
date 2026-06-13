import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PresenceController } from './presence.controller';
import { PresenceService } from './presence.service';
import { PresenceClient } from './presence.client';

@Module({
  imports: [HttpModule],
  controllers: [PresenceController],
  providers: [PresenceService, PresenceClient],
})
export class PresenceModule {}

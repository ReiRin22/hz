import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MwmController } from './mwm.controller';
import { MwmService } from './mwm.service';
import { MwmClient } from './mwm.client';

@Module({
  imports: [HttpModule],
  controllers: [MwmController],
  providers: [MwmService, MwmClient],
})
export class MwmModule {}

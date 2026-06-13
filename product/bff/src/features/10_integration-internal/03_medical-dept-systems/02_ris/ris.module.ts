import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RisController } from './ris.controller';
import { RisService } from './ris.service';
import { RisClient } from './ris.client';

@Module({
  imports: [HttpModule],
  controllers: [RisController],
  providers: [RisService, RisClient],
})
export class RisModule {}

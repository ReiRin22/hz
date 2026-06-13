import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ResultDisplayController } from './result-display.controller';
import { ResultDisplayService } from './result-display.service';
import { ResultDisplayClient } from './result-display.client';

@Module({
  imports: [HttpModule],
  controllers: [ResultDisplayController],
  providers: [ResultDisplayService, ResultDisplayClient],
})
export class ResultDisplayModule {}

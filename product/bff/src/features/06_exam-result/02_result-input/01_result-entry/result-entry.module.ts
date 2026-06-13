import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ResultEntryController } from './result-entry.controller';
import { ResultEntryService } from './result-entry.service';
import { ResultEntryClient } from './result-entry.client';

@Module({
  imports: [HttpModule],
  controllers: [ResultEntryController],
  providers: [ResultEntryService, ResultEntryClient],
})
export class ResultEntryModule {}

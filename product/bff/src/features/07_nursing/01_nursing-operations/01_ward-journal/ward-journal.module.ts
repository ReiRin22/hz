import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WardJournalController } from './ward-journal.controller';
import { WardJournalService } from './ward-journal.service';
import { WardJournalClient } from './ward-journal.client';

@Module({
  imports: [HttpModule],
  controllers: [WardJournalController],
  providers: [WardJournalService, WardJournalClient],
})
export class WardJournalModule {}

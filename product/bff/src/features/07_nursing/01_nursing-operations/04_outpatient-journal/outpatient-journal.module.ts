import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutpatientJournalController } from './outpatient-journal.controller';
import { OutpatientJournalService } from './outpatient-journal.service';
import { OutpatientJournalClient } from './outpatient-journal.client';

@Module({
  imports: [HttpModule],
  controllers: [OutpatientJournalController],
  providers: [OutpatientJournalService, OutpatientJournalClient],
})
export class OutpatientJournalModule {}

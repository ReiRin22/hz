import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingMgmtJournalController } from './nursing-mgmt-journal.controller';
import { NursingMgmtJournalService } from './nursing-mgmt-journal.service';
import { NursingMgmtJournalClient } from './nursing-mgmt-journal.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingMgmtJournalController],
  providers: [NursingMgmtJournalService, NursingMgmtJournalClient],
})
export class NursingMgmtJournalModule {}

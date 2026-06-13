import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HospitalJournalController } from './hospital-journal.controller';
import { HospitalJournalService } from './hospital-journal.service';
import { HospitalJournalClient } from './hospital-journal.client';

@Module({
  imports: [HttpModule],
  controllers: [HospitalJournalController],
  providers: [HospitalJournalService, HospitalJournalClient],
})
export class HospitalJournalModule {}

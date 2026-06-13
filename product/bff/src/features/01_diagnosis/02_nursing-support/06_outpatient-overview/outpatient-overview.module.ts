import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { OutpatientOverviewController } from './outpatient-overview.controller';
import { OutpatientOverviewService } from './outpatient-overview.service';
import { OutpatientOverviewClient } from './outpatient-overview.client';

@Module({
  imports: [HttpModule],
  controllers: [OutpatientOverviewController],
  providers: [OutpatientOverviewService, OutpatientOverviewClient],
})
export class OutpatientOverviewModule {}

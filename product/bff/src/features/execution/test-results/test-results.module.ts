import { Module } from '@nestjs/common';
import { TestResultsController } from '@/features/execution/test-results/test-results.controller';
import { TestResultsService } from '@/features/execution/test-results/test-results.service';
import { TestResultsClient } from '@/features/execution/test-results/test-results.client';
import { TestItemMasterModule } from '@shared/master/test-item-master/test-item-master.module';

@Module({
  imports: [TestItemMasterModule],
  controllers: [TestResultsController],
  providers: [
    TestResultsService,
    TestResultsClient,
  ],
})
export class TestResultsModule {}

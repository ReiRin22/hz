import { Module } from '@nestjs/common';
import { TestItemMasterController } from '@shared/master/test-item-master/test-item-master.controller';
import { TestItemMasterService } from '@shared/master/test-item-master/test-item-master.service';
import { TestItemMasterClient } from '@shared/master/test-item-master/test-item-master.client';

@Module({
  controllers: [TestItemMasterController],
  providers: [
    TestItemMasterService,
    TestItemMasterClient,
  ],
  exports: [TestItemMasterService],
})
export class TestItemMasterModule {}

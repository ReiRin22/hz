import { Module } from '@nestjs/common';
import { BloodTypeMasterController } from '@shared/sample/master/blood-type-master.controller';
import { BloodTypeMasterService } from '@shared/sample/master/blood-type-master.service';
import { BloodTypeMasterClient } from '@shared/sample/master/blood-type-master.client';

@Module({
  controllers: [BloodTypeMasterController],
  providers: [
    BloodTypeMasterService,
    BloodTypeMasterClient,
  ],
})
export class BloodTypeMasterModule {}

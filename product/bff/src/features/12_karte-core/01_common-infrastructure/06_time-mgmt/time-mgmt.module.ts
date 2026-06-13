import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { TimeMgmtController } from './time-mgmt.controller';
import { TimeMgmtService } from './time-mgmt.service';
import { TimeMgmtClient } from './time-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [TimeMgmtController],
  providers: [TimeMgmtService, TimeMgmtClient],
})
export class TimeMgmtModule {}

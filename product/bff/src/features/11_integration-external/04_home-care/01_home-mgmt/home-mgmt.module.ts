import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { HomeMgmtController } from './home-mgmt.controller';
import { HomeMgmtService } from './home-mgmt.service';
import { HomeMgmtClient } from './home-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [HomeMgmtController],
  providers: [HomeMgmtService, HomeMgmtClient],
})
export class HomeMgmtModule {}

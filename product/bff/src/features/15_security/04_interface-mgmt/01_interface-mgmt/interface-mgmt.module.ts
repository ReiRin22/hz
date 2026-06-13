import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InterfaceMgmtController } from './interface-mgmt.controller';
import { InterfaceMgmtService } from './interface-mgmt.service';
import { InterfaceMgmtClient } from './interface-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [InterfaceMgmtController],
  providers: [InterfaceMgmtService, InterfaceMgmtClient],
})
export class InterfaceMgmtModule {}

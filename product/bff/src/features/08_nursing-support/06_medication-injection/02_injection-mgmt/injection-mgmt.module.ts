import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { InjectionMgmtController } from './injection-mgmt.controller';
import { InjectionMgmtService } from './injection-mgmt.service';
import { InjectionMgmtClient } from './injection-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [InjectionMgmtController],
  providers: [InjectionMgmtService, InjectionMgmtClient],
})
export class InjectionMgmtModule {}

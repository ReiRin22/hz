import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { PressureSoreMgmtController } from './pressure-sore-mgmt.controller';
import { PressureSoreMgmtService } from './pressure-sore-mgmt.service';
import { PressureSoreMgmtClient } from './pressure-sore-mgmt.client';

@Module({
  imports: [HttpModule],
  controllers: [PressureSoreMgmtController],
  providers: [PressureSoreMgmtService, PressureSoreMgmtClient],
})
export class PressureSoreMgmtModule {}

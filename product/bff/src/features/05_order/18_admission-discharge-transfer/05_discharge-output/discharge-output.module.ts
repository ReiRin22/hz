import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DischargeOutputController } from './discharge-output.controller';
import { DischargeOutputService } from './discharge-output.service';
import { DischargeOutputClient } from './discharge-output.client';

@Module({
  imports: [HttpModule],
  controllers: [DischargeOutputController],
  providers: [DischargeOutputService, DischargeOutputClient],
})
export class DischargeOutputModule {}

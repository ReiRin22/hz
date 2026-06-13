import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ContraindicationCheckController } from './contraindication-check.controller';
import { ContraindicationCheckService } from './contraindication-check.service';
import { ContraindicationCheckClient } from './contraindication-check.client';

@Module({
  imports: [HttpModule],
  controllers: [ContraindicationCheckController],
  providers: [ContraindicationCheckService, ContraindicationCheckClient],
})
export class ContraindicationCheckModule {}

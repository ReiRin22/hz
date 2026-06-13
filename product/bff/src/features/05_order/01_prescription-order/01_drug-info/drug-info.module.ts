import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DrugInfoController } from './drug-info.controller';
import { DrugInfoService } from './drug-info.service';
import { DrugInfoClient } from './drug-info.client';

@Module({
  imports: [HttpModule],
  controllers: [DrugInfoController],
  providers: [DrugInfoService, DrugInfoClient],
})
export class DrugInfoModule {}

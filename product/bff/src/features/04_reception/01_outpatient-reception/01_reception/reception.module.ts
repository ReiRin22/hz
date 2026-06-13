import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReceptionController } from './reception.controller';
import { ReceptionService } from './reception.service';
import { ReceptionClient } from './reception.client';

@Module({
  imports: [HttpModule],
  controllers: [ReceptionController],
  providers: [ReceptionService, ReceptionClient],
})
export class ReceptionModule {}

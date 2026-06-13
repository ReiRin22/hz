import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RevisitReceptionController } from './revisit-reception.controller';
import { RevisitReceptionService } from './revisit-reception.service';
import { RevisitReceptionClient } from './revisit-reception.client';

@Module({
  imports: [HttpModule],
  controllers: [RevisitReceptionController],
  providers: [RevisitReceptionService, RevisitReceptionClient],
})
export class RevisitReceptionModule {}

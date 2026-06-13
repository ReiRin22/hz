import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NurseCallController } from './nurse-call.controller';
import { NurseCallService } from './nurse-call.service';
import { NurseCallClient } from './nurse-call.client';

@Module({
  imports: [HttpModule],
  controllers: [NurseCallController],
  providers: [NurseCallService, NurseCallClient],
})
export class NurseCallModule {}

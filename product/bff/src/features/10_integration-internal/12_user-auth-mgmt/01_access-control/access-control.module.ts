import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { AccessControlController } from './access-control.controller';
import { AccessControlService } from './access-control.service';
import { AccessControlClient } from './access-control.client';

@Module({
  imports: [HttpModule],
  controllers: [AccessControlController],
  providers: [AccessControlService, AccessControlClient],
})
export class AccessControlModule {}

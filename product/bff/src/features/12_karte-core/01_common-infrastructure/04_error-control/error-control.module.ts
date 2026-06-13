import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ErrorControlController } from './error-control.controller';
import { ErrorControlService } from './error-control.service';
import { ErrorControlClient } from './error-control.client';

@Module({
  imports: [HttpModule],
  controllers: [ErrorControlController],
  providers: [ErrorControlService, ErrorControlClient],
})
export class ErrorControlModule {}

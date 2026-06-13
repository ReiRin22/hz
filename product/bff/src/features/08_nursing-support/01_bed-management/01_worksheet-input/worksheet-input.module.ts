import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { WorksheetInputController } from './worksheet-input.controller';
import { WorksheetInputService } from './worksheet-input.service';
import { WorksheetInputClient } from './worksheet-input.client';

@Module({
  imports: [HttpModule],
  controllers: [WorksheetInputController],
  providers: [WorksheetInputService, WorksheetInputClient],
})
export class WorksheetInputModule {}

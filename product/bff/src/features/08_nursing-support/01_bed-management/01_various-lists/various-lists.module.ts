import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { VariousListsController } from './various-lists.controller';
import { VariousListsService } from './various-lists.service';
import { VariousListsClient } from './various-lists.client';

@Module({
  imports: [HttpModule],
  controllers: [VariousListsController],
  providers: [VariousListsService, VariousListsClient],
})
export class VariousListsModule {}

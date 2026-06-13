import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DocumentStatusController } from './document-status.controller';
import { DocumentStatusService } from './document-status.service';
import { DocumentStatusClient } from './document-status.client';

@Module({
  imports: [HttpModule],
  controllers: [DocumentStatusController],
  providers: [DocumentStatusService, DocumentStatusClient],
})
export class DocumentStatusModule {}

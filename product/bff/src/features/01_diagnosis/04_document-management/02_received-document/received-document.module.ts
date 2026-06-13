import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ReceivedDocumentController } from './received-document.controller';
import { ReceivedDocumentService } from './received-document.service';
import { ReceivedDocumentClient } from './received-document.client';

@Module({
  imports: [HttpModule],
  controllers: [ReceivedDocumentController],
  providers: [ReceivedDocumentService, ReceivedDocumentClient],
})
export class ReceivedDocumentModule {}

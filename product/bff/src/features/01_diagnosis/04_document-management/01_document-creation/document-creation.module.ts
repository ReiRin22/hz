import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { DocumentCreationController } from './document-creation.controller';
import { DocumentCreationService } from './document-creation.service';
import { DocumentCreationClient } from './document-creation.client';

@Module({
  imports: [HttpModule],
  controllers: [DocumentCreationController],
  providers: [DocumentCreationService, DocumentCreationClient],
})
export class DocumentCreationModule {}

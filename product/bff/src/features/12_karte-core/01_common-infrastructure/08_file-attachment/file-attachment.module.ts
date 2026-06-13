import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { FileAttachmentController } from './file-attachment.controller';
import { FileAttachmentService } from './file-attachment.service';
import { FileAttachmentClient } from './file-attachment.client';

@Module({
  imports: [HttpModule],
  controllers: [FileAttachmentController],
  providers: [FileAttachmentService, FileAttachmentClient],
})
export class FileAttachmentModule {}

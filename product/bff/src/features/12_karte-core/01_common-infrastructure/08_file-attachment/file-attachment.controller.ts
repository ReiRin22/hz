import { Controller } from '@nestjs/common';
import { FileAttachmentService } from './file-attachment.service';

@Controller('file-attachment')
export class FileAttachmentController {
  constructor(private readonly fileAttachmentService: FileAttachmentService) {}

  // TODO: エンドポイントを実装
}

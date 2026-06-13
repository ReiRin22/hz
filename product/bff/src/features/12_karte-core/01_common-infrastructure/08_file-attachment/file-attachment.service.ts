import { Injectable } from '@nestjs/common';
import { FileAttachmentClient } from './file-attachment.client';

@Injectable()
export class FileAttachmentService {
  constructor(private readonly fileAttachmentClient: FileAttachmentClient) {}

  // TODO: ビジネスロジックを実装
}

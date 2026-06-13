import { Controller } from '@nestjs/common';
import { DocumentCreationService } from './document-creation.service';

@Controller('document-creation')
export class DocumentCreationController {
  constructor(private readonly documentCreationService: DocumentCreationService) {}

  // TODO: エンドポイントを実装
}

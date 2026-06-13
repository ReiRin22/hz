import { Controller } from '@nestjs/common';
import { NursingDocumentService } from './nursing-document.service';

@Controller('nursing-document')
export class NursingDocumentController {
  constructor(private readonly nursingDocumentService: NursingDocumentService) {}

  // TODO: エンドポイントを実装
}

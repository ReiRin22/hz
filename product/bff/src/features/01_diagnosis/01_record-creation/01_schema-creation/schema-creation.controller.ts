import { Controller } from '@nestjs/common';
import { SchemaCreationService } from './schema-creation.service';

@Controller('schema-creation')
export class SchemaCreationController {
  constructor(private readonly schemaCreationService: SchemaCreationService) {}

  // TODO: エンドポイントを実装
}

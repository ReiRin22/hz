import { Injectable } from '@nestjs/common';
import { SchemaCreationClient } from './schema-creation.client';

@Injectable()
export class SchemaCreationService {
  constructor(private readonly schemaCreationClient: SchemaCreationClient) {}

  // TODO: ビジネスロジックを実装
}

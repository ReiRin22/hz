import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { SchemaCreationController } from './schema-creation.controller';
import { SchemaCreationService } from './schema-creation.service';
import { SchemaCreationClient } from './schema-creation.client';

@Module({
  imports: [HttpModule],
  controllers: [SchemaCreationController],
  providers: [SchemaCreationService, SchemaCreationClient],
})
export class SchemaCreationModule {}

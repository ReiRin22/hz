import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NursingDocumentController } from './nursing-document.controller';
import { NursingDocumentService } from './nursing-document.service';
import { NursingDocumentClient } from './nursing-document.client';

@Module({
  imports: [HttpModule],
  controllers: [NursingDocumentController],
  providers: [NursingDocumentService, NursingDocumentClient],
})
export class NursingDocumentModule {}

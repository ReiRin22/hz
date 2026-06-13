import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { QuestionnaireController } from './questionnaire.controller';
import { QuestionnaireService } from './questionnaire.service';
import { QuestionnaireClient } from './questionnaire.client';

@Module({
  imports: [HttpModule],
  controllers: [QuestionnaireController],
  providers: [QuestionnaireService, QuestionnaireClient],
})
export class QuestionnaireModule {}

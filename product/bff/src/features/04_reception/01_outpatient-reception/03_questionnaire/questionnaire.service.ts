import { Injectable } from '@nestjs/common';
import { QuestionnaireClient } from './questionnaire.client';

@Injectable()
export class QuestionnaireService {
  constructor(private readonly questionnaireClient: QuestionnaireClient) {}

  // TODO: ビジネスロジックを実装
}

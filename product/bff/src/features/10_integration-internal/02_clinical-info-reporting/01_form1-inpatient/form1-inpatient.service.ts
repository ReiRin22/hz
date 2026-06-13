import { Injectable } from '@nestjs/common';
import { Form1InpatientClient } from './form1-inpatient.client';

@Injectable()
export class Form1InpatientService {
  constructor(private readonly form1InpatientClient: Form1InpatientClient) {}

  // TODO: ビジネスロジックを実装
}

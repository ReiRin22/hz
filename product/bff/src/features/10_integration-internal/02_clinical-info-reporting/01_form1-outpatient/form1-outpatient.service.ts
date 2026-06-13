import { Injectable } from '@nestjs/common';
import { Form1OutpatientClient } from './form1-outpatient.client';

@Injectable()
export class Form1OutpatientService {
  constructor(private readonly form1OutpatientClient: Form1OutpatientClient) {}

  // TODO: ビジネスロジックを実装
}
